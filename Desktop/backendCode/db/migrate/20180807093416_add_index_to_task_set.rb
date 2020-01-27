class AddIndexToTaskSet < ActiveRecord::Migration[5.0]
  def change
  	add_index :task_sets, :task_name
  end
end
