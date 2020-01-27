class AddLeadQueueIdToLeadUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :lead_users, :seen_by_agent, :boolean, default: false
  end
end
