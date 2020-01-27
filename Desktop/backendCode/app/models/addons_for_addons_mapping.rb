# == Schema Information
#
# Table name: addons_for_addons_mappings
#
#  id                              :integer          not null, primary key
#  kitchen_module_addon_mapping_id :integer
#  addon_id                        :integer
#  created_at                      :datetime         not null
#  updated_at                      :datetime         not null
#  addon_combination_id            :integer
#

class AddonsForAddonsMapping < ApplicationRecord
  belongs_to :kitchen_module_addon_mapping, required: true
  belongs_to :addon, optional: true
  belongs_to :addon_combination, optional: true

  validates_uniqueness_of :addon_id, scope: [:kitchen_module_addon_mapping_id], allow_blank: true
  validates_uniqueness_of :addon_combination_id, scope: [:kitchen_module_addon_mapping_id], allow_blank: true
  validate :addon_required

  private
  # must have either an addon or an addon_combination associated.
  def addon_required
    errors.add(:addon_id, "missing addon and addon combination - at least 1 is needed.") if addon.blank? && addon_combination.blank?
  end
end
