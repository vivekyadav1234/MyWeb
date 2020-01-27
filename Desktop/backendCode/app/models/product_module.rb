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

class ProductModule < ApplicationRecord
  has_paper_trail

  belongs_to :modular_product, optional: true
  belongs_to :module_type

  has_many :module_carcass_elements, dependent: :destroy
  has_many :carcass_elements, through: :module_carcass_elements

  has_many :module_hardware_elements, dependent: :destroy
  has_many :hardware_elements, through: :module_hardware_elements

  has_many :modular_jobs  #NO dependent: :destroy!!!

  # mapping for which addons are allowed for which modules
  has_many :product_module_addons, dependent: :destroy
  has_many :allowed_addons, through: :product_module_addons, source: :addon
  has_many :allowed_addon_combinations, through: :product_module_addons, source: :addon_combination

  # mapping for kitchen addons to module mapping - restricted by size
  has_many :kitchen_addon_slots, dependent: :destroy

  # for modspace cabinet pricing
  has_many :modspace_cabinet_prices, dependent: :destroy

  has_attached_file :module_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :module_image, content_type: /\Aimage\/.*\z/

  validates_presence_of :code
  validates_uniqueness_of :code, scope: [:category]
  # validate :kitchen_module_addons_mappings_number

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  HINGE_ELEMENT_TYPES = ["Hinges", "Aventos Hinge"]
  CHANNEL_ELEMENT_TYPES = ["Telescopic Channel"]
  UNFINISHED_PANEL = ["AR-CORMAT"]
  FINISHED_PANEL = ["AR-FINMAT"]

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}
  scope :aluminium_profile_shutter, -> {where(special_handles_only: true)}
  scope :not_hidden, -> {where(hidden: false)}
  scope :modspace, -> {where(modspace: true)}
  scope :non_modspace, -> {where(modspace: false)}

  EDGE_BAND_PRICE_HASH = {
    0.8 => 0,
    1   => 0,
    2   => 0
  }

  CUSTOM_SHELF_UNIT_CODE = "CUSTOM_SHELF_UNIT"

  include Mkw::PriceCalculationConcern

  def ProductModule.custom_shelf_unit
    ProductModule.kitchen.find_by(code: CUSTOM_SHELF_UNIT_CODE)
  end

  def add_allowed_addon(addon)
    self.allowed_addons << addon
  end

  def remove_allowed_addon(addon)
    self.allowed_addons.delete(addon.id)
  end

  # used for custom shelf unit - get the appropriate "Double Shutter with Shelf" OR "Single Shutter with Shelf"
  def get_nearest_module(custom_shelf_unit_width)
    module_type_name = custom_shelf_unit_width <= 600 ? "Single Shutter with Shelf" : "Double Shutter with Shelf"
    module_type_to_use = ModuleType.kitchen.find_by(name: module_type_name)

    module_to_use = module_type_to_use.product_modules.where("width >= ?", custom_shelf_unit_width).order(width: :asc).limit(1).take
  end

  def aluminium_profile_shutter?
    special_handles_only
  end

  def has_hinge_element?
    hardware_type_names = hardware_elements.map{|e| e.hardware_type.name}
    (hardware_type_names & HINGE_ELEMENT_TYPES).present?
  end

  def has_channel_element?
    hardware_type_names = hardware_elements.map{|e| e.hardware_type.name}
    (hardware_type_names & CHANNEL_ELEMENT_TYPES).present?
  end

  # is this module eligible for skirting cost calculation
  def has_skirting?
    kitchen_category = module_type.get_kitchen_category
    category == "kitchen" && KitchenCategory.skirting_eligible.include?(kitchen_category)
  end

  # Is this module an Unfinished Panel? Their pricing logic is very different.
  def unfinished_panel?
    UNFINISHED_PANEL.include?(code)
  end

  # Is this module a Finished Panel? Their pricing logic is very different.
  def finished_panel?
    FINISHED_PANEL.include?(code)
  end

  def get_hinge_elements
    hardware_elements.joins(:hardware_type).where(hardware_types: {name: [HINGE_ELEMENT_TYPES]}).distinct
  end

  def get_channel_elements
    hardware_elements.joins(:hardware_type).where(hardware_types: {name: [CHANNEL_ELEMENT_TYPES]}).distinct
  end

  def hinge_element_count
    module_hardware_elements.where(hardware_element_id: get_hinge_elements).map(&:quantity).sum
  end

  # how many channel elements are there (adjusted or unadjusted for specific addons)
  def channel_element_count
    module_hardware_elements.where(hardware_element_id: get_channel_elements).map(&:quantity).sum
  end

  # what attributes NOT to allow for the customization of a module - this was created for unfinished and
  # finished panels but may be used for other modules in the future.
  def attributes_not_for_customization
    if unfinished_panel?
      return [:shutter_material, :shutter_finish, :shutter_shade_code, :skirting_config_type, :skirting_config_height, 
        :door_handle_code, :shutter_handle_code, :hinge_type, :channel_type, :number_exposed_sites, :hardware_brand_id, 
        :edge_banding_shade_code]
    elsif finished_panel?
      return [:core_material, :skirting_config_type, :skirting_config_height, :door_handle_code, :shutter_handle_code, 
        :hinge_type, :channel_type, :number_exposed_sites, :hardware_brand_id]
    else
      return []
    end
  end

  private
  # number_kitchen_addons matches the kitchen_module_addon_mappings associated
  def kitchen_module_addons_mappings_number
    errors.add(:number_kitchen_addons, "must equal the number of addon mappings defined") if category == "kitchen" && number_kitchen_addons != kitchen_module_addon_mappings.count
  end
end
