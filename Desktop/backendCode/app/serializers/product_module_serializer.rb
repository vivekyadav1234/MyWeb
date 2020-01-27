# == Schema Information
#
# Table name: product_modules
#
#  id                        :integer          not null, primary key
#  code                      :string
#  description               :string
#  width                     :integer
#  depth                     :integer
#  height                    :integer
#  category                  :string
#  modular_product_id        :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  module_type_id            :integer
#  number_kitchen_addons     :integer
#  module_image_file_name    :string
#  module_image_content_type :string
#  module_image_file_size    :integer
#  module_image_updated_at   :datetime
#  number_shutter_handles    :integer
#  number_door_handles       :integer
#  c_section_length          :integer          default(0)
#  l_section_length          :integer          default(0)
#  c_section_number          :integer          default(0)
#  l_section_number          :integer          default(0)
#  special_handles_only      :boolean          default(FALSE)
#  percent_18_reduction      :boolean          default(FALSE)
#  al_profile_size           :float            default(0.0)
#  lead_time                 :integer          default(0)
#  hidden                    :boolean          default(FALSE), not null
#

class ProductModuleSerializer < ActiveModel::Serializer
  attributes :id, :code, :description, :width, :depth, :height, :module_image,
    :modular_product_id, :created_at, :updated_at, :module_type_id, :number_kitchen_addons, 
    :category, :number_shutter_handles, :number_door_handles, :special_handles_only, :hidden,
    :modspace
  
  attribute :module_type
  attributes :carcass_elements, :hardware_elements
  attribute :dimensions

  def module_type
    object.module_type&.name
  end

  def carcass_elements
    carcass_elements = []
    object.module_carcass_elements.each do |element|
      element_hash = Hash.new
      element_hash["id"] = element.carcass_element_id
      element_hash["code"] = element.carcass_element&.code
      carcass_elements.push element_hash
    end
    carcass_elements
  end

  def hardware_elements
    hardware_elements = []
    object.module_hardware_elements.each do |element|
      element_hash = Hash.new
      element_hash["id"] = element.hardware_element_id
      element_hash["code"] = element.hardware_element&.code
      hardware_elements.push element_hash
    end
    hardware_elements
  end

  def dimensions
    "#{object.width}X#{object.depth}X#{object.height}"
  end
end
