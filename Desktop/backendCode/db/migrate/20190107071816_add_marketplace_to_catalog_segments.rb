class AddMarketplaceToCatalogSegments < ActiveRecord::Migration[5.0]
  def change
    add_column :catalog_segments, :marketplace, :boolean, default: false
  end
end
