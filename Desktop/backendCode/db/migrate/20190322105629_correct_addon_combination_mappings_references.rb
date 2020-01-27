class CorrectAddonCombinationMappingsReferences < ActiveRecord::Migration[5.0]
  def change
    remove_reference :addon_combination_mappings, :addons, index: true, foreign_key: true
    remove_reference :addon_combination_mappings, :addon_combinations, index: true, foreign_key: true

    add_reference :addon_combination_mappings, :addon, index: true, foreign_key: true
    add_reference :addon_combination_mappings, :addon_combination, index: true, foreign_key: true
  
    add_index :addon_combination_mappings, [:addon_id, :addon_combination_id], unique: true, name: 'by_addon_and_addon_combination'
  end
end
