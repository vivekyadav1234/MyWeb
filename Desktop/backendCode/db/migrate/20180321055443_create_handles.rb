class CreateHandles < ActiveRecord::Migration[5.0]
  def change
    create_table :handles do |t|
      t.string :code
      t.string :handle_type
      t.float :price

      t.boolean :global, default: false

      t.attachment :handle_image

      t.references :product_module, index: true, foreign_key: true
      t.references :modular_product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
