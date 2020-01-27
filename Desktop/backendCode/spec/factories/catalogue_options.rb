# == Schema Information
#
# Table name: catalogue_options
#
#  id                   :integer          not null, primary key
#  name                 :string
#  master_sub_option_id :integer
#  minimum_price        :float
#  maximum_price        :float
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

FactoryGirl.define do
  factory :catalogue_option do
    name "MyString"
    master_sub_option ""
    minimum_price 1.5
    maximum_price 1.5
  end
end
