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

class KitchenModuleAddonMapping < ApplicationRecord
  has_paper_trail

  belongs_to :kitchen_addon_slot, required: true
  belongs_to :addon, optional: true
  belongs_to :addon_combination, optional: true

  has_many :addons_for_addons_mappings, dependent: :destroy
  has_many :allowed_addons, through: :addons_for_addons_mappings, source: :addon
  has_many :allowed_addon_combinations, through: :addons_for_addons_mappings, source: :addon_combination

  validates_uniqueness_of :addon_id, scope: [:kitchen_addon_slot_id], allow_blank: true
  validates_uniqueness_of :addon_combination_id, scope: [:kitchen_addon_slot_id], allow_blank: true
  validate :addon_required

  private
  # must have either an addon or an addon_combination associated.
  def addon_required
    errors.add(:addon_id, "missing addon and addon combination - at least 1 is needed.") if addon.blank? && addon_combination.blank?
  end
end
