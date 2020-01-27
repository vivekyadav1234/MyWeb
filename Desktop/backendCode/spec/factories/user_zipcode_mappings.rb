# == Schema Information
#
# Table name: user_zipcode_mappings
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  zipcode_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :user_zipcode_mapping do
    
  end
end
