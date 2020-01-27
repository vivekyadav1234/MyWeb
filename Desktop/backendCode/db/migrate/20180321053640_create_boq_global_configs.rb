class CreateBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    create_table :boq_global_configs do |t|
      t.string :core_material
      t.string :shutter_material
      t.string :shutter_finish
      t.string :shutter_shade_code
      t.string :shutter_config_type
      t.string :shutter_config_height
      t.string :door_handle_code
      t.string :shutter_handle_code
      t.string :hinge_type
      t.string :channel_type

      t.references :brand, index: true, foreign_key: true
      t.references :skirting_config, index: true, foreign_key: true

      t.timestamps
    end
  end
end
