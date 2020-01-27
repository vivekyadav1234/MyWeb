class GmDashboardModule::GmDashboardExcel
  def initialize(leads, user)
    @leads = leads
    @user = user
  end

  def gm_dashboard_excel
    package = Axlsx::Package.new
    excel_report = package.workbook
    sheet = excel_report.add_worksheet(:name => "excel Report")
    
    header_names = ["Sr_No", "Customer Name", "lead id", "CM Name", "Designer Name", "Delayed Project / Possession", "Lead Assignment to CM", "Date of 1st Meeting", "Date of First Attempt by Designer", "Total BOQ Created Value", "Total BOQ Shared Value", "Total Closure Value", "First BOQ Creation Date", "First BOQ Sharing Date", "First Closure Date (10% Payment Verified)", "Lead Asgmt to Designer - First Attempt", "Lead Asgmt to Designer - BOQ Creation", "Lead Asgmt to Designer - BOQ Sharing", "Lead Assignment to - Closure"]    
    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end
    sheet.add_row header_names
    sr_no = 1

    @leads.each do |lead|
      row_array = []
      row_array[headers["Sr_No"]] = sr_no
      row_array[headers["Customer Name"]] = lead.name
      row_array[headers["lead id"]] = lead.id
      row_array[headers["CM Name"]] = lead.assigned_cm&.name&.titleize
      row_array[headers["Designer Name"]] = lead.designer_projects&.where(active: true)&.first&.designer&.name&.titleize
      row_array[headers["Delayed Project / Possession"]] = lead.lead_status.in?(["delayed_possession", "delayed_project"]) ? "Yes" : "No"
      row_array[headers["Lead Assignment to CM"]] = lead.lead_statistics_datum&.lead_qualification_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      row_array[headers["Date of 1st Meeting"]] = lead.lead_statistics_datum&.first_meeting_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      row_array[headers["Date of First Attempt by Designer"]] = lead.lead_statistics_datum&.first_meeting_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      row_array[headers["Total BOQ Created Value"]] = lead.project&.quotations&.pluck(:total_amount)&.sum&.round(0) || 0
      row_array[headers["Total BOQ Shared Value"]] = lead.project&.quotations&.where(status: "shared")&.pluck(:total_amount)&.sum&.round(0) || 0
      row_array[headers["Total Closure Value"]] = lead.lead_statistics_datum&.closure_value&.round(0) || 0
      row_array[headers["First BOQ Creation Date"]] = lead.lead_statistics_datum&.boq_creation_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      row_array[headers["First BOQ Sharing Date"]] = lead.lead_statistics_datum&.first_shared_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      row_array[headers["First Closure Date (10% Payment Verified)"]] = lead.lead_statistics_datum&.closure_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
      first_boq = lead.lead_statistics_datum&.boq_creation_time
      first_meeting = lead.project&.events&.where(agenda: "first_meeting", status: "done")&.first&.updated_at
      first_sharing = lead.lead_statistics_datum&.first_shared_time
      closure_date = lead.lead_statistics_datum&.closure_time
      lead_desigent_assignment = lead.project&.designer_projects&.where(active: true)&.first&.created_at
      row_array[headers["Lead Asgmt to Designer - First Attempt"]] = ((first_meeting - lead_desigent_assignment  )/86400)&.to_i if first_meeting.present?
      row_array[headers["Lead Asgmt to Designer - BOQ Creation"]] = ((first_boq - lead_desigent_assignment)/86400).to_i if first_boq.present?
      row_array[headers["Lead Asgmt to Designer - BOQ Sharing"]] =  ((first_sharing - lead_desigent_assignment)/86400).to_i if first_sharing.present?
      row_array[headers["Lead Assignment to - Closure"]] = ((closure_date - lead_desigent_assignment)/86400).to_i if closure_date.present? 
      sr_no +=1
      sheet.add_row row_array
    end
    file_name = "GM-Report#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    ReportMailer.gm_report_email(filepath, file_name, @user).deliver_now
    File.delete(filepath) if File.exist?(filepath)
  end
end