class AddSalesManagerForReferrersToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :sales_manager_id, :integer
    add_index :users, :sales_manager_id
    add_foreign_key :users, :users, column: :sales_manager_id
  end
end
