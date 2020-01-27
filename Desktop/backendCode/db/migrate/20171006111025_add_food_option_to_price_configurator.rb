class AddFoodOptionToPriceConfigurator < ActiveRecord::Migration[5.0]
  def change
    add_column :price_configurators, :food_option, :string
  end
end
