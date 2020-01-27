class CreateAddonCombinations < ActiveRecord::Migration[5.0]
  def change
    create_table :addon_combinations do |t|
      t.string :combo_name, default: "default"

      t.timestamps
    end
  end
end
