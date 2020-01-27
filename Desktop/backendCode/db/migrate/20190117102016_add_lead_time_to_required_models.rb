class AddLeadTimeToRequiredModels < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :lead_time, :integer, default: 0
    add_column :shutter_finishes, :lead_time, :integer, default: 0
    add_column :shades, :lead_time, :integer, default: 0
    add_column :skirting_configs, :lead_time, :integer, default: 0
    add_column :core_materials, :lead_time, :integer, default: 0
    add_column :handles, :lead_time, :integer, default: 0
    add_column :addons, :lead_time, :integer, default: 0
    add_column :kitchen_appliances, :lead_time, :integer, default: 0
  end
end
