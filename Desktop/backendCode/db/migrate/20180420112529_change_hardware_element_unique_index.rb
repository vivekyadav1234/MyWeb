class ChangeHardwareElementUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :hardware_elements, column: [:code, :brand_id]
    add_index :hardware_elements, [:code, :category, :brand_id], unique: true
  end
end
