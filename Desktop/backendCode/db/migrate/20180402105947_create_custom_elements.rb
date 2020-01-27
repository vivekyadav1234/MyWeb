class CreateCustomElements < ActiveRecord::Migration[5.0]
  def change
    create_table :custom_elements do |t|
      t.string :name
      t.string :measurements
      t.float :price
      t.attachment :element_image

      t.boolean :global, default: false

      t.references :product_module, index: true, foreign_key: true

      t.timestamps
    end
  end
end
