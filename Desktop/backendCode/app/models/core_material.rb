# == Schema Information
#
# Table name: core_materials
#
#  id               :integer          not null, primary key
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  lead_time        :integer          default(0)
#  hidden           :boolean          default(TRUE)
#  arrivae_select   :boolean          default(FALSE), not null
#  modspace_visible :boolean          default(FALSE), not null
#  modspace_shutter :boolean          default(FALSE), not null
#

# shutter material will also be from this only.
class CoreMaterial < ApplicationRecord
  has_paper_trail

  has_many :core_material_prices, dependent: :destroy
  # Material Finish mapping default
  has_many :shutter_material_finishes, -> {where(mapping_type: 'arrivae')} , dependent: :destroy
  has_many :shutter_finishes, through: :shutter_material_finishes

  # Material Finish mapping modspace
  has_many :modspace_shutter_material_finishes, -> {where(mapping_type: 'modspace')}, class_name: 'ShutterMaterialFinish', dependent: :destroy
  has_many :modspace_shutter_finishes, through: :modspace_shutter_material_finishes, source: :shutter_finish

  # core material to allowed shutter material mapping - originally created for Modspace pricing.
  has_many :core_material_mappings, class_name: 'CoreShutterMapping', foreign_key: 'shutter_material_id', dependent: :destroy
  has_many :shutter_material_mappings, class_name: 'CoreShutterMapping', foreign_key: 'core_material_id', dependent: :destroy
  has_many :core_materials, through: :core_material_mappings
  has_many :shutter_materials, through: :shutter_material_mappings  

  validates_presence_of :name
  validates_uniqueness_of :name

  # hidden materials will exist in DB, but will not be available to be added in BOQs.
  scope :not_hidden, -> {where(hidden: false)}
  scope :modspace_visible, -> {where(modspace_visible: true)}
  scope :modspace_shutter, -> {where(modspace_shutter: true)}
  scope :arrivae_select, -> {where(arrivae_select: true)}

  def CoreMaterial.core_material_price(core_material, category, thickness)
    CoreMaterial.find_by(name: core_material).core_material_prices.find_by(category: category, thickness: thickness).price
  end

  # Add a shutter finish allowed for this material.
  def add_finish(shutter_finish)
    self.shutter_finishes << shutter_finish
  end

  # Remove a shutter finish allowed for this material.
  def remove_finish(shutter_finish)
    self.shutter_finishes.delete(shutter_finish.id)
  end
end
