# == Schema Information
#
# Table name: product_module_addons
#
#  id                   :integer          not null, primary key
#  product_module_id    :integer
#  addon_id             :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  addon_combination_id :integer
#

class ProductModuleAddon < ApplicationRecord
  has_paper_trail

  belongs_to :product_module, required: true
  belongs_to :addon, optional: true
  belongs_to :addon_combination, optional: true

  validates_uniqueness_of :addon_id, scope: [:product_module_id], allow_blank: true
  validates_uniqueness_of :addon_combination_id, scope: [:product_module_id], allow_blank: true
  validate :addon_required

  private
  # must have either an addon or an addon_combination associated.
  def addon_required
    errors.add(:addon_id, "missing addon and addon combination - at least 1 is needed.") if addon.blank? && addon_combination.blank?
  end
end
