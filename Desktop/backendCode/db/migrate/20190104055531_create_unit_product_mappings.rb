class CreateUnitProductMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :unit_product_mappings do |t|
      t.references :business_unit, index: true, foreign_key: true
      t.references :product, index: true, foreign_key: true

      t.timestamps
    end
  end
end
