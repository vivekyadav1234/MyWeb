class ChangeProductModuleUniqueIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :product_modules, :code
    add_index :product_modules, [:code, :category], unique: true
  end
end
