class ChangeHandleUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    add_index :handles, [:code, :category], unique: true
  end
end
