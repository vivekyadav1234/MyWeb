class ChangeColumnOfProjectTask < ActiveRecord::Migration[5.0]
  def change
  	change_column :project_tasks, :action_point, :string
    change_column :project_tasks, :process_owner, :string
  end
end
