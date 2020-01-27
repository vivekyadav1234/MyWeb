# frozen_string_literal: true

class MarginReportDownloadJob < ApplicationJob
  queue_as :default

  def perform(user)
    margin_report(user)
  end
end
def margin_report(user)
  quotations = Quotation.where(wip_status: "10_50_percent").where(status: "shared").where("quotations.client_approval_at > quotations.created_at")
  package = Axlsx::Package.new
  margin_boq_spread_sheet = package.workbook
  sheet = margin_boq_spread_sheet.add_worksheet(name: 'Margin-Report')
  header_names = [
    'Lead ID',
    'Customer Name',
    'CM Name',
    'Designer Name',
    'Lead Source',
    'BOQ Number',
    'BOQ Value before Discount',
    'BOQ Value after Discount',
    'Panel Value after Discount (Modular Kitchen and Modular Wardrobe)',
    'Non Panel Value after Discount (Loose Furniture)',
    'Services Value after Discount',
    'Custom Element Value after Discount',
    'Custom Furniture Value after Discount',
    '10% Date (First 10% Payment Verified)',
    '10% Amount (Verified by Finance)',
    '40% Date (First 40% Payment Verified)',
    '40% Amount (Verified by Finance)',
    'Final 50% Date (First 50% Payment Verified)',
    'Final 50% Amount (Verified by Finance)',
    'Total Amount Collected (Verified by Finance)',
    'Total % of Payment Collected',
    'Total Value of All POs released',
    'Total Value of Snag POs released',
    'Total Value of POs (Not Released)',
    'Value of all POs released after 100% Payment collected',
    'Total Margin (Final BOQ value after discount - sum of all POs)'
  ]

  headers = {}
  header_names.each_with_index do |n, i|
    headers[n] = i
  end

  sheet.add_row header_names
  quotations.each do |quotation|
    project = quotation.project
    designer = project.assigned_designer
    lead = project.lead
    cm = lead.assigned_cm
    lead_source = lead.lead_source&.name
    # calculating discount value
    if quotation.discount_status == 'accepted'
      discount_value = quotation.discount_value
    elsif quotation.parent_quotation&.discount_status == 'accepted'
      discount_value = quotation.parent_quotation.discount_value
    else
      discount_value = 0.0
    end
    #total payment collected on a boq
    payment_collected = quotation.parent_quotation&.quotation_payments&.pluck(:amount)&.compact&.sum.to_f + quotation.quotation_payments&.pluck(:amount)&.compact&.sum.to_f
    #calculating time when 100% payment is done on boq
    final_payment_date = payment_collected.round(0) == quotation.total_amount.round(0) ? quotation.payments.where(is_approved: true).last&.updated_at : Time.now

    purchase_orders = quotation.purchase_orders.where(status: "released")
    pos_released_after_100_per_payment = purchase_orders.where("created_at > ?", final_payment_date)
    
    #declare variable
    po_amount = snag_amount = po_amount_after_hund_per = pending_pos_amount = 0

    pos_released_after_100_per_payment.each do |po|
      po_amount_after_hund_per += po.job_element_vendors.pluck(:final_amount).compact.sum
    end if pos_released_after_100_per_payment.present?

    purchase_orders.each do |po|
      if po.tag_snag.present?
        snag_amount += po.job_element_vendors.pluck(:final_amount).compact.sum
        po_amount += po.job_element_vendors.pluck(:final_amount).compact.sum
      else
        po_amount += po.job_element_vendors.pluck(:final_amount).compact.sum
      end
    end if purchase_orders.present?
    
    pending_pos = quotation.purchase_orders.where(status: "pending")

    pending_pos.each do |po|
      pending_pos_amount += po.job_element_vendors.pluck(:final_amount).compact.sum
    end if pending_pos.present?

    modular_jobs_amount = quotation.modular_jobs.where(combined_module_id: nil).pluck(:amount).compact.sum + quotation.appliance_jobs.pluck(:amount).compact.sum

    row_array = []
    row_array[headers['Lead ID']] = lead.id
    row_array[headers['Customer Name']] = lead.name
    row_array[headers['CM Name']] = cm.name
    row_array[headers['Designer Name']] = designer.name
    row_array[headers['Lead Source']] = lead_source
    row_array[headers['BOQ Number']] = quotation.reference_number
    row_array[headers['BOQ Value before Discount']] = quotation.net_amount
    row_array[headers['BOQ Value after Discount']] = quotation.total_amount
    row_array[headers['Panel Value after Discount (Modular Kitchen and Modular Wardrobe)']] = modular_jobs_amount * (1 - (discount_value / 100)).round(2)
    row_array[headers['Non Panel Value after Discount (Loose Furniture)']] = (quotation.boqjobs.sum(:amount) * (1 - discount_value / 100)).round(2)
    row_array[headers['Services Value after Discount']] = (quotation.service_jobs.sum(:amount) * (1 - discount_value / 100)).round(2)
    row_array[headers['Custom Element Value after Discount']] = (quotation.custom_jobs.sum(:amount) * (1 - discount_value / 100)).round(2)
    row_array[headers['Custom Furniture Value after Discount']] = (quotation.shangpin_jobs.sum(:amount) * (1 - discount_value / 100)).round(2)
    row_array[headers['10% Date (First 10% Payment Verified)']] = quotation.parent_quotation&.payments&.where(is_approved: true)&.last&.updated_at
    row_array[headers['10% Amount (Verified by Finance)']] = quotation.parent_quotation&.quotation_payments&.select{|qp| qp.payment.is_approved == true}&.pluck(:amount)&.compact&.sum
    row_array[headers['40% Date (First 40% Payment Verified)']] = quotation.payments.where(is_approved: true)&.where(payment_stage: "10_50_percent")&.last&.updated_at
    row_array[headers['40% Amount (Verified by Finance)']] = quotation.quotation_payments&.select{|qp| qp.payment.is_approved == true && qp.payment.payment_stage == "10_50_percent"}&.pluck(:amount)&.compact&.sum
    row_array[headers['Final 50% Date (First 50% Payment Verified)']] = quotation.payments.where(is_approved: true).where(payment_stage: "final_payment")&.last&.updated_at
    row_array[headers['Final 50% Amount (Verified by Finance)']] = quotation.quotation_payments&.select{|qp| qp.payment.is_approved == true && qp.payment.payment_stage == "final_payment"}&.pluck(:amount)&.compact&.sum
    row_array[headers['Total Amount Collected (Verified by Finance)']] = payment_collected.round(2)
    row_array[headers['Total % of Payment Collected']] = ((payment_collected / quotation.total_amount) * 100).round(2)
    row_array[headers['Total Value of All POs released']] = po_amount != 0 ? po_amount : '-'
    row_array[headers['Total Value of Snag POs released']] = snag_amount != 0 ? snag_amount : '-'
    row_array[headers['Total Value of POs (Not Released)']] = pending_pos_amount != 0 ?  pending_pos_amount.round(0) : '-'
    row_array[headers['Value of all POs released after 100% Payment collected']] = po_amount_after_hund_per != 0 ? po_amount_after_hund_per : '-'
    row_array[headers['Total Margin (Final BOQ value after discount - sum of all POs)']] = (quotation.total_amount - po_amount.to_f).round(2)
    sheet.add_row row_array
  end
  file_name = "Margin-Report-#{Time.zone.now.strftime('%Y-%m-%d:%I:%M:%S%p')}.xlsx"
  filepath = Rails.root.join('tmp', file_name)
  package.serialize(filepath)
  ReportMailer.margin_report_email(filepath, file_name, user).deliver!
  File.delete(filepath) if File.exist?(filepath)
end
