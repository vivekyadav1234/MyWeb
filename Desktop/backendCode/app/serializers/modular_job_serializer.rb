# == Schema Information
#
# Table name: modular_jobs
#
#  id                      :integer          not null, primary key
#  name                    :string
#  quantity                :float
#  rate                    :float
#  amount                  :float
#  space                   :string
#  category                :string
#  dimensions              :string
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
#  ownerable_type          :string
#  ownerable_id            :integer
#  product_module_id       :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  number_exposed_sites    :integer
#  section_id              :integer
#  number_door_handles     :integer          default(0)
#  number_shutter_handles  :integer          default(0)
#  brand_id                :integer
#  kitchen_category_name   :string
#  combined_module_id      :integer
#  combined                :boolean          default(FALSE)
#  edge_banding_shade_code :string
#  custom_shelf_unit_width :integer          default(0)
#  thickness               :float
#  length                  :float
#  breadth                 :float
#  width                   :integer
#  depth                   :integer
#  height                  :integer
#  estimated_cogs          :float            default(0.0)
#  clubbed_job_id          :integer
#  tag_id                  :integer
#  no_bom                  :boolean          default(FALSE), not null
#  lead_time               :integer          default(0), not null
#  lead_time_type          :string
#  lead_time_code          :string
#

class ModularJobSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :rate, :amount, :space, :category, :dimensions, :core_material, 
    :shutter_material, :shutter_finish, :shutter_shade_code, :edge_banding_shade_code, :skirting_config_type, :skirting_config_height, 
    :door_handle_code, :shutter_handle_code, :hinge_type, :channel_type, :ownerable_type, :ownerable_id, 
    :product_module_id, :created_at, :updated_at, :number_exposed_sites, :section_id, :number_door_handles, 
    :number_shutter_handles, :brand_id, :kitchen_category_name, :combined, :combined_module_id, 
    :custom_shelf_unit_width, :thickness, :length, :breadth, :width, :depth, :height

  attribute :name
  attribute :code
  attribute :module_type
  attribute :addons
  attribute :addon_combinations
  attribute :addons_for_addons
  attribute :has_hinge_element
  attribute :has_channel_element
  attribute :brand_name
  attribute :combined_door
  attribute :included_modules
  attribute :module_image_url
  attribute :customizable_dimensions
  attribute :timeline
  attribute :labels

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def timeline
    object.time_line_from_columns
  end

  def name
    object.name || object.product_module&.module_type&.name
  end

  # for a combined module, this will contain the details of the included modules
  def included_modules
    object.modular_jobs.map{ |modular_job|
      ModularJobSerializer.new(modular_job).serializable_hash
    }
  end

  def combined_door
    CombinedDoorSerializer.new(object.combined_door).serializable_hash if object.combined_door.present?
  end

  def addons
    object.job_addons.joins(:addon).where(compulsory_job_addon_id: nil).map do |job_addon|
      addon = job_addon.addon
      quantity = job_addon.quantity
      compulsory = job_addon.compulsory
      slot = job_addon.slot
      brand = addon.brand
      AddonSerializer.new(addon).serializable_hash.merge(quantity: quantity, compulsory: compulsory, slot: slot,
        combination: job_addon.combination?, brand_id: brand&.id, brand_name: brand&.name)
    end
  end

  # For those job_addons which have a combination of addons, instead of a single addon.
  def addon_combinations
    object.job_addons.joins(:addon_combination).where(compulsory_job_addon_id: nil).map do |job_addon|
      addon_combination = job_addon.addon_combination
      combo_name = addon_combination.combo_name
      compulsory = job_addon.compulsory
      slot = job_addon.slot
      quantity = job_addon.quantity   #the quantity of the addon
      included_mrp = addon_combination.mrp.round(2)
      addons = addon_combination.addon_combination_mappings.map do |mapping|
        addon = mapping.addon
        brand = addon.brand
        AddonSerializer.new(addon).serializable_hash.merge(quantity: mapping.quantity, brand_id: brand&.id, brand_name: brand&.name)
      end

      {
        id: addon_combination.id, 
        combo_name: combo_name, 
        quantity: quantity, 
        compulsory: compulsory, 
        slot: slot, 
        addons: addons,
        included_mrp: included_mrp
      }
    end
  end

  def addons_for_addons
    object.job_addons.where.not(compulsory_job_addon_id: nil).map do |job_addon|
      quantity = job_addon.quantity
      compulsory = job_addon.compulsory
      slot = job_addon.slot
      compulsory_job_addon_id = job_addon.compulsory_job_addon_id
      compulsory_addon_id = job_addon.combination? ? JobAddon.find(compulsory_job_addon_id).addon_combination_id.present? : JobAddon.find(compulsory_job_addon_id).addon_id.present?
      
      if job_addon.combination?
        addon_combination = job_addon.addon_combination
        combo_name = addon_combination.combo_name
        included_addons = addon_combination.addon_combination_mappings.map do |mapping|
          addon = mapping.addon
          brand = addon.brand
          AddonSerializer.new(addon).serializable_hash.merge(quantity: mapping.quantity, brand_id: brand&.id, brand_name: brand&.name)
        end
        {
          id: addon_combination.id,
          combo_name: combo_name, 
          compulsory: compulsory, 
          slot: slot, 
          quantity: quantity, 
          included_addons: included_addons, 
          included_mrp: addon_combination.mrp.round(2)
        }
      else
        addon = job_addon.addon
        brand = addon.brand
        AddonSerializer.new(addon).serializable_hash.merge(quantity: quantity, compulsory: compulsory, slot: slot,
          brand_id: brand&.id, brand_name: brand&.name, compulsory_job_addon_id: compulsory_job_addon_id,
          compulsory_addon_id: compulsory_addon_id)
      end
    end
  end

  def code
    object.product_module&.code
  end

  def module_type
    object.product_module&.module_type&.name
  end

  def has_hinge_element
    object.product_module&.has_hinge_element?
  end

  def has_channel_element
    object.product_module&.has_channel_element?
  end

  def brand_name
    object.brand&.name
  end

  def module_image_url
    object.product_module&.module_image&.url
  end

  def customizable_dimensions
    object.product_module&.module_type&.customizable_dimensions
  end
