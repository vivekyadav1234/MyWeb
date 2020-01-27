class AddHiddenToHandles < ActiveRecord::Migration[5.0]
  def change
    add_column :handles, :hidden, :boolean, null: false, default: false
  end
end
