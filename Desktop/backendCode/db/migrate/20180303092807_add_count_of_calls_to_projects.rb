class AddCountOfCallsToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :count_of_calls, :integer
    add_column :projects, :status_updated_at, :datetime
  end
end
