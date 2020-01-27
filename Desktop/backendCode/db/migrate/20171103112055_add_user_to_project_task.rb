class AddUserToProjectTask < ActiveRecord::Migration[5.0]
  def change
    add_reference :project_tasks, :user, foreign_key: true
  end
end
