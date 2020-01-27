class AddCounterTopWidthToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :countertop_width, :integer
  end
end
