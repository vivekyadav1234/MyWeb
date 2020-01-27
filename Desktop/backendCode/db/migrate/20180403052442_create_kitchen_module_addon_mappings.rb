class CreateKitchenModuleAddonMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :kitchen_module_addon_mappings do |t|
      t.string :name
      t.text :addons, array: true, default: []

      t.references :product_module, index: true, foreign_key: true

      t.timestamps
    end

    add_column :product_modules, :number_kitchen_addons, :integer
  end
end
