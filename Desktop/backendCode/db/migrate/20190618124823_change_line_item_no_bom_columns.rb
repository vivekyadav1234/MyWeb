class ChangeLineItemNoBomColumns < ActiveRecord::Migration[5.0]
  def change
    remove_column :boqjobs, :no_cutting_list, :boolean, null:false, default: false
    remove_column :modular_jobs, :no_cutting_list, :boolean, null:false, default: false
    remove_column :service_jobs, :no_cutting_list, :boolean, null:false, default: false
    remove_column :custom_jobs, :no_cutting_list, :boolean, null:false, default: false
    remove_column :appliance_jobs, :no_cutting_list, :boolean, null:false, default: false
    remove_column :extra_jobs, :no_cutting_list, :boolean, null:false, default: false

    remove_column :boqjobs, :no_hardware_list, :boolean, null:false, default: false
    remove_column :modular_jobs, :no_hardware_list, :boolean, null:false, default: false
    remove_column :service_jobs, :no_hardware_list, :boolean, null:false, default: false
    remove_column :custom_jobs, :no_hardware_list, :boolean, null:false, default: false
    remove_column :appliance_jobs, :no_hardware_list, :boolean, null:false, default: false
    remove_column :extra_jobs, :no_hardware_list, :boolean, null:false, default: false
  end
end
