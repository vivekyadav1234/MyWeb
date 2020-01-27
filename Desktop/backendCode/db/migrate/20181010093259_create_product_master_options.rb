class CreateProductMasterOptions < ActiveRecord::Migration[5.0]
  def change
    create_table :product_master_options do |t|
      t.references :product
      t.references :master_option
      t.timestamps
    end
  end
end
