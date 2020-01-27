class RemoveJobElementVendorFromPo < ActiveRecord::Migration[5.0]
  def change
    remove_column :purchase_orders, :job_element_vendor_id
  end
end
