class CreateProductSegments < ActiveRecord::Migration[5.0]
  def change
    create_table :product_segments do |t|
      t.references :product, index: true, foreign_key: true
      t.references :catalog_segment, index: true, foreign_key: true

      t.timestamps
    end
  end
end
