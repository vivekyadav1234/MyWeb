class ChangeHandoverStatusColumnType < ActiveRecord::Migration[5.0]
  def change
    rename_column :project_handovers, :shared, :status
    change_column :project_handovers, :status, :string
  end
end
