class CreateModularJobCosts < ActiveRecord::Migration[5.0]
  def change
    create_table :modular_job_costs do |t|
      t.float :core_quantity, default: 0.0
      t.float :shutter_quantity, default: 0.0
      t.float :carcass_cost, default: 0.0
      t.float :finish_cost, default: 0.0
      t.float :hardware_cost, default: 0.0
      t.float :addon_cost, default: 0.0
      t.float :handle_cost, default: 0.0
      t.float :skirting_cost, default: 0.0
      t.float :soft_close_hinge_cost, default: 0.0
      t.float :modspace_cabinet_cost, default: 0.0

      t.references :modular_job, foreign_key: true, index: true

      t.timestamps
    end
  end
end
