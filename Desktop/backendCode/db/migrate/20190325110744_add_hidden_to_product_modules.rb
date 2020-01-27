class AddHiddenToProductModules < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :hidden, :boolean, null: false, default: false
  end
end
