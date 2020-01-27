class CreateCivilKitchenParameters < ActiveRecord::Migration[5.0]
  def change
    create_table :civil_kitchen_parameters do |t|
      t.integer :depth
      t.integer :drawer_height_1
      t.integer :drawer_height_2
      t.integer :drawer_height_3

      t.references :boq_global_config, index: true, foreign_key: true

      t.timestamps
    end
  end
end
