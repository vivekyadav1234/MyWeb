# == Schema Information
#
# Table name: vendor_serviceable_city_mappings
#
#  id                  :integer          not null, primary key
#  serviceable_city_id :integer
#  vendor_id           :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

FactoryGirl.define do
  factory :vendor_serviceable_city_mapping do
    
  end
end
