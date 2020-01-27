class CreateCarcassElements < ActiveRecord::Migration[5.0]
  def change
    create_table :carcass_elements do |t|
      t.string :code
      # t.string :prefix  #remove
      # t.string :element #separate table

      t.integer :width
      t.integer :depth
      t.integer :height
      t.float :length
      t.float :breadth
      t.float :thickness 
      t.integer :edge_band_thickness

      t.float :area_sqft

      t.string :category
      t.boolean :global, default: false

      t.references :product_module, index: true, foreign_key: true
      t.references :modular_product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
