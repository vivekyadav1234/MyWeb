class AddNotNeededColumnsToApplianceJob < ActiveRecord::Migration[5.0]
  def change
   add_column :appliance_jobs, :no_bom, :boolean, default: false, null: false
   add_column :appliance_jobs, :no_cutting_list, :boolean, default: false, null: false   
   add_column :appliance_jobs, :no_hardware_list, :boolean, default: false, null: false     
  end
end
