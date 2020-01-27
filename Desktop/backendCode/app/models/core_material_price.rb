# == Schema Information
#
# Table name: core_material_prices
#
#  id               :integer          not null, primary key
#  thickness        :float
#  price            :float
#  core_material_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  category         :string           default("kitchen")
#

class CoreMaterialPrice < ApplicationRecord
  has_paper_trail

  belongs_to :core_material, required: true

  validates_presence_of :thickness
  validates_uniqueness_of :thickness, scope: [:core_material_id, :category]

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}
end
