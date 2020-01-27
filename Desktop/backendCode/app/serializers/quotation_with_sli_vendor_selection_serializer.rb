class QuotationWithSliVendorSelectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :reference_number, :sli_flag, :project_id
  attribute :line_items
  attribute :extra_items  #ie job_elements belonging directly to quotation, not to a line item specifically.

  def line_items
    boqjob_line_items = object.boqjobs.joins(:job_elements).distinct.map do |boqjob|
      boqjob.attributes.merge(
        type: 'loose_furniture',
        fabric: boqjob.product_variant&.product_variant_code,
        po_created: ( boqjob.job_elements.joins(:purchase_elements).count > 0 ),
        subline_items: boqjob.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    modular_job_line_items_kitchen = object.modular_jobs.kitchen.joins(:job_elements).distinct.map do |modular_job|
      modular_job.attributes.merge(
        type: 'modular_kitchen',
        po_created: ( modular_job.job_elements.joins(:purchase_elements).count > 0 ),
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        subline_items: modular_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    modular_job_line_items_wardrobe = object.modular_jobs.wardrobe.joins(:job_elements).distinct.map do |modular_job|
      modular_job.attributes.merge(
        type: 'modular_wardrobe',
        po_created: ( modular_job.job_elements.joins(:purchase_elements).count > 0 ),
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        subline_items: modular_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    service_job_line_items = object.service_jobs.joins(:job_elements).distinct.map do |service_job|
      service_job.attributes.merge(
        type: 'services',
        base_rate: service_job.base_rate,
        po_created: ( service_job.job_elements.joins(:purchase_elements).count > 0 ),
        subline_items: service_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    custom_job_line_items = object.custom_jobs.joins(:job_elements).distinct.map do |custom_job|
      custom_element = custom_job.custom_element
      custom_job.attributes.merge(
        type: 'custom_jobs',
        dimension: custom_element.dimension,
        specs: "Finish: #{custom_element.shutter_finish}, Core Material: #{custom_element.core_material}",
        remark: custom_element.designer_remark,
        po_created: ( custom_job.job_elements.joins(:purchase_elements).count > 0 ),
        subline_items: custom_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    appliance_job_line_items = object.appliance_jobs.joins(:job_elements).distinct.map do |appliance_job|
      appliance_job.attributes.merge(
        type: 'appliance',
        po_created: ( appliance_job.job_elements.joins(:purchase_elements).count > 0 ),
        subline_items: appliance_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    extra_job_line_items = object.extra_jobs.joins(:job_elements).distinct.map do |extra_job|
      extra_job.attributes.merge(
        type: 'extra',
        po_created: ( extra_job.job_elements.joins(:purchase_elements).count > 0 ),
        subline_items: extra_job.job_elements.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
        )
    end

    return ( boqjob_line_items + modular_job_line_items_kitchen + modular_job_line_items_wardrobe + service_job_line_items + custom_job_line_items + appliance_job_line_items + extra_job_line_items ).flatten
  end

  def extra_items
    object.job_elements.extra_items.map{ |job_element| JobElementSerializer.new(job_element).serializable_hash }
  end
end