end

# same as original, with detailed customization details as well as addons and custom_elements
# added to this line item.
class ModuleCustomizationSerializer < ModularJobSerializer
  attribute :customization
  # attribute :allowed_custom_elements
  attribute :allowed_addons
  attribute :allowed_number_exposed_sites
  attribute :compulsory_addons
  attribute :custom_shade_flag
  attribute :shade_details
  attribute :custom_edge_banding_flag
  attribute :attributes_not_for_customization

  def custom_edge_banding_flag
    object.edge_banding_shade_code.present? && EdgeBandingShade.find_by_code(object.edge_banding_shade_code).blank?
  end

  def custom_shade_flag
    object.shutter_shade_code.present? && Shade.find_by_code(object.shutter_shade_code).blank?
  end

  def shade_details
    shade = Shade.find_by_code object.shutter_shade_code
    if shade.present?
      return ShadeSerializer.new(shade).serializable_hash
    else
      nil
    end
  end

  def customization
    customization_hash = object.options_for_calculation.merge(brand_name: object.brand&.name)
  end

  def attributes_not_for_customization
    object.product_module&.attributes_not_for_customization || []
  end

  # def allowed_custom_elements
  #   CustomElement.all.map do |custom_element|
  #     CustomElementSerializer.new(custom_element).serializable_hash
  #   end
  # end

  def allowed_addons
    object.product_module.allowed_addons.map do |addon|
      AddonSerializer.new(addon).serializable_hash
    end
  end

  def allowed_number_exposed_sites
    ModularJob::ALLOWED_EXPOSED_SITES
  end

  # applicable only for kitchen
  # list of compulsory addon slots and allowed addons for each slot
  def compulsory_addons
    unless object.category == "kitchen"
      return nil
    else
      product_module = object.product_module
      # for custom shelf modules, use the appropriate module's addon mapping
      module_to_use = nil
      if product_module.code == ProductModule::CUSTOM_SHELF_UNIT_CODE
        module_to_use = product_module.get_nearest_module(object.custom_shelf_unit_width.to_i)
      else
        module_to_use = product_module
      end

      arr = []
      module_to_use.kitchen_addon_slots.each do |kitchen_addon_slot|
        hash = Hash.new
        hash[:slot] = kitchen_addon_slot.slot_name
        hash[:allowed_addons] = kitchen_addon_slot.addons.map do |addon|
          AddonSerializer.new(addon, slot: kitchen_addon_slot.slot_name).serializable_hash
        end
        arr.push hash
      end
      arr
    end
  end
end


class BusinessModularJobSerializer < ModularJobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end

end
