# == Schema Information
#
# Table name: core_material_prices
#
#  id               :integer          not null, primary key
#  thickness        :float
#  price            :float
#  core_material_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  category         :string           default("kitchen")
#

FactoryGirl.define do
  factory :core_material_price do
    
  end
end
