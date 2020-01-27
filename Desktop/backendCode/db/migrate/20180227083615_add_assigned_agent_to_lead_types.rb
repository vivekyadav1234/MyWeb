class AddAssignedAgentToLeadTypes < ActiveRecord::Migration[5.0]
  def change
    add_reference :lead_types, :assigned_cs_agent, index: true, foreign_key: { to_table: :users }
  end
end
