# == Schema Information
#
# Table name: kitchen_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class KitchenCategory < ApplicationRecord
  has_paper_trail

  has_many :category_module_types, dependent: :destroy
  has_many :allowed_module_types, through: :category_module_types, source: :module_type

  validates_presence_of :name
  validates_uniqueness_of :name

  # get the records which represents the kitchen base unit + tall unit
  def KitchenCategory.skirting_eligible
    KitchenCategory.where(name: ["Base Unit", "Tall Unit"])
  end

  # return category that is to be treated as appliances. Probably only one category.
  def KitchenCategory.appliance_category
    KitchenCategory.where(name: "Appliances")
  end

  # get the record which represents the kitchen base unit
  def KitchenCategory.base_unit
    KitchenCategory.find_by(name: "Base Unit")
  end

  # Addon category
  def KitchenCategory.addon_category
    KitchenCategory.find_by(name: "Add Ons")
  end

  def add_allowed_module_type(module_type)
    self.allowed_module_types << module_type
  end

  def remove_allowed_module_type(module_type)
    self.allowed_module_types.delete(module_type.id)
  end
end
