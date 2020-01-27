# == Schema Information
#
# Table name: civil_kitchen_parameters
#
#  id                   :integer          not null, primary key
#  depth                :integer
#  drawer_height_1      :integer
#  drawer_height_2      :integer
#  drawer_height_3      :integer
#  boq_global_config_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class CivilKitchenParameter < ApplicationRecord
  belongs_to :boq_global_config

  validates_presence_of :depth
  validates_presence_of :drawer_height_1
  validates_presence_of :drawer_height_2
  validates_presence_of :drawer_height_3

  MINIMUM_D1 = 130
  MINIMUM_D2 = 150
  MINIMUM_D3 = 360
  L_PATTI_PRICE = 28.0
  RAWAL_PLUG_PRICE = 20.0   #with screw

  validate :minimum_drawer_heights

  # add this cost to all custom shelf units
  def CivilKitchenParameter.fixed_cost
    L_PATTI_PRICE + RAWAL_PLUG_PRICE
  end

  private
  def minimum_drawer_heights
    errors.add(:drawer_height_1, "must be at least #{MINIMUM_D1}") if drawer_height_1.present? && drawer_height_1 < MINIMUM_D1
    errors.add(:drawer_height_2, "must be at least #{MINIMUM_D2}") if drawer_height_2.present? && drawer_height_2 < MINIMUM_D2
    errors.add(:drawer_height_3, "must be at least #{MINIMUM_D3}") if drawer_height_3.present? && drawer_height_3 < MINIMUM_D3
  end
end
