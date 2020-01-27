# Create an excel with the provided BOQ's information and email it.
# This should run in a worker instance, not the web server instance.
class QuotationDownloadJob < ApplicationJob
  queue_as :default

  def perform(quotation_ids , user)
    quotations = Quotation.where(id: quotation_ids).includes({ project: [ :user, :designer_projects, { lead: [:lead_source, :lead_campaign, { assigned_cm: :tags }, :note_records, :tag] } ] }, 
      :proposals, :boq_global_configs, :boqjobs, :modular_jobs, :service_jobs, :custom_jobs, :appliance_jobs, :extra_jobs, :shangpin_jobs, :task_sets)
    package = Axlsx::Package.new
    boq_spread_sheet = package.workbook
    sheet = boq_spread_sheet.add_worksheet(:name => "BOQ Report")

    header_names = [
      "Lead ID",
      "Customer Name",
      "Customer Phone Number",
      "Customer Email ID",
      "City",
      "Lead Source",
      "Lead Campaign",
      "Fast Track",
      "App",
      "Referral Partner Type",
      "Referral Partner Name",
      "MKW/FHI",
      "Digital/Physical",
      "Designer",
      "Type of Lead (MKW/Full home/Both)",
      "Lead Acquisition Date",
      "Lead Acquisition Time",
      "Lead Acquisition Timestamp",
      "Lead Qualification Date",
      "Lead Qualification Time",
      "Lead Qualification Timestamp",
      "Lead Assignment Date to Designer",
      "Lead Assignment Time to Designer",
      "Lead Assignment Timestamp to Designer",
      "Date of Marking WIP",
      "Time of Marking WIP",
      "Timestamp of Marking WIP",
      "BOQ Reference Number",
      "Designer Name",
      "CM Name",
      "BOQ Creation Date",
      "BOQ Creation Time",
      "BOQ Creation Timestamp",
      "BOQ Last Update Date",
      "BOQ Last Update Time",
      "BOQ Last Update Timestamp",
      "Stage (Initial BOQ / Final BOQ)",
      "BOQ Value",
      "Discount %",
      "Discount Value",
      "Final BOQ Value",
      "Type of Kitchen - Modular / Civil",
      "Modular Kitchen Value",
      "Modular Wardrobe Value",
      "Loose Furniture Value",
      "Services Value",
      "Custom Elements Value",
      "Custom Furniture Value",
      "Master Bedroom Value",
      "Living Room Value",
      "Guest Room Value",
      "Kids room value",
      "Kitchen value",
      "Foyer value",
      "Dining value",
      "Balcony value",
      "Attic value",
      "Basement value",
      "Bathroom value",
      "Garage value",
      "Hallway value",
      "Library value",
      "Loft value",
      "Nook value",
      "Pantry value",
      "Porch value",
      "Office value",
      "Others value",
      "Kitchen Carcass Core Material",
      "Kitchen Carcass Shutter Material",
      "Kitchen Shutter Finish",
      "Kitchen Hardware",
      "Wardrobe Carcass Core Material",
      "Wardrobe Carcass Shutter Material",
      "Wardrobe Shutter Finish",
      "Wardrobe Hardware",
      "Proposal Number",
      "Proposal Creation Date",
      "Proposal Creation Time",
      "Proposal Creation Timestamp",
      "Proposal Sharing Date",
      "Proposal Sharing Time",
      "Proposal Sharing Timestamp",
      "Parent BOQ",
      "Wip Status",
      "Wip Sub Status",
      "Wip Stage",
      "Client Approval Date",
      "Client Approval Time",
      "Client Approval Timestamp",
      'Referral name',
      'Referral Type'
    ]
    header_names.delete_at(header_names.index("Customer Phone Number")) if user.has_role?(:designer)
    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end
    sheet.add_row header_names
    # byebug

    quotations.find_each do |quotation|
      project = quotation.project
      lead = quotation.project.lead
      designer_project = project.designer_projects.where(active: true).take
      proposal = quotation.proposals.last
      boq_global_config_kitchen = quotation.boq_global_configs.find_by_category("kitchen")
      boq_global_config_wardrobe = quotation.boq_global_configs.find_by_category("wardrobe")

      city = lead.city || lead.note_records.last&.city

      lead_source = lead.lead_source&.name
      lead_campaign = lead.lead_campaign&.name
      fast_track = lead.from_fasttrack_page? ? "Yes" : "No"
      app = lead.source ==  "app" ? "Yes" : "No"
      referrar_partner_type = lead.referrer_type&.humanize
      referrer_partner_name = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      #mkw_fhi = lead.tag&.name == "both" ? "Full Home" :  lead.tag&.name&.humanize
      # now tags will be displayed based on cm tags
      mkw_fhi = lead.assigned_cm&.tags == "mkw" ? "MKW" : lead.assigned_cm&.tags == "full_home" ? "Full Home" : lead.tag&.name == "both" ? "Full Home" :  lead.tag&.name&.humanize 
      digital_physical = lead.digital_physical?
      designer_type = lead.project&.assigned_designer&.internal? ? "Internal" : "Externals"

      type_of_kitchen = quotation.modular_jobs.kitchen.present? ? (boq_global_config_kitchen&.civil_kitchen ? "Civil" : "Modular") : "NA"
      discount_value_to_use = quotation.discount_value_to_use.to_f
      discount_factor = 1.0 - discount_value_to_use/100.0

      modular_kitchen_value = (
        ( quotation.modular_jobs.kitchen.where(combined_module_id: nil).sum(:amount) +
        quotation.appliance_jobs.sum(:amount) +
        quotation.extra_jobs.where(category: 'kitchen').sum(:amount) +
        quotation.countertop_cost.to_f ) * discount_factor
        ).round(2)

      space_array = []
      quotation_jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a + quotation.shangpin_jobs.to_a
      quotation_jobs.each do |qj|
        space_array << qj.space
      end
      quotation_spaces_value = quotation.space_total_value(space_array.uniq)
      master_bedroom_value = quotation_spaces_value["Master Bedroom"] != 0 ? quotation_spaces_value["Master Bedroom"].values.sum * discount_factor : 'N/A'
      living_room_value = quotation_spaces_value["Living"] != 0 ? quotation_spaces_value["Living"].values.sum * discount_factor : 'N/A'
      guest_room_value = quotation_spaces_value["Guest Room"] != 0 ? quotation_spaces_value["Guest Room"].values.sum * discount_factor : 'N/A'
      kids_room_value = quotation_spaces_value["Kids Room"] != 0 ? quotation_spaces_value["Kids Room"].values.sum * discount_factor : 'N/A'
      kitchen_value = quotation_spaces_value["Kitchen"] != 0 ? quotation_spaces_value["Kitchen"].values.sum * discount_factor : 'N/A'
      foyer_value = quotation_spaces_value["Foyer"] != 0 ? quotation_spaces_value["Foyer"].values.sum * discount_factor : 'N/A'
      dining_value = quotation_spaces_value["Dining Area"] != 0 ? quotation_spaces_value["Dining Area"].values.sum * discount_factor : 'N/A'
      balcony_value = quotation_spaces_value["Balcony"] != 0 ? quotation_spaces_value["Balcony"].values.sum * discount_factor : 'N/A'
      attic_value = quotation_spaces_value["Attic"] != 0 ? quotation_spaces_value["Attic"].values.sum * discount_factor : 'N/A'
      basement_value = quotation_spaces_value["Basement"] != 0 ? quotation_spaces_value["Basement"].values.sum * discount_factor : 'N/A'
      bathroom_value = quotation_spaces_value["Bathroom"] != 0 ? quotation_spaces_value["Bathroom"].values.sum * discount_factor : 'N/A'
      garage_value = quotation_spaces_value["Garage"] != 0 ? quotation_spaces_value["Garage"].values.sum * discount_factor : 'N/A'
      hallway_value = quotation_spaces_value["Hallway"] != 0 ? quotation_spaces_value["Hallway"].values.sum * discount_factor : 'N/A'
      library_value = quotation_spaces_value["Library"] != 0 ? quotation_spaces_value["Library"].values.sum * discount_factor : 'N/A'
      loft_value = quotation_spaces_value["Loft"] != 0 ? quotation_spaces_value["Loft"].values.sum * discount_factor : 'N/A'
      nook_value = quotation_spaces_value["Nook"] != 0 ? quotation_spaces_value["Nook"].values.sum * discount_factor : 'N/A'
      pantry_value = quotation_spaces_value["Pantry"] != 0 ? quotation_spaces_value["Pantry"].values.sum * discount_factor : 'N/A'
      porch_value = quotation_spaces_value["Porch"] != 0 ? quotation_spaces_value["Porch"].values.sum * discount_factor : 'N/A'
      office_value = quotation_spaces_value["Office"] != 0 ? quotation_spaces_value["Office"].values.sum * discount_factor : 'N/A'
      others_value = quotation_spaces_value["Other"] != 0 ? quotation_spaces_value["Other"].values.sum * discount_factor : 'N/A'

      modular_wardrobe_value = ( quotation.modular_jobs.wardrobe.where(combined_module_id: nil).sum(:amount) * discount_factor + 
            quotation.extra_jobs.where(category: 'wardrobe').sum(:amount) * discount_factor ).round(2)
      loose_furniture_value = ( quotation.boqjobs.sum(:amount) * discount_factor ).round(2)
      services_value = ( quotation.service_jobs.sum(:amount) * discount_factor ).round(2)
      custom_elements_value = ( quotation.custom_jobs.sum(:amount) * discount_factor ).round(2)
      custom_furniture_value = ( quotation.shangpin_jobs.sum(:amount) * discount_factor ).round(0)
      quotation_wip_stage = quotation.task_sets&.last&.stage

      row_array = []
      row_array[headers["Lead ID"]] = lead.id
      row_array[headers["Customer Name"]] = lead.name
      row_array[headers["Customer Phone Number"]] = lead.contact if !user.has_role?(:designer)
      row_array[headers["Customer Email ID"]] = project.user.email
      row_array[headers["City"]] = lead.city

      row_array[headers["Lead Source"]] = lead_source
      row_array[headers["Lead Campaign"]] = lead_campaign
      row_array[headers["Fast Track"]] = fast_track
      row_array[headers["App"]] = app
      row_array[headers["Referral Partner Type"]] = referrar_partner_type
      row_array[headers["Referral Partner Name"]] = referrer_partner_name
      row_array[headers["MKW/FHI"]] = mkw_fhi
      row_array[headers["Digital/Physical"]] = digital_physical
      row_array[headers["Designer"]] = designer_type

      row_array[headers["Type of Lead (MKW/Full home/Both)"]] = lead.tag&.name&.humanize
      row_array[headers["Lead Acquisition Date"]] = lead.created_at.strftime("%d-%m-%Y")
      row_array[headers["Lead Acquisition Time"]] = lead.created_at.strftime("%I:%M:%S %p")
      row_array[headers["Lead Acquisition Timestamp"]] = lead.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Lead Qualification Date"]] = project.created_at.strftime("%d-%m-%Y")
      row_array[headers["Lead Qualification Time"]] = project.created_at.strftime("%I:%M:%S %p")
      row_array[headers["Lead Qualification Timestamp"]] = project.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Lead Assignment Date to Designer"]] = designer_project&.updated_at&.strftime("%d-%m-%Y")
      row_array[headers["Lead Assignment Time to Designer"]] = designer_project&.updated_at&.strftime("%I:%M:%S %p")
      row_array[headers["Lead Assignment Timestamp to Designer"]] = designer_project&.updated_at&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Date of Marking WIP"]] = project.wip_time&.strftime("%d-%m-%Y")
      row_array[headers["Time of Marking WIP"]] = project.wip_time&.strftime("%I:%M:%S %p")
      row_array[headers["Timestamp of Marking WIP"]] = project.wip_time&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["BOQ Reference Number"]] = quotation.reference_number
      row_array[headers["Designer Name"]] = project.assigned_designer&.name
      row_array[headers["CM Name"]] = project.assigned_designer&.cm&.name
      row_array[headers["BOQ Creation Date"]] = quotation.created_at.strftime("%d-%m-%Y")
      row_array[headers["BOQ Creation Time"]] = quotation.created_at.strftime("%I:%M:%S %p")
      row_array[headers["BOQ Creation Timestamp"]] = quotation.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["BOQ Last Update Date"]] = quotation.updated_at.strftime("%d-%m-%Y")
      row_array[headers["BOQ Last Update Time"]] = quotation.updated_at.strftime("%I:%M:%S %p")
      row_array[headers["BOQ Last Update Timestamp"]] = quotation.updated_at.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Stage (Initial BOQ / Final BOQ)"]] = quotation.final_boq? ? "Final" : "Initial"
      row_array[headers["BOQ Value"]] = quotation.net_amount.to_f.round(2)
      row_array[headers["Discount %"]] = quotation.discount_value
      row_array[headers["Discount Value"]] = quotation.net_amount - quotation.total_amount
      row_array[headers["Final BOQ Value"]] = quotation.total_amount
      row_array[headers["Type of Kitchen - Modular / Civil"]] = type_of_kitchen
      row_array[headers["Modular Kitchen Value"]] = modular_kitchen_value
      row_array[headers["Modular Wardrobe Value"]] = modular_wardrobe_value
      row_array[headers["Loose Furniture Value"]] = loose_furniture_value
      row_array[headers["Services Value"]] = services_value
      row_array[headers["Custom Elements Value"]] = custom_elements_value
      row_array[headers["Custom Furniture Value"]] = custom_furniture_value
      row_array[headers["Master Bedroom Value"]] = master_bedroom_value
      row_array[headers["Living Room Value"]] = living_room_value
      row_array[headers["Guest Room Value"]] = guest_room_value
      row_array[headers["Kids room value"]] = kids_room_value
      row_array[headers["Kitchen value"]] = kitchen_value
      row_array[headers["Foyer value"]] = foyer_value
      row_array[headers["Dining value"]] = dining_value
      row_array[headers["Balcony value"]]  = balcony_value
      row_array[headers["Attic value"]]  = attic_value
      row_array[headers["Basement value"]] = basement_value
      row_array[headers["Bathroom value"]] = bathroom_value
      row_array[headers["Garage value"]] = garage_value
      row_array[headers["Hallway value"]] = hallway_value
      row_array[headers["Library value"]] =  library_value
      row_array[headers["Loft value"]] =  loft_value
      row_array[headers["Nook value"]] = nook_value
      row_array[headers["Pantry value"]] = pantry_value
      row_array[headers["Porch value"]] = porch_value
      row_array[headers["Office value"]] = office_value
      row_array[headers["Others value"]] = others_value
      row_array[headers["Kitchen Carcass Core Material"]] = boq_global_config_kitchen&.core_material || "NA"
      row_array[headers["Kitchen Carcass Shutter Material"]] = boq_global_config_kitchen&.shutter_material || "NA"
      row_array[headers["Kitchen Shutter Finish"]] = boq_global_config_kitchen&.shutter_finish || "NA"
      row_array[headers["Kitchen Hardware"]] = Brand.find_by_id(boq_global_config_kitchen&.brand_id)&.name || "NA"
      row_array[headers["Wardrobe Carcass Core Material"]] = boq_global_config_wardrobe&.core_material || "NA"
      row_array[headers["Wardrobe Carcass Shutter Material"]] = boq_global_config_wardrobe&.shutter_material || "NA"
      row_array[headers["Wardrobe Shutter Finish"]] = boq_global_config_wardrobe&.shutter_finish || "NA"
      row_array[headers["Wardrobe Hardware"]] = Brand.find_by_id(boq_global_config_wardrobe&.brand_id)&.name || "NA"
      row_array[headers["Proposal Number"]] = proposal&.proposal_name
      row_array[headers["Proposal Creation Date"]] = proposal&.created_at&.strftime("%d-%m-%Y")
      row_array[headers["Proposal Creation Time"]] = proposal&.created_at&.strftime("%I:%M:%S %p")
      row_array[headers["Proposal Creation Timestamp"]] = proposal&.created_at&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Proposal Sharing Date"]] = proposal&.sent_at&.strftime("%d-%m-%Y")
      row_array[headers["Proposal Sharing Time"]] = proposal&.sent_at&.strftime("%I:%M:%S %p")
      row_array[headers["Proposal Sharing Timestamp"]] = proposal&.sent_at&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Parent BOQ"]] = quotation.parent_quotation&.reference_number
      row_array[headers["Wip Status"]] = project&.status.in?(Project::AFTER_WIP_STATUSES) ? project&.status&.humanize : ""
      row_array[headers["Wip Sub Status"]] = project&.status.in?(Project::AFTER_WIP_STATUSES) ? project&.sub_status&.humanize : ""
      row_array[headers["Wip Stage"]] = quotation_wip_stage
      row_array[headers["Client Approval Date"]] = quotation.client_approval_at&.strftime("%d-%m-%Y") if quotation.is_approved == true
      row_array[headers["Client Approval Time"]] = quotation.client_approval_at&.strftime("%I:%M:%S %p") if quotation.is_approved == true
      row_array[headers["Client Approval Timestamp"]] = quotation.client_approval_at&.strftime("%d-%m-%Y %I:%M:%S %p") if quotation.is_approved == true
      row_array[headers['Referral name']] = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      row_array[headers['Referral Type']] = lead.referrer_type

      sheet.add_row row_array
    end

    file_name = "BOQ-Report-#{user.id}-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp", file_name)
    package.serialize(filepath)
    ReportMailer.boq_report_email(filepath, file_name, user).deliver!
    File.delete(filepath) if File.exist?(filepath)
  end
end
