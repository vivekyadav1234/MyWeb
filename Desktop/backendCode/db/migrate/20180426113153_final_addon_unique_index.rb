class FinalAddonUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :addons, column: [:code, :category]
    add_index :addons, [:code, :brand_id, :category], unique: true
  end
end
