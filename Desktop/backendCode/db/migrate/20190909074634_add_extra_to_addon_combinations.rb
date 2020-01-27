class AddExtraToAddonCombinations < ActiveRecord::Migration[5.0]
  def change
    add_column :addon_combinations, :extra, :boolean, null: false, default: false
    add_column :addon_combinations, :hidden, :boolean, null: false, default: false
  end
end
