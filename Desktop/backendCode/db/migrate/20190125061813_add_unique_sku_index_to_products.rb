class AddUniqueSkuIndexToProducts < ActiveRecord::Migration[5.0]
  def change
    add_index :products, :unique_sku, unique: true
  end
end
