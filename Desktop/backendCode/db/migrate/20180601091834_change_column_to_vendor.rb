class ChangeColumnToVendor < ActiveRecord::Migration[5.0]
  def change
  	rename_column :vendors, :baranch_name, :branch_name
  end
end
