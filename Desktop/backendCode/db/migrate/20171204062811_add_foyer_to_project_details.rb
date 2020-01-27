class AddFoyerToProjectDetails < ActiveRecord::Migration[5.0]
  def change
  	add_column :project_details, :foyer, :json, null: false, default: {}
  end
end
