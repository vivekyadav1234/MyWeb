class AddCmIdToDesigners < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :cm_id, :integer
    add_index :users, :cm_id
    add_foreign_key :users, :users, column: :cm_id
  end
end
