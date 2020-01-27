# == Schema Information
#
# Table name: vendor_category_mappings
#
#  id              :integer          not null, primary key
#  vendor_id       :integer
#  sub_category_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do
  factory :vendor_category_mapping do
    
  end
end
