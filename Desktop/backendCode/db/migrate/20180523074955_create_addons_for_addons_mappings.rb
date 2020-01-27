class CreateAddonsForAddonsMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :addons_for_addons_mappings do |t|
      t.references :kitchen_module_addon_mapping, index: { name: 'index_addons_for_addons_mappings_on_module_addon_mapping_id' }, foreign_key: true
      t.references :addon, index: false, foreign_key: true

      t.timestamps
    end
  end
end
