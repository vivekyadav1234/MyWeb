class AddSpecAndWarrantyToKitchenAppliances < ActiveRecord::Migration[5.0]
  def change
    add_column :kitchen_appliances, :specifications, :string
    add_column :kitchen_appliances, :warranty, :string
  end
end
