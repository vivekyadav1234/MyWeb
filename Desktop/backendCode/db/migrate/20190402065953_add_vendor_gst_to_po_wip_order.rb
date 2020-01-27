class AddVendorGstToPoWipOrder < ActiveRecord::Migration[5.0]
  def change
    add_column :po_wip_orders, :vendor_gst, :string
  end
end
