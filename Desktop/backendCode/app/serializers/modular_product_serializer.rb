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

class ModularProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :modular_product_type, :space, :price, :section_id, :created_at, 
    :updated_at
end
