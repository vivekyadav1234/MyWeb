class AddModifyingToPurchaseOrders < ActiveRecord::Migration[5.0]
  def change
    add_column :purchase_orders, :modifying, :boolean, default: false
  end
end
