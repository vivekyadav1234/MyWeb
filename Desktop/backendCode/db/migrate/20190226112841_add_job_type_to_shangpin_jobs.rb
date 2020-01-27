class AddJobTypeToShangpinJobs < ActiveRecord::Migration[5.0]
  def change
  	add_column :shangpin_jobs, :job_type, :string, null: false

	add_column :shangpin_jobs, :amount, :float, null: false, default: 0	
  end
end
