class AddTagSnagToPurchaseOrderTables < ActiveRecord::Migration[5.0]
  def change
  	add_column :purchase_orders, :tag_snag, :boolean, null: false, default: false
  	add_column :po_wip_orders, :tag_snag, :boolean, null: false, default: false
  end
end
