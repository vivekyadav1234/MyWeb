# == Schema Information
#
# Table name: invoices
#
#  id               :integer          not null, primary key
#  name             :string
#  terms            :text
#  net_amount       :float            default(0.0)
#  total_amount     :float            default(0.0)
#  status           :integer          default(0)
#  project_id       :integer
#  user_id          :integer
#  invoicing_date   :date
#  due_date         :date
#  due_in_days      :integer          default(0)
#  payment_status   :integer          default("unpaid")
#  billing_address  :string
#  total_discount   :float            default(0.0)
#  gross_amount     :float            default(0.0)
#  customer_notes   :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  reference_number :string
#  quotation_id     :integer
#  designer_id      :integer
#

class InvoiceSerializer < ActiveModel::Serializer
  attributes :id, :name, :terms, :net_amount, :total_amount, :status, :description, :invoicing_date, :due_date, :due_in_days, :payment_status, :billing_address, :saved_tax_details, :total_discount, :gross_amount, :customer_notes
  has_one :project
  has_one :user
end
