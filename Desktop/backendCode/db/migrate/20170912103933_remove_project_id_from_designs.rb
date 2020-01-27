class RemoveProjectIdFromDesigns < ActiveRecord::Migration[5.0]
  def change
    remove_column :designs, :project_id, :integer
  end
end
