# == Schema Information
#
# Table name: shutter_finishes
#
#  id               :integer          not null, primary key
#  name             :string
#  price            :float
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  wardrobe_price   :float
#  lead_time        :integer          default(0)
#  hidden           :boolean          default(TRUE)
#  arrivae_select   :boolean          default(FALSE), not null
#  modspace_visible :boolean          default(FALSE), not null
#

class ShutterFinish < ApplicationRecord
  has_paper_trail

  # Material Finish mapping default
  has_many :shutter_material_finishes, dependent: :destroy
  has_many :core_materials, through: :shutter_material_finishes

  # Material Finish mapping modspace
  has_many :modspace_shutter_material_finishes, -> {where(mapping_type: 'modspace')}, class_name: 'ShutterMaterialFinish', dependent: :destroy
  has_many :modspace_core_materials, through: :modspace_shutter_material_finishes, source: :core_material

  has_many :shutter_finish_shades, dependent: :destroy
  has_many :shades, through: :shutter_finish_shades

  has_many :modspace_cabinet_prices, dependent: :destroy

  validates_presence_of :name
  validates_uniqueness_of :name

  BACK_PAINTED_GLASS_FINISH_NAMES = ["Glass Pearlised", "Glass Satin Finish", "Glass Glossy"]
  scope :back_painted_glass, ->{ where(name: BACK_PAINTED_GLASS_FINISH_NAMES) }
  # hidden products will exist in DB, but will not be available to be added in BOQs.
  scope :not_hidden, -> {where(hidden: false)}
  scope :modspace_visible, -> {where(modspace_visible: true)}
  scope :arrivae_select, -> {where(arrivae_select: true)}

  alias shutter_materials core_materials  #same table for both materials

  # Add a shade allowed for this finish.
  def add_shade(shade)
    self.shades << shade
  end

  # Remove a shade allowed for this finish.
  def remove_shade(shade)
    self.shades.delete(shade.id)
  end
end
