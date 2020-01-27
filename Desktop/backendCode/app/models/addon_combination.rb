# == Schema Information
#
# Table name: addon_combinations
#
#  id         :integer          not null, primary key
#  combo_name :string           default("default")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  code       :string
#

class AddonCombination < ApplicationRecord
  has_many :addon_combination_mappings, dependent: :destroy
  has_many :addons, through: :addon_combination_mappings

  has_many :job_addons, dependent: :destroy
  has_many :modular_jobs, through: :job_addons

  has_many :extra_jobs

  # mapping for which addon combinationss are allowed for which modules
  has_many :product_module_addons, dependent: :destroy
  has_many :allowed_product_modules, through: :product_module_addons, source: :product_module

  has_many :addons_for_addons_mappings, dependent: :destroy
  has_many :kitchen_module_addon_mappings, through: :addons_for_addons_mappings
  has_many :kitchen_addon_slots, through: :kitchen_module_addon_mappings

  validates_presence_of :combo_name
  validates_presence_of :code
  validates_uniqueness_of :code

  scope :extra, -> {where(extra: true)}
  # hidden addon_combinations will exist in DB, but will not be available to be added in BOQs.
  scope :not_hidden, -> {where(hidden: false)}

  # sum of mrp of addons
  def mrp
    addon_combination_mappings.map{ |mapping|
      mapping.quantity * mapping.addon.mrp.to_f
    }.sum
  end
end
