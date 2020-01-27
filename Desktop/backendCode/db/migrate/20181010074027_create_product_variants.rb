class CreateProductVariants < ActiveRecord::Migration[5.0]
  def change
    create_table :product_variants do |t|
      t.string :name
      t.string :product_varient_code, index: true, unique: true
      t.references :catalogue_option

      t.timestamps
    end
  end
end
