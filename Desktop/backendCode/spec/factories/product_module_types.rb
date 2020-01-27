# == Schema Information
#
# Table name: product_module_types
#
#  id                :integer          not null, primary key
#  product_module_id :integer
#  module_type_id    :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

FactoryGirl.define do
  factory :product_module_type do
    
  end
end
