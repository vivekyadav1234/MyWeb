class AddAssignedAgentToLeadCampaigns < ActiveRecord::Migration[5.0]
  def change
    add_reference :lead_campaigns, :assigned_cs_agent, index: true, foreign_key: { to_table: :users }
  end
end
