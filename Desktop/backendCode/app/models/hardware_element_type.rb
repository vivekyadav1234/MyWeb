# == Schema Information
#
# Table name: hardware_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

#eg Normal Hinge 0 Crank
class HardwareElementType < ApplicationRecord
  has_paper_trail

  has_many :hardware_elements

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:category]

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}

  SKIP_PRICE_CUSTOM_SHELF = ["Minifix 7 mm Dia", "Housing MF 18", "MS Dowel 10 mm Dia", "Wood Dowel 40 mm Length", 
   "Housing MF 18", "Minifix 7 mm Dia", "MS Dowel 10 mm Dia", "PVC Legs 100mm", "Wood Dowel 40 mm Length" ]
end
