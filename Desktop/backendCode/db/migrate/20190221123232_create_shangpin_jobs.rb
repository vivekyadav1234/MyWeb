class CreateShangpinJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :shangpin_jobs do |t|
      t.string :space

      t.string :cabinet_model_no
      t.integer :cabinet_width
      t.integer :cabinet_depth
      t.integer :cabinet_height
      t.string :cabinet_material
      t.integer :cabinet_specific_door
      t.integer :cabinet_specific_worktop
      t.integer :cabinet_specific_leg
      t.string :cabinet_handle
      t.float :cabinet_price, default: 0
      t.float :cabinet_quantity, default: 1
      t.float :cabinet_amount, default: 0

      t.string :door_style_code
      t.integer :door_width
      t.integer :door_depth
      t.integer :door_height
      t.float :door_price, default: 0
      t.float :door_quantity, default: 1
      t.float :door_amount, default: 0

      t.string :accessory_code
      t.integer :accessory_width
      t.integer :accessory_depth
      t.integer :accessory_height
      t.float :accessory_price, default: 0
      t.float :accessory_quantity, default: 1
      t.float :accessory_amount, default: 0

      t.references :ownerable, polymorphic: true

      t.timestamps
    end
  end
end
