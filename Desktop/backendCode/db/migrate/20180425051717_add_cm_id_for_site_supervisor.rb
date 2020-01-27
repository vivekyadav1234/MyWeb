class AddCmIdForSiteSupervisor < ActiveRecord::Migration[5.0]
  def change
  	add_column :users, :cm_for_site_supervisor_id, :integer
    add_index :users, :cm_for_site_supervisor_id
    add_foreign_key :users, :users, column: :cm_for_site_supervisor_id
  end
end
