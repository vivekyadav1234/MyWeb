class AddDoorPriceColumnsToShangpinJobs < ActiveRecord::Migration[5.0]
  def change
  	add_column :shangpin_jobs, :door_price, :float, default: 0.0
  end
end
