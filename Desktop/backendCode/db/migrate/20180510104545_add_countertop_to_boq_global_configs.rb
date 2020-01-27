class AddCountertopToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :countertop, :string, default: 'none'
  end
end
