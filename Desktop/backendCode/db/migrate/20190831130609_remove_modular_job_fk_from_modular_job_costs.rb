class RemoveModularJobFkFromModularJobCosts < ActiveRecord::Migration[5.0]
  def change
    remove_foreign_key :modular_job_costs, :modular_jobs
  end
end
