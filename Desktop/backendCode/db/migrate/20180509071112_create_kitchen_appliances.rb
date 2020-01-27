class CreateKitchenAppliances < ActiveRecord::Migration[5.0]
  def change
    create_table :kitchen_appliances do |t|
      t.string :name
      t.string :code
      t.string :make
      t.float :sales_price
      t.attachment :appliance_image

      t.references :module_type, index: true, foreign_key: true

      t.timestamps
    end
  end
end
