class ChangeCarcassElementTypeUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :carcass_element_types, :name
    add_index :carcass_element_types, [:name, :category], unique: true
  end
end
