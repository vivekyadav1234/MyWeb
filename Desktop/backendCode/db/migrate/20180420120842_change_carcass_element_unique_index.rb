class ChangeCarcassElementUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :carcass_elements, :code
    add_index :carcass_elements, [:code, :category], unique: true
  end
end
