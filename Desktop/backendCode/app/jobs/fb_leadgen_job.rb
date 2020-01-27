class FbLeadgenJob < ApplicationJob
  queue_as :default

  include FbModule::CommonModule

  def perform(start_time, end_time)
    # Excel Headers
    header_names = [
      'Delta lead id',
      'Phone number',
      'Duplicate number',
      'Duplicate lead id',
      'FB creation time',
      'Delta ping time',
      'Delta creation time',
      'FB leadgen_id',
      'FB ad_id',
      'FB form_id',
      'FB page_id',
      'FB adgroup_id'
    ]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end

    package = Axlsx::Package.new
    fb_leads_report = package.workbook
    sheet = fb_leads_report.add_worksheet(:name => "Leadgen Report")
    sheet.add_row header_names

    FbLeadgen.where(created_at: start_time..end_time).includes(:lead).find_each do |fb_leadgen|
      skipped_form = forms_to_skip.values.include?(fb_leadgen.form_id.to_i)
      lead = fb_leadgen.lead

      row_array = []
      row_array[headers['Delta lead id']] = lead.present? ? lead.id : (skipped_form ? 'form skipped' : '')
      row_array[headers['FB leadgen_id']] = fb_leadgen.leadgen_id
      row_array[headers['Delta creation time']] = lead&.created_at
      row_array[headers['FB creation time']] = fb_leadgen.fb_created_time
      row_array[headers['Delta ping time']] = fb_leadgen.created_at
      row_array[headers['FB ad_id']] = fb_leadgen.ad_id
      row_array[headers['FB form_id']] = fb_leadgen.form_id
      row_array[headers['FB page_id']] = fb_leadgen.page_id
      row_array[headers['FB adgroup_id']] = fb_leadgen.adgroup_id
      row_array[headers['Phone number']] = fb_leadgen.contact
      # Check for duplicate phone number case.
      if lead.blank? && Lead.where(contact: fb_leadgen.contact).exists?
        duplicate_lead = Lead.find_by(contact: fb_leadgen.contact)
      end
      row_array[headers['Duplicate number']] = ( lead.blank? && Lead.where(contact: fb_leadgen.contact).exists? ) ? 'yes' : 'no'
      row_array[headers['Duplicate lead id']] = duplicate_lead&.id
      
      sheet.add_row row_array
    end

    file_name = "Delta-FB-Leadgen-Report-#{start_time}-TO-#{end_time}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    FbMailer.fb_leadgen_report(file_name, filepath, start_time, end_time).deliver
  end
end
