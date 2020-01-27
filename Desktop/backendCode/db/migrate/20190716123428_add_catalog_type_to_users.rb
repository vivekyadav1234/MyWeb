class AddCatalogTypeToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :catalog_type, :string, null: false, default: 'arrivae'
  end
end
