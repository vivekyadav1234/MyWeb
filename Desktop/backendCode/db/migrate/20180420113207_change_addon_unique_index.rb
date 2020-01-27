class ChangeAddonUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :addons, column: [:code]
    add_index :addons, [:code, :category], unique: true
  end
end
