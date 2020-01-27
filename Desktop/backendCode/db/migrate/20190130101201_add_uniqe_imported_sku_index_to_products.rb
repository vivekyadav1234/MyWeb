class AddUniqeImportedSkuIndexToProducts < ActiveRecord::Migration[5.0]
  def change
    add_index :products, :imported_sku, unique: true, where: 'imported_sku IS NOT NULL'
  end
end
