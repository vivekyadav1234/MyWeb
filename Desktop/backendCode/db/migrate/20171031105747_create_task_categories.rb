class CreateTaskCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :task_categories do |t|
      t.string :name

      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end
