class BoqLineItemReportJob < ApplicationJob
  queue_as :report_mailer

  def perform(user, quotation_ids)
      line_item_excel = line_item_report(quotation_ids)
      UserNotifierMailer.line_item_excel_mail(line_item_excel[:filepath], line_item_excel[:file_name], user).deliver_now
      File.delete(line_item_excel[:filepath]) if File.exist?(line_item_excel[:filepath])
  end

  # return an Excel workbook - not saved
  # shared boqs only
  def line_item_report(quotation_ids)
    shared_boqs = Quotation.where(id: quotation_ids)
    package = Axlsx::Package.new
    workbook = package.workbook
    sheet = workbook.add_worksheet(name: 'BOQ Line Item Report')

    header_arr = ['Lead ID', 'Client', 'CM', 'Designer', 'BOQ Value', 'BOQ#', 'BOQ Status', 'BOQ Stage', 
      '10% Payment', '40% Payment', 'Space', 'Line Item Type', 'BOQ Line Item', 'Name', 'Description', 
      'Quantity', 'Rate', 'Amount', 'Discount %', 'Final amount']
    headers = {}
    header_arr.each_with_index do |title, i|
      headers[title] = i
    end

    # first set headers
    sheet.add_row(header_arr)

    i = 0
    shared_boqs.find_each do |boq|
      # byebug if i==2
      common_values_array = []
      project = boq.project
      lead = project.lead
      cm = lead.assigned_cm
      designer = project.assigned_designer
      # common_values_array << [lead&.id, lead&.name, cm&.name, designer&.name, boq.total_amount.round(0), 
        # boq.reference_number]
      created_or_shared = boq.proposals.proposal_shared.present? ? 'shared' : 'created'
      # common_values_array[headers['BOQ Status']] = created_or_shared
      boq_stage = boq.final_boq? ? 'final' : 'initial'
      # common_values_array[headers['BOQ Stage']] = boq_stage
      payment_10_per = boq.payment_10_done? ? 'Yes' : 'No'
      # common_values_array[headers['10% Payment']] = payment_10_per
      payment_40_per = boq.payment_50_done? ? 'Yes' : 'No'
      # common_values_array[headers['40% Payment']] = payment_40_per
      #discount_percent = boq.discount_status=='accepted' ? boq.discount_value.to_f : 0.0
      if boq.discount_status != 'accepted' && boq.parent_quotation&.discount_status == 'accepted'
        discount_percent = boq.parent_quotation&.discount_value.to_f
      elsif boq.discount_status == 'accepted'
        discount_percent = boq.discount_value.to_f
      else 
        discount_percent = 0.0
      end
      options = {
        headers: headers,
        lead_id: lead&.id,
        lead_name: lead&.name,
        cm_name: cm&.name,
        designer_name: designer&.name,
        boq_amount: boq.total_amount.round(0),
        reference_number: boq.reference_number,
        discount_percent: discount_percent,
        created_or_shared: created_or_shared,
        boq_stage: boq_stage,
        payment_10_per: payment_10_per,
        payment_40_per: payment_40_per
      }

      boq.boqjobs.each do |boqjob|
        add_boqjob_row(boqjob, sheet, options)
      end

      boq.modular_jobs.wardrobe.each do |modular_job|
        options[:category] = 'Wardrobe'
        add_modular_job_row(modular_job, sheet, options)
      end

      boq.modular_jobs.kitchen.each do |modular_job|
        options[:category] = 'Kitchen'
        add_modular_job_row(modular_job, sheet, options)
      end

      boq.service_jobs.each do |service_job|
        add_service_job_row(service_job, sheet, options)
      end

      boq.appliance_jobs.each do |appliance_job|
        add_appliance_job_row(appliance_job, sheet, options)
      end

      boq.extra_jobs.each do |extra_job|
        add_extra_job_row(extra_job, sheet, options)
      end

      boq.custom_jobs.each do |custom_job|
        add_custom_job_row(custom_job, sheet, options)
      end

      boq.shangpin_jobs.each do |shangpin_job|
        add_shangpin_job_row(shangpin_job, sheet, options)
      end

      i += 1
    end

    file_name = "BOQLineItemReport-#{Time.zone.now.strftime("%Y-%m-%d--%I-%M%p")}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  private

  def add_boqjob_row(boqjob, sheet, options)
    row_array = []
    product = boqjob.product
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = boqjob.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = boqjob.space
    row_array[headers['Line Item Type']] = 'Loose Furniture'
    row_array[headers['Name']] = product.name
    description = ""
    description += "-Dimensions: #{product.dimensions} "
    description += "-#{product.product_config} " if product.product_config.present?
    description += "-Color: #{product.color} "
    description += "; Finish: #{product.finish}"
    description += "; Material: #{product.material}"
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = boqjob.quantity
    row_array[headers['Rate']] = boqjob.rate.round(0)
    row_array[headers['Amount']] = boqjob.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_service_job_row(service_job, sheet, options)
    row_array = []
    service_activity = service_job.service_activity
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = service_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = service_job.space
    row_array[headers['Line Item Type']] = 'Service'
    row_array[headers['Name']] = service_activity&.service_category&.name || service_activity&.service_subcategory&.name
    description = service_activity.name
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = service_job.quantity
    row_array[headers['Rate']] = service_job.final_rate.round(0)
    row_array[headers['Amount']] = service_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_appliance_job_row(appliance_job, sheet, options)
    row_array = []
    kitchen_appliance = appliance_job.kitchen_appliance
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = appliance_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = appliance_job.space
    row_array[headers['Line Item Type']] = 'Appliance'
    row_array[headers['Name']] = kitchen_appliance.code
    description = ""
    description += "Appliance Name: #{kitchen_appliance.name}; Make: #{kitchen_appliance.make}; Specifications: #{kitchen_appliance.specifications}"
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = appliance_job.quantity
    row_array[headers['Rate']] = appliance_job.rate.round(0)
    row_array[headers['Amount']] = appliance_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_extra_job_row(extra_job, sheet, options)
    row_array = []
    addon = extra_job.addon.present? ? extra_job.addon : extra_job.addon_combination
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = extra_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = extra_job.space
    row_array[headers['Line Item Type']] = 'Extra'
    row_array[headers['Name']] = addon.code
    description = ""
    if addon.class.to_s == 'AddonCombination'
      addon.addons.each do |included_addon|
        description += "Name: #{included_addon.name}; Make: #{included_addon.brand&.name}; Specifications: #{included_addon.specifications}\n"
      end
    else
      description += "Name: #{addon.name}; Make: #{addon.brand&.name}; Specifications: #{addon.specifications}"
    end
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = extra_job.quantity
    row_array[headers['Rate']] = extra_job.rate.round(0)
    row_array[headers['Amount']] = extra_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_custom_job_row(custom_job, sheet, options)
    row_array = []
    custom_element = custom_job.custom_element
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = custom_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = custom_job.space
    row_array[headers['Line Item Type']] = 'Custom'
    row_array[headers['Name']] = "#{custom_element.name}; Dimensions: #{custom_element.dimension}"
    description = ""
    description += "Core Material: #{custom_element.core_material}; "
    description += "ShutterFinish: #{custom_element.shutter_finish}; "
    description += "Designer Remark: #{custom_element.designer_remark}; "
    description += "Category Remark: #{custom_element.category_remark}"
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = custom_job.quantity
    row_array[headers['Rate']] = custom_job.rate.round(0)
    row_array[headers['Amount']] = custom_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_modular_job_row(modular_job, sheet, options)
    row_array = []
    product_module = modular_job.product_module
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = modular_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = modular_job.space
    row_array[headers['Line Item Type']] = options[:category]
    row_array[headers['Name']] = "Module Type: #{product_module&.module_type&.name}; Code: #{product_module&.code}; Dimensions: #{modular_job.dimensions}"
    boq_global_config = modular_job.get_boq_global_config
    description = ""
    if modular_job.category=='kitchen' && boq_global_config&.civil_kitchen
      civil_kitchen_parameter = boq_global_config.civil_kitchen_parameter
      description += "Civil Kitchen: yes; Countertop: #{boq_global_config.countertop}; Countertop width: #{boq_global_config.countertop_width || modular_job.ownerable.default_countertop_length}; "
    elsif modular_job.category=='wardrobe' && modular_job.is_combined_module?
      description += "Modules Combined: #{modular_job.modular_jobs.map{|j| j.product_module.code}.join(',')}; "
      description += "Combined Door: #{modular_job.combined_door&.name}; "
    end
    description += "Core Material: #{modular_job.core_material}; "
    description += "Shutter Material: #{modular_job.shutter_material}; "
    description += "Shutter Finish: #{modular_job.shutter_finish}; "
    description += "Shutter Shade Code: #{modular_job.shutter_shade_code}; "
    description += "Edge Banding Shade Code: #{modular_job.edge_banding_shade_code}; "
    description += "Drawer Handle Code: #{modular_job.door_handle_code}; "
    description += "Shutter Handle Code: #{modular_job.shutter_handle_code}; "
    description += "Hinge Type: #{modular_job.hinge_type}; "
    description += "Channel Type: #{modular_job.channel_type}; "
    description += "Hardware Brand: #{modular_job.brand&.name}; "
    description += "Number Exposed Sites: #{modular_job.number_exposed_sites}; "
    if modular_job.category=='wardrobe'
      if modular_job.combined
        modular_job.modular_jobs.each do |sub_job|
          sub_job.addons.each do |addon|
            job_addon = addon.job_addons.find_by(modular_job: sub_job)
            description += "Code: #{addon.code};  Name: #{addon.name};  Quantity: #{job_addon&.quantity}; "
          end if sub_job.addons.present?
        end if modular_job.modular_jobs.present? 
      else
        modular_job.addons.each do |addon|
          job_addon = addon.job_addons.find_by(modular_job: modular_job)
          description += "Code: #{addon.code}; Name: #{addon.name}; Quantity: #{job_addon&.quantity}; "
        end if modular_job.addons.present?
      end
    elsif modular_job.category=='kitchen'
      modular_job.job_addons.each do |job_addon|
        if job_addon.combination?
          job_addon.addon_combination.addons&.each do |addon|
            description += "Slot: #{job_addon.slot}; Code: #{addon&.code}; Name: #{addon&.name}; Quantity: #{job_addon&.quantity}; "
          end
        else
          description += "Slot: #{job_addon.slot}; Code: #{job_addon.addon&.code}; Name: #{job_addon.addon&.name}; Quantity: #{job_addon&.quantity}; "
        end
      end if modular_job.job_addons.present? 
    end
    row_array[headers['Description']] = description
    row_array[headers['Quantity']] = modular_job.quantity
    row_array[headers['Rate']] = modular_job.combined.present? ? (modular_job.amount - modular_job.modular_jobs.sum(:amount)).round(0) : modular_job.rate.round(0)
    row_array[headers['Amount']] = modular_job.combined.present? ? (modular_job.amount - modular_job.modular_jobs.sum(:amount)).round(0) : modular_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = modular_job.combined.present? ? ((modular_job.amount - modular_job.modular_jobs.sum(:amount)) * (1-(discount_percent/100.0))).round(0) : final_amount.round(0)
    sheet.add_row(row_array)
  end

  def add_shangpin_job_row(shangpin_job, sheet, options)
    row_array = []
    job = shangpin_job.job_type
    headers = options[:headers]
    # common_values_array = [options[:common_values_array]].flatten
    discount_percent = options[:discount_percent].to_f>0 ? options[:discount_percent] : 0
    final_amount = shangpin_job.amount * (1-(discount_percent/100.0))
    # common columns
    row_array[headers['Lead ID']] = options[:lead_id]
    row_array[headers['Client']] = options[:lead_name]
    row_array[headers['CM']] = options[:cm_name]
    row_array[headers['Designer']] = options[:designer_name]
    row_array[headers['BOQ Value']] = options[:boq_amount]
    row_array[headers['BOQ#']] = options[:reference_number]
    row_array[headers['BOQ Status']] = options[:created_or_shared]
    row_array[headers['BOQ Stage']] = options[:boq_stage]
    row_array[headers['10% Payment']] = options[:payment_10_per]
    row_array[headers['40% Payment']] = options[:payment_40_per]
    # common columns end
    row_array[headers['Space']] = shangpin_job.space
    row_array[headers['Line Item Type']] = 'Custom Furniture'
    case job
    when "door"
      row_array[headers['Name']] = "Item: #{shangpin_job.door_item}  Model No: #{shangpin_job.door_model_no}"    
      description = ""
      description += "Actual Size (wdh)(mm) : #{shangpin_job.door_width}*#{shangpin_job.door_depth}*#{shangpin_job.door_height} Color: #{shangpin_job.door_color}"
      row_array[headers['Description']] = description
      row_array[headers['Quantity']] = shangpin_job.door_quantity
      row_array[headers['Rate']] = shangpin_job.door_price ? shangpin_job.door_price.round(0) : "-"
    when "cabinet"
      row_array[headers['Name']] = "Item: #{shangpin_job.cabinet_item}  Model No: #{shangpin_job.cabinet_model_no}"    
      description = ""
      description += "Actual Size (wdh)(mm) : #{shangpin_job.cabinet_width}*#{shangpin_job.cabinet_depth}*#{shangpin_job.cabinet_height} Color: #{shangpin_job.cabinet_color}"
      row_array[headers['Description']] = description
      row_array[headers['Quantity']] = shangpin_job.cabinet_quantity
      row_array[headers['Rate']] = shangpin_job.cabinet_price ? shangpin_job.cabinet_price.round(0) : "-"
    when "accessory"
      row_array[headers['Name']] = "Item: #{shangpin_job.accessory_item}  Model No: #{shangpin_job.accessory_model_no}"    
      description = ""
      description += "Actual Size (wdh)(mm) : #{shangpin_job.accessory_width}*#{shangpin_job.accessory_depth}*#{shangpin_job.accessory_height} Color: #{shangpin_job.accessory_color}"
      row_array[headers['Description']] = description
      row_array[headers['Quantity']] = shangpin_job.accessory_quantity
      row_array[headers['Rate']] = shangpin_job.accessory_price ? shangpin_job.accessory_price.round(0) : "-"
    when "wardrobe"
      row_array[headers['Name']] = '-'
      description = "-"
      row_array[headers['Description']] = description
      row_array[headers['Quantity']] = '-'
      row_array[headers['Rate']] = shangpin_job.wardrobe_price ? shangpin_job.wardrobe_price.round(0) : "-"
    when "sliding_door"
      row_array[headers['Name']] = "Item: #{shangpin_job.door_item}  Model No: #{shangpin_job.door_model_no}"    
      description = ""
      description += "Actual Size (wdh)(mm) : #{shangpin_job.door_width}*#{shangpin_job.door_depth}*#{shangpin_job.door_height} Color: #{shangpin_job.door_color}"
      row_array[headers['Description']] = description
      row_array[headers['Quantity']] = shangpin_job.door_quantity
      row_array[headers['Rate']] = shangpin_job.door_price ? shangpin_job.door_price.round(0) : "-"
    else
      nil  
    end    
    row_array[headers['Amount']] = shangpin_job.amount.round(0)
    row_array[headers['Discount %']] = discount_percent
    row_array[headers['Final amount']] = final_amount.round(0)
    sheet.add_row(row_array)
  end  
end