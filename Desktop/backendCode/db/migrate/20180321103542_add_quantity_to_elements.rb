class AddQuantityToElements < ActiveRecord::Migration[5.0]
  def change
    add_column :carcass_elements, :quantity, :integer, default: 1
    add_column :hardware_elements, :quantity, :integer, default: 1
    add_column :addons, :quantity, :integer, default: 1
    add_column :handles, :quantity, :integer, default: 1
  end
end
