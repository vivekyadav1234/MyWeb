class AddShutterAndDoorHandle < ActiveRecord::Migration[5.0]
  def change
  	add_column :product_modules, :number_shutter_handles, :integer
  	add_column :product_modules, :number_door_handles, :integer
  end
end
