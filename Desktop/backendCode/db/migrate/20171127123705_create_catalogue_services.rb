class CreateCatalogueServices < ActiveRecord::Migration[5.0]
  def change
    create_table :catalogue_services do |t|
      t.string :name
      t.string :image_name
      t.string :product_type
      t.string :product_subtype
      t.string :unique_sku
      t.attachment :attachment_file
      t.references :section, index: true, foreign_key: true
      t.string :brand
      t.string :catalogue_code
      t.text :specification
      t.float :rate_per_unit
      t.float :l1_rate
      t.float :l1_quote_price
      t.float :l2_rate
      t.float :l2_quote_price
      t.float :contractor_rate
      t.float :contractor_quote_price
      t.string :measurement_unit
      t.timestamps
    end
  end
end
