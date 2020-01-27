class CreateCombinedDoors < ActiveRecord::Migration[5.0]
  def change
    create_table :combined_doors do |t|
      t.string :name
      t.string :code
      t.float :price

      t.references :brand, index: true, foreign_key: true

      t.timestamps
    end

    add_index :combined_doors, :code, unique: true
  end
end
