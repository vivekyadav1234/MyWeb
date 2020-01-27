namespace :lead do
  task import_qualified_leads: :environment do
    folderpath = "/home/deploy/arrivae/shared/log/"
    filepath = folderpath + "Lead_Status.xlsx"
    csvpath = folderpath + "import_lead_summary.csv"
    workbook = Roo::Spreadsheet.open filepath

    # puts workbook.row(1)

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    CSV.open(csvpath, "wb") do |csv|
      csv << ["Row", "name", "contact", "city", "email", "New lead", "Lead saved", "Lead approved", "errors"]
    end

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # begin
        import_row(workbook, row, headers, csvpath)
      # rescue StandardError => e
      #   CSV.open(csvpath, "a+") do |csv|
      #     csv << ["Row #{row}", "", "", "", "", "", "", "", e.message]
      #   end
      # end          
    end
  end
end

def import_row(workbook, row, headers, csvpath)
  # flags
  new_lead = true
  lead_saved = false
  lead_approved = false
  # Get the column data using the column heading.
  lead_type = LeadType.find_by(name: 'customer')
  name = workbook.row(row)[headers['customer name']]
  contact = workbook.row(row)[headers['customer phone no']]
  city = workbook.row(row)[headers['city']]
  lead = Lead.where(lead_type: lead_type, name: name, city: city, contact: contact).first_or_initialize
  lead.email = Lead.generate_dummy_email
  lead.dummyemail = true
  lead.source = 'bulk'
  lead.lead_source = LeadSource.find_by(name: "digital_marketing")   #Since all values are 'Facebook Campaign'

  #questionnaire details
  project_type = workbook.row(row)[headers['project type']]
  accomodation_type = workbook.row(row)[headers['type of accommodation']]
  scope_of_work = [].push(workbook.row(row)[headers['scope of work']]) if workbook.row(row)[headers['scope of work']]
  possession_status = parse_possession_status(workbook.row(row)[headers['possession status']])
  possession_status_date = parse_call_back_day(workbook.row(row)[headers['possession date']])
  call_back_day = parse_call_back_day(workbook.row(row)[headers['call back day']])
  call_back_time = workbook.row(row)[headers['call back time']]
  have_floorplan = "No"
  additional_comments = workbook.row(row)[headers['additional comments']]
  project_name = workbook.row(row)[headers['project name']]
  have_homeloan = workbook.row(row)[headers['do you have a home loan against the property?']]
  lead_generator = workbook.row(row)[headers['lead generator']]
  location = workbook.row(row)[headers['location']]
  home_value = workbook.row(row)[headers['home value']]
  budget_value = workbook.row(row)[headers['budget value']]

  note_record = nil
  if lead.new_record?
    note_record = lead.note_records.build
  else
    new_lead = false
    note_record = lead.note_records.last
    note_record = lead.note_records.build if note_record.blank?
  end

  note_record.assign_attributes(customer_name: name, 
    phone: contact, 
    city: city, 
    project_type: project_type, 
    accomodation_type: accomodation_type, 
    scope_of_work: scope_of_work, 
    possession_status: possession_status, 
    possession_status_date: possession_status_date, 
    call_back_day: call_back_day, 
    call_back_time: call_back_time, 
    have_floorplan: have_floorplan, 
    additional_comments: additional_comments, 
    project_name: project_name, 
    have_homeloan: have_homeloan, 
    lead_generator: lead_generator, 
    location: location,
    home_value: home_value, 
    budget_value: budget_value
    )

    lead.save!
    lead_saved = true
    lead.approve
    lead_approved = true

rescue ActiveRecord::RecordInvalid => exception
  message = exception.message
ensure
  message ||= ""
  CSV.open(csvpath, "a+") do |csv|
    csv << [row, name, contact, city, lead.email, new_lead.to_s, lead_saved.to_s, 
      lead_approved.to_s, message]
  end
end

def parse_possession_status(str)
  return nil if str.blank?
  if str.include?("Possession Taken")
    return "Possession Taken"
  elsif str.include?("Awaiting Possession")
    return "Awaiting Possession"
  else
    return nil
  end
end

def parse_call_back_day(str)
  return nil if str.blank?
  elements = str.to_s
  # elements = str.to_s.split("/")
  # elements[2] + "-" + elements[0] + "-" + elements[1]
end
