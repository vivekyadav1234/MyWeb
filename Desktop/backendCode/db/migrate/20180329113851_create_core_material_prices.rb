class CreateCoreMaterialPrices < ActiveRecord::Migration[5.0]
  def change
    create_table :core_material_prices do |t|
      t.string :thickness
      t.float :price

      t.references :core_material

      t.timestamps
    end
  end
end
