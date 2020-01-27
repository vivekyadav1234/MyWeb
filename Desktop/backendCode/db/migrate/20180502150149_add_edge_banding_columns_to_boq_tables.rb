class AddEdgeBandingColumnsToBoqTables < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :edge_banding_shade_code, :string
    add_column :modular_jobs, :edge_banding_shade_code, :string
  end
end
