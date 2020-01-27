class CreateAddons < ActiveRecord::Migration[5.0]
  def change
    create_table :addons do |t|
      t.string :code
      t.string :name

      # t.integer :width
      # t.integer :depth
      # t.integer :height

      t.string :specifications  #eg lxbxh
      t.float :price

      t.boolean :global, default: false

      t.references :product_module, index: true, foreign_key: true
      t.references :modular_product, index: true, foreign_key: true
      t.references :brand, index: true, foreign_key: true

      t.timestamps
    end
  end
end
