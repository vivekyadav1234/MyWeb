class ProjectForPaymentInvoiceSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data].map{|a| a[:attributes]}
  end

  attribute :project_info do |object|
    lead = object.lead
    if lead.note_records.last&.building_crawler.present? 
      shipping_address = "#{lead.note_records.last.building_crawler.building_name} - #{lead.note_records.last.building_crawler.locality}" 
    end    
    @quotations = object.quotations.where("paid_amount >= total_amount*0.45 OR per_50_approved_by_id IS NOT NULL").where(wip_status: "10_50_percent").joins(:payments).where(payments: {is_approved: true, payment_stage: "final_payment"})
    line_items = []
    @quotations.each do |quotation|
      boq_number = quotation.reference_number
      fifty_approved_date = quotation.quotation_payments&.last&.payment&.updated_at
      discount_value = quotation.discount_value_to_use
      is_pm_fee_needed = (quotation.nonservice_pm_fee > 0 || quotation.service_pm_fee > 0) ? true : false
      line_item = nil
      boq_jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a + quotation.shangpin_jobs.to_a
      boq_jobs.each do |job|
        job_amount = job.amount.to_f * (1 - (discount_value.to_f/100))
        job_amount = is_pm_fee_needed ? (job_amount.to_f * (1 + (Quotation::PROJECT_MANAGEMENT_FEE/100))) : job_amount
        case job.class.name
        when "ModularJob"
          type =  job.category == "kitchen" ? "Modular kitchen" : "Modular Wardrobe"
          dimension = job.length.present? ? "#{job.length}X#{job.breadth}X#{job.thickness}" : "#{job.product_module&.width}X#{job.product_module&.depth}X#{job.product_module&.height}"
          job_name = "Module Type: #{job.product_module&.module_type&.name.to_s}  Module :#{job.product_module&.code.to_s} \n Dimension: #{dimension}mm"
          quantity = job.quantity 
        when "ExtraJob" 
          type =  job.category == "kitchen" ? "Kitchen Extra" : "Wardrobe Extra"
          job_name = job.name
          quantity = job.quantity
        when "ApplianceJob"
          type =  "Appliance"
          job_name = job.name
          quantity = job.quantity
        when "Boqjob" 
          type = "Furniture"
          job_name = job.name 
          quantity = job.quantity
        when "CustomJob"
          type = "Custom Element"
          job_name = job&.custom_element&.name
          qquantity = job.quantity
        when "ServiceJob"
          type = "Service"
          job_name = job.name
          quantity = job.quantity
        when "ShangpinJob"
          type = "Custom Furniture"
          case job.job_type
          when "cabinet"
            job_name = "#{job.job_type.capitalize} \n Item: #{job.cabinet_item} \n Model No: #{job&.cabinet_model_no}"
            quantity = job.cabinet_quantity
          when "door"
            item = job.door_item ? job.door_item : job.door_style_code 
            job_name = "#{job.job_type.capitalize} \n Item: #{item} \n Model No: #{job.door_model_no}"
            quantity = job.door_quantity
          when "accessory"
            item = job.accessory_item ? job.accessory_item : job.accessory_code
            job_name = "#{job.job_type.capitalize} \n Item: #{item}  \n Model No: #{job.accessory_model_no}"
            quantity = job.accessory_quantity
          when "sliding_door"
            item = job.door_item ? job.door_item : job.door_style_code 
            job_name = "Sliding Door \n Item: #{item} \n Model No: #{job.door_model_no}"
            quantity = job.door_quantity
          when "wardrobe"
            job_name = "Wardrobe"
            quantity = nil
          else
            job_name = nil
            quantity = nil
          end
        else
          type = nil
          job_name = nil
          quantity = nil   
        end
        line_items << { 
          space: job.space,
          job_type: type,
          job_name: job_name,
          job_amount: job_amount,
          job_quantity: quantity,
          fifty_approved_date: fifty_approved_date,
          job_id: job.id,
          job_segment: job.get_segment,
          job_class: job.class.name,
          boq_number: boq_number,
          invoice_status: job.payment_invoice&.status,
          is_invoice: job.invoice_line_item&.present? ? true : false
        }  
      end if boq_jobs.present?     
    end
    project_info = {
      lead_id: lead.id,
      project_id: object.id,
      lead_name: lead.name,
      lead_email: lead.email,
      lead_phone: lead.contact,
      cm: lead.assigned_cm.name,
      designer: object.assigned_designer.name,
      paid_amount: @quotations.sum(:paid_amount),
      total_amount: @quotations.sum(:total_amount),
      line_items: line_items,
      billing_addess: object.project_booking_form&.billing_address,
      gst_number: object.project_booking_form&.gst_number,
      shipping_address: shipping_address
    }
  end
end