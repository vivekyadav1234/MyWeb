class AddStatusToProjectTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :project_tasks, :status, :string
  end
end
