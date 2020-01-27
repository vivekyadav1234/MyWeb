# == Schema Information
#
# Table name: modular_products
#
#  id                   :integer          not null, primary key
#  name                 :string
#  modular_product_type :string
#  space                :string
#  price                :float
#  section_id           :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

FactoryGirl.define do
  factory :modular_product do
    
  end
end
