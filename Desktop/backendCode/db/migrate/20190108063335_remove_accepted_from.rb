class RemoveAcceptedFrom < ActiveRecord::Migration[5.0]
  def change
    remove_column :project_handovers, :accepted
  end
end
