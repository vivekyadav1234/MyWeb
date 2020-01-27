class AddNotNeededColumnsToBoqJob < ActiveRecord::Migration[5.0]
  def change
   add_column :boqjobs, :no_bom, :boolean, default: false, null: false
   add_column :boqjobs, :no_cutting_list, :boolean, default: false, null: false   
   add_column :boqjobs, :no_hardware_list, :boolean, default: false, null: false     
  end
end
