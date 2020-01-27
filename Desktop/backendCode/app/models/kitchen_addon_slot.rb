# == Schema Information
#
# Table name: kitchen_addon_slots
#
#  id                :integer          not null, primary key
#  slot_name         :string
#  product_module_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class KitchenAddonSlot < ApplicationRecord
  belongs_to :product_module, required: true

  has_many :kitchen_module_addon_mappings, dependent: :destroy
  has_many :addons, through: :kitchen_module_addon_mappings
  has_many :addon_combinations, through: :kitchen_module_addon_mappings

  validates_presence_of :slot_name
  validates_uniqueness_of :slot_name, scope: [:product_module_id]

  validate :kitchen_module_only

  private
  def kitchen_module_only
    errors.add(:product_module_id, "must belong to modular kitchen") if product_module.category != "kitchen"
  end
end
