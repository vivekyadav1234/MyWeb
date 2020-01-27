# == Schema Information
#
# Table name: product_module_addons
#
#  id                   :integer          not null, primary key
#  product_module_id    :integer
#  addon_id             :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  addon_combination_id :integer
#

FactoryGirl.define do
  factory :product_module_addon do
    
  end
end
