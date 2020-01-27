# == Schema Information
#
# Table name: payments
#
#  id                  :integer          not null, primary key
#  project_id          :integer
#  quotation_id        :integer
#  payment_type        :string
#  amount_to_be_paid   :float
#  mode_of_payment     :string
#  bank                :string
#  branch              :string
#  date_of_checque     :date
#  amount              :float
#  date                :datetime
#  is_approved         :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  payment_status      :string
#  image_file_name     :string
#  image_content_type  :string
#  image_file_size     :integer
#  image_updated_at    :datetime
#  remarks             :string
#  payment_stage       :string
#  transaction_number  :string
#  ownerable_id        :integer
#  ownerable_type      :string
#  description         :string
#  finance_approved_at :datetime
#

class Payment < ApplicationRecord
  has_paper_trail
  belongs_to :project
  belongs_to :ownerable, polymorphic: true
  has_many :quotation_payments
  has_many :quotations, through: :quotation_payments, dependent: :destroy



  has_attached_file :image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  validates_presence_of :amount

  PAYMENT_STAGE = ["pre_10_percent", "10_50_percent", "final_payment"]

  validates_inclusion_of :payment_stage, in: PAYMENT_STAGE

  scope :done, ->{ where(payment_status: 'done') }

  def split_payment(quotations_id)
    paid_amount = self.amount
    quotations = Quotation.where(id: quotations_id)
    # total_quotation_amount = quotations.pluck(:total_amount).sum.to_f
    total_pending_amount = quotations.map{|quotation| quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount}.sum
    q_per_array = []
    initial_payment_present = false
    ten_to_50_per_payment_present = false
    quotations.each_with_index do |q, i|
      if i == quotations.count - 1
        q_per = 1 - q_per_array.sum
      else
        q_per = ((q.paid_amount.present? ? q.total_amount - q.paid_amount : q.total_amount)/total_pending_amount).to_f
      end
      q_per_array.push q_per
      amount_to_add = q_per * paid_amount
      amount_to_add = amount_to_add.nan? ? 0 : amount_to_add
      self.quotation_payments.where(quotation_id: q).update(amount: amount_to_add)
      q.paid_amount = q.paid_amount.to_f + amount_to_add
      q.payment_50_comp_date = Time.zone.now if q.payment_percent_done?(50)
      q.save!

      # @task_set = TaskEscalation.mark_done_task("Payment Verification", "10% - 40%", q) if quotation.parent_quotation&.is_approved

      # @task_set = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.where(task_name: "Payment Verification"), status: "no")

      if q.wip_status == "pre_10_percent"
        @task_set = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by(task_name: "Payment Verification", stage: "10 %"), status: "no")
        @task_set.update(status: "yes", completed_at: DateTime.now) if @task_set.present?
        if (q.paid_amount > 0.07 * q.total_amount)
          @cm_approval = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by_task_name("CM Approval for less than 10% Payment"), status: "no")
          @cm_approval.destroy if @cm_approval.present?

          q.clone if !q.copied
          new_boq = q.child_quotations.last
          @task_set_final = TaskEscalation.find_by(ownerable: new_boq, task_set: TaskSet.find_by_task_name("Create Final BOQ"))
          TaskEscalation.invoke_task(["Create Final BOQ"], "10% - 40%", new_boq) if !@task_set_final.present?
          TaskEscalation.mark_done_task("Create Final BOQ", "10% - 40%", new_boq) if !@task_set_final.present?
          new_boq.update(wip_status: "10_50_percent")
          # @task_of_site_measurement = TaskEscalation.find_by(ownerable: q.project, task_set: TaskSet.find_by_task_name("Request site measurement"))
          # TaskEscalation.invoke_task(["Request site measurement"], "10% - 40%", q.project) if !@task_of_site_measurement
        else
          UserNotifierMailer.less_payment_approved(q).deliver_now
          @cm_approval = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by_task_name("CM Approval for less than 10% Payment"))
          TaskEscalation.invoke_task(["CM Approval for less than 10% Payment"], "10 %", q) if !@cm_approval.present?
        end

        initial_payment_present = true
      elsif q.wip_status == "10_50_percent" && self.payment_stage == "10_50_percent"

        @task_set = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by(task_name: "Payment Verification", stage: "10% - 40%"), status: "no")
        TaskEscalation.mark_done_task("Payment Verification", "10% - 40%", q) if @task_set.present?
        @cm_approval = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by_task_name("CM Approval for less than 40% Payment"))

        if q.paid_amount > 0.45*q.total_amount
          @cm_approval.update(status: "yes") if @cm_approval.present? && @cm_approval.status == "no"
          @sli_task = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by_task_name("SLI Creation"))
          TaskEscalation.invoke_task(["SLI Creation"], "50 %", q) if @sli_task.blank?
          # @cm_approval = TaskEscalation.find_by(ownerable: q, task_set: TaskSet.find_by_task_name("CM Approval for less than 40% Payment"), status: "no")
          # @cm_approval.destroy if @cm_approval.present?
          # q.update(wip_status: "50_percent")
        else
          UserNotifierMailer.less_payment_approved(q).deliver_later!
          TaskEscalation.invoke_task(["CM Approval for less than 40% Payment"], "10% - 40%", q) if !@cm_approval.present?
        end
        ten_to_50_per_payment_present = true
      end

    end
    project_sub_status = Project::ALLOWED_SUB_STATUSES
    initial_payment_status = project.site_measurement_requests.where(request_status: "complete").present? ?  "site_measurement_done" : "initial_payment_recieved"
    project.update_column("sub_status", initial_payment_status) if initial_payment_present && (project_sub_status.index(initial_payment_status) > project_sub_status.index(project.sub_status).to_i)
    project.update_column("sub_status", "40%_payment_recieved") if ten_to_50_per_payment_present && (project_sub_status.index("40%_payment_recieved") > project_sub_status.index(project.sub_status).to_i)
  end

  def self.daily_payment_report
    quotation_payments =  QuotationPayment.where(created_at: 1.day.ago..Time.now)
    package = Axlsx::Package.new
    daily_payment_report = package.workbook
    sheet = daily_payment_report.add_worksheet(:name => "Daily Payment Report")

    header_names = ["Sr No","Client ID", "Client", "City", "MKW/FHI", "Community manager", "Designer","Initial BOQ Number", "Initial BOQ Value", "10% payment ID", "10% date", "10% Amount", "Finance status-initial","Final BOQ Number", "Final BOQ value", "40% payment ID", "40% date", "40% value", "Finance status-final"]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end
    sheet.add_row header_names
    sr_no = 1

    quotation_payments.find_each do |quotation_payment|

      quotation = quotation_payment.quotation
      project = quotation.project
      designer = project.assigned_designer
      lead = project.lead
      cm = lead.assigned_cm

      initial_quotation = quotation.wip_status == "pre_10_percent" ? quotation : quotation.parent_quotation

      ten_percent_amount = initial_quotation.quotation_payments.select{|qp| qp.payment.payment_stage == "pre_10_percent"}.pluck(:amount).compact.sum
      ten_percent_payment = initial_quotation.quotation_payments.map{|qp| qp.payment if qp.payment.payment_stage == "pre_10_percent"}.last
      
      row_array = []

        row_array[headers["Sr No"]] = sr_no
        row_array[headers["Client ID"]] = lead.id
        row_array[headers["Client"]] = lead.name
        row_array[headers["City"]] = lead.city
        row_array[headers["MKW/FHI"]] = lead.tag&.name&.humanize
        row_array[headers["Community manager"]] = cm.name
        row_array[headers["Designer"]] = designer.name
        row_array[headers["Initial BOQ Number"]] = initial_quotation.reference_number
        row_array[headers["Initial BOQ Value"]] = initial_quotation.total_amount.round(2)
        row_array[headers["10% payment ID"]] =  ten_percent_payment&.id
        row_array[headers["10% date"]] =  ten_percent_payment&.created_at
        row_array[headers["10% Amount"]] = ten_percent_amount&.round(2) 
        row_array[headers["Finance status-initial"]] = ten_percent_payment&.is_approved ? "Approved" : ten_percent_payment&.is_approved == nil ? "pending" : "Rejected" 

        if quotation.wip_status == "10_50_percent"
          fourty_percent_amount = quotation.quotation_payments.select{|qp| qp.payment.payment_stage == "10_50_percent"}.pluck(:amount).compact.sum
          fourty_percent_payment = quotation.quotation_payments.map{|qp| qp.payment if qp.payment.payment_stage == "10_50_percent"}.last
          row_array[headers["Final BOQ Number"]] = quotation&.reference_number
          row_array[headers["Final BOQ value"]] = quotation&.total_amount.round(2)
          row_array[headers["40% payment ID"]] = fourty_percent_payment&.id
          row_array[headers["40% date"]] = fourty_percent_payment&.created_at
          row_array[headers["40% value"]] = fourty_percent_amount&.round(2)
          row_array[headers["Finance status-final"]] = fourty_percent_payment&.is_approved? ? "Approved" : fourty_percent_payment&.is_approved == nil ? "pending" : "rejected"
        end

        sr_no +=1

        sheet.add_row row_array
    end
    file_name = "Payment-Report-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    UserNotifierMailer.daily_payment_report(filepath, file_name).deliver_now
    File.delete(filepath) if File.exist?(filepath)
  end

  def self.dp_payout_payment_report(user)
    quotations = Quotation.where(status: "shared")
    quotation_payments = QuotationPayment.joins(:payment).where(payments: {is_approved: true})
    package = Axlsx::Package.new
    payment_boq_spread_sheet = package.workbook
    sheet = payment_boq_spread_sheet.add_worksheet(:name => "DP Layout Payment-Report")
    header_names = [
      "Lead ID",
      "Lead Source",
      "Lead Campaign",
      "Fast Track",
      "App",
      "Referral Partner Type",
      "Referral Partner Name",
      "MKW/FHI",
      "Digital/Physical",
      "Designer",
      "Customer Name",
      "CM Name",
      "Designer Name",
      "Initial BOQ Number",
      "Initial BOQ Sharing Date",
      "Initial BOQ Value",
      "Initial BOQ Discount",
      "Initial BOQ Total Value",
      "Payment added against Intial BOQ and Verified by Finance",
      "Final BOQ Number",
      "Final BOQ Sharing Date",
      "Final BOQ Value",
      "Final BOQ Discount",
      "Final BOQ Total Value",
      "Payment added against Final BOQ and Verified by Finance",
      "Payment Addition Date",
      "Payment Verification Date",
      "Stage of BOQ",
      'Referral name',
      'Referral Type',
      "Total Payment Received Till Date"
    ]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end

    sheet.add_row header_names

    quotations.each do |quotation|
      project = quotation.project
      designer = project.assigned_designer
      lead = project.lead
      cm = lead.assigned_cm
      proposal = quotation.proposals.last

      initial_quotation = quotation.wip_status == "pre_10_percent" ? quotation : quotation.parent_quotation

      stage = ""
      if quotation.wip_status == "pre_10_percent"
        stage = 'Initial'
      elsif quotation.wip_status == "10_50_percent"
        stage = 'final'
      else
         stage = " "
      end

      lead_source = lead.lead_source&.name
      lead_campaign = lead.lead_campaign&.name
      fast_track = lead.from_fasttrack_page? ? "Yes" : "No"
      app = lead.source ==  "app" ? "Yes" : "No"
      referrar_partner_type = lead.referrer_type&.humanize
      referrer_partner_name = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      mkw_fhi = lead.tag&.name == "both" ? "Full Home" :  lead.tag&.name&.humanize
      digital_physical = lead.digital_physical?
      designer_type = lead.project&.assigned_designer&.internal? ? "Internal" : "Externals"

      row_array = []
      row_array[headers["Lead ID"]] = lead.id

      row_array[headers["Lead Source"]] = lead_source
      row_array[headers["Lead Campaign"]] = lead_campaign
      row_array[headers["Fast Track"]] = fast_track
      row_array[headers["App"]] = app
      row_array[headers["Referral Partner Type"]] = referrar_partner_type
      row_array[headers["Referral Partner Name"]] = referrer_partner_name
      row_array[headers["MKW/FHI"]] = mkw_fhi
      row_array[headers["Digital/Physical"]] = digital_physical
      row_array[headers["Designer"]] = designer_type

      row_array[headers["Customer Name"]] = lead.name
      row_array[headers["CM Name"]] = cm.name
      row_array[headers["Designer Name"]] = designer.name
      row_array[headers["Initial BOQ Number"]] = initial_quotation&.reference_number
      row_array[headers["Initial BOQ Sharing Date"]] = initial_quotation&.proposals&.last&.sent_at&.strftime("%Y-%m-%d:%I:%M:%S%p")
      row_array[headers["Initial BOQ Value"]] = initial_quotation&.net_amount
      row_array[headers["Initial BOQ Discount"]] = initial_quotation&.discount_value
      row_array[headers["Initial BOQ Total Value"]] = initial_quotation&.total_amount
      row_array[headers["Payment added against Intial BOQ and Verified by Finance"]] =  quotation_payments.find_by(quotation_id: initial_quotation).amount   if quotation_payments.find_by(quotation_id: initial_quotation).present?
      if quotation.wip_status == '10_50_percent'
        row_array[headers["Final BOQ Number"]] = quotation.reference_number
        row_array[headers["Final BOQ Sharing Date"]] = proposal.sent_at&.strftime("%Y-%m-%d:%I:%M:%S%p")
        row_array[headers["Final BOQ Value"]] = quotation.net_amount
        row_array[headers["Final BOQ Discount"]] = quotation.discount_value
        row_array[headers["Final BOQ Total Value"]] = quotation&.total_amount
        row_array[headers["Payment added against Final BOQ and Verified by Finance"]] = quotation_payments.find_by(quotation_id: quotation).amount if quotation_payments.find_by(quotation_id: quotation).present?
      end
      row_array[headers["Payment Addition Date"]] = quotation_payments.find_by(quotation_id: quotation).payment.created_at&.strftime("%Y-%m-%d:%I:%M:%S%p")  if quotation_payments.find_by(quotation_id: quotation)&.payment
      row_array[headers["Payment Verification Date"]] = quotation_payments.find_by(quotation_id: quotation).payment.finance_approved_at&.strftime("%Y-%m-%d:%I:%M:%S%p")  if quotation_payments.find_by(quotation_id: quotation)&.payment
      row_array[headers["Stage of BOQ"]] = stage
      if quotation.wip_status == '10_50_percent' && quotation.parent_quotation.present?
        row_array[headers["Total Payment Received Till Date"]] = (quotation.parent_quotation.paid_amount  + quotation_payments.where(quotation_id: quotation.id).pluck(:amount).compact.sum).round(2)
      elsif quotation.child_quotations.present?
        row_array[headers["Total Payment Received Till Date"]] = quotation.child_quotations.pluck(:paid_amount).compact.sum.round(2)
      else
        row_array[headers["Total Payment Received Till Date"]] = quotation_payments.where(quotation_id: quotation.id).pluck(:amount).compact.sum.round(2)
        #quotation.payments.where(is_approved: true).pluck(:amount).compact.sum.round(2)
      end
      row_array[headers['Referral name']] = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      row_array[headers['Referral Type']] = lead.referrer_type
      sheet.add_row row_array
    end

    file_name = "DP-Payment-Report-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp", file_name)
    package.serialize(filepath)
    ReportMailer.dp_payout_payment_report_email(filepath, file_name, user).deliver!
    File.delete(filepath) if File.exist?(filepath)
  end

  def self.payment_excel_to_download(user, quotation_ids)
    quotation_payments =  quotation_ids.present? ? QuotationPayment.where(quotation_id: quotation_ids) : QuotationPayment.all
    package = Axlsx::Package.new
    payment_boq_spread_sheet = package.workbook
    sheet = payment_boq_spread_sheet.add_worksheet(:name => "BOQ Report")

    header_names = [
      "Payment ID",
      "Payment addition timestamp",
      "Payment addition Time",
      "Payment addition Date",
      "Payment value",
      "Proportionate Value",
      "Name of designer",
      "Name of CM",
      "lead id",
      "Lead name",
      "Lead Qualification Date",
      "Lead Source",
      "Lead Campaign",
      "Fast Track",
      "App",
      "Referral Partner Type",
      "Referral Partner Name",
      "MKW/FHI",
      "Digital/Physical",
      "Designer",
      "Initial / Final",
      "Mode of payment",
      "Date of Cheque",
      "Finance status - Approved/rejected",
      "Finance verification timestamp",
      "Finance verification Time",
      "Finance verification Date",
      "Quotation Reference number",
      "Quotation value",
      "Quotation Sharing timestamp",
      "Quotation Sharing Time",
      "Quotation Sharing Date",
      'Referral name',
      'Referral Type',
      "status"
    ]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end
    sheet.add_row header_names
    # byebug

    quotation_payments.find_each do |quotation_payment|
      quotation = quotation_payment.quotation
      project = quotation.project
      designer = project.assigned_designer
      lead = project.lead
      cm = lead.assigned_cm
      proposal = quotation.proposals.last
      payment = quotation_payment.payment

      quotations = payment.quotations

      paid_amount = payment.amount
      added_amount = quotation_payment.amount
      quotations = payment.quotations

      # total_quotation_amount = quotations.pluck(:total_amount).sum.to_f

      total_pending_amount = quotations.map{|quotation| quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount}.sum

      q_per = ((quotation.paid_amount.present? ? quotation.total_amount - quotation.paid_amount : quotation.total_amount)/total_pending_amount).to_f

      amount_to_add = added_amount.present? ? added_amount : q_per * paid_amount

      stage = ""
      if payment.payment_type == "initial_design"
        stage = 'Initial'
      elsif payment.payment_type == "final_design"
        stage = '40% Payment'
      elsif payment.payment_type == "final_payment"
         stage = 'Final'
      end

      lead_source = lead.lead_source&.name
      lead_campaign = lead.lead_campaign&.name
      fast_track = lead.from_fasttrack_page? ? "Yes" : "No"
      app = lead.source ==  "app" ? "Yes" : "No"
      referrar_partner_type = lead.referrer_type&.humanize
      referrar_partner_type = lead.referrer_type&.humanize
      referrer_partner_name = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      mkw_fhi = lead.tag&.name == "both" ? "Full Home" :  lead.tag&.name&.humanize
      digital_physical = lead.digital_physical?
      designer_type = lead.project&.assigned_designer&.internal? ? "Internal" : "Externals"


      row_array = []
      row_array[headers["Payment ID"]] = payment.id
      row_array[headers["Payment addition timestamp"]] = payment.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Payment addition Time"]] = payment.created_at.strftime("%I:%M:%S %p")
      row_array[headers["Payment addition Date"]] = payment.created_at.strftime("%d-%m-%Y")
      row_array[headers["Payment value"]] = payment.amount
      row_array[headers["Name of designer"]] = designer.name
      row_array[headers["Name of CM"]] = cm.name
      row_array[headers["lead id"]] = lead.id
      row_array[headers["Lead name"]] = lead.name
      row_array[headers["Lead Qualification Date"]] = project.created_at.strftime("%d-%m-%Y")
      row_array[headers["Lead Source"]] = lead_source
      row_array[headers["Lead Campaign"]] = lead_campaign
      row_array[headers["Fast Track"]] = fast_track
      row_array[headers["App"]] = app
      row_array[headers["Referral Partner Type"]] = referrar_partner_type
      row_array[headers["Referral Partner Name"]] = referrer_partner_name
      row_array[headers["MKW/FHI"]] = mkw_fhi
      row_array[headers["Digital/Physical"]] = digital_physical
      row_array[headers["Designer"]] = designer_type

      row_array[headers["Initial / Final"]] = stage
      row_array[headers["Mode of payment"]] = payment.mode_of_payment
      row_array[headers["Finance status - Approved/rejected"]] = payment.is_approved? ? "Approved" : payment.is_approved == nil ? "Pending" : "Rejected"
      row_array[headers["Finance verification timestamp"]] = payment.finance_approved_at&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Finance verification Time"]] = payment.finance_approved_at&.strftime("%I:%M:%S %p")
      row_array[headers["Finance verification Date"]] = payment.finance_approved_at&.strftime("%d-%m-%Y")
      row_array[headers["Quotation Reference number"]] = quotation.reference_number
      row_array[headers["Quotation value"]] = quotation.total_amount.to_f.round(2)
      row_array[headers["Quotation Sharing timestamp"]] = proposal.sent_at&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Quotation Sharing Time"]] = proposal.sent_at&.strftime("%I:%M:%S %p")
      row_array[headers["Quotation Sharing Date"]] = proposal.sent_at&.strftime("%d-%m-%Y")
      row_array[headers["status"]] = quotation.status
      row_array[headers["Date of Cheque"]] = payment.date_of_checque
      row_array[headers['Referral name']] = User.find_by(id: lead.referrer_id).name  if lead.referrer_id.present?
      row_array[headers['Referral Type']] = lead.referrer_type
      row_array[headers["Proportionate Value"]] = amount_to_add.round(2) #quotation.quotation_payments.find_by_payment_id(payment.id).amount

      sheet.add_row row_array
    end

    file_name = "BOQ-Payment-Report-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp", file_name)
    package.serialize(filepath)
    ReportMailer.payment_report_email(filepath, file_name, user).deliver!
    File.delete(filepath) if File.exist?(filepath)
  end

  # def self.payment_ledger
  #   quotations =  QuotationPayment.all

  # end

end
