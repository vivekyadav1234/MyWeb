class CreateProductImages < ActiveRecord::Migration[5.0]
  def change
    create_table :product_images do |t|
      t.attachment :product_image
      t.string :image_name
      t.references :product, foriegn_key: true
      t.timestamps
    end
  end
end
