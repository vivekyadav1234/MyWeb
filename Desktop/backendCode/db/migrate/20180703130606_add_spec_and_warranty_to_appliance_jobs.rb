class AddSpecAndWarrantyToApplianceJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :appliance_jobs, :specifications, :string
    add_column :appliance_jobs, :warranty, :string
  end
end
