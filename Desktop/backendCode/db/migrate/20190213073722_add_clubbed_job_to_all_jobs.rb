class AddClubbedJobToAllJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :boqjobs, :clubbed_job
    add_reference :modular_jobs, :clubbed_job
    add_reference :service_jobs, :clubbed_job
    add_reference :custom_jobs, :clubbed_job
    add_reference :appliance_jobs, :clubbed_job
    add_reference :extra_jobs, :clubbed_job
  end
end
