class ChangeSkirtingColumnNamesInBoqglobalConfigs < ActiveRecord::Migration[5.0]
  def change
    rename_column :boq_global_configs, :shutter_config_type, :skirting_config_type
    rename_column :boq_global_configs, :shutter_config_height, :skirting_config_height
  end
end
