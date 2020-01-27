class AddActiveToDesignerProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :designer_projects, :active, :boolean, default: false
  end
end
