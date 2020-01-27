# == Schema Information
#
# Table name: kitchen_module_addon_mappings
#
#  id                    :integer          not null, primary key
#  kitchen_addon_slot_id :integer
#  addon_id              :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  addon_combination_id  :integer
#

class KitchenModuleAddonMappingSerializer < ActiveModel::Serializer
  attributes :id, :code, :description, :width, :depth, :height, :modular_product_id, :created_at, :updated_at, :module_type_id,
  :number_kitchen_addons, :kitchen_module_addons

  # superseded by method below - delete later
  # def kitchen_module_addons
  #   mapping = []
  #   object.kitchen_module_addon_mappings.each do |map|
  #     addon_hash = Hash.new
  #     addons = []
  #     addon_hash["id"] = map.id
  #     addon_hash["name"] = map.name
  #     addon_hash["product_module_id"] = map.product_module_id
  #     map.addons.each do |ad|
  #       add_hash = Hash.new
  #       addon = Addon.find_by_id(ad)
  #       add_hash["id"] = ad
  #       add_hash["code"] = addon&.code
  #       add_hash["name"] = addon&.name
  #       addons.push add_hash
  #     end
  #     addon_hash["addons"] = addons
  #     mapping.push addon_hash
  #   end
  #   mapping
  # end

  def kitchen_module_addons
    slot_array = []
    object.kitchen_addon_slots.each do |kitchen_addon_slot|
      addon_hash = Hash.new
      addons = []
      addon_hash["id"] = kitchen_addon_slot.id
      addon_hash["name"] = kitchen_addon_slot&.name
      addon_hash["product_module_id"] = kitchen_addon_slot.product_module_id
      kitchen_addon_slot.kitchen_module_addon_mappings.each do |mapping|
        addon_hash = Hash.new
        addon = mapping.addon
        addon_hash["id"] = addon&.id
        addon_hash["code"] = addon&.code
        addon_hash["name"] = addon&.name
        addons.push addon_hash
      end
      addon_hash["addons"] = addons
      slot_array.push addon_hash
    end
    slot_array
  end
end
