class ChangeColtypeForProjectTask < ActiveRecord::Migration[5.0]
  def change
    add_column :project_tasks, :remarks, :text
    change_column :project_tasks, :action_point, 'integer USING CAST(action_point AS integer)'
    change_column :project_tasks, :process_owner, 'integer USING CAST(process_owner AS integer)'
  end
end
