class AddEstimatedCogsToTables < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :estimated_cogs, :float, default: 0.0
    add_column :boqjobs, :estimated_cogs, :float, default: 0.0
    add_column :modular_jobs, :estimated_cogs, :float, default: 0.0
    add_column :service_jobs, :estimated_cogs, :float, default: 0.0
    add_column :custom_jobs, :estimated_cogs, :float, default: 0.0
    add_column :appliance_jobs, :estimated_cogs, :float, default: 0.0
    add_column :extra_jobs, :estimated_cogs, :float, default: 0.0
  end
end
