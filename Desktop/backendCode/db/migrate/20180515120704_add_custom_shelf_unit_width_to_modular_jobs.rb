class AddCustomShelfUnitWidthToModularJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :modular_jobs, :custom_shelf_unit_width, :integer, default: 0
  end
end
