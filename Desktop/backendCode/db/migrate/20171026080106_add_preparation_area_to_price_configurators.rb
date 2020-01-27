class AddPreparationAreaToPriceConfigurators < ActiveRecord::Migration[5.0]
  def change
    add_column :price_configurators, :preparation_area, :string
  end
end
