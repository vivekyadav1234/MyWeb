# == Schema Information
#
# Table name: mli_attributes
#
#  id                   :integer          not null, primary key
#  attr_name            :string           not null
#  attr_type            :string           default("text_field")
#  attr_data_type       :string           default("string")
#  reference_table_name :string
#  required             :boolean          default(FALSE)
#  master_line_item_id  :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

# Master Line Items.
# reference_table_name -> name of table if applicable.
# eg if referenceing CoreMaterial, its value should be 'CoreMaterial'.
class MliAttribute < ApplicationRecord
  has_paper_trail

  validates_presence_of [:attr_name, :attr_type, :attr_data_type]
  validates_uniqueness_of :attr_name, scope: [:master_line_item_id]
  
  ALL_TYPES = ['text_field', 'dropdown']
  ALL_DATA_TYPES = ['string', 'integer', 'float', 'reference']  #reference is when it references another table
  # the column name whose value to show - eg for Addon, show code; for CoreMaterial, show name.
  REFERENCE_OBJECT_VALUE_MAP =  {
      'Addon'             => 'code', 
      'CoreMaterial'      => 'name', 
      'EdgeBandingShade'  => 'code', 
      'HardwareElement'   => 'code', 
      'SkirtingConfig'    => 'skirting_type', 
      'Handle'            => 'code', 
      'Shade'             => 'code', 
      'ProductModule'     => 'code'
    }

  validates_inclusion_of :attr_type, in: ALL_TYPES
  validates_inclusion_of :attr_data_type, in: ALL_DATA_TYPES
  validates_inclusion_of :reference_table_name, in: REFERENCE_OBJECT_VALUE_MAP.keys, allow_blank: true

  belongs_to :master_line_item, required: true

  has_many :sli_dynamic_attributes  #deletion not allowed if used in sli_dynamic_attributes

  scope :reference_attributes, ->{ where(attr_data_type: 'reference') }

  # Not used now, but could be useful in the future.
  # def MliAttribute.end_points_hash
  #   url_helpers = Rails.application.routes.url_helpers
  #   {
  #     "EdgeBandingShade": url_helpers.v1_edge_banding_shades_path, 
  #     "Addon": url_helpers.v1_addons_path, 
  #     "CoreMaterial": url_helpers.v1_core_materials_path
  #   }
  # end

  def get_dropdown_options
    case reference_table_name
    when 'Addon'
      return Addon.all.map{|addon| { name: addon.code, value: addon.id} }
    when 'CoreMaterial'
      return CoreMaterial.all.map{|core_material| { name: core_material.name, value: core_material.id} }
    when 'EdgeBandingShade'
      return EdgeBandingShade.all.map{|edge_banding_shade| { name: edge_banding_shade.code, value: edge_banding_shade.id} }
    when 'HardwareElement'
      return HardwareElement.all.map{|hardware_element| { name: hardware_element.code, value: hardware_element.id} }
    when 'SkirtingConfig'
      return SkirtingConfig.all.map{|skirting_config| { name: skirting_config.skirting_type, value: skirting_config.id} }
    when 'Handle'
      return Handle.all.map{|handle| { name: handle.code, value: handle.id} }
    when 'Shade'
      return Shade.all.map{|shade| { name: shade.code, value: shade.id} }
    when 'ProductModule'
      return ProductModule.all.map{|product_module| { name: product_module.code, value: product_module.id} }
    else
      return []
    end
  end
end
