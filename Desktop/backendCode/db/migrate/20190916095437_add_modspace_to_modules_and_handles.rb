class AddModspaceToModulesAndHandles < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :modspace, :boolean, default: false, null: false
    add_column :handles, :modspace, :boolean, default: false, null: false
  end
end
