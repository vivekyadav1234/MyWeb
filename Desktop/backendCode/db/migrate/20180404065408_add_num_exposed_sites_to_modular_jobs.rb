class AddNumExposedSitesToModularJobs < ActiveRecord::Migration[5.0]
  def change
    remove_column :product_modules, :number_exposed_sites, :integer
    remove_column :product_modules, :price, :float
    add_column :modular_jobs, :number_exposed_sites, :integer
  end
end
