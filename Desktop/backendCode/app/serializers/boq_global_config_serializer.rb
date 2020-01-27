# == Schema Information
#
# Table name: boq_global_configs
#
#  id                      :integer          not null, primary key
#  core_material           :string
#  shutter_material        :string
#  shutter_finish          :string
#  shutter_shade_code      :string
#  skirting_config_type    :string
#  skirting_config_height  :string
#  door_handle_code        :string
#  shutter_handle_code     :string
#  hinge_type              :string
#  channel_type            :string
#  brand_id                :integer
#  skirting_config_id      :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  quotation_id            :integer
#  category                :string
#  edge_banding_shade_code :string
#  countertop              :string           default("none")
#  civil_kitchen           :boolean          default(FALSE)
#  countertop_width        :integer
#  is_preset               :boolean          default(FALSE)
#  preset_remark           :string
#  preset_created_by_id    :integer
#  preset_name             :string
#

class BoqGlobalConfigSerializer < ActiveModel::Serializer
  attributes :id, :skirting_config_type, :skirting_config_height, :door_handle_code, :shutter_handle_code, :hinge_type, :channel_type, 
    :brand_id, :skirting_config_id, :created_at, :updated_at, :category, :quotation_id, :countertop, 
    :civil_kitchen, :countertop_width, :is_preset, :preset_name, :preset_remark, :preset_created_by_id

  attribute :civil_kitchen_parameters
  attribute :brand
  attribute :core_material
  attribute :shutter_material
  attribute :shutter_finish
  attribute :custom_shutter_shade_code
  attribute :shutter_shade_code
  attribute :custom_edge_banding_shade_code
  attribute :edge_banding_shade_code
  attribute :door_handle_image
  attribute :shutter_handle_image
  attribute :preset_created_by

  def civil_kitchen_parameters
    if object.civil_kitchen_parameter.present?
      CivilKitchenParameterSerializer.new(object.civil_kitchen_parameter).serializable_hash
    else
      nil
    end
  end

  def core_material
    record = CoreMaterial.find_by_name object.core_material
    if record.blank?
      return nil
    else
      record.attributes.slice("id", "name")
    end
  end

  def shutter_material
    record = CoreMaterial.find_by_name object.shutter_material
    if record.blank?
      return nil
    else
      record.attributes.slice("id", "name")
    end
  end

  def shutter_finish
    record = ShutterFinish.find_by_name object.shutter_finish
    if record.blank?
      return nil
    else
      record.attributes.slice("id", "name")
    end
  end

  def custom_shutter_shade_code
    object.shutter_shade_code.present? && Shade.find_by_code(object.shutter_shade_code).blank?
  end

  def shutter_shade_code
    record = Shade.find_by_code object.shutter_shade_code
    if record.blank?
      object.shutter_shade_code
    else
      ShadeSerializer.new(record).serializable_hash
    end
  end

  def custom_edge_banding_shade_code
    object.edge_banding_shade_code.present? && EdgeBandingShade.find_by_code(object.edge_banding_shade_code).blank?
  end

  def edge_banding_shade_code
    record = EdgeBandingShade.find_by_code object.edge_banding_shade_code
    if record.blank?
      return object.edge_banding_shade_code
    else
      EdgeBandingShadeSerializer.new(record).serializable_hash
    end
  end

  def brand
    record = Brand.find_by_id(object.brand_id)
    if record.blank?
      return nil
    else
      record.attributes.slice("id", "name")
    end
  end

  def door_handle_image
    Handle.drawer.find_by_code(object.door_handle_code)&.handle_image&.url
  end

  def shutter_handle_image
    Handle.shutter.find_by_code(object.shutter_handle_code)&.handle_image&.url
  end

  def preset_created_by
    if object.preset_created_by.present?
      object.preset_created_by.attributes.slice("name", "email")
    end
  end
end
