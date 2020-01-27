class SendFactoryJob < ApplicationJob
  queue_as :default
  
  def perform(project, data_hash)
    zip_dir = Rails.root.join("tmp")
    zip_file = Rails.root.join("tmp").join("Send-to-Factory-files-#{project.name}-#{project.id}-#{Time.now}.rar")
    bom_files = []
    bom_contents = Content.where(id: data_hash[:bom_ids])

    bom_contents.each do |bom|
      bom_hash = {}
      if bom.document&.s3_object&.exists?
        bom.document.s3_object.get(response_target: zip_dir + "#{bom.document_file_name}")
        bom_hash["BOM-#{bom.created_at}-#{bom.document_file_name}"] = zip_dir + "#{bom.document_file_name}"
      end
      bom_files.push bom_hash if bom_hash.present?
    end
    drawings_handovers = ProjectHandover.where(id: data_hash[:handovers_ids])
    ownerable_types = drawings_handovers.pluck(:ownerable_type).uniq
    ownerable_types.each do |ownerable_type|
      eval("#{ownerable_type}_array = []")
    end
    drawings_handovers.each do |handover|
      owner = handover.ownerable
      handover_hash = {}
      if handover.ownerable_type == "CadDrawing"
        if owner.cad_drawing.s3_object.exists?
          owner.cad_drawing.s3_object.get(response_target: zip_dir + "#{owner.cad_drawing_file_name}")
          handover_hash["#{owner.name}-#{owner.created_at}-#{owner.cad_drawing_file_name}"] = zip_dir + "#{owner.cad_drawing_file_name}"
        end
      else
        if owner.content&.document&.s3_object&.exists?
          owner.content.document.s3_object.get(response_target: zip_dir + "#{owner.content.document_file_name}")
          handover_hash["#{owner.name}-#{owner.created_at}-#{owner.content.document_file_name}"] = zip_dir + "#{owner.content.document_file_name}"
        end  
      end
      eval("#{handover.ownerable_type}_array").push handover_hash if handover_hash.present?
    end
    
    quotations = Quotation.where(id: data_hash[:quotation_ids])
    quotation_array = []
    quotations.each do |quotation|
      quotation_hash = {}
      if (quotation.boqjobs.present? || quotation.modular_jobs.present? || quotation.custom_jobs.present? || quotation.appliance_jobs.present? || quotation.extra_jobs.present? || quotation.shangpin_jobs.present? ) && quotation.service_jobs.present?
        boq_file_path = quotation.generate_quotation_pdf_for_handover(["summary", "boq" , "annexure"])
        boq_name = quotation.reference_number&.gsub("/","-").to_s+".pdf"
        services_file_path = quotation.generate_services_pdf_for_handover
        service_name = "Service-"+quotation.reference_number&.gsub("/","-").to_s+".pdf"
        quotation_hash["#{service_name}"] = services_file_path
        quotation_hash["#{boq_name}"] = boq_file_path
      elsif (quotation.boqjobs.present? || quotation.modular_jobs.present? || quotation.custom_jobs.present? || quotation.appliance_jobs.present? ||quotation.extra_jobs.present? ) && quotation.service_jobs.empty?
        boq_file_path = quotation.generate_quotation_pdf_for_handover(["summary", "boq" , "annexure"])
        boq_name = quotation.reference_number&.gsub("/","-").to_s+".pdf"
        quotation_hash["#{boq_name}"] = boq_file_path
      elsif quotation.service_jobs.present?
        services_file_path = quotation.generate_services_pdf_for_handover
        service_name = "Service-"+quotation.reference_number&.gsub("/","-").to_s+".pdf"
        quotation_hash["#{service_name}"] = services_file_path
      end
    quotation_array.push quotation_hash if quotation_hash.present?
    end 

    factory_hash = {}
    factory_hash["bom"] = bom_files
    factory_hash["quotation"] = quotation_array
    ownerable_types.each do |ownerable_type|
      array =  ownerable_type + "_array"
      eval("factory_hash[ownerable_type] = #{ownerable_type}_array")
    end

    temp_files_path_array = []

    Zip::File.open(zip_file, Zip::File::CREATE) do  |zipfile|
      factory_hash.each do |k,v|
        if k == "quotation"
          dir_name = "BOQ"
        elsif k == "bom"
          dir_name = "BOM"
        else
          dir_name = k.underscore.humanize
        end
        zipfile.dir.mkdir(dir_name)
        factory_hash["#{k}"].each do |data|
          data.keys.each do |key|
            zipfile.file.open("#{dir_name}/#{key}", "wb") do |f|
              f.write(File.open(data["#{key}"]).read)
              f.close
            end
            temp_files_path_array.push data["#{key}"]
          end
        end if factory_hash["#{k}"].present?
      end
    end

    temp_files_path_array.each do |path|
      File.delete(path) if File.exist?(path)
    end

    file = File.open(zip_file)
    send_to_factory_url = project.send_to_factory_url.create
    content = Content.create!(document: file, scope: "send_to_factory_zip_file", document_file_name: "Send-to-Factory-files-#{project.name}-#{project.id}-#{Time.now}.rar")
    send_to_factory_url.update(content_id: content.id)
    UserNotifierMailer.factory_notification_mail(project, "https:" + send_to_factory_url.contents.last.document.url).deliver_now!
    File.delete(zip_file) if zip_file.present?
  end
end
