class CreateModularProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :modular_products do |t|
      t.string :name
      t.string :modular_product_type
      t.string :space

      t.float :price

      t.references :section, index: true, foreign_key: true

      t.timestamps
    end
  end
end
