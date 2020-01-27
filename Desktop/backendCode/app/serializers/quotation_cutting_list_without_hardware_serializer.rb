# ############
# Commented as it is not being used anywhere. Remove later if not needed.
# ############
# class QuotationCuttingListWithoutHardwareSerializer 
#   include FastJsonapi::ObjectSerializer
#   attributes :id, :reference_number, :project_id

#   attribute :line_items do |object|
#     line_items = line_items_with_cutting_list(object, Tag.tags_for_cutting_list_and_bom)
#   end

#   def self.line_items_with_cutting_list(quotation, tag_ids)
#     kitchen_jobs = quotation.modular_jobs.kitchen.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
#     wardrobe_jobs = quotation.modular_jobs.wardrobe.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
#     boq_jobs = quotation.boqjobs.where(tag_id: tag_ids).select {|boqjob| !['services', 'non_panel_furniture'].include? boqjob.tag.name}
#     service_jobs = quotation.service_jobs.where(tag_id: tag_ids).select { |service| !['services', 'non_panel_furniture'].include? service.tag.name  }
#     custom_jobs = quotation.custom_jobs.where(tag_id: tag_ids).select {|custom_job| !['services', 'non_panel_furniture'].include? job.tag.name}
#     appliance_jobs = quotation.appliance_jobs.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
#     extra_jobs = quotation.extra_jobs.where(tag_id: tag_ids).select { |job| !['services', 'non_panel_furniture'].include? job.tag.name }
#     lines_items = {}

#     lines_items[:loose_furniture] = boq_jobs.map do |boqjob|
#       boqjob.slice(:id, :name).merge(
#         fabric: boqjob.product_variant&.product_variant_code,
#         type: "Boqjob",
#         bom_sli_manual_sheet: ContentSerializer.new(boqjob.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(boqjob.contents.where(scope: "imos")).serializable_hash
#         )
#     end if boq_jobs.present?

#     lines_items[:modular_kitchen] = kitchen_jobs.map do |modular_job|
#       modular_job.slice(:id).merge(
#         name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
#         type: "ModularJob",
#         bom_sli_manual_sheet: ContentSerializer.new(modular_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(modular_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if kitchen_jobs.present?

#     lines_items[:modular_wardrobe] = wardrobe_jobs.map do |modular_job|
#       modular_job.slice(:id).merge(
#         name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
#         type: "ModularJob",
#         bom_sli_manual_sheet: ContentSerializer.new(modular_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(modular_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if wardrobe_jobs.present?

#     lines_items[:service] = service_jobs.map do |service_job|
#       service_job.slice(:id, :name).merge(
#         base_rate: service_job.base_rate,
#         type: "ServiceJob",
#         bom_sli_manual_sheet: ContentSerializer.new(service_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(service_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if service_jobs.present?

#     lines_items[:custom_element] = custom_jobs.map do |custom_job|
#       custom_element = custom_job.custom_element
#       custom_job.slice(:id, :name).merge(
#         dimension: custom_element.dimension,
#         remark: custom_element.designer_remark,
#         type: "CustomJob",
#         bom_sli_manual_sheet: ContentSerializer.new(custom_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(custom_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if custom_jobs.present?

#     lines_items[:appliance] = appliance_jobs.map do |appliance_job|
#       appliance_job.slice(:id, :name).merge(
#         type: "ApplianceJob",
#         bom_sli_manual_sheet: ContentSerializer.new(appliance_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(appliance_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if appliance_jobs.present?

#     lines_items[:extra] = extra_jobs.map do |extra_job|
#       extra_job.slice(:id, :name).merge(
#         type: "ExtraJob",
#         bom_sli_manual_sheet: ContentSerializer.new(extra_job.contents.where(scope: "bom_sli_manual_sheet")).serializable_hash,
#         imos_manual_sheet: [],
#         imos: ContentSerializer.new(extra_job.contents.where(scope: "imos")).serializable_hash
#         )
#     end if extra_jobs.present?

#     lines_items
#   end

# end