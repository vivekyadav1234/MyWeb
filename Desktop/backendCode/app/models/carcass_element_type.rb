# == Schema Information
#
# Table name: carcass_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  aluminium  :boolean          default(FALSE)
#  glass      :boolean          default(FALSE)
#

class CarcassElementType < ApplicationRecord
  has_paper_trail

  has_many :carcass_elements

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:category]

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  validate :only_one_special_material

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}

  SKIP_PRICE_CUSTOM_SHELF = ["Back Panel", "Bottom Panel", "Skirting"]
  FINISH_PRICE_ENABLED = ["Shutter", "Filler Panel", "Chimney Panel", "Tall Unit Shutter"]
  # For these type of carcass elements, some modules have their material cost reduced to 18%.
  PERCENT_18_REDUCTION = ["Side Panel Left", "Side Panel Right"]

  # get names of all panel carcass_element_types
  # ie all carcass element types, in reality
  def CarcassElementType.get_all_panel_type_names
    CarcassElementType.where(aluminium: false, glass: false).pluck(:name).uniq
  end

  private
  # only one special material, so either glass can be true or aluminium, but not both.
  # both can be false, of course
  def only_one_special_material
    if glass && aluminium
      errors.add(:glass, "element type cannot be both glass and aluminium")
      errors.add(:aluminium, "element type cannot be both glass and aluminium")
    end
  end
end
