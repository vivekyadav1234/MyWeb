class AddLastHandovreAtToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :last_handover_at, :datetime
  end
end
