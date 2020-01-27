class AddRemarksToProjectHandover < ActiveRecord::Migration[5.0]
  def change
    add_column :project_handovers, :remarks, :string
  end
end
