# == Schema Information
#
# Table name: purchase_elements
#
#  id                    :integer          not null, primary key
#  purchase_order_id     :integer
#  job_element_vendor_id :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

FactoryGirl.define do
  factory :purchase_element do
    
  end
end
