class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.float :price
      t.text :description
      t.references :section, index: true, foreign_key: true
      t.timestamps
    end
  end
end
