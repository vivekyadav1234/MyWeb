class AddVendorGstToPo < ActiveRecord::Migration[5.0]
  def self.up
    add_column :purchase_orders, :vendor_gst, :string
  end

  def self.down
    remove_column :purchase_orders, :vendor_gst
  end
end
