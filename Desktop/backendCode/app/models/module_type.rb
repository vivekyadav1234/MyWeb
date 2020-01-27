# == Schema Information
#
# Table name: module_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ModuleType < ApplicationRecord
  has_paper_trail

  has_many :product_modules, dependent: :destroy
  has_many :kitchen_appliances, dependent: :destroy

  has_many :category_module_types, dependent: :destroy
  has_many :kitchen_categories, through: :category_module_types

  # mapping for which modules are allowed for which types
  # has_many :product_module_types, dependent: :destroy
  # has_many :allowed_product_modules, through: :product_module_types, source: :product_module

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:category]

  scope :kitchen, -> {where(category: 'kitchen')}
  scope :wardrobe, -> {where(category: 'wardrobe')}

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  CUSTOM_SHELF_UNIT_NAME = "Custom Shelf Unit"
  UNFINISHED_PANEL_NAME = "Unfinished Panel"
  FINISHED_PANEL_NAME = "Finished Panel"

  def ModuleType.custom_shelf_unit
    ModuleType.find_by(name: CUSTOM_SHELF_UNIT_NAME)
  end

  def ModuleType.unfinished_panel(category)
    ModuleType.find_by(name: UNFINISHED_PANEL_NAME, category: category)
  end

  def ModuleType.finished_panel(category)
    ModuleType.find_by(name: FINISHED_PANEL_NAME, category: category)
  end

  def ModuleType.remove_custom_shelf_unit(module_types)
    module_types.where.not(id: ModuleType.custom_shelf_unit)
  end


  def add_allowed_product_module(product_module)
    self.allowed_product_modules << product_module
  end

  def remove_allowed_product_module(product_module)
    self.allowed_product_modules.delete(product_module.id)
  end

  def get_kitchen_category
    kitchen_categories.first
  end

  def customizable_dimensions
    hash = Hash.new

    if self == ModuleType.unfinished_panel(category)
      hash = {
        dimensions: 'LBT',
        allowed_L: [0, 10000], 
        allowed_B: [0, 10000], 
        allowed_T: ModularJob::ALLOWED_UNFINISHED_THICKNESSES
      }
    elsif self == ModuleType.finished_panel(category)
      hash = {
        dimensions: 'LBT',
        allowed_L: [0, 10000], 
        allowed_B: [0, 10000], 
        allowed_T: ModularJob::ALLOWED_FINISHED_THICKNESSES
      }
    else
      hash = {
        dimensions: 'WDH',
        allowed_W: [0, 10000], 
        allowed_D: [0, 10000], 
        allowed_H: [0, 10000]
      }
    end

    hash
  end
end
