class CreateModspaceCabinetPrices < ActiveRecord::Migration[5.0]
  def change
    create_table :modspace_cabinet_prices do |t|
      t.references :product_module, index: true, foreign_key: true
      t.references :core_shutter_mapping, index: true, foreign_key: true
      t.references :shutter_finish, index: true, foreign_key: true

      t.float :price, null: false, default: 0.0

      t.timestamps
    end

    add_index :modspace_cabinet_prices, [:product_module_id, :core_shutter_mapping_id, :shutter_finish_id], unique: true, name: 'on_product_module_cs_mapping_and_finish'
  end
end
