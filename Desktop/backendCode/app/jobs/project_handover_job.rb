class ProjectHandoverJob < ApplicationJob
  queue_as :default

  def perform(project, not_shared_handovers)
    # handovers = project.project_handovers.where(status: "shared")
    handovers = ProjectHandover.where(id: not_shared_handovers)
    zip_dir = Rails.root.join("tmp")
    zip_file = Rails.root.join("tmp").join("#{project.name}-#{project.id}.rar")

    category_array = handovers.pluck(:ownerable_type).uniq
    category_hash = {}
    category_array.each do |category|
      eval("#{category}_array = []")
    end
    quotations_in_handover = []

    handovers.each do |handover|
      owner = handover.ownerable
      data_hash = Hash.new
      if handover.ownerable_type == "Quotation"
        if (owner.boqjobs.present? || owner.modular_jobs.present? || owner.custom_jobs.present? || owner.appliance_jobs.present? ||owner.extra_jobs.present? ) && owner.service_jobs.present?
          boq_file_path = owner.generate_quotation_pdf_for_handover(["summary", "boq" , "annexure"])
          boq_name = owner.reference_number&.gsub("/","-").to_s+".pdf"
          services_file_path = owner.generate_services_pdf_for_handover
          service_name = "Service-"+owner.reference_number&.gsub("/","-").to_s+".pdf"
          data_hash["#{service_name}"] = services_file_path
          data_hash["#{boq_name}"] = boq_file_path
        elsif (owner.boqjobs.present? || owner.modular_jobs.present? || owner.custom_jobs.present? || owner.appliance_jobs.present? ||owner.extra_jobs.present? ) && owner.service_jobs.empty?
          boq_file_path = owner.generate_quotation_pdf_for_handover(["summary", "boq" , "annexure"])
          boq_name = owner.reference_number&.gsub("/","-").to_s+".pdf"
          data_hash["#{boq_name}"] = boq_file_path
        elsif owner.service_jobs.present?
          services_file_path = owner.generate_services_pdf_for_handover
          service_name = "Service-"+owner.reference_number&.gsub("/","-").to_s+".pdf"
          data_hash["#{service_name}"] = services_file_path
        end
        # Notify segment specific category users if the applicable handovers includes BOQ.
        owner.update(can_edit: false)
        handover.mark_accepted_segments
        quotations_in_handover << owner
      elsif handover.ownerable_type == "SiteMeasurementRequest"
        sg = SiteGallery.where(site_measurement_request_id: owner.id)
        sg.each do |gallery|
          if gallery.site_image.s3_object.exists?
            gallery.site_image.s3_object.get(response_target: zip_dir + "#{gallery.site_image_file_name}") if gallery.site_image.s3_object.exists?
            data_hash["#{gallery.site_image_file_name}"] = zip_dir + "#{gallery.site_image_file_name}"
          end
        end if sg.present?
      elsif handover.ownerable_type == "Floorplan"
        if owner.attachment_file.s3_object.exists?
          owner.attachment_file.s3_object.get(response_target: zip_dir + "#{owner.attachment_file_file_name}")
          data_hash["#{owner.attachment_file_file_name}"] = zip_dir + "#{owner.attachment_file_file_name}"
        end
      elsif handover.ownerable_type == "BoqAndPptUpload"
        if owner.upload.s3_object.exists?
          owner.upload.s3_object.get(response_target: zip_dir + "#{owner.upload_file_name}")
          data_hash["#{owner.upload_file_name}"] = zip_dir + "#{owner.upload_file_name}"
        end
      elsif handover.ownerable_type == "CadDrawing"
        if owner.cad_drawing.s3_object.exists?
          owner.cad_drawing.s3_object.get(response_target: zip_dir + "#{owner.cad_drawing_file_name}")
          data_hash["#{owner.name}-#{owner.created_at}-#{owner.cad_drawing_file_name}"] = zip_dir + "#{owner.cad_drawing_file_name}"
        end
      else
        if owner.content&.document&.s3_object&.exists?
          owner.content.document.s3_object.get(response_target: zip_dir + "#{owner.content.document_file_name}")
          data_hash["#{owner.name}-#{owner.created_at}-#{owner.content.document_file_name}"] = zip_dir + "#{owner.content.document_file_name}"
        end
      end
      eval("#{handover.ownerable_type}_array").push data_hash if data_hash.present?
    end

    category_array.each do |category|
      category_hash["#{category}"] = eval("#{category}_array").compact
    end

    #============================
    # create Zip of files only
    #============================

    # data_hash = data_hash.compact
    # Zip::File.open(zip_file, Zip::File::CREATE) do |zipfile|
    #   data_hash.each do |name, path|
    #     zipfile.add(name, path)
    #   end
    # end

    file_paths_array = []  #to delete file after zipping
    #====================================
    # create Zip with directory structure
    #====================================

    Zip::File.open(zip_file, Zip::File::CREATE) do  |zipfile|
      category_array.each do |category|
        if category == "Quotation"
          dir_name = "BOQ"
        elsif category == "BoqAndPptUpload"
          dir_name = "PPT"
        else
          dir_name = category.underscore.humanize
        end
        zipfile.dir.mkdir(dir_name)
        category_hash["#{category}"].each do |ch|
          ch.keys.each do |key|
            zipfile.file.open("#{dir_name}/#{key}", "wb") do |f|
              f.write(File.open(ch["#{key}"]).read)
              f.close
            end
            file_paths_array.push ch["#{key}"]
          end
        end
      end
    end

    #delete temprory files
    file_paths_array.each do |path|
      File.delete(path) if File.exist?(path)
    end

    handover_url = project.project_handover_urls.create  #keeping recor of shared versions
    file = File.open(zip_file)
    handover_url.contents.create!(document: file, scope: "project_handover_zip_file", document_file_name: "#{project.name}-#{project.id}.rar")
    UserNotifierMailer.category_handover_mail(project, "https:" + handover_url.contents.last.document.url).deliver_now!

    if quotations_in_handover.present?
      UserNotifierMailer.category_boq_handover_mail(quotations_in_handover.map(&:id), "https:" + handover_url.contents.last.document.url).deliver!
    end

    File.delete(zip_file)  #delete zipfile after uploading it to S3

  end
end
