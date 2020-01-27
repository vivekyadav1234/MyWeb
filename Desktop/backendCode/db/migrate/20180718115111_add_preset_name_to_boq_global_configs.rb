class AddPresetNameToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :preset_name, :string
  end
end
