class AddColumnToPriceConfigurator < ActiveRecord::Migration[5.0]
  def change
    add_column :price_configurators, :kitchen_type, :string
    add_column :price_configurators, :finish_type, :string
  end
end
