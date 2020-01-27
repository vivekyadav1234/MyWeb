# == Schema Information
#
# Table name: modspace_cabinet_prices
#
#  id                      :integer          not null, primary key
#  product_module_id       :integer
#  core_shutter_mapping_id :integer
#  shutter_finish_id       :integer
#  price                   :float            default(0.0), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#

# For a module, based on the core material, shutter material and finish chosen, the price is determined.
# This model holds that data.
class ModspaceCabinetPrice < ApplicationRecord
  belongs_to :product_module, required: true
  belongs_to :core_shutter_mapping, required: true
  belongs_to :shutter_finish, required: true

  validates :price, numericality: { greater_than_or_equal_to: 0.0 }
  validates_uniqueness_of :shutter_finish_id, scope: [:product_module_id, :core_shutter_mapping_id]

  def core_material
    core_shutter_mapping.core_material
  end

  def shutter_material
    core_shutter_mapping.shutter_material
  end
end
