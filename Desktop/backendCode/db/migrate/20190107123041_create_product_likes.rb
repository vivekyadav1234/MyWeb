class CreateProductLikes < ActiveRecord::Migration[5.0]
  def change
    create_table :product_likes do |t|
      t.references :product, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
