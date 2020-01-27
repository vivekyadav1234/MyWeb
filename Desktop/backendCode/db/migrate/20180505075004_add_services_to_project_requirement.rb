class AddServicesToProjectRequirement < ActiveRecord::Migration[5.0]
  def change
    add_column :project_requirements, :service, :text
    add_column :project_requirements, :color_preference, :text
  end
end
