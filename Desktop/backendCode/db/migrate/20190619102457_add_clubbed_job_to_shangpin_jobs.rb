class AddClubbedJobToShangpinJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :shangpin_jobs, :clubbed_job    
  end
end
