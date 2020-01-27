class ReportMailer < ApplicationMailer
  default :from => 'wecare@arrivae.com'
  after_action :prevent_delivery_to_dummyemails

  def boq_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    @lead_to_check = @user
    attachments[file_name] = File.read(file_path)
    mail( :to => @user.email,
    :subject => "BOQ Report.")
  end

  def call_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    @lead_to_check = @user
    attachments[file_name] = File.read(file_path)
    mail( :to => @user.email,
    :subject => "Call Report.")
  end

  def gm_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    emails = []
    if Rails.env.production?
      emails << [@user.email, "abhishek@arrivae.com"]
    else
      emails << [@user.email, "abhinav@gloify.com"]
    end
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "GM Data Report.")
  end

  def released_po_cost_alert(quotation, released_po_ids)
    @lead = quotation.project.lead
    @quotation = quotation
    @released_pos = PurchaseOrder.where(id: released_po_ids)
    emails = []
    if Rails.env.production?
      emails << ["hardik@arrivae.com", "abhishek@arrivae.com", "deepanshu@arrivae.com", "rajesh@arrivae.com"]
    else
      emails << ["abhinav@gloify.com"]
    end
    mail( :to => emails,
    :subject => "#{@quotation.reference_number} - Alert! PO Released amount crossed more than 65% of BOQ Amount")
  end

  def custom_element_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    emails = []
    if Rails.env.production?
      emails << @user.email
    else
      emails << [@user.email, "abhinav@gloify.com"]
    end
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "Custom Element Data Report.")
  end

  def payment_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    @lead_to_check = @user
    attachments[file_name] = File.read(file_path)
    mail( :to => @user.email,
    :subject => "Payment Report.")
  end

  def margin_report_email(file_path,file_name,user)
    @file_path = file_path
    @user = user
    emails = []
    if Rails.env.production?
      emails << @user.email
    else
      emails << @user.email
      emails << "abhinav@gloify.com"
    end
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
          :subject => "Margin-Report")
  end

  def dp_payout_payment_report_email(file_path, file_name, user)
    @file_path = file_path
    @user = user
    @lead_to_check = @user
    emails = []
    if Rails.env.production?
      emails << @user.email
    else
      emails << @user.email
      emails << "abhinav@gloify.com"
    end
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "DP Payout Payment Report.")
  end

  def skipped_lead_list(lead_ids)
    @lead_ids = lead_ids
    mail( :to => "arrivae@gloify.com",
    :subject => "[IMPORTANT] The Following Leads information is skipped in Report")
  end

  def converted_excel_files(file_path, file_name, emails)
    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
    :subject => "converted excel")
  end

  def panel_olt_report(file_path, file_name, email)
    emails = [email]
    emails << "abhinav@gloify.com" if Rails.env.qa?
    @file_path = file_path
    attachments[file_name] = File.read(file_path)
    mail( :to => emails.join(","),
    :subject => "Panel OLT Report")
  end

  def panel_olt_status_email(email=nil)
    email ||= 'category@arrivae.com'
    mail(
      to: emails,
      subject: 'Panel OLT Status'
      )
  end

  private
  def prevent_delivery_to_dummyemails
    if @lead_to_check&.has_dummy_email?
      mail.perform_deliveries = false
    end
  end
end
