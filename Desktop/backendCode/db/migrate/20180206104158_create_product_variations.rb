class CreateProductVariations < ActiveRecord::Migration[5.0]
  def change
    create_table :product_variations do |t|
      t.string :name
      t.string :material
      t.string :color

      t.references :product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
