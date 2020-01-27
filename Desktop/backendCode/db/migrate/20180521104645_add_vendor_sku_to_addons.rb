class AddVendorSkuToAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :addons, :vendor_sku, :string
    add_index :addons, [:vendor_sku, :category]
  end
end
