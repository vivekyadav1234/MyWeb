class AddCatalogTypeToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :catalog_type, :string, null: false, default: 'arrivae'
    add_index :products, :catalog_type
  end
end
