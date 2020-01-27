# This module containes methods related to Csagents. This will prevent the User class from being bloated.
module ClientConcern
  extend ActiveSupport::Concern

  # # Leads visible to this Csagent
  # def csagent_visible_leads
  #   lead_ids = lead_users.where.not(claimed: "no").pluck(:lead_id).uniq

  #   Lead.where(id: lead_ids)
  # end

  # # Total leads assigned to this Csagent, by any means having any status.
  # def all_assigned_leads
  #   leads
  # end

  # # All leads claimed by this agent, no matter their current status.
  # def claimed_leads
  #   lead_ids = lead_users.find_all{|lu| lu.claimed == "yes"}.pluck(:lead_id)
  #   Lead.where(id: lead_ids)
  # end

  # # All leads that were claimed by him and then qualified
  # def qualified_leads
  #   claimed_leads.where(lead_status: "approved")
  # end

end