class CreateProjectTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :project_tasks do |t|
      t.string :internal_name, null: false
      t.string :name, null: false
      t.date :start_date
      t.date :end_date
      t.integer :duration
      t.integer :percent_completion
      t.integer :upstream_dependency_id

      t.references :project, foreign_key: true
      t.references :task_category, foreign_key: true

      t.timestamps
    end

    add_foreign_key :project_tasks, :project_tasks, column: :upstream_dependency_id
  end
end
