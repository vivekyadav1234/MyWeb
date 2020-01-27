class CreateProductRangeTags < ActiveRecord::Migration[5.0]
  def change
    create_table :product_range_tags do |t|
      t.references :product, index: true, foreign_key: true
      t.references :tag, index: true, foreign_key: true

      t.timestamps
    end
  end
end
