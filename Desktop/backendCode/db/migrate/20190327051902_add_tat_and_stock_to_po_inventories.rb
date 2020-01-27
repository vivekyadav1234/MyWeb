class AddTatAndStockToPoInventories < ActiveRecord::Migration[5.0]
  def self.up
    add_column :po_inventories, :tat, :float
    add_column :po_inventories, :min_stock, :float
  end

  def self.down
    remove_column :po_inventories, :tat
    remove_column :po_inventories, :min_stock
  end
end
