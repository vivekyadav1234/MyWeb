class QuotationCuttingListSerializer 
	include FastJsonapi::ObjectSerializer
  attributes :id, :reference_number, :project_id

  attribute :line_items do |object|
    line_items = line_items_with_cutting_list(object, Tag.tags_for_cutting_list_and_bom)
  end

  def self.line_items_with_cutting_list(quotation, tag_ids)
    kitchen_jobs = quotation.modular_jobs.kitchen.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
    wardrobe_jobs = quotation.modular_jobs.wardrobe.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
    boq_jobs = quotation.boqjobs.where(tag_id: tag_ids).select {|boqjob| !['services', 'non_panel_furniture'].include? boqjob.tag.name}
   	service_jobs = quotation.service_jobs.where(tag_id: tag_ids).select { |service| !['services', 'non_panel_furniture'].include? service.tag.name  }
   	custom_jobs = quotation.custom_jobs.where(tag_id: tag_ids).select {|job| !['services', 'non_panel_furniture'].include? job.tag.name}
   	appliance_jobs = quotation.appliance_jobs.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
   	extra_jobs = quotation.extra_jobs.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
    shangpin_jobs = quotation.shangpin_jobs.where(tag_id: tag_ids).select {|shangpin_job| !['services', 'non_panel_furniture'].include? shangpin_job.tag.name}
    lines_items = {}

    lines_items[:loose_furniture] = boq_jobs.map do |boqjob|
      boqjob.slice(:id, :name).merge(
        fabric: boqjob.product_variant&.product_variant_code,
        type: "Boqjob",
        quantity: boqjob.quantity,        
        no_bom: boqjob.no_bom,
        bom_sli_manual_sheet: ContentSerializer.new(boqjob.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(boqjob.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(boqjob.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: boqjob.boq_labels.pluck(:label_name)
        )
    end if boq_jobs.present?

    lines_items[:modular_kitchen] = kitchen_jobs.map do |modular_job|
      modular_job.slice(:id).merge(
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        type: "ModularJob",
        quantity: modular_job.quantity,
        no_bom: modular_job.no_bom, 
        bom_sli_manual_sheet: ContentSerializer.new(modular_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(modular_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(modular_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: modular_job.boq_labels.pluck(:label_name)
        )
    end if kitchen_jobs.present?

    lines_items[:modular_wardrobe] = wardrobe_jobs.map do |modular_job|
      modular_job.slice(:id).merge(
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        type: "ModularJob",
        quantity: modular_job.quantity,
        no_bom: modular_job.no_bom, 
        bom_sli_manual_sheet: ContentSerializer.new(modular_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(modular_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(modular_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: modular_job.boq_labels.pluck(:label_name)
        )
    end if wardrobe_jobs.present?

    lines_items[:service] = service_jobs.map do |service_job|
      service_job.slice(:id, :name).merge(
        base_rate: service_job.base_rate,
        type: "ServiceJob",
        quantity: service_job.quantity,
        no_bom: service_job.no_bom,
        bom_sli_manual_sheet: [],
        imos_manual_sheet: [],
        imos: []
        )
    end if service_jobs.present?

    lines_items[:custom_element] = custom_jobs.map do |custom_job|
      custom_element = custom_job.custom_element
      custom_job.slice(:id, :name).merge(
        dimension: custom_element.dimension,
        remark: custom_element.designer_remark,
        type: "CustomJob",
        quantity: custom_job.quantity,
        no_bom: custom_job.no_bom, 
        bom_sli_manual_sheet: ContentSerializer.new(custom_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(custom_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(custom_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: custom_job.boq_labels.pluck(:label_name)
        )
    end if custom_jobs.present?

    lines_items[:appliance] = appliance_jobs.map do |appliance_job|
      appliance_job.slice(:id, :name).merge(
        type: "ApplianceJob",
        no_bom: appliance_job.no_bom,
        quantity: appliance_job.quantity,
        bom_sli_manual_sheet: ContentSerializer.new(appliance_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(appliance_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(appliance_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: appliance_job.boq_labels.pluck(:label_name)
        )
    end if appliance_jobs.present?

    lines_items[:extra] = extra_jobs.map do |extra_job|
      extra_job.slice(:id, :name).merge(
        type: "ExtraJob",
        quantity: extra_job.quantity,
        no_bom: extra_job.no_bom,
        bom_sli_manual_sheet: ContentSerializer.new(extra_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(extra_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(extra_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: extra_job.boq_labels.pluck(:label_name)
        )
    end if extra_jobs.present?
    
    lines_items[:custom_furniture] = shangpin_jobs.map do |shangpin_job|
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
      shangpin_job.slice(:id).merge(
        name: "Type: #{shangpin_job.job_type} Model: #{model_no}",
        type: "ShangpinJob",
        quantity: quantity,
        no_bom: shangpin_job.no_bom,
        bom_sli_manual_sheet: ContentSerializer.new(shangpin_job.boms.where(scope: "bom_sli_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos_manual_sheet: ContentSerializer.new(shangpin_job.boms.where(scope: "imos_manual_sheet").order(id: :desc).limit(1)).serializable_hash,
        imos: ContentSerializer.new(shangpin_job.boms.where(scope: "imos").order(id: :desc).limit(1)).serializable_hash,
        boq_labels: shangpin_job.boq_labels.pluck(:label_name)     
        )
    end if shangpin_jobs.present?

    lines_items
  end

end