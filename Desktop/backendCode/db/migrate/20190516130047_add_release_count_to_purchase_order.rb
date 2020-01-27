class AddReleaseCountToPurchaseOrder < ActiveRecord::Migration[5.0]
  def self.up
    add_column :purchase_orders, :release_count, :integer, default: 0
  end

  def self.down
    remove_column :purchase_orders, :release_count, :integer, default: 0
  end
end
