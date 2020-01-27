class AddSchedulerColumnsToProjectTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :project_tasks, :action_point, :string
    add_column :project_tasks, :process_owner, :string
  end
end
