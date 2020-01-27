class RemoveCodeFromApplianceJobs < ActiveRecord::Migration[5.0]
  def change
    remove_column :appliance_jobs, :code, :string
    remove_column :appliance_jobs, :subcategory, :string

    add_column :appliance_jobs, :vendor_sku, :string
  end
end
