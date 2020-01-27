class ChangeCoreMaterialPriceThicknessToFloat < ActiveRecord::Migration[5.0]
  def self.up
    change_column :core_material_prices, :thickness, "float USING CAST(thickness AS float)"
  end

  def self.down
    change_column :core_material_prices, :thickness, :string
  end
end
