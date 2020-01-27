class AddTaskOwnerToTaskSet < ActiveRecord::Migration[5.0]
  def change
    add_column :task_sets, :task_owner, :string
  end
end
