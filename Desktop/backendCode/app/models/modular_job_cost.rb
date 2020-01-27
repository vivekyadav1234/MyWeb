# == Schema Information
#
# Table name: modular_job_costs
#
#  id                    :integer          not null, primary key
#  core_quantity         :float            default(0.0)
#  shutter_quantity      :float            default(0.0)
#  carcass_cost          :float            default(0.0)
#  finish_cost           :float            default(0.0)
#  hardware_cost         :float            default(0.0)
#  addon_cost            :float            default(0.0)
#  handle_cost           :float            default(0.0)
#  skirting_cost         :float            default(0.0)
#  soft_close_hinge_cost :float            default(0.0)
#  modspace_cabinet_cost :float            default(0.0)
#  modular_job_id        :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

# For a ModularJob, this model will contain the details of the costs/qty needed for reports etc.
# Why it is needed - because for a given module, the mapped carcass or hardware elements might change in the future, the prices of 
# core material, finish etc might change or the price calculation logic itself might change, so that cannot be calculated in real time.
# Whenever the rate of a modular_job is calculated, this associated record must be updated.
# This way, even if in the future the logic etc changes, the value is available in the database.
class ModularJobCost < ApplicationRecord
  belongs_to :modular_job, required: true

  # validates_uniqueness_of :modular_job_id
end
