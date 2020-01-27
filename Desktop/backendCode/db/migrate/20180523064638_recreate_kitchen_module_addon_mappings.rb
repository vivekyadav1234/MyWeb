class RecreateKitchenModuleAddonMappings < ActiveRecord::Migration[5.0]
  def change
    drop_table :kitchen_module_addon_mappings

    create_table :kitchen_module_addon_mappings do |t|
      t.references :kitchen_addon_slot, index: true, foreign_key: true
      t.references :addon, index: true, foreign_key: true

      t.timestamps
    end
  end
end
