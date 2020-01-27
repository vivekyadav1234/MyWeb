class AddVendorSkuToKitchenAppliances < ActiveRecord::Migration[5.0]
  def change
    add_column :kitchen_appliances, :vendor_sku, :string
  end
end
