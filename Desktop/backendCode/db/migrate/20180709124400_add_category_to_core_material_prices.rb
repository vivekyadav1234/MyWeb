class AddCategoryToCoreMaterialPrices < ActiveRecord::Migration[5.0]
  def change
    add_column :core_material_prices, :category, :string, default: 'kitchen'
  end
end
