class CreateAddonCombinationMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :addon_combination_mappings do |t|
      t.integer :quantity, null:false, default: 0

      t.references :addons, index: true, foreign_key: true
      t.references :addon_combinations, index: true, foreign_key: true

      t.timestamps
    end
  end
end
