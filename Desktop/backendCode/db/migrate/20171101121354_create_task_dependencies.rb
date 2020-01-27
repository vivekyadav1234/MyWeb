class CreateTaskDependencies < ActiveRecord::Migration[5.0]
  def up
    create_join_table :project_tasks, :upstream_dependencies, table_name: :task_dependencies do |t|
      t.index [:project_task_id, :upstream_dependency_id], unique: true, 
      name: 'index_dependencies_on_task_id_and_dependency_id'
    end
  end

  def down
    drop_table :task_dependencies
  end
end
