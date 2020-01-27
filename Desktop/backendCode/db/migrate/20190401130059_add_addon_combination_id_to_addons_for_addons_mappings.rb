class AddAddonCombinationIdToAddonsForAddonsMappings < ActiveRecord::Migration[5.0]
  def change
    add_reference :addons_for_addons_mappings, :addon_combination, index: true, foreign_key: true
  end
end
