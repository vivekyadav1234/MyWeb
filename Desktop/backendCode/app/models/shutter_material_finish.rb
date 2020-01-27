# == Schema Information
#
# Table name: shutter_material_finishes
#
#  id                :integer          not null, primary key
#  core_material_id  :integer
#  shutter_finish_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  mapping_type      :string           default("arrivae"), not null
#

class ShutterMaterialFinish < ApplicationRecord
  has_paper_trail

  belongs_to :core_material, required: true  #actually shutter material but same table.
  belongs_to :shutter_finish, required: true

  validates_uniqueness_of :shutter_finish_id, scope: [:mapping_type, :core_material_id]

  ALL_MAPPING_TYPES = ['arrivae', 'modspace']
  validates_inclusion_of :mapping_type, in: ALL_MAPPING_TYPES
end
