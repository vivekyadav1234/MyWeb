class AddSpecialHandlesOnlyToProductModules < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :special_handles_only, :boolean, default: false
  end
end
