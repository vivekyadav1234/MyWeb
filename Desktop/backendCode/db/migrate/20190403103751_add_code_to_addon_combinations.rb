class AddCodeToAddonCombinations < ActiveRecord::Migration[5.0]
  def change
    add_column :addon_combinations, :code, :string
    add_index :addon_combinations, :code, unique: true
  end
end
