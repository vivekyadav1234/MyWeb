class AddCategoryToExtraJobs < ActiveRecord::Migration[5.0]
  def change
    add_column :extra_jobs, :category, :string
  end
end
