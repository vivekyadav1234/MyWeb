# == Schema Information
#
# Table name: quotation_payments
#
#  id           :integer          not null, primary key
#  quotation_id :integer
#  payment_id   :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  amount       :float
#

class QuotationPayment < ApplicationRecord
  belongs_to :quotation, required: true
  belongs_to :payment, required: true

  delegate :id, :name, :terms, :net_amount, :total_amount, :status,
    :generation_date,:remark, :expiration_date, :expiration_in_days,
    :billing_address, :flat_amount, :customer_notes, :created_at, :updated_at,
    :reference_number, :project_id, :user_id, :designer_id, :spaces,
    :spaces_kitchen, :spaces_loose, :spaces_services, :spaces_custom,
    :spaces_custom_furniture, :countertop_cost, :paid_amount, :discount_value,
    :discount_status, :disc_status_updated_at, :disc_status_updated_by,
    :final_amount,:is_approved, :wip_status, :copied, :per_10_approved_by_id,
    :per_10_approved_at, :per_50_approved_by_id, :per_50_approved_at,
    :category_appoval_by_id, :category_appoval_at, :cm_approval,
    :category_approval, :per_100_true, :shangpin_amount, :parent_quotation_id,
    to: :quotation, prefix: 'boq'

  scope :filter_by_lead, -> (lead_id) {includes(payment: :project).where(projects: {lead_id: lead_id})}
  scope :filter_by_ageing, -> (days_ago) { where("payments.created_at > ? ", DateTime.now.days_ago(days_ago))}
  scope :filter_by_date, -> (dates) { where("payments.created_at BETWEEN ? and ?",dates[:from_time], dates[:to_time])}

  validates_uniqueness_of :quotation_id, scope: [:payment_id]

  # # Filters based on leads aging and dates
  # def filter_by(options)
  #   quary_params =
  #   if options[:lead_id].present?
  #     quary_params[:projects] = {lead_id: 19598}
  #   end

  #   if options[:aging].present?
  #     quary_params = ""

  #   end

  #   if options[:from_date].present? || options[:to_date].present?

  #     .where("payments.created_at BETWEEN ? and ?",from_time, to_time)
  #   end
  # end

  # serialize :purchase_element_ids
end
