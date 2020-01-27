class ChangeColumnNameDpqProject < ActiveRecord::Migration[5.0]
  def change
  	rename_column :dpq_projects, :type, :project_type
  end
end
