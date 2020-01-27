# == Schema Information
#
# Table name: carcass_elements
#
#  id                      :integer          not null, primary key
#  code                    :string
#  width                   :integer
#  depth                   :integer
#  height                  :integer
#  length                  :float
#  breadth                 :float
#  thickness               :float
#  edge_band_thickness     :integer
#  area_sqft               :float
#  category                :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  carcass_element_type_id :integer
#

class CarcassElementSerializer < ActiveModel::Serializer
  attributes :id, :code, :width, :depth, :height, :length, :breadth, :thickness, :edge_band_thickness, 
    :area_sqft, :created_at, :updated_at, :carcass_element_type_id, :category

  attribute :carcass_element_type

  def carcass_element_type
    object.carcass_element_type&.name
  end 
end
