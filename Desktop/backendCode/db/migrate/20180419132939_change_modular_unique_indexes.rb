class ChangeModularUniqueIndexes < ActiveRecord::Migration[5.0]
  def change
    remove_index :hardware_element_types, :name
    add_index :hardware_element_types, [:name, :category], unique: true

    remove_index :module_types, :name
    add_index :module_types, [:name, :category], unique: true
  end
end
