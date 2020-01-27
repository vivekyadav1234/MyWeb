# == Schema Information
#
# Table name: master_sub_options
#
#  id               :integer          not null, primary key
#  name             :string
#  master_option_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryGirl.define do
  factory :master_sub_option do
    name "MyString"
    master_option ""
  end
end
