class CreateModularJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :modular_jobs do |t|
      t.string :name
      t.float :quantity
      t.float :rate
      t.float :amount
      t.string :space
      t.string :category
      t.string :dimensions

      # columns affected by global variables
      t.string :core_material
      t.string :shutter_material
      t.string :shutter_finish
      t.string :shutter_shade_code
      t.string :skirting_config_type
      t.string :skirting_config_height
      t.string :door_handle_code
      t.string :shutter_handle_code
      t.string :hinge_type
      t.string :channel_type

      t.references :ownerable, polymorphic: true, index: true
      t.references :product_module, index: true, foreign_key: true

      t.timestamps
    end

    add_column :boqjobs, :space, :string
  end
end
