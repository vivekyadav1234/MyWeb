class AddColumnToProjectHandover < ActiveRecord::Migration[5.0]
  def change
    add_column :project_handovers, :created_by, :integer
  end
end
