class CreateHardwareElements < ActiveRecord::Migration[5.0]
  def change
    create_table :hardware_elements do |t|
      t.string :code
      # t.string :type_of_hardware #table
      # t.string :element #table - same as carcass
      t.string :category

      t.string :unit
      t.float :price

      t.boolean :global, default: false

      t.references :product_module, index: true, foreign_key: true
      t.references :modular_product, index: true, foreign_key: true
      t.references :brand, index: true, foreign_key: true

      t.timestamps
    end
  end
end
