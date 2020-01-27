class AddUniqueSkuToProduct < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :unique_sku, :string
  end
end
