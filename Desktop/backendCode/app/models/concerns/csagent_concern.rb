# This module containes methods related to Csagents. This will prevent the User class from being bloated.
module CsagentConcern
  extend ActiveSupport::Concern

  # method redundant - will soon be removed
  # Leads visible to this Csagent
  # def csagent_visible_leads
  #   lead_ids = lead_users.where.not(claimed: "no").pluck(:lead_id).uniq

  #   Lead.where(id: lead_ids)
  # end

  # leads that are currently forcefully assigned to this cs_agent
  def forcefully_assigned_leads
    leads.joins(:lead_users).where(lead_users: { active: true, claimed: 'force_yes' }).distinct
  end

  # Total leads currently assigned to this Csagent, having any status.
  # assigned is wrongly used - active would have been sufficient.
  def all_assigned_active_leads
    leads.joins(:lead_users).where(lead_users: { active: true }).distinct
  end

  # All leads claimed by this agent, no matter their current status.
  def claimed_leads
    leads.joins(:lead_users).where(lead_users: { claimed: ['yes','auto_reassigned','force_reassigned'] }).distinct
  end

  # All leads claimed by this agent, no matter their current status.
  def active_claimed_leads
    leads.joins(:lead_users).where(lead_users: { claimed: 'yes', active: true }).distinct
  end

  # All leads that were claimed by him and have status currently as qualified
  def qualified_leads
    claimed_leads.where(lead_status: "qualified")
  end

  # All leads that were claimed by him and have status currently as qualified.
  # and for which this cs_agent is currently active.
  def qualified_active_leads
    active_claimed_leads.where(lead_status: "qualified")
  end

end
