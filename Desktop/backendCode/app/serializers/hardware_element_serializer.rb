# == Schema Information
#
# Table name: hardware_elements
#
#  id                       :integer          not null, primary key
#  code                     :string
#  category                 :string
#  unit                     :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  hardware_type_id         :integer
#  hardware_element_type_id :integer
#

class HardwareElementSerializer < ActiveModel::Serializer
  attributes :id, :code, :unit, :price, :brand_id, :created_at, :updated_at,
  :hardware_type_id, :hardware_element_type_id, :category

  attribute :hardware_element_type
  attribute :hardware_type
  attribute :brand_type

  def hardware_type
    object.hardware_type&.name
  end

  def hardware_element_type
    object.hardware_element_type&.name
  end

  def brand_type
    object.brand&.name
  end
end
