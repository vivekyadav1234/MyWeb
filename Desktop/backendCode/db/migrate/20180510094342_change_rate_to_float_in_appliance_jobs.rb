class ChangeRateToFloatInApplianceJobs < ActiveRecord::Migration[5.0]
  def change
  	change_column :appliance_jobs, :rate, 'float USING CAST(rate AS float)'
  end
end
