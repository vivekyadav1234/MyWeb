class AddTimelineToModularJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :modular_jobs, :lead_time, :integer, default: 0, null: false
    add_column :modular_jobs, :lead_time_type, :string
    add_column :modular_jobs, :lead_time_code, :string
  end
end
