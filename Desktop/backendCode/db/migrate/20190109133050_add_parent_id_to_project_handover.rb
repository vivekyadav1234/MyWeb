class AddParentIdToProjectHandover < ActiveRecord::Migration[5.0]
  def change
    add_reference :project_handovers, :parent_handover, index: true, foreign_key: {to_table: :project_handovers}
  end
end
