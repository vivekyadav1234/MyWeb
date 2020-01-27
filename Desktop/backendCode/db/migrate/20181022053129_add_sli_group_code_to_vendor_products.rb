class AddSliGroupCodeToVendorProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :vendor_products, :sli_group_code, :string
    add_index :vendor_products, :sli_group_code
    remove_index :vendor_products, [:vendor_id, :sli_code]
    add_index :vendor_products, :sli_code, unique: true
  end
end
