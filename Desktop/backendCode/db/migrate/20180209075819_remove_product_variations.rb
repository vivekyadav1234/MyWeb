class RemoveProductVariations < ActiveRecord::Migration[5.0]
  def change
    remove_reference :boqjobs, :product_variation, index: true, foreign_key: true
    drop_table :product_variations

    add_reference :products, :parent_product, index: true, foreign_key: {to_table: :products}
  end
end
