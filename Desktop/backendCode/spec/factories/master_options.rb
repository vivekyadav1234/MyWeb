# == Schema Information
#
# Table name: master_options
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :master_option do
    name "MyString"
  end
end
