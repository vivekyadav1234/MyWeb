# == Schema Information
#
# Table name: purchase_order_performa_invoices
#
#  id                  :integer          not null, primary key
#  purchase_order_id   :integer
#  performa_invoice_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

FactoryGirl.define do
  factory :purchase_order_performa_invoice do
    
  end
end
