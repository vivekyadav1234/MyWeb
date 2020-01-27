class AddCivilKitchenToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :civil_kitchen, :boolean, default: false
  end
end
