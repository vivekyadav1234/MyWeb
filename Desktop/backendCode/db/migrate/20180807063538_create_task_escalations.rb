class CreateTaskEscalations < ActiveRecord::Migration[5.0]
  def change
    create_table :task_escalations do |t|
      t.references :task_set, foreign_key: true
      t.references :ownerable, polymorphic: true
      t.integer :task_owner
      t.datetime :start_time
      t.datetime :end_time
      t.datetime :completed_at
      t.text :remark
      t.string :status, :default => "no"

      t.timestamps
    end
  end
end
