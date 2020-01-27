class ChangeSalePriceToPriceInKitchenAppliances < ActiveRecord::Migration[5.0]
  def change
    rename_column :kitchen_appliances, :sales_price, :price
  end
end
