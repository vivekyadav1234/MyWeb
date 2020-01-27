# == Schema Information
#
# Table name: core_shutter_mappings
#
#  id                  :integer          not null, primary key
#  mapping_type        :string           default("arrivae"), not null
#  core_material_id    :integer
#  shutter_material_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

# This table is used for core material to allowed shutter material mapping - originally created for Modspace pricing.
class CoreShutterMapping < ApplicationRecord
  belongs_to :core_material, class_name: 'CoreMaterial', required: true
  belongs_to :shutter_material, class_name: 'CoreMaterial', required: true

  has_many :modspace_cabinet_prices, dependent: :destroy

  ALL_TYPES = ['arrivae', 'modspace']  #so we can have separate mappings for Modspace, Arrivae etc if needed.
  validates_inclusion_of :mapping_type, in: ALL_TYPES
  validates_uniqueness_of :shutter_material_id, scope: [:mapping_type, :core_material_id]
end
