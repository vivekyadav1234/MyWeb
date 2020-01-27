class PaymentInvoice < ApplicationRecord
  belongs_to :project
  has_many :invoice_line_items, dependent: :destroy
  has_many :boqjobs, through: :invoice_line_items, source: :line_item, source_type: 'Boqjob'
  has_many :modular_jobs, through: :invoice_line_items, source: :line_item, source_type: 'ModularJob'
  has_many :appliance_jobs, through: :invoice_line_items, source: :line_item, source_type: 'ApplianceJob'
  has_many :custom_jobs, through: :invoice_line_items, source: :line_item, source_type: 'CustomJob'
  has_many :extra_jobs, through: :invoice_line_items, source: :line_item, source_type: 'ExtraJob'
  has_many :service_jobs, through: :invoice_line_items, source: :line_item, source_type: 'ServiceJob'
  has_many :shangpin_jobs, through: :invoice_line_items, source: :line_item, source_type: 'ShangpinJob'

  before_validation :ensure_invoice_number, if: :is_final_invoice?

  scope :invoice_labels, -> { where(is_parent_invoice: false) }
  scope :invoices, -> {where(is_parent_invoice: true)}
  has_attached_file :document, :default_url => "/images/:style/missing.png"
  validates_attachment_content_type :document, content_type: ['application/pdf']
  
  has_many :child_invoices,dependent: :destroy, class_name: 'PaymentInvoice', foreign_key: :parent_invoice_id
  belongs_to :parent_invoice, class_name: "PaymentInvoice"

  def is_final_invoice?
    self.is_parent_invoice
  end

  def ensure_invoice_number
    self.invoice_number = generate_invoice_number if self.invoice_number.blank?
  end

  def generate_invoice_number
    return "INV/SING/#{PaymentInvoice.invoices&.last&.id.to_i + 1}"
  end

  def generate_invoice_pdf(invoice_info)
    invoice_content = PaymentInvoicePdf.new(self, invoice_info)
    filepath = Rails.root.join("tmp","invoice.pdf")
    invoice_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  def update_project_invoice_status
    quotations = self.project.quotations.where("paid_amount >= total_amount*0.45 OR per_50_approved_by_id IS NOT NULL").where(wip_status: "10_50_percent").joins(:payments).where(payments: {is_approved: true, payment_stage: "final_payment"})
    quotations.each do |quotation|
      boq_jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a + quotation.shangpin_jobs.to_a
      boq_jobs.each do |boq_job|
        if boq_job.invoice_line_item&.blank? || boq_job.payment_invoice&.status != "released"
          return 
        end
      end
    end
    self.project.update(is_invoice_completed: true)
  end

  def set_invoice_amount
    amount = self.invoice_line_items.map{|invoice_line_item| invoice_line_item.line_item.amount}.sum
  end      
end
