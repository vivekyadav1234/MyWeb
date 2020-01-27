class AddColumnToShangpinJob < ActiveRecord::Migration[5.0]
  def change
    add_column :shangpin_jobs, :job_spec_door, :integer
    add_column :shangpin_jobs, :job_spec_worktop, :integer
    add_column :shangpin_jobs, :job_spec_leg, :integer
    add_column :shangpin_jobs, :cabinet_platform, :string
    add_column :shangpin_jobs, :cabinet_door, :integer
    add_column :shangpin_jobs, :job_handle, :string
    add_column :shangpin_jobs, :job_material, :string
    add_column :shangpin_jobs, :imported_file_type, :string
  end
end
