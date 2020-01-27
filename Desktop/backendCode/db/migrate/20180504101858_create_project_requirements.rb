class CreateProjectRequirements < ActiveRecord::Migration[5.0]
  def change
    create_table :project_requirements do |t|
      t.references :project, foreign_key: true
      t.string :requirement_name
      t.string :budget

      t.timestamps
    end
  end
end
