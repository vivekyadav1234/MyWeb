# == Schema Information
#
# Table name: performa_invoices
#
#  id                     :integer          not null, primary key
#  quotation_id           :integer
#  vendor_id              :integer
#  amount                 :float
#  description            :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  base_amount            :float            default(0.0)
#  tax_percent            :float            default(0.0)
#  pi_upload_file_name    :string
#  pi_upload_content_type :string
#  pi_upload_file_size    :integer
#  pi_upload_updated_at   :datetime
#  purchase_order_id      :integer
#

class PerformaInvoice < ApplicationRecord
  belongs_to :vendor
  belongs_to :quotation
  belongs_to :purchase_order

  # has_many :purchase_order_performa_invoices
  # has_many :purchase_orders, through: :purchase_order_performa_invoices
  has_many :payments, as: :ownerable
  has_many :pi_payments
  has_many :performa_invoice_files
  before_validation :ensure_reference_presence

  #before_save :populate_amount

  has_attached_file :pi_upload, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :pi_upload

  # return all PIs that haven't had all payments completed
  def self.payment_release_remaining
    ids = self.all.find_all{ |pi|
      pi.payment_status != 'done'
    }.pluck(:id)

    self.where(id: ids)
  end

  # return all PIs for which there haven't been any PiPayments released (pi_payment status irrelevant)
  def self.with_no_pi_payment
    self.left_outer_joins(:pi_payments).where(pi_payments: {id: nil}).distinct
  end

  # def populate_amount
  #   self.amount = base_amount * (1 + tax_percent/100.0)
  # end

  def ensure_reference_presence
    self.reference_no = generate_reference_number if self.reference_no.blank?
  end

  def generate_reference_number
    sno = PerformaInvoice.count + 1

    10000.times do
      ref_no = "PI/#{Date.today.year}/#{sno}"
      if PerformaInvoice.find_by(reference_no: ref_no).present?
        sno += 1
        next
      else
        return ref_no
      end
    end

    # Even looping 10000 times didn't help. Generate a random ref no now.
    return "BOQ/#{Date.today.year}/R#{rand(PerformaInvoice.count+1..1000000)}"
  end

  def payment_status
    pi_payments.approved.map{|pi_payment| pi_payment.total_amount}.sum < amount ? 'pending' : 'paid'
  end

  def tax_amount
    base_amount.to_f * tax_percent.to_f/100
  end

  def total_amount
    purchase_order.total_amount
  end

  def base_value
    purchase_order.base_value
  end

  def tax_value
    purchase_order.tax_value
  end

  def balance
    (self.total_amount - pi_payments.not_rejected.pluck(:amount).compact.sum).round(2)
  end
end
