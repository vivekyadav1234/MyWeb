# == Schema Information
#
# Table name: zipcodes
#
#  id         :integer          not null, primary key
#  code       :string
#  city_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :zipcode do
    
  end
end
