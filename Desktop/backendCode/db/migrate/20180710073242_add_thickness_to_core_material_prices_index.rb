class AddThicknessToCoreMaterialPricesIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :core_material_prices, column: [:thickness, :core_material_id]
    add_index :core_material_prices, [:thickness, :core_material_id, :category], unique: true, name: 'by_thickness_core_material_id_category'
  end
end
