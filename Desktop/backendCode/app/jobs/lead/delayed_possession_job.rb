# Set the lead_status of a lead to 'not_attempted' on the given time so that 
class Lead::DelayedPossessionJob < ApplicationJob
  queue_as :leads

  def perform(lead)
    # allowed only for some lead_status values, ignore for the rest.
    if lead.lead_status.in?(["delayed_possession", "delayed_project", "follow_up", "not_contactable"])
      lead_users.map { |lu| lu.update!(active: false) }  #unassign any cs_agent, just in case.
      lead.update(lead_status: 'not_attempted')
    else
      Rails.logger.info "Status of lead ID #{lead.id} was not changed because it did not have one of these statuses -
        delayed_possession, delayed_project, follow_up, not_contactable."
    end
  end
end
