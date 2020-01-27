class AddPresetColumnsToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :is_preset, :boolean, default: false
    add_column :boq_global_configs, :preset_remark, :string
    
    add_reference :boq_global_configs, :preset_created_by, index: true, foreign_key: { to_table: :users }
  end
end
