class AddMrpToAppliances < ActiveRecord::Migration[5.0]
  def change
  	add_column :kitchen_appliances, :mrp, :float
  end
end
