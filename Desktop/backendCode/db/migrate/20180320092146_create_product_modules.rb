class CreateProductModules < ActiveRecord::Migration[5.0]
  def change
    create_table :product_modules do |t|
      t.string :code
      t.string :description
      t.boolean :global, default: false
      # t.string :module_type  #table
      t.integer :width
      t.integer :depth
      t.integer :height

      # # columns affected by global variables
      # t.string :core_material
      # t.string :shutter_material
      # t.string :shutter_finish
      # t.string :shutter_shade_code
      # t.string :skirting_config_type
      # t.string :skirting_config_height
      # t.string :door_handle_code
      # t.string :shutter_handle_code
      # t.string :hinge_type
      # t.string :channel_type

      t.string :category

      # customizations
      t.integer :number_exposed_sites

      # price
      t.float :price

      t.references :modular_product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
