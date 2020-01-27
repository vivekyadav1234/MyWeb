# == Schema Information
#
# Table name: pi_payments
#
#  id                      :integer          not null, primary key
#  description             :string           not null
#  remarks                 :string
#  percentage              :float            not null
#  payment_status          :string           default("pending"), not null
#  status_updated_at       :datetime
#  payment_due_date        :datetime
#  performa_invoice_id     :integer
#  created_by_id           :integer
#  approved_by_id          :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  attachment_file_name    :string
#  attachment_content_type :string
#  attachment_file_size    :integer
#  attachment_updated_at   :datetime
#  transaction_number      :string
#  amount                  :float
#

class PiPayment < ApplicationRecord
  has_paper_trail
  
  belongs_to :performa_invoice, required: true
  belongs_to :created_by, class_name: 'User', required: true
  belongs_to :approved_by, class_name: 'User', optional: true

  ALL_PAYMENT_STATUSES = ['pending', 'approved', 'rejected']

  #validates_presence_of [:description, :percentage, :payment_status] #:payment_due_date
  #validates :percentage, numericality: {greater_than: 0, less_than_or_equal_to: 100}
  validates_inclusion_of :payment_status, in: ALL_PAYMENT_STATUSES
  # validate :due_date_validity
  validate :pi_payment_not_exceed_100, on: :create

  scope :approved, ->{ where(payment_status: 'approved') }
  scope :pending, ->{ where(payment_status: 'pending') }
  scope :not_rejected, ->{ where(payment_status: ['pending', 'approved']) }
  scope :action_taken, ->{ where(payment_status: ['rejected', 'approved']) }

  scope :filter_by_vendor, -> (vendor_id) {includes(:performa_invoice).where(performa_invoices: {vendor_id: vendor_id})}
  scope :filter_by_ageing, -> (days_ago) { where("pi_payments.created_at > ? ", DateTime.now.days_ago(days_ago))}
  scope :filter_by_date, -> (dates) { where("pi_payments.created_at BETWEEN ? and ?",dates[:from_time], dates[:to_time])}

  has_attached_file :upload, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :upload

  has_attached_file :attachment, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :attachment
  

  def tax_percent
    performa_invoice.tax_percent
  end

  # def amount
  #   performa_invoice.base_amount * percentage/100
  # end

  def tax_amount
    performa_invoice.tax_amount * percentage/100
  end

  def total_amount
    (performa_invoice.base_amount * percentage/100) + tax_amount
  end

  private
  def due_date_validity
    errors.add(:payment_due_date, 'cannot be earlier than today.') if payment_due_date.present? && payment_due_date < Time.zone.now
  end

  def pi_payment_not_exceed_100
    errors.add(:performa_invoice_id, 'for a PI, sum of payments cannot exceed 100% of total amount.') if ((self.payment_status != 'rejected') && (performa_invoice.pi_payments.not_rejected.sum(:percentage) + self.percentage) > 100)
  end
end
