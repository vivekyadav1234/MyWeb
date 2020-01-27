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

class BoqGlobalConfig < ApplicationRecord
  has_paper_trail

  belongs_to :quotation, optional: true
  belongs_to :preset_created_by, class_name: 'User', optional: true

  has_one :civil_kitchen_parameter, dependent: :destroy

  validates_presence_of :core_material
  validates_presence_of :shutter_material
  validates_presence_of :shutter_finish
  validates_presence_of :shutter_shade_code
  validates_uniqueness_of :preset_name, scope: [:category, :preset_created_by_id], if: :is_preset
  
  validate :max_countertop_width

  validate :quotation_can_edit_check?   #to check quotation can be updated or not (can_edit column)

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  validate :quotation_or_preset_present
  validate :civil_kitchen_only_kitchen
  validate :civil_kitchen_not_modspace

  accepts_nested_attributes_for :civil_kitchen_parameter, allow_destroy: true

  after_save :check_civil_kitchen_parameter   #ensure that if civil_kitchen is false, then the civil_kitchen_parameter is deleted

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}
  scope :presets, -> { where(is_preset: true) }

  ALL_HINGE_TYPES = {
    'normal' => 'Normal',
    'soft' => 'Soft Close'
  }
  validates_inclusion_of :hinge_type, in: ALL_HINGE_TYPES.keys

  ALL_CHANNEL_TYPES = {
    'normal' => 'Normal',
    'soft' => 'Soft Close'
  }
  # validates_inclusion_of :channel_type, in: ALL_CHANNEL_TYPES.keys, allow_blank: true

  ALL_COUNTERTOPS = {
    'none' => 'None',
    'telephone_black' => 'Telephone Black',
    'black_galaxy' => 'Black Galaxy',
    'pearl_granite' => 'Pearl Granite'
  }
  # validates_inclusion_of :countertop, in: ALL_COUNTERTOPS.keys

  SPACES = ['Master Bedroom','Kids Room','Guest Room','Living','Kitchen','Foyer','Dining Area','Balcony',
    'Attic','Basement','Bathroom','Garage','Hallway','Library','Loft','Nook','Pantry','Porch','Office', 
    'Utility','Vanity','Other']

  # when copying a preset data to a boq_global_config
  def BoqGlobalConfig.preset_columns_to_copy
    [:core_material, :shutter_material, :shutter_finish, :shutter_shade_code, :skirting_config_type, 
      :skirting_config_height, :door_handle_code, :shutter_handle_code, :hinge_type, :channel_type, 
      :brand_id, :skirting_config_id, :category, :edge_banding_shade_code, :countertop, :civil_kitchen, 
      :countertop_width]
  end

  def copy_from_preset
    self.deep_clone include: [ :civil_kitchen_parameter ], only: BoqGlobalConfig.preset_columns_to_copy
  end

  def skirting_config
    SkirtingConfig.where(skirting_type: skirting_config_type, skirting_height: skirting_config_height).last
  end

  def skirting_price
    skirting_config.price
  end

  def check_civil_kitchen_parameter
    civil_kitchen_parameter.destroy if civil_kitchen_parameter.present? && !civil_kitchen
  end

  ### Reading countertop lead_time from mkw_global_data.yml
  def countertop_lead_time
    MKW_GLOBAL_DATA["countertop_lead_times"][countertop] if category =='kitchen'
  end

  private
  def civil_kitchen_only_kitchen
    errors.add(:civil_kitchen, "Only modular kitchen can have civil kitchen enabled") if category=='wardrobe' && civil_kitchen
  end

  def civil_kitchen_not_modspace
    if is_preset
      preset_creator = User.find_by_id(preset_created_by_id)
      errors.add(:civil_kitchen, "is not allowed for Modspace pricing") if civil_kitchen && (preset_creator.present? && preset_creator.has_modspace_pricing?)
    else
      errors.add(:civil_kitchen, "is not allowed for Modspace pricing") if civil_kitchen && quotation&.has_modspace_pricing?
    end
  end

  def max_countertop_width
    errors.add(:countertop_width, "Max length allowed is #{ApplicationRecord::MAX_INTEGER}") if countertop_width.to_i > 0 && countertop_width > ApplicationRecord::MAX_INTEGER
  end

  def quotation_or_preset_present
    errors.add(:quotation_id, "must belong to quotation or be a preset") unless ( is_preset || quotation.present? )
  end

  def quotation_can_edit_check?
    errors.add(:quotation, "BOQ is in handover stage, and cannot be edited.") if quotation.present? && quotation.can_edit == false
  end
  
end
