class QuotationWithSliSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :reference_number, :sli_flag, :project_id
  attribute :line_items
  attribute :extra_items  #ie job_elements belonging directly to quotation, not to a line item specifically.
  attribute :po_automation_errors

  def line_items
    hash = {}
    hash[:loose_furniture] = object.boqjobs.not_a_clubbed_module.map do |boqjob|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: boqjob.job_elements}).pluck(:status)
      boqjob.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: boqjob.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: boqjob.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        unique_sku: boqjob.product.unique_sku,
        quantity: boqjob.quantity,
        addons: [],
        hardware_brand_name: "",
        boq_labels: boqjob.boq_labels.pluck(:label_name)
        )
    end

    hash[:modular_kitchen] = object.modular_jobs.kitchen.not_a_clubbed_module.map do |modular_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: modular_job.job_elements}).pluck(:status)
      modular_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        cad_files: modular_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: modular_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: modular_job.addons,
        quantity: modular_job.quantity,
        hardware_brand_name: modular_job&.brand&.name,
        boq_labels: modular_job.boq_labels.pluck(:label_name)
        )
    end

      hash[:modular_wardrobe]  = object.modular_jobs.wardrobe.not_a_clubbed_module.map do |modular_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: modular_job.job_elements}).pluck(:status)
      modular_job.attributes.merge(
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: modular_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: modular_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: modular_job.addons,
        quantity: modular_job.quantity,
        hardware_brand_name: modular_job&.brand&.name,
        boq_labels: modular_job.boq_labels.pluck(:label_name)
        )
    end

     hash[:services] = object.service_jobs.not_a_clubbed_module.map do |service_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: service_job.job_elements}).pluck(:status)
      service_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: service_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: service_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: [],
        quantity: service_job.quantity,
        hardware_brand_name: ""
        )
    end

    hash[:custom_jobs]  = object.custom_jobs.not_a_clubbed_module.map do |custom_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: custom_job.job_elements}).pluck(:status)
      custom_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: custom_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: custom_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: [],
        quantity: custom_job.quantity,
        hardware_brand_name: "",
        boq_labels: custom_job.boq_labels.pluck(:label_name)
        )
    end

     hash[:appliance] = object.appliance_jobs.not_a_clubbed_module.map do |appliance_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: appliance_job.job_elements}).pluck(:status)
      appliance_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: appliance_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: appliance_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: [],
        quantity: appliance_job.quantity,
        hardware_brand_name: "",
        boq_labels: appliance_job.boq_labels.pluck(:label_name)
        )
    end

    hash[:extra] = object.extra_jobs.not_a_clubbed_module.map do |extra_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: extra_job.job_elements}).pluck(:status)
      extra_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        cad_files: extra_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: extra_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: [],
        quantity: extra_job.quantity,
        hardware_brand_name: "",
        boq_labels: extra_job.boq_labels.pluck(:label_name)       
        )
    end

    hash[:custom_furniture] = object.shangpin_jobs.not_a_clubbed_module.map do |shangpin_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: shangpin_job.job_elements}).pluck(:status)
      case shangpin_job.job_type
      when "door", "sliding_door"
        model_no = shangpin_job.door_model_no
        quantity = shangpin_job.door_quantity
      when "cabinet"
        model_no = shangpin_job.cabinet_model_no
        quantity = shangpin_job.cabinet_quantity
      when "accessory"
        model_no = shangpin_job.accessory_model_no
        quantity = shangpin_job.accessory_quantity
      else
        model_no = nil
        quantity = nil
      end
      shangpin_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        name: "Type: #{shangpin_job.job_type} Model: #{model_no}",
        cad_files: shangpin_job.cad_uploads.map{ |cad_upload| CadUploadSerializer.new(cad_upload).serializable_hash },
        subline_items: shangpin_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },
        addons: [],
        quantity: quantity,        
        hardware_brand_name: "",
        boq_labels: shangpin_job.boq_labels.pluck(:label_name)        
        )
    end

    hash[:clubbed_jobs] = object.clubbed_jobs.map do |clubbed_job|
      po_statuses = PurchaseOrder.joins(:job_elements).where(job_elements: {id: clubbed_job.job_elements}).pluck(:status)
      clubbed_job.attributes.merge(
        po_created: po_statuses.include?("released") ? false : po_statuses.include?("pending") ? false : true ,
        subline_items: clubbed_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash },

        ).merge(
          loose_furniture: clubbed_job.boqjobs.map(&:attributes)
        ).merge(
          modular_kitchen: clubbed_job.modular_jobs.kitchen.map do |kitchen|
            kitchen.attributes.merge(name: "Module Type: #{kitchen.product_module&.module_type&.name.to_s}  Module :#{kitchen.product_module&.code.to_s}", quantity: kitchen.quantity)
          end
        ).merge(
          modular_wardrobe: clubbed_job.modular_jobs.wardrobe.map do |wardrobe|
            wardrobe.attributes.merge(name: "Module Type: #{wardrobe.product_module&.module_type&.name.to_s}  Module :#{wardrobe.product_module&.code.to_s}", quantity: wardrobe.quantity)
          end
        ).merge(
          services: clubbed_job.service_jobs.map(&:attributes)
        ).merge(
          custom_jobs: clubbed_job.custom_jobs.map(&:attributes)
        ).merge(
          appliance: clubbed_job.appliance_jobs.map(&:attributes)
        ).merge(
          extra: clubbed_job.extra_jobs.map(&:attributes)
        ).merge(
          shangpin_job: clubbed_job.shangpin_jobs.map do |shangpin_job|
            case shangpin_job.job_type
            when "door", "sliding_door"
              model_no = shangpin_job.door_model_no
              quantity = shangpin_job.door_quantity
            when "cabinet"
              model_no = shangpin_job.cabinet_model_no
              quantity = shangpin_job.cabinet_quantity
            when "accessory"
              model_no = shangpin_job.accessory_model_no
              quantity = shangpin_job.accessory_quantity
            else
              model_no = nil
              quantity = nil
            end
            shangpin_job.attributes.merge(name: "Type: #{shangpin_job.job_type} Model: #{model_no}", quantity: quantity)
          end
        )
    end

    return hash
  end

  def extra_items
    object.job_elements.extra_items.map{|job_element| JobElementSerializer.new(job_element).serializable_hash}
  end

  def po_automation_errors
    instance_options[:po_automation_errors]
  end
end
