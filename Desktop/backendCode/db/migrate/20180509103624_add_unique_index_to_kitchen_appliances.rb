class AddUniqueIndexToKitchenAppliances < ActiveRecord::Migration[5.0]
  def change
    add_index :kitchen_appliances, :code, unique: true
  end
end
