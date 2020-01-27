class AddColumnsToBoqModularJobCustomizations < ActiveRecord::Migration[5.0]
  def change
    add_column :modular_jobs, :number_door_handles, :integer, default: 0
    add_column :modular_jobs, :number_shutter_handles, :integer, default: 0
    add_reference :modular_jobs, :brand, index: true, foreign_key: true
  end
end
