class AddremovedColumnsToShangpinJobs < ActiveRecord::Migration[5.0]
  def change
  	remove_column :shangpin_jobs, :door_price
  	add_column :shangpin_jobs, :wardrobe_price, :float, default: 0.0
  	add_column :shangpin_jobs, :wardrobe_amount, :float, default: 0.0
  end
end
