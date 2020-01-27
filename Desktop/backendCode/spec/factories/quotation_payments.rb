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

FactoryGirl.define do
  factory :quotation_payment do
    
  end
end
