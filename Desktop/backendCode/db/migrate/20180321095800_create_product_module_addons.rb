class CreateProductModuleAddons < ActiveRecord::Migration[5.0]
  def change
    create_table :product_module_addons do |t|
      t.references :product_module, index: true, foreign_key: true
      t.references :addon, index: true, foreign_key: true

      t.timestamps
    end
  end
end
