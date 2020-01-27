class AddCountOfCallsToDesignerProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :designer_projects, :count_of_calls,:integer
  end
end
