class CreateProductSubcategories < ActiveRecord::Migration[5.0]
  def change
    create_table :product_subcategories do |t|
      t.references :product, index: true, foreign_key: true
      t.references :catalog_subcategory, index: true, foreign_key: true

      t.timestamps
    end
  end
end
