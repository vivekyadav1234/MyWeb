class UserNotifierMailer < ApplicationMailer
  default :from => "wecare@arrivae.com"
  after_action :prevent_delivery_to_dummyemails

  def manual_password_reset_mail(user)
    @name = user.name || user.email
    mail(to: user.email, subject: "Your password needs to reset.")
  end

  def manual_password_reset_dev_mail(user_ids)
    @user_ids = user_ids
    mail(to: "arunoday@gloify.com", subject: "Password successfully reset for these users.")
  end

  def lead_creation_mail_to_lead(lead)
    @lead = lead
    mail(to: lead.email,
      subject: "Lead created"
      )
  end

  def lead_no_delay_time(lead)
    @lead = lead
    emails = ['arunoday@gloify.com', 'sachin@gloify.com', 'abhinav@gloify.com']
    mail(
      to: emails,
      subject: "Delayed lead without delay time"
      )
  end

  def temp_boq_or_ppt_created(emails,boq_ppt)
    @boq_ppt = boq_ppt
    @project = @boq_ppt.project
    mail(to: emails,
         subject: "New #{@boq_ppt.upload_type} file Uploaded")
  end

  def share_invoice(payment_invoice)
    @payment_invoice = payment_invoice
    @lead = @payment_invoice.project.lead
    mail(to: @lead.email,
         subject: "Invoice Report")
  end

  def visit_us_details(reciever_email, name, email, mobile_number, datetime_for_meeting, city, address)
    @name = name
    @email = email
    @mobile_number = mobile_number
    @datetime_for_meeting = datetime_for_meeting
    @city = city
    @address = address
    mail(to: reciever_email, subject: "New User Details")
  end

  def factory_notification_mail(project , url)
    @project = project
    @url = url
    @lead = project.lead
    if Rails.env.production?
      email = ["abhishek@arrivae.com"]
    else
      email = "abhinav@gloify.com"
    end
    mail(to: email,
      subject: "New Request in factory")
  end


  def temp_boq_shared_mail(boq_ppt)
    @boq_ppt = boq_ppt
    @project = @boq_ppt.project
    mail(to: @project&.user&.email,
         subject: "New #{@boq_ppt.upload_type} is Shared With You")
  end

  def olt_email_report(data_hash, users)
    @finance_approved_client = data_hash[:finance_approved_client]
    @po_raised_client = data_hash[:po_raised_client]
    @po_not_raised_client = data_hash[:po_not_raised_client]
    @handover_approved_client = data_hash[:handover_approved_client]
    @not_production_drawing_client = data_hash[:not_production_drawing_client]
    emails = []
    if Rails.env.production?
      emails << users
      emails << ["category@arrivae.com", "abhishek@arrivae.com"]
    else
      emails << users
      emails << ["abhinav@gloify.com"]
    end
    mail(:to => emails,
      :subject => "Daily OLT Report")
  end

  def lead_qualified_mail_to_cm(email,lead)
    @lead = lead
    mail(to: email,
         subject: "New Lead Qualified")
  end

  def bulk_po_created(file_name, file_path, status, vendor, po_type)
    @file_path = file_path
    @status = status
    @vendor = vendor
    emails = []

    if Rails.env.production?
      emails = ["category@arrivae.com", "abhishek@arrivae.com",
        "swati@arrivae.com", "aamna@arrivae.com"]
    else
      emails = ["abhinav@gloify.com"]
    end

    # added mail ids which has to recieve update of maintenance po 
    if Rails.env.production? && po_type == "maintenance"
      emails += ["kunalkava@arrivae.com", "savita@arrivae.com","rishil@arrivae.com"]
    elsif po_type == "maintenance"
      emails += ["kunalkava@mailinator.com", "savita@mailinator.com","rishil@mailinator.com"]
    end
    emails.push(vendor.email)
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "Purchase Order #{status}")
  end

  def share_payment_receipt(user, file_path, file_name)
    @user = user
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail( :to => @user.email,
      :subject => "Payment Receipt")
  end

  def bulk_po_canceled(vendor, po)
    @vendor = vendor
    @po = po
    emails = []
    if Rails.env.production?
      emails = ["category@arrivae.com", "abhishek@arrivae.com",
        "swati@arrivae.com", "aamna@arrivae.com"]
    else
      emails = ["abhinav@gloify.com"]
    end
    emails.push(vendor.email)
    mail( :to => emails,
    :subject => "Purchase Order got Cancelled")
  end

  def bulk_po_modification(vendor, po)
    @vendor = vendor
    @po = po
    emails = []
    if Rails.env.production?
      emails = ["category@arrivae.com", "abhishek@arrivae.com",
        "swati@arrivae.com", "aamna@arrivae.com"]
    else
      emails = ["abhinav@gloify.com"]
    end
    emails.push(vendor.email)
    mail( :to => emails,
    :subject => "Purchase Order Sent for Modification")
  end

  def test_email_utility
    users = %w(arunoday@gloify.com shobhit@gloify.com)
    mail(to: users.join(","),
         subject: "Test email from #{Rails.env} utility server")
  end

  # send a signup email to the user, pass in the user object that   contains the user's email address
  def user_approved_email(user, password)
    @user = user
    @password = password
    @role = @user.roles.first.name
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "Thanks for signing up for our amazing app")
  end

  # send a signup email to the user, pass in the user object that   contains the user's email address
  def user_invited_welcome_email(user, password, role)
    @user = user
    @password = password
    @role = role
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "You have been invited to Arrivae.com!")
  end

  def lead_credential_mail(lead, password)
    @user = lead
    @password = password
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "User Credentials")
  end

  def lead_signup_email(lead)
    @lead = lead
    @lead_to_check = @lead
    mail(:to => @lead.email,
         :subject => "Thanks for signing up for our amazing app")
  end

  def designer_assigned_email(designer_project)
    @user = designer_project.project.user
    @project = designer_project.project
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "Designer asssigned to your project")
  end

  def project_assigned_email(designer_project)
    @user = designer_project.project.user
    @designer = designer_project.designer
    @desginer_project = designer_project
    @project = designer_project.project
    @redirect_url = "#{@frontend_root_url}/leadstatus"
    @lead_to_check = @designer
    mail(:to => @designer.email,
         :subject => "Project asssigned to you!")
  end

  def design_status_email(design)
    @designer = design.designer
    @cm = design.designer.cm
    @design = design
    @lead_to_check = @designer
    mail(:to => @cm.email, :cc => @designer.email,
         :subject => "Design status! #{@design.status.humanize}")
  end

  def quotation_status_email(quotation)
    @design = quotation.quotationable
    @designer = quotation.quotationable.designer
    @quotation = quotation
    # puts @designer
    @lead_to_check = @designer
    mail(:to => @designer.email,
         :subject => "Quotation status!")
  end

  def contact_form_email(number)
    @number = number
    mail(:to => "wecare@arrivae.com ",
         :subject => "New contact!")
  end

  def user_activation_email(user, password)
    @user = user
    @password = password
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "Your account is activated")
  end

  def user_deactivation_email(user)
    @user = user
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "Your account is deactivated")
  end

  def user_role_remove_email(user, role)
    @user = user
    @role = role
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "Your role is removed")
  end

  def user_role_add_email(user, role)
    @user = user
    @role = role
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "New role assigned to you!")
  end

  def scheduler_send_invite(user, task)
    @user = user
    @task = task
    @project = @task.project
    # puts @user.email
    @lead_to_check = @user
    mail(to: @user.email,
         subject: "Task #{@task.name} of #{@project.name} scheduled.")
  end

  # Send a email to cm when designer uploads a design to a lead
  def design_uploaded_mail_to_cm(user, design_type)
    @user = user.cm
    @designer = user
    @subject = design_type == "final" ? "Final design is Uploaded" : "New design is Uploaded"
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => @subject)
  end

  def customer_designer_status_mail(customer, designer, customer_status)
    @user = designer.cm
    @designer = designer
    @customer = customer
    @status = customer_status
    @lead_to_check = @customer
    @lead_to_check = @user
    if @status.status == "meeting_fixed"
      mail(:to => @customer.email, :cc => @user.email,
           :subject => "Meeting Fixed With Designer")
    else
      if @user.present?
        mail(:to => @user.email, :subject => "Customer Status Updated")
      end
    end
  end

  #project under WIP
  def project_under_wip_mail(user, wip_status)
    @user = user.cm
    @designer = user
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => wip_status)
  end

  # Lead assigned to Community Manager
  def lead_assigned_to_cm(user)
    @user = user.cm
    @lead_to_check = @user
    mail(:to => @user.email,
         :subject => "New lead assigned !!")
  end

  #Lead Status Mail To Lead Head
  def status_of_lead_to_lead_head(lead, mail_ids)
    @lead = lead

    mail(:to => mail_ids,
         :subject => "Status of lead updated !!")
  end

  # Event Creation Mail
  def event_rescheduled_email(event, user)
    @event = event
    @user = user
    @lead_to_check = @user
    mail(:to => user.email,
         :subject => "Event Re-Scheduled !!")
  end

  def line_item_excel_mail(file_path, file_name, user)
    @file_path = file_path
    @user = user
    emails = []
    if Rails.env.production?
      emails = @user.email
    else
      emails = [@user.email,"abhinav@gloify.com"]
    end
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
      :subject => "BOQ Line Item Report")
  end

  def event_created_email(event,user)
    @event = event
    @user = user
    @lead_to_check = @user
    mail(:to => user.email,
      :subject => "Event Scheduled !!")
  end

  def event_created_email_for_outsider(event, email)
    @event = event
    # @lead_to_check = @user
    mail(:to => email,
      :subject => "Event Scheduled !!")
  end

  def event_reminder(event, user)
    @event = event
    @user = user
    @lead_to_check = @user
    mail(:to => user.email, :subject => "Event Reminder!!")
  end

  def proposed_boq_aproved(proposal_doc, user)
    @user = user
    @proposal_doc = proposal_doc
    @doc_status = proposal_doc.is_approved == true ? "Approved" : "Rejected"
    @designer = proposal_doc.proposal.project.assigned_designer
    @cm = @designer.cm
    emails = [@designer.email, @designer.cm.email] + User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    mail(:to => emails,
         :subject => "BOQ #{@doc_status}!!")
  end

  def proposal_shared_mail_to_customer(proposal)
    @user = proposal.project.user
    @proposal = proposal
    @url = "https://delta.arrivae.com/"
    mail(:to => @user.email,
         :subject => "Proposal Shared !!")
  end

  def proposal_shared_mail_to_arrivae(proposal)
    @user = proposal.project.user
    @proposal = proposal
    @project = proposal.project
    @url = "#{@frontend_root_url}/customer/projects"
    emails = []

    if Rails.env.production?
      emails = ["atul@arrivae.com", "abhishek@arrivae.com"]
    else
      emails = ["sunny@mailinator.com", "ranjeet@mailinator.com"]
    end
    mail(:to => emails,
         :subject => "Proposal Shared !!")
  end

  def proposal_created_mail_to_cm_and_category(proposal,user)
    @user = user.has_role?(:community_manager) ? user : user.cm
    @proposal = proposal
    @designer = user
    emails = [@user.email]
    emails.push (User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)) if proposal.proposal_type == "final_design"
    mail(:to => emails,
         :subject => "New Proposal Created !!")
  end

  def site_measurement_request_mail(request, cm_om_emails)
    @request = request
    @project = @request.project
    @designer = @request.designer
    @user = @request.designer.cm
    @lead_to_check = @user
    emails = []
    if Rails.env == "production" || Rails.env == "uat"
      emails << @user.email
      emails << @designer.email
      emails << "abhishek@arrivae.com"
      emails << "rupesh@arrivae.com"
      emails = emails + cm_om_emails
    else
      emails << @user.email
      emails << @designer.email
      emails << "abhinav@gloify.com"
    end
    mail( :to => emails,
    :subject => "New Site Measurement Request is created!")
  end

  # MailerNotification for Office Users on creating new site_measurement_request 
  # def site_measurement_request_office_mail(request, office_users)
  #   @request = request
  #   @project = @request.project
  #   @designer = @request.designer
  #   @user = @request.designer.cm
  #   emails = []
  #   if Rails.env == "production"
  #     emails = office_users.pluck(:email)
  #   else
  #     emails << "abhishek@arrivae.com"
  #     emails << "jinita@arrivae.com"
  #     emails << "sanket@arrivae.com"
  #     emails << "nikhil@arrivae.com"
  #   end
  #   mail( :to => emails,
  #   :subject => "New Site Measurement Request is created!")
  # end

  def site_measurement_completed_mail(request, str)
    @request = request
    @project = @request.project
    @cm = @request.designer.cm
    @designer = @request.designer
    @lead_to_check = @cm
    @lead_to_check = @designer
    @content = ""
    if @request.request_type == "line_marking_site_measurement_request"
      @content = "Line Marking is completed, please initiate Cost and Technician QC. Ignore if already done"
    end
    emails = [@cm.email, @designer.email, User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)].flatten
    mail( :to => emails,
    :subject => str)
  end

  def site_measurement_images_mail(request)
    @request = request
    @project = @request.project
    @cm = @request.designer.cm
    @designer = @request.designer
    @lead_to_check = @cm
    @lead_to_check = @designer
    emails = [@cm.email, @designer.email]
    mail(:to => emails,
         :subject => "New Site images added !")
  end

  def notification_of_new_custom_elements(emails, project, custom_elelment_ids, options = {})
    @project = project
    @lead = project.lead
    @custom_elements = CustomElement.where(id: custom_elelment_ids)
    mail(:to => emails,
         :subject => "New Custom Elements are created for Lead ID #{@lead.id} (#{@lead.name}). Segment - #{options[:segment]}.")
  end

  def notification_of_updated_custom_elements(emails, custom_element)
    @project = custom_element.project
    @lead = @project.lead
    @custom_element = custom_element
    mail(:to => emails, :subject => "Custom Element is updated for Lead ID #{@lead.id} (#{@lead.name}). Segment - #{custom_element.category_split}.")
  end

  def category_remark_add_to_custom_elements(emails, custom_element, user)
    @project = custom_element.project
    @lead = @project.lead
    @custom_element = custom_element
    @user = user
    mail(:to => emails,
         :subject => "Custom Element is updated for Lead ID #{@lead.id} (#{@lead.name}). Segment - #{custom_element.category_split}.")
  end

  def discount_for_approval(proposal, proposed_by_id, quotation)
    @proposal = proposal
    @user = User.find proposed_by_id
    @cm =  @user.has_role?(:designer) ? @user.cm : @user
    @lead = proposal.project.lead
    @quotation = quotation
    cm_email = quotation&.project&.assigned_designer&.cm.email
    base_url = Rails.env == "production" ? "https://arrivae.com" : "https://qa.arrivae.com"
    # lead/3660/project/1058/proposals/37/view-proposal
    @url = @frontend_root_url + "/lead/#{@proposal.project.lead.id}/project/#{@proposal.project.id}/view-proposal"
    mail(to: cm_email, subject: "Proposal Discount Waiting for approval")
  end

  def lead_list_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    @lead_to_check = @user
    attachments[file_name] = File.read(file_path)
    mail(:to => @user.email,
         :subject => "List of Leads")
  end

  def customer_profile_questionnaire(file_path,file_name,email)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail( :to => email,
    :subject => "Customer Questionnaire")
  end

  def po_report_email(file_path,file_name,email)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail( :to => email,
    :subject => "PO Report")
  end

  def unassigned_lead_in_a_day(file_path,file_name)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    if  Rails.env == "production"
      emails =['wecare@arrivae.com','roshnimalik@arrivae.com','abhishek@arrivae.com']
    else
      emails = ['abhinav@gloify.com']
    end
    mail( :to => emails,
    :subject => "Unassigned Leads")
  end

  def daily_payment_report(file_path,file_name)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    if  Rails.env == "production"
      emails =['umesh@arrivae.com','mridul@arrivae.com', 'deepakvuppala@arrivae.com', 'sunilg@arrivae.com','abhishek@arrivae.com']
    else
      emails = ['abhinav@gloify.com']
    end
    mail( :to => emails,
    :subject => "Daily Payment Report")
  end


  def discount_approved(quotation)
    @quotation = quotation
    @proposal = quotation.proposals.last
    @designer = quotation.project.assigned_designer
    @project = quotation.project    
    @lead = @project.lead
    mail(to: @designer.email, subject: "Quotation Approved")
  end

  def complete_discount_approval_email(quotation)
    @quotation = quotation
    #@gm_approval = quotation.approvals.where(approval_scope: 'discount').where(role: "city_gm").present? 
    @lead = quotation.project.lead
    @proposed_discount = quotation.discount_value
    @designer = quotation.project.assigned_designer
    @cm = @lead.assigned_cm
    @gm = @cm.gms&.last
    bhs = User.with_role(:business_head).pluck(:email)
    case quotation.discount_value
    when 0.0..Proposal::DISCOUNT_THRESHOLD[:designer]
      emails = @designer.email
    when Proposal::DISCOUNT_THRESHOLD[:designer]..Proposal::DISCOUNT_THRESHOLD[:community_manager]
      emails = @cm.email
    when Proposal::DISCOUNT_THRESHOLD[:community_manager]..Proposal::DISCOUNT_THRESHOLD[:city_gm]
      emails = @gm.present? ? @gm.email : bhs
    when Proposal::DISCOUNT_THRESHOLD[:city_gm]..100.0
      emails = bhs
    end
    #emails =  @gm_approval ? [@designer.email, @cm.email, @gm.email] + bhs : [@designer.email, @cm.email, @gm&.email]
    mail(to: emails, subject: "Action Required ! Discount Approval Pending For #{@quotation.reference_number}")
  end

  def discount_alert(quotation)
    @quotation = quotation
    @proposal = quotation.proposals.last
    @designer = quotation.project.assigned_designer
    @project = quotation.project
    @gm = quotation.approvals.where(role: "city_gm").last
    if @gm.present?
      @gm_user = User.find_by_id(@gm.approved_by)
    end
    @business_head = quotation.approvals.where(role: "business_head").last
    if @business_head.present?
      @bh_user = User.find_by_id(@business_head.approved_by)
    end
    email = Rails.env.production? ? "abhishek@arrivae.com" : "abhinav@gloify.com"
    mail(to: email , subject: "More than 10% Discount approved for BOQ #{quotation.reference_number}.")
  end


  def payment_added(payment)
    emails = User.with_role(:finance).pluck(:email)
    emails.push payment.project.assigned_designer.cm.email
    @community_manager = payment.project.assigned_designer.cm.name
    @client_name = payment.project.lead.name
    @designer_name = payment.project.assigned_designer.name
    @payment = payment
    mail(to: emails, subject: "Payment Added")
  end

  def pi_payment_added(pi_payment)
    emails = User.with_role(:finance).pluck(:email)
    project = pi_payment.performa_invoice.quotation.project
    emails.push project.assigned_designer.cm.email
    @community_manager = project.assigned_designer.cm.name
    @client_name = project.lead.name
    @designer_name = project.assigned_designer.name
    @pi_payment = pi_payment
    mail(to: emails, subject: "Payment against PI Added")
  end

  def less_payment_approved(quotation)
    @project = quotation.project
    @quotation = quotation
    cm = @project.assigned_designer.cm
    gms = cm.gms
    emails = [cm.email]
    if Rails.env.production? || Rails.env.uat?
      emails << 'abhishek@arrivae.com'
    end
    emails.push(gms.pluck(:email)) if gms.exists?
    mail(to: emails.flatten, subject: "Lesser Payment Approved for Quotation #{@quotation.reference_number}.")
  end

  ### send a notification email to the arrivae's internal team, with details - once finace approve any 40% payment
  def payment_of_40_approved(payment,quotation)
    lead = quotation.project.lead
    @lead_id = lead.id
    @lead_name = lead.name
    @boq_number = quotation.reference_number
    @boq_value = quotation.net_amount&.round(2)
    @boq_discount = quotation.discount_value&.round(2)
    @boq_final_value = quotation.total_amount&.round(2)
    @payment_added_date = payment.created_at.strftime("%d %B %Y")
    @payment_verification = Time.now.strftime("%d %B %Y")
    @payment_approved_value = payment.amount&.round(2)
    if  Rails.env == "production"
      user_list = ['deepakvuppala@arrivae.com',
        'swati@arrivae.com',
        'rishil@arrivae.com',
        'kunalkava@arrivae.com',
        'diptijadhav@arrivae.com',
        'mrunal@arrivae.com',
        'shreya@arrivae.com',
        'ameya@arrivae.com',
        'abhishek@arrivae.com',
        'savita@arrivae.com']
    else
      user_list = "abhinav@gloify.com"
    end
    mail(to: user_list, subject: "40 % Payment has been approved for #{@boq_number}")
  end

  def quotation_cm_category_approval(quotation, role)
    @quotation = quotation
    @role = role
    @project = quotation.project
    mail(to: @project.assigned_designer.email, subject: "Quotation #{@quotation.reference_number} Approved by #{role&.titleize}")
  end

  def payment_approved(payment)
    @payment = payment
    @project = payment.project
    @designer = @project.assigned_designer
    @cm = @designer.cm
    emails = [@designer.email]
    emails.push @cm.email
    if(@payment.is_approved == true)
      mail(to: emails, subject: "Payment of #{payment.amount} has been approved.")
    else
      mail(to: emails, subject: "Payment of #{payment.amount} has been rejected.")
    end
  end


  def pi_payment_approved_to_vendor(pi_payment)
    @pi_payment = pi_payment
    @quotation = pi_payment.performa_invoice.quotation
    @project = @quotation.project
    # @designer = @project.assigned_designer
    @vendor = pi_payment.performa_invoice.vendor
    # @cm = @designer.cm
    # emails = [@designer.email]
    # emails.push @cm.email
    mail(to: @vendor.email , subject: "PO Payment of #{pi_payment.amount} has been released.")
  end

  def pi_payment_approved(pi_payment)
    @pi_payment = pi_payment
    @quotation = pi_payment.performa_invoice.quotation
    @project = @quotation.project
    # @designer = @project.assigned_designer
    @vendor = pi_payment.performa_invoice.vendor
    # @cm = @designer.cm
    emails = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    # emails.push @cm.email
    mail(to: emails , subject: "PO Payment of #{pi_payment.amount} has been #{pi_payment.payment_status}.")
  end

  def send_purchase_order(file_path, user, purchase_order)
    @purchase_order = purchase_order
    user_email = user.email
    vendor_email = purchase_order.vendor.email
    emails = [ user_email, vendor_email ]
    if  Rails.env == "production"
      emails += ["category@arrivae.com", "abhishek@arrivae.com", "vinay@arrivae.com",
        "dhanalakshmi@arrivae.com", "swati@arrivae.com", "aamna@arrivae.com"]
    end
    attachments["#{@purchase_order.reference_no}.pdf"] = File.read(file_path)
    mail(to: emails, subject: "New Purchase Order")
  end

  def send_modified_purchase_order(file_path, user, purchase_order)
    @purchase_order = purchase_order
    user_email = user.email
    vendor_email = purchase_order.vendor.email
    emails = [ user_email, vendor_email ]
    if  Rails.env == "production"
      emails += ["category@arrivae.com", "abhishek@arrivae.com", "vinay@arrivae.com",
        "swati@arrivae.com", "aamna@arrivae.com"]
    end
    attachments["#{@purchase_order.reference_no}.pdf"] = File.read(file_path)
    mail(to: emails, subject: "Modified Purchase Order")
  end

  def lead_queue_generation
    users = %w(arunoday@gloify.com shobhit@gloify.com)
    mail(to: users.join(","),
         subject: "Lead Queue Generated in #{Rails.env} with #{LeadQueue.all.count}")
  end

  def task_escalated_email(task, emails)
    @task = task
    mail(to: emails, subject: "Task Escalated")
  end

  def schedule_visit_email(name, email, contact, visit_date)
    @name = name
    @email = email
    @mobile_number = contact
    @datetime_for_meeting = visit_date
    mail(to: ["edwin@arrivae.com", "azhar@arrivae.com"], subject: "New Meeting Scheduled" )
  end

  def cancel_po(purchase_order, user)
    @purchase_order = purchase_order
    emails = [user.email, @purchase_order.vendor.email]
    if  Rails.env == "production"
      emails += ["category@arrivae.com", "abhishek@arrivae.com", "vinay@arrivae.com",
        "dhanalakshmi@arrivae.com", "swati@arrivae.com", "aamna@arrivae.com"]
    end
    mail(to: emails, subject: "Cancellation of Purchase Order")
  end

  def test_mail(emails)
    mail(to: emails, subject: "Testing Notification Functionality")
  end

  def catalog_report_email(category_name, file_path, file_name, email)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail(:to => email,
         :subject => "#{category_name} Catalog Report")
  end

  def event_excel_mail(file_path, file_name, email)
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail(:to => email,
         :subject => "Event Report")
  end

  def referrer_assigned(sales_manager, referrer)
    @sales_manager = sales_manager
    @referrer = referrer
    mail(to: sales_manager.email, subject: "New referrer assigned: #{referrer.name}")
  end

  def category_excel_mail(file_path,file_name,email)
    emails = []
    emails << email
    emails << "abhinav@gloify.com"


    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "SLI Report")
  end

  def invite_new_users(user)
    @user = user
    mail(to: user.email, subject: "Greetings from Arrivae!")
  end

  def share_pdf_with_customer(project, file_name)
    @user = project.user
    s3 = Aws::S3::Resource.new
    obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(file_name)
    url = obj.presigned_url("get", expires_in: 600*60)
    @link = url
    mail(to: @user.email, subject: "Greetings from Arrivae!")
  end

  def share_warrenty_doc_with_customer(project)
    @user = project.user
    @link = Rails.env == "production" ? "https://delta.arrivae.com/assets/img/customerWarranty.pdf" : "https://arrivae-qa-product.firebaseapp.com/assets/img/customerWarranty.pdf"
    mail(to: @user.email, subject: "Warranty Document from Arrivae")
  end

  def category_handover_mail(project, url)
    emails = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    emails.push "category@arrivae.com" if Rails.env.production?
    @lead = project.lead
    @designer = project.assigned_designer
    @cm = @designer.cm
    @link = url
    mail(to: emails, subject: "#{@lead.name} Handover Files")
  end

  # This email will be sent in addition to :category_handover_mail as only BOQs have segment wise approval.
  # Must include BOQ number and the segments included.
  def category_boq_handover_mail(quotation_ids, url)
    @quotations = Quotation.where(id: quotation_ids)
    segments_in_boq = @quotations.map(&:get_segments).flatten.compact.uniq
    roles_for_segments = segments_in_boq.map{|segment| SEGMENT_ROLE_MAPPING.key(segment)}
    emails = User.with_any_role(:category_head, *roles_for_segments).pluck(:email)
    project = @quotations.sample.project
    @lead = project.lead
    @designer = project.assigned_designer
    @cm = @designer.cm
    @link = url
    mail(to: emails, subject: "#{@lead.name} BOQ Handover.")
  end

  def share_mom_details(emails, event)
    @event = event
    mail(to: emails, subject: "MOM details Shared")
  end

  def category_handover_action(handover, project, current_user, options = {})
    lead = project.lead
    emails = [project.assigned_designer.email, lead&.assigned_cm&.email.to_s]
    @lead_id = lead.id
    @customer_name = project.lead.name
    @handover = handover
    @owner = handover.ownerable
    @user = current_user
    @class_name = @owner.class.name
    @segment = options[:segment] || 'All segments'
    if @class_name == "BoqAndPptUpload"
      @class_name  = "PPT"
    elsif @class_name == "Floorplan"
      @class_name  = "Floor Plan"
    elsif @class_name == "CadDrawing"
      @class_name  = "Cad Drawing"
    elsif @class_name == "ThreeDImage"
      @class_name  = "3D Image"
    elsif @class_name == "ReferenceImage"
      @class_name  = "Reference Image"
    elsif @class_name == "LineMarking"
      @class_name  = "Line Marking"
    elsif @class_name == "CustomerInspiration"
      @class_name  = "Customer Inspiration"
    end
    lead_name = lead.name.present? ? lead.name : lead.id
    mail(to: emails.compact.join(","), subject: "Handover file updated by Category for lead #{lead_name}.")
  end

  def additional_file_requested(project, file)
    @project = project
    @file = file
    email = project.assigned_designer.email
    mail(to: email, subject: "Additional File Requested for Project #{@project.name}")
  end

  def rake_task_run(task_name)
    @task_name = task_name
    users = %w(arunoday@gloify.com shobhit@gloify.com)
    mail(to: users.join(','), subject: "Rake Task email for #{@task_name}" )
  end

  def additional_request_resolved(request_file)
    @project = request_file.project
    emails = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    mail(to: emails, subject: "Additional File Request Resolved")
  end

  def qc_schedule(qc, project, clubbed_ids)
    @qc = qc
    @qcStatus = qc.qc_status
    @project = project
    @lead = @project.lead
    @purchase_order = @qc.unscoped_job_element.unscoped_purchase_elements.last.purchase_order
    @job_element = @qc.job_element
    if clubbed_ids.present?
      clubbed_count = clubbed_ids.map{|id| JobElement.find(id)}.map(&:quantity).compact.sum
    else
      clubbed_count = 0
    end
    @quantity = @job_element.quantity + clubbed_count
    emails = Rails.env.production? ? ["qc@arrivae.com", "santosh@arrivae.com"] : ["abhinav@gloify.com"]
    mail(to: emails, subject: "QC #{@qcStatus.humanize.titleize} for Lead ID: #{@lead.id}")
  end

  def revision_added(project)
    @project = project
    emails = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    emails.push "category@arrivae.com" if Rails.env.production?
    mail(to: emails, subject: "Revision Added for #{@project.name}" )
  end

  def duration_changed(quotation, old_duration, new_duration, owner)
    @old_duration = old_duration
    @new_duration = new_duration
    @owner = owner
    project = quotation.project
    designer_email = project.assigned_designer.email
    cm_emil = project.lead.assigned_cm.email
    emails = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email)
    emails<< designer_email << cm_emil
    mail(to: emails, subject: "Duration Changed for BOQ - #{quotation.reference_number}")
  end

  def project_quality_check_created(quality_check)
    @quality_check = quality_check
    @project = quality_check.project
    designer_emal = @project.assigned_designer.email
    @content = ""
    if quality_check.qc_type == "design_qc" && quality_check.status == true
      @content = "Initiate Line Marking. Please ignore if already initiated."
    end
    mail(to: designer_emal, subject: "New #{quality_check.qc_type.titleize} is created for Project - #{@project.name}")
  end

  def dispatch_schedule(dispatch_schedule,clubbed_ids)
    @dispatch_schedule = dispatch_schedule
    emails = Rails.env.production? ? ["logistics@arrivae.com", "jayesh@arrivae.com"] : ["abhinav@gloify.com"]
    @dispatch_schedule.contents&.each do |file|
      mail.attachments[file.document_file_name] = Paperclip.io_adapters.for(file.document).read
    end
    @job_element = @dispatch_schedule.unscoped_job_element
    @purchase_order = @dispatch_schedule.unscoped_job_element.unscoped_purchase_elements.last.purchase_order
    if clubbed_ids.present?
      clubbed_count = clubbed_ids.map{|id| JobElement.find(id)}.map(&:quantity).compact.sum
    else
      clubbed_count = 0
    end
    @quantity = @job_element.quantity + clubbed_count
    mail(to: emails, subject: "Dispatch Request Raised")
  end

  def office_project_assign_mail(assigned_user, assigned_project)
    if Rails.env == "production"
      emails = []
      emails << assigned_user.email
      ccs = ["abhishek@arrivae.com", "mridul@arrivae.com"]
    else
      emails = ["jinita@arrivae.com"]
      ccs = ["abhishek@arrivae.com","sanket@arrivae.com", "suman@arrivae.com", "manish@arrivae.com", "nikhil@arrivae.com"]
    end

  	@name = assigned_user.name
    @project_name = assigned_project.name
    
    mail(to: emails, subject: "Assigned Project", cc: ccs)

    
  end

  def office_payment_40_mail(user,payment,quotation)
    lead = quotation.project.lead
    @name = user.name
    @lead_id = lead.id
    @lead_name = lead.name
    @boq_number = quotation.reference_number
    @boq_value = quotation.net_amount&.round(2)
    @payment_added_date = payment.created_at.strftime("%d %B %Y")
    @payment_verification = Time.now.strftime("%d %B %Y")
    if Rails.env == "production"
      emails = []
      emails << user.email
      ccs = ["abhishek@arrivae.com", "mridul@arrivae.com"]
    else
      emails = ["jinita@arrivae.com"]
      ccs = ["abhishek@arrivae.com","sanket@arrivae.com", "suman@arrivae.com", "manish@arrivae.com", "nikhil@arrivae.com"]
    end
    mail(to: emails, subject: "40% Payment has been added", cc: ccs)
  end

private
  def prevent_delivery_to_dummyemails
    if @lead_to_check&.has_dummy_email?
      mail.perform_deliveries = false
    end
  end
end
