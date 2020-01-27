class AddAddonCombinationToKitchenModuleAddonMappings < ActiveRecord::Migration[5.0]
  def change
    add_reference :kitchen_module_addon_mappings, :addon_combination, index: true, foreign_key: true
  
    add_index :kitchen_module_addon_mappings, [:kitchen_addon_slot_id, :addon_combination_id], unique: true, name: 'by_slot_and_addon_combination'
  end
end
