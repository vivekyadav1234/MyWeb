class AddLocationToPoInventory < ActiveRecord::Migration[5.0]
  def change
  	add_column :po_inventories, :location, :text
  end
end
