# == Schema Information
#
# Table name: gst_numbers
#
#  id             :integer          not null, primary key
#  gst_reg_no     :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :gst_number do
    
  end
end
