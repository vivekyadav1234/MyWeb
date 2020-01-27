class AddQuantityToJobElementVendor < ActiveRecord::Migration[5.0]
  def change
  	add_column :job_element_vendors, :quantity, :integer
  end
end
