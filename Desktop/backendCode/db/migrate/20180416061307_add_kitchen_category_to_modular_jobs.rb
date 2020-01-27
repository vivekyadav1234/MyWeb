class AddKitchenCategoryToModularJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :modular_jobs, :kitchen_category_name, :string
  end
end
