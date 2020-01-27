class RenameColumnProductVariant < ActiveRecord::Migration[5.0]
  def change
  	rename_column :product_variants, :product_varient_code, :product_variant_code
  end
end
