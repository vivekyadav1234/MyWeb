class AddSeenColumnsToTaskEscalations < ActiveRecord::Migration[5.0]
  def change
    add_column :task_escalations, :seen, :boolean, default: false
    # add_reference :task_escalations, :seen_by, index: true, foreign_key: { to_table: :users }
  end
end
