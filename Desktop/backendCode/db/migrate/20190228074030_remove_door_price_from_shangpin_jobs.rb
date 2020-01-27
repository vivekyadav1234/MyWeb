class RemoveDoorPriceFromShangpinJobs < ActiveRecord::Migration[5.0]
  def change
    remove_column :shangpin_jobs, :door_price, :float, default: 0

    change_column_default :shangpin_jobs, :cabinet_quantity, 0
    change_column_default :shangpin_jobs, :door_quantity, 0
    change_column_default :shangpin_jobs, :accessory_quantity, 0
  end
end
