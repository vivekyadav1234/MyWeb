class AddCombinedFieldsToModularJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :modular_jobs, :combined_module, index: true, foreign_key: { to_table: :modular_jobs }
    add_column :modular_jobs, :combined, :boolean, default: false
  end
end
