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

require 'rails_helper'

RSpec.describe Invoice, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
