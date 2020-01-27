# This module will contain scripts to be executed to accommodate changes to the DB. The
# scripts will be temporary and will be removed once run on all servers/DBs as appropriate.
module ScriptModule
  def move_leads_to_pipeline
    users = User.with_role :community_manager
    targeted_lead_ids = []
    data = users.map{|user| 
      targeted_lead_ids += user.cm_leads.nil_pipeline_items.pluck(:id)
      {"#{user.email}"=> user.cm_leads.nil_pipeline_items.pluck(:id,:name)}
    }
    Lead.where(id: targeted_lead_ids).update_all(is_in_pipeline: true)
    data
  end

  def delete_duplicate_leads
    filepath = "#{Rails.root.join('app', 'data', 'Final to be deleted.xlsx')}"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    lead_ids = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      lead_id = workbook.row(row)[headers['final to be deleted']]
      lead_ids << lead_id
    end

    Lead.where(id: lead_ids).each do |lead|
      lead.project&.destroy!
      lead.destroy!
    end
  end


  def format_lead_contacts
    filepath = "#{Rails.root.join('app', 'data', 'formatted_contacts.xlsx')}"

    CSV.open(filepath, "wb") do |csv|
      csv << ["Lead ID", "email", "contact", "modified contact"]
    end

    Lead.all.each do |lead|
      original_contact = lead.contact
      new_contact = Lead.format_contact(original_contact)
      next if new_contact.blank?
      lead.update!(contact: new_contact)
      CSV.open(filepath, "a+") do |csv|
        csv << [lead.id, lead.email, original_contact, lead.contact]
      end
    end
  end

  def add_vendor_sub_categories
    filepath = "#{Rails.root.join('app', 'data', 'Vendor Category and sub category.xlsx')}"

    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      category_id = VendorCategory.find_by_category_name workbook.row(row)[0]
      VendorCategory.find_or_create_by(category_name: workbook.row(row)[1], parent_category_id: category_id.id)
    end
  end


  def add_vendor_categories
    categories = ["Modular Kitchen", "Modular Wardrobe", "Loose Furniture", "Services"]
    categories.each do |category|
      VendorCategory.find_or_create_by(category_name: category)
    end
  end



  def clear_older_events_for_project
    @projects = Project.all
    @projects.each do |project|
      eid = project.events.last.id if project.events.present?
      project.events.where.not(id: eid).update_all(status: "done") if project.events.present?
    end
  end

  def project_status_events
    @projects = Project.all
    @projects.each do |project|
      if ["follow_up", "on_hold"].include?(project.status)
        agenda = project.status
      elsif project.status == "not_contactable"
         agenda = "follow_up_for_not_contactable"
      end
      if ["follow_up", "not_contactable", "on_hold"].include?(project.status)
        project.events.where(agenda: agenda).where.not(scheduled_at: nil).last.update_attributes!(status: "scheduled") if project.events.where(agenda: agenda).where.not(scheduled_at: nil).present?
      end
    end
  end


  def change_substatus_for_floorplan_uploaded_projects
    @projects =  Project.where(sub_status: [nil, ""])
    @projects.each do |project|
       project.update_column("sub_status", "floorplan_uploaded") if project.floorplans.present?
    end
  end

  def mark_done_lost_events
    @leads = Lead.where(lead_status: ["lost","dropped"]).pluck(:id)
    @projects = Project.where("status = ? OR lead_id IN (?)", "lost" ,@leads)
    @projects.each do |project|
       project.events.update_all(status: "done") if project.events.present?
    end
  end

  def add_cities
    cities = ["mumbai", "pune", "bangalore", "delhi_ncr","ahmedabad", "nagpur", "aurangabad", "nashik", "kolhapur", "chennai", "kochi", "hyderabad", "new_delhi"]
    cities.each do |city|
     @city = City.find_or_create_by(name: city)
    end
  end

  def add_dpq_sections
    sections = ["Entrepreneurial Characteristics", "Curiosity", "World View on Design", "Empathy", "Knowledge of Spaces", "Ability to sell", "Educational Qualification", "Market and micro-market that you're working on"]
    sections.each do |section|
     @section = DpqSection.find_or_create_by(section_name: section)
    end
  end

  def add_dpq_questions
    filepath = "#{Rails.root.join('app', 'data', 'DP-Questions.xlsx')}"

    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      dpq_section_id = DpqSection.find_by_section_name workbook.row(row)[0]
      DpqQuestion.find_or_create_by(question: workbook.row(row)[1], dpq_section_id: dpq_section_id.id)
    end
  end

  def add_details_to_old_designers
    designers = User.with_role(:designer)
    designers.each do |designer|
      related_lead = designer.related_leads&.where(lead_type_id: (LeadType.find_by_name ("designer")))&.last
      if related_lead.present? && !designer.designer_detail.present?
        lead_cv = related_lead.lead_cv
        @designer_detail = designer.build_designer_detail(instagram_handle: related_lead&.instagram_handle, designer_cv: lead_cv)
        @designer_detail.save!
      elsif !designer.designer_detail.present?
        @designer_detail = designer.build_designer_detail
        @designer_detail.save!
      end
    end
  end

  def add_codes_bajaj_finance
    codes = [ "ARRBFL001","ARRBFL002","ARRBFL003","ARRBFL004","ARRBFL005","ARRBFL006","ARRBFL007","ARRBFL008","ARRBFL009","ARRBFL010",
              "ARRBFL011","ARRBFL012","ARRBFL013","ARRBFL014","ARRBFL015","ARRBFL016","ARRBFL017","ARRBFL018","ARRBFL019","ARRBFL020",
              "ARRBFL021","ARRBFL022","ARRBFL023","ARRBFL024","ARRBFL025","ARRBFL026","ARRBFL027","ARRBFL028","ARRBFL029","ARRBFL030",
              "ARRBFL031","ARRBFL032","ARRBFL033","ARRBFL034","ARRBFL035","ARRBFL036","ARRBFL037","ARRBFL038","ARRBFL039","ARRBFL040",
              "ARRBFL041","ARRBFL042","ARRBFL043","ARRBFL044","ARRBFL045","ARRBFL046","ARRBFL047","ARRBFL048","ARRBFL049","ARRBFL050",
              "ARRBFL051","ARRBFL052","ARRBFL053","ARRBFL054","ARRBFL055","ARRBFL056","ARRBFL057","ARRBFL058","ARRBFL059","ARRBFL060",
              "ARRBFL061","ARRBFL062","ARRBFL063","ARRBFL064","ARRBFL065","ARRBFL066","ARRBFL067","ARRBFL068","ARRBFL069","ARRBFL070",
              "ARRBFL071","ARRBFL072","ARRBFL073","ARRBFL074","ARRBFL075","ARRBFL076","ARRBFL077","ARRBFL078","ARRBFL079","ARRBFL080",
              "ARRBFL081","ARRBFL082","ARRBFL083","ARRBFL084","ARRBFL085","ARRBFL086","ARRBFL087","ARRBFL088","ARRBFL089","ARRBFL090",
              "ARRBFL091","ARRBFL092","ARRBFL093","ARRBFL094","ARRBFL095","ARRBFL096","ARRBFL097","ARRBFL098","ARRBFL099","ARRBFL100" ]
    codes.each do |code|
      Voucher.where(code: code).first_or_create
    end

    LeadSource.where(name: 'HFC').first_or_create
    LeadCampaign.where(name: 'Bajaj Finserv Voucher Campaign', status: 'active').first_or_create
  end

  # mark existing tags as those of addons
  def populate_tag_types
    Tag.where(tag_type: nil).update(tag_type: "addons")
  end

  def add_new_tags
    Tag.create(name: "mkw", tag_type: "lead")
    Tag.create(name: "full_home", tag_type: "lead")
    Tag.create(name: "both", tag_type: "old_leads")
  end

  def add_tag_to_old_leads
    tag = Tag.find_by_name("both").id
    NoteRecord.all.each do |nr|
      nr.ownerable.update(tag_id: tag) if nr.ownerable.present?
    end
  end


  def user_pincode_mapping
    files = ["Aurangabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Kochi", "Kolhapur", "Mumbai", "Nagpur", "Nashik", "Pune"]
    user_not_found = []
    files.each do |file|
      filepath = "#{Rails.root.join('app', 'data', 'user_pincode_mapping')}"
      filepath = filepath+"/#{file}.xlsx"
      workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
          city = City.where(name: workbook.row(row)[headers['district']].gsub(" ", "").underscore).first_or_create
          code = city.zipcodes.where(code: workbook.row(row)[headers['pincode']]).first_or_create
          users_emails = []
          users_emails.push workbook.row(row)[headers['full home community manager']]
          users_emails.push workbook.row(row)[headers['mkw community manager']]
          users_emails.push workbook.row(row)[headers['both community manager']]
          users_emails.push workbook.row(row)[headers['full home designer']]
          users_emails.push workbook.row(row)[headers['mkw designer']]
          users = User.where(email: users_emails)
          users.each do |user|
            user.user_zipcode_mappings.where(zipcode_id: code.id).first_or_create
          end if code.present?
          user_not_found.push (users_emails.uniq - users.pluck(:email))
      end
    end
    puts "=============="
    puts user_not_found.uniq
    puts "=============="
  end

  # Get all the space tags associated with all the products in a category and tag them
  # against the category
  def tag_categories_with_spaces
    Section.loose_furniture.children.each do |category|
      category.tag_with_spaces
    end
  end

  def populate_referral_campaign
    LeadCampaign.where(name: "Referral Partner Campaign").first_or_create!
  end

  # one time script
  # set the :wardrobe_price column of each finish to be the same :price
  def populate_finish_wardrobe_price
    ShutterFinish.all.each do |shutter_finish|
      shutter_finish.update! wardrobe_price: shutter_finish.price
    end
  end

  def populate_material_wardrobe_price
    CoreMaterialPrice.all.each do |core_material_price|
      CoreMaterialPrice.create!(
        thickness: core_material_price.thickness,
        price: core_material_price.price,
        core_material_id: core_material_price.core_material_id,
        category: 'wardrobe'
        )
    end
  end
  def assign_cm_id
      file = "CM Mapping"
      filepath = "#{Rails.root.join('app', 'data', 'user_pincode_mapping')}"
      filepath = filepath+"/#{file}.xlsx"
      workbook = Roo::Spreadsheet.open filepath
      missing_user = []
      missing_lead = []
      ((workbook.first_row)..workbook.last_row).each do |row|
          lead = Lead.where(id: workbook.row(row)[0]).first
          cm = User.where(email: workbook.row(row)[1]).first
          if lead.present?
            if cm.present? && cm.has_role?(:community_manager)
              lead.update!(assigned_cm_id: cm.id)
            else
              missing_user.push workbook.row(row)[1]
            end
          else
            missing_lead.push workbook.row(row)[0]
          end
      end
      puts "=================="
      puts "USERS: #{missing_user}"
      puts "LEADS: #{missing_lead}"
      puts "=================="
  end

  # Get all the space tags associated with all the products in a category and tag them
  # against the category
  def tag_categories_with_spaces
    Section.loose_furniture.children.each do |category|
      category.tag_with_spaces
    end
  end

  def populate_referral_campaign
    LeadCampaign.where(name: "Referral Partner Campaign").first_or_create!
  end

  # one time script
  # set the :wardrobe_price column of each finish to be the same :price
  def populate_finish_wardrobe_price
   ShutterFinish.all.each do |shutter_finish|
     shutter_finish.update! wardrobe_price: shutter_finish.price
   end
  end

  def populate_material_wardrobe_price
    CoreMaterialPrice.all.each do |core_material_price|
      CoreMaterialPrice.create!(
        thickness: core_material_price.thickness,
        price: core_material_price.price,
        core_material_id: core_material_price.core_material_id,
        category: 'wardrobe'
      )
    end
  end

  def create_order_manager
    Role.where(name: "order_manager").first_or_create
    JobElementVendor.all.update(tax_type: "cgst_sgst", quantity: 1)
  end

  def custom_element
    CustomElement.all.each do |ce|
        ce.update(photo_file_name: "data") if ce.photo_content_type.present?
    end
  end

  def make_old_substatus_as_nil
    projects = Project.where.not(sub_status: Project::ALLOWED_SUB_STATUSES)
    projects.update_all(sub_status: nil) if projects.present?
  end

  def all_office_leads_to_cm
    cm = User.find_by_email("avish@arrivae.com")
    leads = Lead.joins(:note_records).where(note_records: {accomodation_type: "Office Space"})
    leads.update_all(assigned_cm_id: cm.id) if cm.present? && leads.present?
  end

  def populate_mkw_frameloft_category
    KitchenCategory.where(name: 'Frame Loft').first_or_create
  end

  def add_tasks_to_task_set
    filepath = "#{Rails.root.join('app', 'data', "TaskList.xlsx")}"

    workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        @task = TaskSet.find_or_create_by(task_name: workbook.row(row)[headers['task name']], stage: workbook.row(row)[headers['stage']])

        @task.duration_in_hr = workbook.row(row)[headers['duration']]
        @notify_to = []
        @notify_to = workbook.row(row)[headers['notify to']].split(",") if workbook.row(row)[headers['notify to']].present?
        @notify_to.each do |notify_to|
          @task.notify_to << notify_to
          @task.notify_to = @task.notify_to.uniq
        end if @notify_to.present?
        @task.notify_by_email = workbook.row(row)[headers['notify by email']]
        @task.notify_by_sms = workbook.row(row)[headers['notify by sms']]
        @task.optional = workbook.row(row)[headers['is optional']]
        @task.task_owner = workbook.row(row)[headers['owner']]
        @task.save!
      end

  end

  def add_status_to_custom_element
    CustomElement.all.each do |custom_element|
      custom_element.update(status: "approved") if custom_element.price.present?
    end
  end

  def set_false_for_older_tasks
    @task_escalations = TaskEscalation.all
    @task_escalations.each do |task_escalation|
      task_escalation.update(is_new: false)
    end
  end

  def projects_escalated_after_wip
    @projects = Project.where(status: ["follow_up", "not_contactable"]).where.not(wip_time: nil)
    count = 0
    project_info = []
    @projects.each do |project|
      project.update(status: "wip", wip_time: DateTime.now)
      count += 1
      project_info.push({id: project.id,name: project.name})
    end
  end

  def lead_not_contactable_event
    @leads = Lead.where(lead_status: "not_contactable")
    @leads.each do |lead|
      lead_events = lead.events.where(status: ["rescheduled", "scheduled"], agenda: "not_contactable")
      if !lead_events.present?
        @event = Event.new(agenda: "not_contactable", scheduled_at: lead.updated_at + 24.hours, ownerable: lead)
        @event.save
        lead_head = (User.with_role :lead_head).first
        @event.add_participants([lead_head.email], lead_head.id)
      end
    end
  end

  def lead_follow_up_event
    @leads = Lead.where(lead_status: "follow_up")
    count = 0
    @leads.each do |lead|
      lead_events = lead.events.where(status: ["rescheduled", "scheduled"], agenda: "follow_up")
      if !lead_events.present?
        @event = Event.new(agenda: "follow_up", scheduled_at: lead.follow_up_time, ownerable: lead)
        @event.save
        lead_head = (User.with_role :lead_head).first
        @event.add_participants([lead_head.email], lead_head.id)
        count += 1
      end
    end
  end

  def add_status_to_custom_element
    CustomElement.all.each do |custom_element|
      custom_element.update(status: "approved") if custom_element.price.present?
    end
  end

  #run only once
  def update_payments
    Payment.all.each do |payment|
      payment.update(ownerable_id: payment.quotation_id, ownerable_type: "Quotation")
    end
  end

  def add_lead_source
    ["add_call_attempt", "missed_call", "shriram_developers"].each do |source|
      LeadSource.create!(name: source)
    end
  end

  def update_50_percent_boq_tasks
    task_set = TaskSet.fifty_per_tasks.first
    Project.where(sub_status: "40%_payment_recieved").each do |project|
      quotation_ids = Project.joins(proposals: :proposal_docs).where(proposal_docs: {ownerable_type: "Quotation"}, proposals: {project_id: project.id, proposal_type: "final_design"} ).pluck(:ownerable_id).uniq
      quotations = Quotation.where(id: quotation_ids)
      quotations.each do |quotation|
        quotation.task_escalations.where(status: "no").each do |object|
          object.update(status: "yes", completed_at: DateTime.now)
        end
        taskescalation = TaskEscalation.find_or_create_by(task_set: task_set, ownerable: quotation)
        taskescalation.start_time = DateTime.now
        taskescalation.end_time = taskescalation.start_time + task_set.duration_in_hr.to_f.hours
        taskescalation.save!
      end
    end
  end

  def office_space
    Tag.loose_spaces.where(name: "offices").first_or_create
  end

  def new_tag
    Tag.create!(name: "office", tag_type: "lead")
  end

  def make_project_status_wip_for_wip_time_present
    @projects = Project.where.not(status: Project::AFTER_WIP_STATUSES, wip_time: nil)
    project_info = []

    @projects.each do |project|
      project.update(status: "wip") if project.status != "lost"
      project_info.push({id: project.id}) if project.status != "lost"
    end
  end

  # populate all project names to remove random names
  def populate_project_names
    project_name_changed_ids = []
    no_lead = []
    Project.all.each do |project|
      lead = project.lead
      if lead.blank?
        no_lead << project.id
        next
      end

      old_name = project.name
      if lead.note_records.present? && lead.note_records.last&.project_name.present?
        project.name = lead.note_records.last.project_name
      else
        proj_name = lead.name || "No Project Name"
        project.name = proj_name
      end

      if project.name_changed? && project.save
        project_name_changed_ids.push(
            {
              lead_id: lead.id,
              project_id: project.id,
              old_name: old_name,
              new_name: project.name
            }
          )
      end
    end

    pp project_name_changed_ids
    pp no_lead
    project_name_changed_ids
  end

  def populate_pi_base_amounts
    PerformaInvoice.all.each do |pi|
      pi.update!(base_amount: pi.amount)
    end
  end

  def change_proposal_doc_seen
    ProposalDoc.where(ownerable_type: "Quotation").each do |pd|
      if pd.ownerable.seen_by_category == true
        pd.update(seen_by_category: true)
      end
    end
  end

  def get_proposal_shared_date
    proposals = Proposal.where(proposal_status: "proposal_shared")
    proposals.each do |proposal|
      proposal.update(sent_at: proposal.updated_at)
    end
  end

  def re_calculate_final_quotations
    quotations = Quotation.where.not(parent_quotation_id: nil, discount_value: nil)
    quotations.each do |quotation|
      quotation.recalculate
    end
  end

  def client_approval_time
    @quotations = Quotation.where.not(is_approved: nil).where(client_approval_at: nil)
    @quotations.each do |quotation|
      versions = quotation.versions
      versions.each do |version|
        ob_changes = YAML::load version.object_changes
        if ob_changes["is_approved"].present?
          quotation.update(client_approval_at: ob_changes["updated_at"][1])
        end
      end
    end
  end

  # Since JobElement has a new column quantity, populate it from the recommended JobElementVendor.
  def populate_job_element_quantity
    JobElement.joins(:job_element_vendors).each do |job_element|
      job_element_vendor = job_element.job_element_vendors.find_by(recommended: true)
      job_element_vendor = job_element.job_element_vendors.last if job_element_vendor.blank?
      next if job_element_vendor.blank?
      job_element.update!(
        quantity: job_element_vendor.quantity,
        rate: job_element_vendor.cost,
        unit: job_element_vendor.unit_of_measurement
        )
    end

    # if any JobElement still has nil quantity, set it to 0.0
    JobElement.where(quantity: nil).update(quantity: 0)

    return {
      quantity_array: JobElement.pluck(:quantity).uniq,
      rate_array: JobElement.pluck(:rate).uniq,
      unit_array: JobElement.pluck(:unit).uniq
    }
  end

  def call_responce_getter
    call_histories = InhouseCall.where(contact_type: "call")
    call_histories.each do |call_hystory|
      if  call_hystory.created_at - call_hystory.updated_at > 1
        puts "=============="
        puts "Duration #{call_hystory.created_at - call_hystory.updated_at }"
        puts "id: #{call_hystory.id}"
        puts "=============="
      end
    end
  end

  def update_payment_approved_at
    quotations =  Quotation.joins(:payments).distinct
    quotations.each do |quotation|
      payments = quotation.payments
      payments.each do |payment|
        finance_varification_timestamp = nil
        payment.versions.each do |version|
          ob_change = YAML::load version.object_changes
          if ob_change["is_approved"].present? && ob_change["is_approved"][1]
            finance_varification_timestamp = ob_change["updated_at"][1]
          end
        end

        if finance_varification_timestamp.present? && payment.finance_approved_at.blank? && payment.is_approved
          payment.update(finance_approved_at: finance_varification_timestamp)
        elsif payment.finance_approved_at.blank? && payment.is_approved
          payment.update(finance_approved_at: payment.updated_at)
        end

      end
    end
  end

  def user_invitation
    filepath = "#{Rails.root.join('app', 'data', 'NewInvite14110291.xlsx')}"
    #filepath = "#{Rails.root.join('app', 'data', 'example9.xlsx')}"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    # role = Role.find_by_name("employee_referral")
    password = "arrivae123"

    created_user_ids = []
    not_created_user_emails = []
    errors = []
    user_name = []
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      role = "associate_partner"
      user = User.new
      user.name = workbook.row(row)[headers['crm name']]
      user.email = workbook.row(row)[headers['username']]
      user.contact = workbook.row(row)[headers['contact number']]
      user.password = password
      begin
        user.save!
        user.add_role(role)
        user.skip_confirmation_notification!
        user.confirm
        created_user_ids << user.id
         #UserNotifierMailer.invite_new_users(user).deliver_later!
         UserInviteMailer.invite_user(user).deliver_now!
        #SmsModule.delay.send_sms("Greetings from Arrivae! We hope that you managed to download/activate our app and will be sharing leads with us. Contact us on 080-39345808 in case of any concerns.\nYou can also download our app here\nAndroid: https://goo.gl/WPGygJ\niOS: https://goo.gl/XpyFRR\nUsername: #{user.email}\nPassword: arrivae123", user.contact) if user.contact.present?
      rescue StandardError => e
        not_created_user_emails << workbook.row(row)[headers['username']]
        errors << e
      end

    end
    puts "=====errorrrrrrrrrrrrrrrrrrrrrrrrrssss========"
    pp errors
    puts "=====User IDS===="
    pp created_user_ids
    puts "=====Not Created User Emails====="
    pp not_created_user_emails
  end


  def trigger_sms_and_email_to_new_users(user_ids)
    users = User.where(id: user_ids)
    users.each do |user|
      UserNotifierMailer.invite_new_users(user).deliver_later!
      SmsModule.delay.send_sms("Greetings from Arrivae! We hope that you managed to download/activate our app and will be sharing leads with us. Contact us on 080-39345808 in case of any concerns.\nYou can also download our app here\nAndroid: https://goo.gl/WPGygJ\niOS: https://goo.gl/XpyFRR", user.contact) if user.contact.present?
    end
  end

  def generate_otp_key_to_customers
    User.with_role(:customer).map { |user| user.update(otp_secret_key: ROTP::Base32.random_base32) }
  end

  def populate_units_sold_count
    quotations_to_consider = Quotation.joins(:proposals).where(status: 'shared', parent_quotation_id: nil).where(proposals: { id: Proposal.proposal_shared }).distinct
    quotations_to_consider_ids = quotations_to_consider.pluck(:id)

    ActiveRecord::Base.transaction do
      Product.all.each do |product|
        units_sold = product.boqjobs.find_all{|boqjob|
          quotation = boqjob.ownerable
          quotations_to_consider_ids.include?(quotation.id)
        }.map{|boqjob| boqjob.quantity.to_i}.sum

        product.update!(units_sold: units_sold)
      end
    end
  end

  def possession_date_script
    count = 0
    month_array = %w(jan feb mar apr may jun jul aug sep oct nov dec)
    NoteRecord.all.each do |note_record|
      begin
        str = note_record.possession_status_date.to_s
        new_str = str
        arr = str.split("-")
        # only if the string is in expected format.
        if str.present? && str.include?("-") && arr.last.to_i < 100 && month_array.include?(arr.first.downcase)
          new_str = arr[0] + "-" + (arr.last.to_i + 2000).to_s
          if new_str != str
            note_record.update!(possession_status_date: new_str)
            count += 1
          end
        else
          next
        end
      rescue
        next
      end
    end
    return count
  end

  def possession_data_dump
    folderpath ||= Rails.root.join("app", "data")
    csvpath = folderpath + "possession_data_dump.csv"
    headers = ["Lead ID", "NoteRecord ID", "Name", "Email", "Contact", "Possession Date"]

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      Lead.order(id: :asc).find_each do |lead|
        note_record = lead.note_records.first
        csv << [lead.id, note_record&.id, lead.name, lead.email, lead.contact, note_record&.possession_status_date]
      end
    end
  end

  def vendor_gst_info_migration
    Vendor.all.each do |v|
      v.gst_numbers.create(gst_reg_no: v.gst_reg_no) if v.gst_reg_no.present?
      v.contents.create(document: v.gst_copy, scope: "vendor_gst") if v.gst_copy.present?
    end
  end

  def correct_the_payment_stage
    payments = Payment.where(payment_stage: "pre_10_precent")
    payments.map{|payment| payment.update(payment_stage: "pre_10_percent")}
  end

  def referral_partner_mapping
    filepath = "#{Rails.root.join('app', 'data', 'Referral Partner Mapping.xlsx')}"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    no_users = []
    no_leads = []
    count = 0

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      lead_id = workbook.row(row)[headers['lead id']]
      email = workbook.row(row)[headers['dealer email id']]
      lead = Lead.find_by_id lead_id
      if lead.blank?
        no_leads << lead_id
        next
      end
      referral_user = User.find_by(email: email.to_s.strip)
      if referral_user.blank?
        no_users << email
        next
      end
      referrer_type = referral_user.roles.first.name
      referrer_id = referral_user.id
      lead.update!(referrer_id: referrer_id, referrer_type: referrer_type)
      count += 1
    end

    puts "No leads with IDs:"
    pp no_leads
    puts "No users with emails:"
    pp no_users
    count
  end

  # Remove Arrivae Champion Role
  def remove_arrivae_champion_role
    rl = Role.find_by_name("arrivae_champion")
    rl.destroy!
  end

  #This method is to add the roles to users in bulk.
  def change_the_role_arrivae_champions
    filepath = "#{Rails.root.join('app', 'data', "UsersListToChangeRole.xlsx")}"

    workbook = Roo::Spreadsheet.open filepath
    arr = []
      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        @user = User.find_by_email(workbook.row(row)[headers['email']])
        if @user.present?
          if @user.roles.pluck(:name).include?("arrivae_champion") #this line can be removed once arrivae champion role got removed from the system.
            @user.remove_role(:arrivae_champion)
          end
          @user.add_role(workbook.row(row)[headers['role']])
        else
          arr << workbook.row(row)[headers['email']]
        end
      end
    puts "Wrong Emails"
    pp arr
  end

  # This method is to make users as Arrivae Champions
  def make_users_as_champion
    filepath = "#{Rails.root.join('app', 'data', "UsersListToChangeRole.xlsx")}"

    workbook = Roo::Spreadsheet.open filepath
    arr = []
      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        @user = User.find_by_email(workbook.row(row)[headers['email']])
        if @user.present?
          @user.update(is_champion: true)
        else
          arr << workbook.row(row)[headers['email']]
        end
      end
    puts "Wrong Emails"
    pp arr
  end

  def populate_arrivae_champion_program_campaign
    LeadCampaign.where(name: "Arrivae Champion Program").first_or_create!
  end

  def make_all_users_lavel_one_user
    @users = User.where(user_level: [2,3])
    @users.map{|u| u.update(parent_id: nil, user_level: 1)}
  end

  def create_project_to_leads
    leads = Lead.where(lead_status: 'qualified').left_outer_joins(:project).where(projects: {id: nil})

    lead_ids = []

    leads.each do |lead|
      begin
        lead.approve
      rescue StandardError => e
        lead_ids << lead.id
      end

    end
    puts "--------"
    puts lead_ids
  end

  def add_split_tags
    tag_names = ["modular_kitchen", "civil_kitchen", "modular_wardrobe", "non_panel_furniture", "panel_furniture", "services",]

    tag_names.each do |tag_name|
      Tag.create!(name: tag_name,tag_type: "line_item_split")
    end
  end

  # Remove Arrivae Champion Role
  def remove_arrivae_champion_role
    rl = Role.find_by_name("arrivae_champion")
    rl.destroy!
  end

  #This method is to add the roles to users in bulk.
  def change_the_role_arrivae_champions
    filepath = "#{Rails.root.join('app', 'data', "Champion data.xlsx")}"

    workbook = Roo::Spreadsheet.open filepath
    arr = []
      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        @user = User.find_by_email(workbook.row(row)[headers['email']])
        if @user.present?
          if @user.roles.pluck(:name).include?("arrivae_champion") #this line can be removed once arrivae champion role got removed from the system.
            @user.remove_role(:arrivae_champion)
          end
          @user.add_role(workbook.row(row)[headers['new role']].downcase)
          @user.update(is_champion: true)
        else
          arr << workbook.row(row)[headers['email']]
        end
      end
    puts "Wrong Emails"
    pp arr
  end

  # This method is to make users as Arrivae Champions
  def make_users_as_champion
    filepath = "#{Rails.root.join('app', 'data', "UsersListToChangeRole.xlsx")}"

    workbook = Roo::Spreadsheet.open filepath
    arr = []
      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        @user = User.find_by_email(workbook.row(row)[headers['email']])
        if @user.present?
          @user.update(is_champion: true)
        else
          arr << workbook.row(row)[headers['email']]
        end
      end
    puts "Wrong Emails"
    pp arr
  end

  def populate_arrivae_champion_program_campaign
    LeadCampaign.where(name: "Arrivae Champion Program").first_or_create!
  end

  def make_all_users_lavel_one_user
    @users = User.where(user_level: [2,3])
    @users.map{|u| u.update(parent_id: nil, user_level: 1)}
  end

  def convert_any_json_to_excel(jason_data, mails)
    package = Axlsx::Package.new
    boq_spread_sheet = package.workbook
    sheet = boq_spread_sheet.add_worksheet(:name => "Xl Report")

    header_names = jason_data[0].keys
    sheet.add_row header_names
    jason_data.each do |row|
      sheet.add_row row.values
    end

    file_name = "json_converted_file.xlsx"
    filepath = Rails.root.join("tmp", file_name)
    package.serialize(filepath)
    ReportMailer.converted_excel_files(filepath, file_name, mails).deliver!
    File.delete(filepath) if File.exist?(filepath)
  end

  def remove_duplicate_email
    filepath = Rails.root.join('app', 'data', 'Leads with duplicate email.xlsx')
    xlsx = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    xlsx.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    arr = []

    ((xlsx.first_row + 1)..xlsx.last_row).each do |row|
      comment = xlsx.row(row)[headers['action to be taken']]
      hash = {'id' =>  xlsx.row(row)[headers['id']], 'name' => xlsx.row(row)[headers['name']], 'email' => xlsx.row(row)[headers['email']], 'action to be taken' => comment}


      if comment == 'Dummy ID'
        lead_id = xlsx.row(row)[headers['id']]
        lead = Lead.find_by(id: lead_id)
        #lead.update(email: Lead.generate_dummy_email) if lead.present?
        user = lead.related_user
        leads = user.related_leads.where.not(id: lead.id) if user.present?
        if leads.present? || user.blank?
          lead.populate_dummy_email({save_now: true})
        else
          lead.update email: user.email if user.present?
        end
        #user.update(email: lead.email) if user.present?
        hash['new email'] = Lead.find_by(id: lead_id).email
      else
        hash['new email'] = ""
      end

      arr << hash
    end

    convert_any_json_to_excel(arr.as_json, "arunoday@gloify.com")

  end

  def generate_dummy_emails
    lead_ids = [20231, 21642, 21654, 21911, 40522, 48990, 55630, 63233, 67419, 67498, 68401, 73603]
    lead_ids.each do |lead_id|
      lead = Lead.find lead_id
      lead.populate_dummy_email({save_now: true})
    end
  end


  def generate_excel_for_all_app_dplicate_leads
    filepath = Rails.root.join('app', 'data', 'Leads with duplicate email.xlsx')
    xlsx = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    xlsx.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    arr = []

    ((xlsx.first_row + 1)..xlsx.last_row).each do |row|
      email = xlsx.row(row)[headers['email']]
      comment = xlsx.row(row)[headers['action to be taken']]
      hash = {'id' =>  xlsx.row(row)[headers['id']], 'name' => xlsx.row(row)[headers['name']], 'email' => xlsx.row(row)[headers['email']], 'action to be taken' => xlsx.row(row)[headers['action to be taken']]}

      if comment == 'Dummy ID'
        lead = Lead.find xlsx.row(row)[headers['id']]
        hash['new email'] = lead.email
      else
        hash['new email'] = ""
      end
      arr << hash
    end
    convert_any_json_to_excel(arr.as_json, "arunoday@gloify.com")
  end

  def remove_skus
    arr = ["ARR-SHSN-01", "ARR-SHSN-02", "ARR-SHSN-03", "ARR-SHSN-04", "ARR-SHSN-05", "ARR-SHSN-06", "ARR-SHSN-07", "ARR-SHSN-08", "ARR-SHSN-09", "ARR-SHSN-10", "ARR-SHSN-11", "ARR-SHSN-12", "ARR-SHSN-13", "ARR-SHSN-14", "ARR-SHSN-15", "ARR-SHSN-16", "ARR-SHSN-17", "ARR-SHSN-18", "ARR-SHSN-19", "ARR-SHSN-20", "ARR-SHSN-21", "ARR-SHSN-22", "ARR-SHSN-23", "ARR-SHSN-24", "ARR-SHSN-25", "ARR-SHSN-26", "ARR-SHSN-27", "ARR-SHSN-28", "ARR-SHSN-29", "ARR-SHSN-30", "ARR-SHSN-31", "ARR-SHSN-32", "ARR-SHSN-33", "ARR-SHSN-34", "ARR-SHSN-35", "ARR-SHSN-36", "ARR-SHSN-37", "ARR-SHSN-38", "ARR-SHSN-39", "ARR-SHSN-40", "ARR-SHSN-41", "ARR-SHSN-42", "ARR-SHSN-43", "ARR-SHSN-44", "ARR-SHSN-45", "ARR-SHSN-46", "ARR-SHSN-47", "ARR-SHSN-48", "ARR-SHSN-49", "ARR-SHSN-50", "ARR-SHSN-51", "ARR-SHSN-52", "ARR-SHSN-53", "ARR-SHSN-54", "ARR-SHSN-55", "ARR-SHSN-56", "ARR-SHSN-57", "ARR-SHSN-58", "ARR-SHSN-59", "ARR-SHSN-60", "ARR-SHSN-61", "ARR-SHSN-62", "ARR-SHSN-63", "ARR-SHSN-64", "ARR-SHSN-65", "ARR-SHSN-66", "ARR-SHSN-67", "ARR-SHSN-68"]
    no_product = []
    arr.each do |sku|
      @product = Product.find_by_unique_sku sku

      if @product.present?
        @product.update(hidden: true)
      else
        no_product << sku
      end
    end
    puts "=====================no products====================="
    puts no_product
  end

  def create_project_for_leads
    @leads = Lead.where(lead_status: "qualified").joins(:lead_type).left_outer_joins(:project).
    where(projects: {id: nil}, lead_types: {name: 'customer'}).distinct
    arr = []
    err = []
    @leads.each do |lead|
      # don't do anything if lead has user and that user's role is not customer
      next if lead.related_user.present? && !lead.related_user.has_role?(:customer)
      begin
        lead.approve
      rescue StandardError => e
        arr << {id: lead.id, error: e.to_s}
      end
    end
    puts arr
  end

  def remove_from_delta

    filepath = Rails.root.join('app', 'data', 'Furnspace Items.xlsx')
    xlsx = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    xlsx.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    #puts xlsx.row(1)
    puts headers
    i = 0

    ((xlsx.first_row + 1)..xlsx.last_row).each_with_index do |row|
      unique_sku = xlsx.row(row)[headers['furnspace items']]
      status = xlsx.row(row)[headers['delete from delta']]
      if status == 'Yes'
        product = Product.find_by(unique_sku: unique_sku)
        product.update! hidden: true
        i += 1
      end
    end

    i
  end

  def set_deactive_leads
    filepath = Rails.root.join('app', 'data', 'RK leads - deactivate.xlsx')
    xlsx = Roo::Spreadsheet.open filepath.to_s


    headers = Hash.new
    xlsx.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((xlsx.first_row + 1)..xlsx.last_row).each do |row|
      lead_id = xlsx.row(row)[headers['id']]
      lead = Lead.find_by(id: lead_id)
      if lead.project.present?
        if ["inactive","wip","on_hold"].include?(lead.project.status)
          if ["wip","on_hold"].include?(lead.project.status)
           lead.project.update  status: "inactive"
          end
        else
          lead.project.update  status: "lost"
          lead.update  lead_status: "lost"
        end
      else
        lead.update lead_status: "lost"
      end
    end
  end

  def lead_created_by
   filepath = Rails.root.join('app', 'data', 'json_converted_file.xlsx')
   xlsx = Roo::Spreadsheet.open filepath.to_s

   headers = Hash.new
    xlsx.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    arr = []
    ((xlsx.first_row + 1)..xlsx.last_row).each do |row|
      id = xlsx.row(row)[headers['id']]
      email = xlsx.row(row)[headers['email']]
      source = xlsx.row(row)[headers['source']]
      hash = {'id' => id, 'email' => email, 'source' => source}

      lead = Lead.find_by_id(id)
      owner = User.find_by_id(lead.created_by) if lead.present?
       hash['owner'] =  owner.present? ? owner.name : ""
       arr << hash
    end
    convert_any_json_to_excel(arr.as_json, "arunoday@gloify.com")
  end


  def make_optional_tasks
    pro_tasks = TaskEscalation.joins(:task_set).where(task_sets: {task_name: ["Request site measurement", "Assign SS for site measurement", "upload measurements"]}, status: "no")
    pro_tasks.each do |task|
      task.update(status: "yes")
    end

    quo_tasks = TaskEscalation.joins(:task_set).where(task_sets: {task_name: ["Approve Final BOQ by CM", "Approve Final BOQ by Category", "Upload CAD files"]}, status: "no")

    quo_tasks.each do |task|
      task.update(status: "yes")
      q = task.ownerable
      share_proposal_task = q.task_escalations.where(task_set_id: TaskSet.find_by(task_name: "Proposal Sharing", stage: "10% - 40%").id, status: ["yes","no"])
      TaskEscalation.invoke_task(["Proposal Sharing"], "10% - 40%", q)if !share_proposal_task.present?
    end
  end

  # convert CmMkwVariablePricing to convert services factor into services_base and services_installation.
  def variable_pricing_update
    CmMkwVariablePricing.all.each do |vp|
      vp_update_single(vp)
    end
  end

  def vp_update_single(vp)
    if vp.full_home_factors.present?
      full_home_factors = vp.full_home_factors
      hsh = full_home_factors["sale_cost_factor"]
      hsh["services_base"] = 1.18
      hsh["services_installation"] = hsh["services"] if hsh["services"].present?
      hsh.delete("services")
      full_home_factors["sale_cost_factor"] = hsh
      vp.update(full_home_factors: full_home_factors)
    end

    if vp.mkw_factors.present?
      mkw_factors = vp.mkw_factors
      hsh = mkw_factors["sale_cost_factor"]
      hsh["services_base"] = 1.18
      hsh["services_installation"] = hsh["services"] if hsh["services"].present?
      hsh.delete("services")
      mkw_factors["sale_cost_factor"] = hsh
      vp.update(mkw_factors: mkw_factors)
    end
  end

  def delete_modules
    codes = ['AR-WPC65-60', 'AR-WPC65-76', 'AR-WPC65-90', 'AR-Microwave oven unit01, 1 D, LO', 'AR-Microwave oven unit02, 1 D, LO', 'AR-Microwave oven unit01, 1 D, RO', 'AR-Microwave oven unit02, 1 D, RO']
    not_found = []
    error = []
    codes.each do |code|
      begin
        product_module = ProductModule.find_by code: code
        if product_module.blank?
          not_found << code
          next
        end
        product_module.update!(hidden: true)
      rescue
        error << code
        next
      end
    end

    puts "No modules with following codes:"
    pp not_found
    puts "Error occurred for the following codes:"
    pp not_found
  end

  def populate_vendor_id
    WipSli.all.each do |sli|
      if sli.vendor_product_id.present?
        sli.vendor_id = sli.vendor_product.vendor.id
        sli.save
      end
    end
    WipSli.where(vendor_id: nil).destroy_all
  end

  def fasttrack_qualification_data
    filepath = "#{Rails.root.join('app', 'data', 'fasttrack_leads.csv')}"

    CSV.open(filepath, "wb") do |csv|
      csv << ["Lead ID", "Email", "Contact", "Source", "Lead source", "Lead type", "Lead campaign", "Acquisition Time", "Qualification Time", "Qualified by"]
    end

    Lead.approved_users.where("created_at > ?", Date.parse('2019-1-1').beginning_of_day).order(id: :asc).each do |lead|
      # First get the version where the change occured
      version = lead.versions.where_object(lead_status: 'qualified').first
      qualifier = nil
      qualification_time = nil
      if version.present?
        qualifier = User.find_by_id(version.whodunnit)
        qualification_time = version.created_at.strftime("%b %e, %l:%M %p")
      end
      acquisition_time = lead.created_at.strftime("%b %e, %l:%M %p")
      CSV.open(filepath, "a+") do |csv|
        csv << [lead.id, lead.email, lead.contact, lead.source, lead.lead_source&.name, lead.lead_type&.name, lead.lead_campaign&.name, acquisition_time, qualification_time, qualifier&.email]
      end
    end
  end

  def delete_modules
    codes = ['AR-WPC65-60', 'AR-WPC65-76', 'AR-WPC65-90', 'AR-Microwave oven unit01, 1 D, LO', 'AR-Microwave oven unit02, 1 D, LO', 'AR-Microwave oven unit01, 1 D, RO', 'AR-Microwave oven unit02, 1 D, RO']
    not_found = []
    error = []
    codes.each do |code|
      begin
        product_module = ProductModule.find_by code: code
        if product_module.blank?
          not_found << code
          next
        end
        product_module.update!(hidden: true)
      rescue
        error << code
        next
      end
    end

    puts "No modules with following codes:"
    pp not_found
    puts "Error occurred for the following codes:"
    pp not_found
  end

  def hardcoded_arrivae_select
    core_material1 = CoreMaterial.where(name: 'Prelam MDF').first_or_initialize
    core_material1.assign_attributes(lead_time: 45, arrivae_select: true)
    core_material1.save!
    core_material1.core_material_prices.create!(category: 'kitchen', thickness: 6.0, price: 112.24)
    core_material1.core_material_prices.create!(category: 'kitchen', thickness: 12.0, price: 137.901)
    core_material1.core_material_prices.create!(category: 'kitchen', thickness: 18.0, price: 160.35)
    core_material1.core_material_prices.create!(category: 'wardrobe', thickness: 6.0, price: 112.24)
    core_material1.core_material_prices.create!(category: 'wardrobe', thickness: 12.0, price: 137.901)
    core_material1.core_material_prices.create!(category: 'wardrobe', thickness: 18.0, price: 160.35)

    shutter_finish1 = ShutterFinish.create!(name: 'Prelam MDF', price: 4.0, lead_time: 45, arrivae_select: true)
    shutter_finish2 = ShutterFinish.create!(name: 'Gloss Meister', price: 104.0, lead_time: 45, arrivae_select: true)

    core_material1.shutter_finishes << shutter_finish1 unless core_material1.shutter_finishes.include?(shutter_finish1)
    core_material1.shutter_finishes << shutter_finish2 unless core_material1.shutter_finishes.include?(shutter_finish2)
    ShutterFinish.where(wardrobe_price: nil).map{|f| f.update!(wardrobe_price: f.price)}
  end

  def carcass_element_types_csv(category)
    filepath = "#{Rails.root.join('app', 'data', "#{category}_carcass_element_types.csv")}"

    CSV.open(filepath, "wb") do |csv|
      csv << ["Name", "Aluminium", "Glass"]
    end

    CSV.open(filepath, "a+") do |csv|
      CarcassElementType.where(category: category).each do |carcass_element_type|
        csv << [carcass_element_type.name, carcass_element_type.aluminium.to_s, carcass_element_type.glass.to_s]
      end
    end
  end
  
  # where lead time is null or 0, set it to default ie 45
  def populate_lead_time(default_lead_time=45)
    ProductModule.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    Addon.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    ShutterFinish.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    Shade.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    Handle.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    CoreMaterial.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    KitchenAppliance.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
    Product.where(lead_time: [nil, 0]).update(lead_time: default_lead_time)
  end

  def populate_modular_jobs_lead_time
    ModularJob.find_each do |modular_job|
      time_line_hash = modular_job.time_line
      modular_job.update_columns(
        lead_time: time_line_hash[:lead_time],
        lead_time_type: time_line_hash[:type],
        lead_time_code: time_line_hash[:code]
        )
    end
  end

  def gm_cm_mapping
    info_array = [
      {
        gm_email: "raghav@arrivae.com",
        cm_emails: ["sheelu@arrivae.com", "madhuri@arrivae.com", "nikunj@arrivae.com", "saurabh@arrivae.com", "vidhi@arrivae.com"]
      },
      {
        gm_email: "vishad@arrivae.com",
        cm_emails: ["manishthakkar@arrivae.com", "sudhir@arrivae.com", "sanjiv@arrivae.com", "pradnya@arrivae.com"]
      },
      {
        gm_email: "anand@arrivae.com",
        cm_emails: ["dimple@arrivae.com", "pallavini@arrivae.com", "rajkiran@arrivae.com", "sangeeth@arrivae.com"]
      },
      {
        gm_email: "pallavi@arrivae.com",
        cm_emails: ["anuradha@arrivae.com", "mamta@arrivae.com", "sarikakapoor@arrivae.com", "kapil@arrivae.com"]
      }
    ]

    no_gm = []
    no_cm = []
    info_array.each do |hsh|
      gm = User.find_by_email hsh[:gm_email]
      unless gm.present?
        no_gm << hsh[:gm_email]
        next
      end
      hsh[:cm_emails].each do |email|
        begin 
          cm = User.find_by_email email
          unless cm.present?
            no_cm << email
            next
          end
          gm.cms << cm
        rescue StandardError => e
          puts e
        end
      end
      puts "GM: #{gm.email}"
      pp "CMs mapped: #{gm.cms.pluck(:email)}"
    end
    puts "No such GM:"
    pp no_gm
    puts "No such CM:"
    pp no_cm
  end

  def populate_modular_jobs_lead_time
    ModularJob.find_each do |modular_job|
      time_line_hash = modular_job.time_line
      modular_job.update_columns(
        lead_time: time_line_hash[:lead_time],
        lead_time_type: time_line_hash[:type],
        lead_time_code: time_line_hash[:code]
        )
    end
  end

  def populate_boq_labels
    ['Boqjob', 'ModularJob', 'ExtraJob', 'ApplianceJob', 'CustomJob', 'ShangpinJob'].each do |klass|
      klass.constantize.all.find_each do |job|
        next unless job.ownerable_type == 'Quotation'
        job.populate_labels
      end
    end
  end

  # delete all invisible line items for all BOQs that have not been shared.
  def delete_invisible_line_items
    Quotation.where.not(status: 'shared').find_each do |quotation|
      quotation.delete_invisible_line_items
    end
  end

  def modify_boq_labels
    modified_count = 0
    errors = []
    BoqLabel.find_each do |boq_label|
      label_name = boq_label.label_name.gsub('-', '_')
      boq_label.update_columns(label_name: label_name)
    end
  end
  
  # update purchase_orders modifying: false for released po's
  def update_purchase_orders
    PurchaseOrder.where(status: 'released', modifying: true).update_all(modifying: false)
  end

  # Find all duplicate reference_number BOQs. Then change their reference_number to something new and return the info.
  def remove_boq_duplication
    arr = []
    Quotation.group(:reference_number).count.select{|k,v| v>1}.each do |reference_number, count|
      next if Quotation.where(reference_number: reference_number).count <= 1
      old_ref = reference_number
      quotation = Quotation.where(reference_number: reference_number).last
      lead = quotation.project.lead
      new_ref = quotation.generate_reference_number
      quotation.update!(reference_number: new_ref)
      arr.push [lead.id, lead.name, old_ref, new_ref]
    end

    arr
  end

  def populate_delivery_tnc
    Quotation.all.find_each do |quotation|
      quotation.ensure_delivery_tnc
    end
  end

  def add_category_head_role
    Role.where(name: 'category_head').first_or_create
  end

  # populate status updated user for project handover
  def populate_status_updated_by_pr_handover
    prhs = ProjectHandover.where(status_updated_by: nil).where.not(status: 'pending')
    prhs.each do |prh|
      prh_versions = prh.versions.where(event: 'update')
      prh_versions.each do |version|
        objs_changed = YAML::load version.object_changes
        if status = objs_changed.fetch('status', false) 
          prh.update(status_updated_by: User.find(version.whodunnit)) if  ['rejected', 'accepted'].include?(status[1])
        end
      end
    end
  end

  def add_design_manager_role
    Role.where(name: 'design_manager').first_or_create
  end

  def update_payment_stage
    quotations =  Quotation.where(wip_status: "10_50_percent").includes(:payments).where(payments: {payment_type: "initial_design"}).distinct
    reference_number = quotations.pluck(:reference_number)
    payment_ids = []
    quotations.each do |quotation|
      payment_ids += quotation.payments.pluck(:id)
      quotation.payments.map{|payment| payment.update(payment_stage: "10_50_percent", payment_type:"final_design")}
    end
    {"reference_numbers": reference_number, "payment_ids": payment_ids.uniq}
  end

  def update_payment_stage_of_initial_boq
    quotations =  Quotation.where(wip_status: "pre_10_percent").includes(:payments).where(payments: {payment_type: ["final_design", "final_payment"]}).distinct
    reference_number = quotations.pluck(:reference_number)
    payment_ids = []
    quotations.each do |quotation|
      payment_ids += quotation.payments.pluck(:id)
      quotation.payments.map{|payment| payment.update(payment_stage: "pre_10_percent", payment_type: "initial_design")}
    end
    {"reference_numbers": reference_number, "payment_ids": payment_ids.uniq}
  end

  def import_crawl_data
    webs = WebCrawler.all
    webs.each do |web|
      building = BuildingCrawler.create(building_name: web.name, group_name: web.group_name, locality: web.locality, city: web.city)
      BuildingCrawlerDetail.create(bhk_type: web.bhk_type,possession: web.possession, source: web.source, source_id: web.source_id, building_crawler_id: building.id) 
      web.web_crawl_floorplans.each do |fp|
        BuildingCrawlerFloorplan.create(url: fp.url, building_crawler_id: building.id)
      end
    end 
  end

  def import_xl_data
    filepath = "#{Rails.root.join('app', 'data', 'Crawl-Report-2019-11-07:01:40:48PM.xlsx')}"
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      name = workbook.row(row)[headers["Building Name"]]
      group = workbook.row(row)[headers["Group"]]
      locality = workbook.row(row)[headers["locality"]]
      type = workbook.row(row)[headers["Type"]]
      possession = workbook.row(row)[headers["Possession"]]
      price = workbook.row(row)[headers["price"]]
      city = workbook.row(row)[headers["city"]]
      floorplans = workbook.row(row)[headers["floorplans"]]
      wc = WebCrawler.create(name: name, group_name: group, price: price, locality: locality, bhk_type: type, possession: possession, city: city)
      eval(floorplans).each do |fp|
        wc.web_crawl_floorplans.create(url: fp)
      end if floorplans.present?
    end
  end 


  def add_select_cm_tag
    Tag.where(name: 'select_cm', tag_type: 'lead').first_or_create
  end

  def add_questionaire_master_items
    master_data = ["Bunk Bed", "Sofas - L-Shaped", "Sofa Sets", "Microwave Oven", "Dish Washer", "Reception Tables", "Wall Mounted Hood", "Sofa Cum Bed", "Dining Set - 6 Seater", "Oblique Hood", "Warming Drawer", "Island Hood", "Sofas - 3 Seater", "Beds", "Corner Sofa", "Hob", "Day Bed", "Dining Set - 4 Seater", "Hood", "Mattresses", "Crockery Unit", "Flat Hood", "Sofas - 2 Seater", "Conference Tables", "Cabinet", "Wall Hood", "Dining Tables", "Accent Chairs", "Bookshelf and Display Unit", "Study Table", "Gas Hob", "Chest Of Drawers", "Workstation Panel", "TV Units", "Benches", "Lounge Chairs", "Partition - Workstation", "Sofas - 1 Seater, Single Seater", "Coffee Table", "Wall Shelves", "Workstation Desking", "Meeting Table", "Cabin Tables", "Bar Table", "Shoe Rack", "Console Table", "Dining Chairs", "Nested Table", "Chandelier", "Bed Side Table", "Ottoman", "Air Fryer", "Convection Oven", "Side Table", "Workstation", "End Tables", "Decorative Light", "Office Chairs", "Bar Stools", "Water Fountain", "OTG", "Stools", "Kitchen Sets", "Pendant Light", "Griller", "Dinner sets", "Paintings", "Barbecue", "Small Appliances", "Roti Maker", "Show Piece", "Dust Pan Set", "Stock Pot", "Café Chairs", "Multi Kadai", "Clip on", "Pressure Cookers", "Wall Clock", "Chopper", "Utensils", "Door Curtain", "Handi", "Bowls and Palatters", "Bedsheet", "Toaster", "Wall Light", "Fish Pan", "Sofa / Bed Cover", "Candle Stand", "Serving Bowls / Platte", "Plates", "Grill Pan", "Casserole", "Sandwich Maker", "Curry Pan", "Wall Decor", "Chinese Wok", "Deep Pot", "Kadai", "Sauce Pan", "Saute Pan", "Potted Plants", "Table Clock", "Kettle", "Milk Pan", "Spray / Oil", "Tawa", "Fry Pan", "Mirror", "Vases", "Office Accessories", "Bath Mats", "Hand Blender", "Appachetty", "Paniyarakkal", "Wind Chimes", "Sofa Legs", "Photo frames", "Artificial Flowers", "Candles", "Tadka Pan", "Complete Space - Master Bedroom", "Complete Space - Dining", "Complete Space - Pantry", "Complete Space - Living Room", "Complete Space - Porch", "Complete Space - Guest Room", "Complete Space - Kitchen", "Complete Space - Bathroom", "Complete Space - Balcony", "Complete Space - Attic", "Complete Space - Library", "Complete Space - Loft", "Complete Space - Hallway", "Complete Space - Foyer", "Complete Space - Kids room", "1 Bedroom Wardrobe", "2 Bedroom Wardrobe", "3 Bedroom Wardrobe", "4 Bedroom Wardrobe", "5 Bedroom Wardrobe", "Complete House Services - Carpentry", "Complete House Services - Civil Work", "Demolish Activity", "Complete House Services - Electrical", "Complete House Services - False Ceiling", "Complete House Services - Flooring", "Complete House Services - Paint", "Complete House Services - Paneling", "Complete House Services - Partition", "Complete House Services - Plumbing", "1 Room Civil Work", "1 Room Electrical", "1 Room False Ceiling", "1 Room Flooring", "1 Room Painting", "1 Room Paneling", "1 Room Partition", "1 Room Plumbing", "Full Home Interiors - 1.5BHK", "Full Home Interiors - 1BHK", "Full Home Interiors - 1RK", "Full Home Interiors - 2.5BHK", "Full Home Interiors - 2BHK", "Full Home Interiors - 3.5BHK", "Full Home Interiors - 3BHK", "Full Home Interiors - 4.5BHK", "Full Home Interiors - 4BHK", "Full Home Interiors - 5BHK", "Full Home Interiors - Studio Apartment", "Full Home Services - 1.5BHK", "Full Home Services - 1BHK", "Full Home Services - 1RK", "Full Home Services - 2.5BHK", "Full Home Services - 2BHK", "Full Home Services - 3.5BHK", "Full Home Services - 3BHK", "Full Home Services - 4.5BHK", "Full Home Services - 4BHK", "Full Home Services - 5BHK", "Full Home Services - Studio Apartment", "Full Home Furniture - 1.5BHK", "Full Home Furniture - 1BHK", "Full Home Furniture - 1RK", "Full Home Furniture - 2.5BHK", "Full Home Furniture - 2BHK", "Full Home Furniture - 3.5BHK", "Full Home Furniture - 3BHK", "Full Home Furniture - 4.5BHK", "Full Home Furniture - 4BHK", "Full Home Furniture - 5BHK", "Full Home Furniture - Studio Apartment", "Dresser / Dressing Table"]
    master_price = ["160663", "88712", "86275", "79098", "77058", "76367", "75990", "71600", "64617", "60990", "59990", "55378", "51353", "51007", "50988", "48608", "48173", "44504", "40652", "39824", "39249", "38990", "36011", "34809", "33561", "28378", "28211", "27299", "25999", "25486", "25324", "23799", "23325", "41399", "22103", "21999", "21839", "19988", "19916", "19900", "19842", "19661", "18262", "17950", "16025", "15772", "11425", "10624", "10311", "9795", "9105", "8520", "7970", "7873", "7524", "7332", "6844", "5910", "5749", "5624", "5575", "5499", "4677", "4628", "4295", "4199", "3399", "3295", "3225", "2962", "2723", "2555", "2530", "2500", "2460", "2425", "2408", "2249", "2195", "2195", "2179", "2060", "1999", "1899", "1895", "1873", "1840", "1799", "1774", "1760", "1759", "1650", "1558", "1537", "1530", "1499", "1490", "1467", "1450", "1388", "1350", "1299", "1299", "1263", "1214", "1199", "1167", "1099", "1049", "1024", "1015", "999", "995", "970", "965", "949", "949", "916", "899", "624", "440", "251286", "72741", "56393", "226071", "65182", "186858", "199133", "86359", "46504", "147591", "115278", "50930", "61077", "50130", "197702", "72536", "145072", "217608", "290144", "362680", "95796", "96235", "22169", "45893", "72615", "54441", "90699", "88369", "46219", "57697", "38494", "18357", "29046", "21776", "36280", "35348", "18488", "23079", "629391", "568360", "516691", "944087", "786739", "1416131", "1180109", "2124196", "1770163", "2642494", "516691", "176306", "133583", "121439", "264459", "220383", "396689", "330574", "595033", "495861", "654537", "121439", "453085", "434778", "395252", "679628", "566357", "1019442", "849535", "1529163", "1274302", "1987958", "395252", "21462"]
    (0...master_data.length).each do |i|
      QuestionaireMasterItem.where(name: master_data[i], price: master_price[i]).first_or_create
    end
  end

  def check_proposal_approval_doldrums
    arr = []
    # upto 10% discount, CM approved but discount is still not accepted.
    quotations1 = Quotation.joins(:approvals).where("discount_value <= ?", 10.0).
      where(discount_status: [nil, "proposed_for_discount"]).
      where(approvals: { approval_scope: 'discount', role: 'community_manager' })

    quotations2 = Quotation.joins(:approvals).where("discount_value <= ?", 15.0).
      where(discount_status: [nil, "proposed_for_discount"]).
      where(approvals: { approval_scope: 'discount', role: 'city_gm' })

    quotations1.or(quotations2).each do |quotation|
      arr << {
        "Lead ID": quotation.project.lead&.id,
        "Customer Name": quotation.project.lead&.name,
        "Designer": quotation.project.assigned_designer&.email,
        "CM": quotation.project.lead&.assigned_cm&.email,
        "BOQ number": quotation.reference_number,
        "discount_value": quotation.discount_value,
        "discount_status": quotation.discount_status,
        "CM approved": quotation.approvals.where(approval_scope: 'discount', role: 'community_manager').exists?,
        "GM approved": quotation.approvals.where(approval_scope: 'discount', role: 'city_gm').exists?
      }
    end

    arr
  end

  def populate_content_pdf_page_count
    Content.where(scope: 'training_material').each do |content|
      ContentPdfPageCountJob.perform_now(content)
    end
  end

  def created_inbound_call
    ls = LeadSource.where(name: 'Inbound Call').first_or_create!
    lc = LeadCampaign.where(name: 'Inbound Call').first_or_create!
    lc.update! status: 'active'
  end

  def import_shangpin_core_material
    filepath = Rails.root.join('app', 'data', 'Core Mat Mapping.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s
    (0..7).each do |cl|
      ShangpinCoreMaterial.create(core_material: workbook.row(1)[cl])
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      ShangpinJobColor.create(color: workbook.row(row)[0], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Prelam MDF").id)
      ShangpinJobColor.create(color: workbook.row(row)[1], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Glossmeister on MDF").id)
      ShangpinJobColor.create(color: workbook.row(row)[2], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Postlam MDF Glossy").id)
      ShangpinJobColor.create(color: workbook.row(row)[3], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Postlam MDF Matte").id)
      ShangpinJobColor.create(color: workbook.row(row)[4], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Postlam Ply Glossy").id)
      ShangpinJobColor.create(color: workbook.row(row)[5], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Postlam Ply Matte").id)
      ShangpinJobColor.create(color: workbook.row(row)[6], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Postlam Ply White Carcass").id)
      ShangpinJobColor.create(color: workbook.row(row)[7], shangpin_core_material_id:  ShangpinCoreMaterial.find_by(core_material: "Foil on MDF").id)
    end
  end

  def remove_pm_fee(quotation)
    quotation.update_columns(
    service_pm_fee: 0,
    nonservice_pm_fee: 0,
    total_amount: quotation.flat_amount
    )
  end

  # After category is split into separate roles based on segment, this script was/is used to assign the
  # appropriate role to each user currently having :category role.
  def category_split_assign_roles
    roles = ['category_panel', 'category_non_panel', 'category_services']
    category_panel_emails = %w(sarika@arrivae.com jayeshmore@arrivae.com avinashk@arrivae.com prashant@arrivae.com
      rashmi@arrivae.com avinashkottari@icloud.com vinay@arrivae.com swati@arrivae.com sonakshi@arrivae.com
      radheshyam@arrivae.com rishil@arrivae.com aamna@arrivae.com avinashsuddala@arrivae.com tejasvi@arrivae.com
      kunalkava@arrivae.com hafiza.altaf@arrivae.com hafiza@arrivae.com tanvi@arrivae.com zameer@arrivae.com
      bhushan@arrivae.com akshada@arrivae.com anagha@arrivae.com nikhilzore@arrivae.com vishals@arrivae.com
      vikasb@arrivae.com sagar@arrivae.com savita@arrivae.com abhinav01@mailinator.com meena@arrivae.com
      tejal@arrivae.com sushma@arrivae.com manisha@arrivae.com sanketk@arrivae.com darshan@arrivae.com
      hardikd@arrivae.com shraddha@arrivae.com rauf@arrivae.com rajeshsaini@arrivae.com)
    category_non_panel_emails = %w(pranav@arrivae.com kainat@arrivae.com mrunal@arrivae.com shreya@arrivae.com
      sivan@arrivae.com ameya@arrivae.com shyam@arrivae.com)
    category_services_emails = %w(mridul@arrivae.com saravanan@arrivae.com dhiren@arrivae.com salmanshaikh@arrivae.com
      diptijadhav@arrivae.com pradeep@arrivae.com magesh@arrivae.com ravindra@arrivae.com shubhraneel@arrivae.com
      vishalm@arrivae.com harish@arrivae.com rupesh@arrivae.com vishal@arrivae.com chiragmistry@arrivae.com
      amol@arrivae.com hitesh@arrivae.com anirudh@arrivae.com parikshith@arrivae.com sumitchopra@arrivae.com
      arun@arrivae.com sandesh@arrivae.com bhargav@arrivae.com sangita@arrivae.com)
    new_roles = Hash.new
    category_panel_emails.each do |email|
      user = User.find_by_email email
      role_name = user.roles.last.name
      user.remove_role(role_name) if role_name.present?
      user.add_role('category_panel')
      new_roles[email] = user.roles.pluck(:name)
    end
    category_non_panel_emails.each do |email|
      user = User.find_by_email email
      role_name = user.roles.last.name
      user.remove_role(role_name) if role_name.present?
      user.add_role('category_non_panel')
      new_roles[email] = user.roles.pluck(:name)
    end
    category_services_emails.each do |email|
      user = User.find_by_email email
      role_name = user.roles.last.name
      user.remove_role(role_name) if role_name.present?
      user.add_role('category_services')
      new_roles[email] = user.roles.pluck(:name)
    end

    pp new_roles
    new_roles
  end

  def custom_element_populate_split
    CustomElement.all.each do |custom_element|
      if custom_element.category_split.present?
        next
      elsif custom_element.space.present?
        custom_element.update_columns(category_split: custom_element.space.gsub("-", "_"))
      else
        # As per Abhishek, we can mark all custom elements as 'panel'
        custom_element.update_columns(category_split: 'panel')
      end
    end 
  end

  # Script for BOQ approval
  # needed since for the following 2 cases:
  # 1. Initial BOQ to Final BOQ creation - threshold lowered from 10% to 7% for auto approval
  # 2. Final BOQ move to pre-production - threshold lowered from 50% to 45% for auto approval
  def boq_approval_script
    approved_10_refs = []
    error_10_refs = []
    approved_50_refs = []
    error_50_refs = []
    approving_user = User.find_by(email: 'abhishek@arrivae.com')
    # Check for new 7% threshold
    Quotation.all.find_each do |quotation|
      begin
        if !quotation.final_boq? && (quotation.paid_amount.to_f/quotation.total_amount) > 0.07 && quotation.child_quotations.blank?
          quotation.update(per_10_approved_at: Time.zone.now, per_10_approved_by_id: approving_user.id)
          quotation.clone(quotation.discount_value) if !quotation.final_boq? && !quotation.copied
          new_boq = quotation.child_quotations&.last
          cm_approval = TaskEscalation.find_by(ownerable: quotation, task_set: TaskSet.find_by_task_name("CM Approval for less than 10% Payment"), status: "no")
          cm_approval.update(status: "yes", completed_at: DateTime.now) if cm_approval.present?
          if new_boq.present?
            task_set_final = TaskEscalation.find_by(ownerable: new_boq, task_set: TaskSet.find_by_task_name("Create Final BOQ"))
            TaskEscalation.invoke_task(["Create Final BOQ"], "10% - 40%", new_boq) if !task_set_final.present?
            TaskEscalation.mark_done_task("Create Final BOQ", "10% - 40%", new_boq) if !task_set_final.present?
            new_boq.update(wip_status: "10_50_percent")
          end
          approved_10_refs << quotation.reference_number
        end
      rescue
        error_10_refs << quotation.reference_number
        next
      end
    end

    # Check for new 45% threshold.
    Quotation.all.find_each do |quotation|
      begin
        if quotation.final_boq? && (quotation.paid_amount.to_f/quotation.total_amount) > 0.45 && quotation.per_50_approved_at.blank? && quotation.payments.where(is_approved: true, payment_stage: "10_50_percent").exists?
          quotation.update_columns(per_50_approved_at: Time.zone.now, per_50_approved_by_id: approving_user.id, payment_50_comp_date: Time.zone.now)
          cm_approval = TaskEscalation.find_by(ownerable: quotation, task_set: TaskSet.find_by_task_name("CM Approval for less than 40% Payment"), status: "no")
          TaskEscalation.mark_done_task("CM Approval for less than 40% Payment", "10% - 40%",quotation) if cm_approval.present?
          approved_50_refs << quotation.reference_number
        end
      rescue
        error_50_refs << quotation.reference_number
        next
      end
    end

    output = {
      "approved_BOQ_10_percent": approved_10_refs,
      "approved_BOQ_50_percent": approved_50_refs,
      "error_10_refs": error_10_refs,
      "error_50_refs": error_50_refs
    }

    output
  end
end
