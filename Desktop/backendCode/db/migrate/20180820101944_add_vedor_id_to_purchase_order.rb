class AddVedorIdToPurchaseOrder < ActiveRecord::Migration[5.0]
  def change
  	remove_column :purchase_orders, :consignor_name
  	remove_column :purchase_orders, :consignor_address
  	add_reference :purchase_orders, :vendor, foreign_key: true
  end
end
