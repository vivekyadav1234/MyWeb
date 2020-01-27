# == Schema Information
#
# Table name: purchase_orders
#
#  id                     :integer          not null, primary key
#  project_id             :integer
#  quotation_id           :integer
#  status                 :string           default("pending")
#  contact_person         :string
#  contact_number         :string
#  shipping_address       :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  vendor_id              :integer
#  billing_address        :string
#  billing_contact_person :string
#  billing_contact_number :string
#  vendor_gst             :string
#  modifying              :boolean          default(FALSE)
#  movement               :string
#  release_count          :integer          default(0)
#  tag_snag               :boolean          default(FALSE), not null
#

class PurchaseOrder < ApplicationRecord

  belongs_to :project
  belongs_to :quotation
  belongs_to :vendor

  has_many :purchase_elements, dependent: :destroy
  has_many :job_element_vendors, through: :purchase_elements
  has_many :milestones, as: :milestone_object, dependent: :destroy
  #has_many :purchase_order_performa_invoices
  #has_many :performa_invoices, through: :purchase_order_performa_invoices
  has_one :performa_invoice
  has_many :job_elements, through: :job_element_vendors

  STATUSES = ["pending", "released", "cancelled", "modified"]
  BILLING_ADDRESS = "501/502 Everest House 213/1, Suren Road, Gundavali, Andheri East, Mumbai- 400093"

  validates_uniqueness_of :reference_no, allow_blank: true
  validates_inclusion_of :status, in: STATUSES

  # validates :shipping_address, presence: true

  validate :check_vendor_gst #check for Vendor GST No.

  before_save :parameterize_movement

  def payment_approved_or_pending?
    pi = PerformaInvoice.where(quotation_id: self.quotation_id, vendor_id: self.vendor_id, purchase_order_id: self.id).first_or_create
    payments = pi.pi_payments
    if payments.present?
      payment_statutes = payments.pluck(:payment_status)
      return (payment_statutes.compact.uniq.include? 'approved') || (payment_statutes.compact.uniq.include? 'pending')
    else
      false
    end
  end

  def mt_present?
    #dispatch_schedule s je
    job_elements = self.job_elements
    dispatch_present = job_elements.detect {|je| je.dispatch_schedules.present? }
    quality_check_present = job_elements.detect {|je| je.quality_checks.present? }
    readiness_present = job_elements.detect {|je| je.dispatch_readinesses.present? }
    states_present = job_elements.detect {|je| je.delivery_states.present? }
    [dispatch_present,quality_check_present,readiness_present,states_present].compact.uniq.length > 0
  end

  def generate_purchase_order_pdf(user, filepath)
    purchase_order_content = PurchaseOrderPdf.new(self, user)

    File.new(filepath, "w") {}
    purchase_order_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  def consignor_address
    [vendor.address, vendor.city].join(", ")
  end

  def consignor_name
    vendor.name
  end

  def get_job_elements_for_club_view
    job_elements.joins(vendor_product: :vendor).group_by{|e| [e.sli_code, e.unit, e.vendor_product.vendor_id]}
  end

  def payment_made_to_vendor
    payments = self.performa_invoice&.pi_payments&.where(payment_status: 'approved')
    amount = payments.pluck(:amount).compact.sum if payments.present?
  end

  def date_of_payment_to_vendor
    last_payment = self.performa_invoice&.pi_payments&.where(payment_status: 'approved')&.last
    last_payment.updated_at if last_payment.present?
  end

  # Here you will get line items of PO with clubbed view
  def po_line_item_details
    @purchase_order = self
    @project = @purchase_order.project || @purchase_order.quotation.project
    @purchase_elements = @purchase_order.purchase_elements
    @vendor = @purchase_order.vendor

    final_array = []
    sn_no = 1


    @slis_with_vendor_products = @purchase_elements.joins(job_element_vendor: [job_element: :vendor_product])
    @clubed_job_elements = @slis_with_vendor_products.group_by{|e| [e.job_element_vendor.job_element.vendor_product.sli_code]}
    @custom_purchase_elements = @purchase_elements.where.not(id: @slis_with_vendor_products.ids)

    @custom_purchase_elements.each do |purchase_element|
      job_element_vendor = purchase_element.job_element_vendor
      job_element = job_element_vendor.job_element
      if job_element_vendor.tax_type == "cgst_sgst"
        tax_value = job_element_vendor.tax_percent / 2
        cgst_percent = tax_value
        sgst_percent = tax_value
        igst_percent = "N/A"

        cgst_sgst_amount = ((job_element_vendor.cost * job_element_vendor.quantity) * tax_value) / 100 rescue 0
        cgst_sgst_amount = cgst_sgst_amount.round(2)
        igst_amount = "N/A"
      else
        cgst_percent = "N/A"
        sgst_percent = "N/A"
        igst_percent = job_element_vendor.tax_percent

        cgst_sgst_amount = "N/A"
        igst_amount = ((job_element_vendor.cost * job_element_vendor.quantity )* igst_percent) / 100 rescue 0
        igst_amount = igst_amount.round(2)
      end

      @amount = job_element_vendor.cost * (job_element_vendor.quantity || 1)
      @amount =  @amount + ( @amount * job_element_vendor.tax_percent / 100 ) if job_element_vendor.tax_percent.present?

      final_array << { job_element_name: "#{job_element.element_name} #{job_element_vendor.description}",uom: job_element_vendor.unit_of_measurement&.humanize,
        quantity: job_element_vendor.quantity.to_f.round(2),rate: job_element_vendor.cost.to_f.round(2),sgst: sgst_percent,cgst: cgst_percent,
        igst: igst_percent,amount: @amount.to_f.round(2), cgst_sgst_amount: cgst_sgst_amount.to_f.round(2), igst_amount: igst_amount.to_f.round(2),
        tax_type: job_element_vendor.tax_type, tax_percent: job_element_vendor.tax_percent}
    end


    @clubed_job_elements.each do |clubed_job_elements|
      job_element_vendor = clubed_job_elements[1][0].job_element_vendor

      quantity = 0
      clubed_job_elements[1].each do |purchase_element|
        quantity += purchase_element.job_element_vendor.quantity
      end

      if job_element_vendor.tax_type == "cgst_sgst"
        tax_value = job_element_vendor.tax_percent / 2
        cgst_percent = tax_value
        sgst_percent = tax_value
        igst_percent = "N/A"

        cgst_sgst_amount = ((job_element_vendor.cost * job_element_vendor.quantity) * tax_value) / 100 rescue 0
        cgst_sgst_amount = cgst_sgst_amount.round(2)
        igst_amount = "N/A"
      else
        cgst_percent = "N/A"
        sgst_percent = "N/A"
        igst_percent = job_element_vendor.tax_percent

        cgst_sgst_amount = "N/A"
        igst_amount = ((job_element_vendor.cost * job_element_vendor.quantity )* igst_percent) / 100 rescue 0
        igst_amount = igst_amount.round(2)
      end
        @amount = job_element_vendor.cost * (quantity || 1)
        @amount =  @amount + ( @amount * job_element_vendor.tax_percent / 100 ) if job_element_vendor.tax_percent.present?
        vp = VendorProduct.find_by_sli_code(clubed_job_elements[0][0])
        final_array << {job_element_name: "#{vp.sli_name} (#{clubed_job_elements[0][0]})", uom: job_element_vendor.unit_of_measurement&.humanize,
        quantity: quantity.to_f.round(2),rate: job_element_vendor.cost.to_f.round(2), sgst: sgst_percent,cgst: cgst_percent,
        igst: igst_percent, amount: @amount.to_f.round(2),cgst_sgst_amount: cgst_sgst_amount.to_f.round(2),igst_amount: igst_amount.to_f.round(2),
        tax_type: job_element_vendor.tax_type, tax_percent: job_element_vendor.tax_percent}
    end
    final_array
  end

  def self.panel_olt_report
    @quotations = Quotation.all

    olt_headers = ["Lead ID",
    "Customer Name",
    "CM",
    "Designer",
    "BOQ Number",
    "Date of 40% Payment",
    "% of Total Payment Received",
    "SLI Name",
    "SLI Quantity",
    "SLI Unit of Measurement",
    "PO Number",
    "Tag Snag",
    "PO Release Date",
    "PO Status",
    "QC Current Status",
    "QC Status Update Date",
    "Dispatch Readiness Date",
    "Current Location",
    "Next Location",
    "Dispatch Status",
    "Delivery Status",
    "Payment Made to Vendor",
    "Payment Confirmation Date"]

    headers = Hash.new
    olt_headers.each_with_index do |n, i|
      headers[n] = i
    end

    package = Axlsx::Package.new
    olt_xlsx = package.workbook
    sheet = olt_xlsx.add_worksheet(:name => "olt report")
    sheet.add_row olt_headers

    @quotations.find_each do |quotation|
      purchase_orders = quotation.purchase_orders
      job_elements = quotation.job_elements
      lead = quotation.project.lead
      sorted_payments = []
      sorted_payments = quotation.payments.where(is_approved: true).sort_by {|payment| payment.created_at}
      amount_requied = quotation.total_amount.to_f * (0.40)
      forty_per_payment_record = nil
      sorted_payments.inject(0) do |sum, sorted_payment|
        forty_per_payment_record = sorted_payment
        sum = sum + sorted_payment.amount.to_f
        if amount_requied < sum
          break
        end
        sum
      end
      job_elements.each do |job_element|
        row_array = []
        row_array[headers["Lead ID"]] = lead.id
        row_array[headers["Customer Name"]] = lead.name
        row_array[headers["CM"]] = lead.assigned_cm.name
        row_array[headers["Designer"]] = quotation.project.assigned_designer.name
        row_array[headers["BOQ Number"]] = quotation.reference_number
        row_array[headers["Date of 40% Payment"]] = forty_per_payment_record&.created_at&.strftime("%Y-%m-%d:%I:%M:%S%p")
        row_array[headers["% of Total Payment Received"]] = ((quotation.paid_amount.to_f/quotation.total_amount.to_f) * 100).round(2)
        row_array[headers["SLI Name"]] = job_element.element_name
        row_array[headers["SLI Quantity"]] = job_element.quantity
        row_array[headers["SLI Unit of Measurement"]] = job_element.unit
        row_array[headers["PO Number"]] = job_element.purchase_elements&.last&.purchase_order&.reference_no  if job_element.purchase_elements&.last&.purchase_order
        row_array[headers["Tag Snag"]] = job_element.purchase_elements&.last&.purchase_order&.tag_snag ? "Yes" : "No"  if job_element.purchase_elements&.last&.purchase_order
        row_array[headers["PO Release Date"]] = job_element.purchase_elements.last.purchase_order.updated_at.strftime("%Y-%m-%d:%I:%M:%S%p")  if job_element.purchase_elements&.last&.purchase_order
        row_array[headers["PO Status"]] = job_element.purchase_elements&.last&.purchase_order&.modifying ? "under_modification" : job_element.purchase_elements&.last&.purchase_order&.status
        row_array[headers["QC Current Status"]] = job_element.quality_checks&.last&.qc_status
        row_array[headers["QC Status Update Date"]] = job_element.quality_checks&.last&.updated_at&.strftime("%Y-%m-%d")
        row_array[headers["Dispatch Readiness Date"]] = job_element.dispatch_readinesses&.last&.readiness_date&.strftime("%Y-%m-%d")

        delivered = ["partial", "completed"].include? job_element.delivery_states&.last&.status  if job_element.delivery_states&.last&.status
        if  ["partial", "completed"].include? job_element.delivery_states&.last&.status
          row_array[headers["Current Location"]] = job_element.dispatch_schedules&.last&.shipping_address
          row_array[headers["Next Location"]] = '-'
        elsif ["partial", "complete"].include? job_element.dispatch_schedules&.last&.status
          row_array[headers["Current Location"]] = '-'
          row_array[headers["Next Location"]] = job_element.dispatch_schedules&.last&.shipping_address
        elsif job_element.dispatch_schedules&.last&.status == 'scheduled'
          row_array[headers["Current Location"]] = job_element.job_element_vendors&.last&.vendor&.address
          row_array[headers["Next Location"]] = job_element.dispatch_schedules&.last&.shipping_address
        end
        row_array[headers["Dispatch Status"]] = job_element.dispatch_schedules&.last&.status
        row_array[headers["Delivery Status"]] = job_element.delivery_states&.last&.status
        row_array[headers["Payment Made to Vendor"]] = job_element.purchase_elements.last.purchase_order.payment_made_to_vendor  if job_element.purchase_elements&.last&.purchase_order
        row_array[headers["Payment Confirmation Date"]] = job_element.purchase_elements.last.purchase_order.date_of_payment_to_vendor&.strftime("%Y-%m-%d:%I:%M:%S%p") if job_element.purchase_elements&.last&.purchase_order

        sheet.add_row row_array
      end
    end
    file_name = "Panel-OLT-Report-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  def self.download_sli_report
    @purchase_orders = PurchaseOrder.where(status: "released")

      category_headers = ["BOQ Reference Number",
      "BOQ Value",
      "Master Line Item",
      "Type",
      "Sub Line Item",
      "Rate",
      "UoM",
      "Quantity",
      "Cost",
      "BOQ Sharing Date",
      "Vendor Name",
      "Lead ID",
      "Client Name",
      "PO Number",
      "Tag Snag",
      "Date of PO Release"]

      headers = Hash.new
      category_headers.each_with_index do |n, i|
      headers[n] = i
      end

      p = Axlsx::Package.new
      category_xlsx = p.workbook
      category_xlsx.add_worksheet(:name => "demo Worksheet") do |sheet|
      sheet.add_row category_headers

      @purchase_orders.each do |purchase_order|
        job_elements =  purchase_order.job_elements

        job_elements.each do |job_element|
          quotation = job_element.quotation
          master_line_item  =  nil
          if job_element.ownerable_type == "ClubbedJob"
            if job_element.ownerable.modular_jobs.present?
              master_line_item = job_element.ownerable.modular_jobs.pluck(:name).compact
            elsif job_element.ownerable.service_jobs.present?
              master_line_item = job_element.ownerable.modular_jobs.pluck(:name).compact
            elsif job_element.ownerable.boqjobs.present?
              master_line_item = job_element.ownerable.boqjobs.pluck(:name).compact
            elsif job_element.ownerable.custom_jobs.present?
              master_line_item = job_element.ownerable.custom_jobs.pluck(:name).compact
            elsif job_element.ownerable.appliance_jobs.present?
              master_line_item = job_element.ownerable.appliance_jobs.pluck(:name).compact
            elsif job_element.ownerable.extra_jobs.present?
              master_line_item = job_element.ownerable.extra_jobs.pluck(:name).compact
            else
              nil
            end
          else
            master_line_item = job_element.ownerable&.name
          end

          row_array = []
          row_array[headers["BOQ Reference Number"]] = quotation.reference_number
          row_array[headers["BOQ Value"]] = quotation.total_amount
          row_array[headers["Master Line Item"]] = master_line_item.to_s
          row_array[headers["Type"]] = job_element.master_line_item_type
          row_array[headers["Sub Line Item"]] = job_element.element_name
          row_array[headers["Rate"]] = job_element.rate
          row_array[headers["UoM"]] = job_element.unit&.humanize
          row_array[headers["Quantity"]] = job_element.quantity
          row_array[headers["Cost"]] = job_element.quantity * job_element.rate if job_element.rate.present? && job_element.quantity.present?
          row_array[headers["BOQ Sharing Date"]] = quotation.proposals.last&.sent_at&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers["Vendor Name"]] = job_element.vendors&.first&.name
          row_array[headers["Lead ID"]] = quotation.project.lead_id
          row_array[headers["Client Name"]] = quotation.project.lead.name
          row_array[headers["PO Number"]] = purchase_order.reference_no
          row_array[headers["Tag Snag"]] = purchase_order.tag_snag ? "Yes" : "No"
          row_array[headers["Date of PO Release"]] = purchase_order.updated_at
          sheet.add_row row_array
        end
      end
    end

    file_name = "sli_report_#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    p.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  def parameterize_movement
    self.movement = self.movement.parameterize(separator: "_") if self.movement.present?
  end

  def total_amount
    job_element_vendors.pluck(:final_amount).compact.sum.round(2)
  end

  def base_value
    job_element_vendors.map(&:base_value).sum.round(2)
  end

  def tax_value
    job_element_vendors.map(&:tax_value).sum.round(2)
  end

  def self.purchase_order_report
    purchase_orders = PurchaseOrder.where(status: "released")
    po_headers = ["Sr No",
    "Lead ID",
    "Client Name",
    "BOQ No",
    "PO Number",
    "PO Base Value",
    "PO Tax Value",
    "PO Total Value",
    "Vendor Name",
    "Vendor PAN",
    "Tag Snag",
    "Date of Raising PO"]

    headers = Hash.new
      po_headers.each_with_index do |n, i|
      headers[n] = i
    end

    package = Axlsx::Package.new
    xl_report= package.workbook
    sheet = xl_report.add_worksheet(:name => "Xl Report")
    puts "="*90
    puts headers
    puts "="*90

    sheet.add_row po_headers
    number = 1

    purchase_orders.each do |purchase_order|
      row_array = []

      row_array[headers["Sr No"]] = number
      row_array[headers["Lead ID"]] = purchase_order.project&.lead&.id
      row_array[headers["Client Name"]] = purchase_order.project&.lead&.name
      row_array[headers["Vendor Name"]] = purchase_order.vendor&.name
      row_array[headers["Vendor PAN"]] = purchase_order.vendor&.pan_no
      row_array[headers["BOQ No"]] = purchase_order.quotation&.reference_number
      row_array[headers["PO Number"]] = purchase_order.reference_no
      row_array[headers["Tag Snag"]] = purchase_order.tag_snag ? "Yes" : "No"
      row_array[headers["PO Base Value"]] = purchase_order.job_element_vendors&.map(&:base_value)&.compact.sum&.round(2)
      row_array[headers["PO Tax Value"]] = purchase_order.job_element_vendors&.map(&:tax_value)&.compact.sum&.round(2)
      row_array[headers["PO Total Value"]] = purchase_order.job_element_vendors&.pluck(:final_amount)&.compact.sum&.round(2)
      row_array[headers["Date of Raising PO"]] = purchase_order.updated_at.strftime("%Y/%m/%d - %I:%M:%S%p")

      sheet.add_row row_array
      number += 1

    end
    file_name = "PurchaseOrder-Report-#{DateTime.now.in_time_zone('Asia/Kolkata').strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  private
    def check_vendor_gst
      vendor_gsts = Vendor.find_by_id(vendor_id).gsts
      errors.add(:vendor_id, "GST does not belong to Vendor.") unless vendor_gst.in?(vendor_gsts)
    end

end
