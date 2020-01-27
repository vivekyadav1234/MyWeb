class AddMrpAndOtherColumnsToHandles < ActiveRecord::Migration[5.0]
  def change
  	add_column :handles, :mrp, :float
  	add_column :handles, :vendor_sku, :string
  	add_column :handles, :spec, :string
  	add_column :handles, :make, :string
  	add_column :handles, :unit, :string
  end
end
