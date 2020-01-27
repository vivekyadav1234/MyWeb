class ChangeColumnNameForProjectHandover < ActiveRecord::Migration[5.0]
  def change
    rename_column :project_handovers, :version, :file_version
  end
end
