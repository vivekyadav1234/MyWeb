class AddModuleDimensionCustomizationColumnsToModularJobs < ActiveRecord::Migration[5.0]
  def change
  	add_column :modular_jobs, :thickness, :float
  	add_column :modular_jobs, :length, :float
  	add_column :modular_jobs, :breadth, :float
  	add_column :modular_jobs, :width, :integer
  	add_column :modular_jobs, :depth, :integer
  	add_column :modular_jobs, :height, :integer
  end
end
