class AddIsNewToTaskEscalation < ActiveRecord::Migration[5.0]
  def change
    add_column :task_escalations, :is_new, :boolean, default: true
  end
end
