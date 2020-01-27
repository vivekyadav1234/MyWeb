class CreateKitchenAddonSlots < ActiveRecord::Migration[5.0]
  def change
    create_table :kitchen_addon_slots do |t|
      t.string :slot_name

      t.references :product_module, index: true, foreign_key: true

      t.timestamps
    end
  end
end
