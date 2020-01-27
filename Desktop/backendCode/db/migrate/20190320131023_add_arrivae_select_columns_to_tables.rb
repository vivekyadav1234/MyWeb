class AddArrivaeSelectColumnsToTables < ActiveRecord::Migration[5.0]
  def change
    add_column :core_materials, :arrivae_select, :boolean, null: false, default: false
    add_column :shutter_finishes, :arrivae_select, :boolean, null: false, default: false
    add_column :shades, :arrivae_select, :boolean, null: false, default: false
    add_column :handles, :arrivae_select, :boolean, null: false, default: false
    add_column :addons, :arrivae_select, :boolean, null: false, default: false
    add_column :kitchen_appliances, :arrivae_select, :boolean, null: false, default: false
  end
end
