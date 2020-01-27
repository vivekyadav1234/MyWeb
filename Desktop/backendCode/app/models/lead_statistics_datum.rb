# == Schema Information
#
# Table name: lead_statistics_data
#
#  id                      :integer          not null, primary key
#  lead_qualification_time :datetime
#  first_meeting_time      :datetime
#  first_shared_time       :datetime
#  closure_time            :datetime
#  lead_id                 :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  first_shared_value      :float            default(0.0), not null
#  closure_value           :float            default(0.0), not null
#  boq_creation_time       :datetime
#  boq_creation_value      :float            default(0.0), not null
#  designer_assign_time    :datetime
#  designer_first_call     :datetime
#  cm_assigned_date        :datetime
#  boq_shangpin_value      :float            default(0.0)
#  closer_shangpin_value   :float            default(0.0)
#

class LeadStatisticsDatum < ApplicationRecord
  belongs_to :lead, required: true
  validates_uniqueness_of :lead_id

  # run all methods to populate data (which is difficult to get directly, or costly to compute).
  def self.populate_qualified_data(lead_ids=[])
    if lead_ids.present?
      leads = Lead.where(id: lead_ids)
    else
      leads = Lead.approved_users
    end
    leads.map do |lead|
      begin
        lead_stat = LeadStatisticsDatum.where(lead: lead).first_or_initialize
        lead_stat.save!
        project = lead.lead_status == "qualified" ?  lead.project : nil
        lead_qualification_time = project&.created_at
        first_meeting_time = project&.events&.where(agenda: "first_meeting", status: "done")&.first&.scheduled_at
        lead_stat.update_columns(
          lead_qualification_time: lead_qualification_time,
          first_meeting_time: first_meeting_time,
          )
        lead_stat.set_first_sharing_values
        lead_stat.set_closure_values
        lead_stat.set_boq_creation_values
        lead_stat.set_designer_aggignment_call_values
        lead_stat.set_cm_assigned_date
      rescue StandardError => e
        ExceptionNotifier.notify_exception(e)
      end
    end
  end

  # First time a proposal is shared
  def set_first_sharing_values
    project = lead.project
    return nil if project.blank?
    first_shared_proposal = project.proposals.where(proposal_status: 'proposal_shared').order(sent_at: :asc).limit(1).take
    return nil if first_shared_proposal.blank?
    first_shared_boq = first_shared_proposal.quotations.order(created_at: :asc).first
    first_shared_boq_value = first_shared_boq.present? ? first_shared_boq.total_amount : 0
    self.update_columns(
      first_shared_time: first_shared_proposal&.sent_at,
      first_shared_value: first_shared_boq_value
      )
  end

  def set_closure_values
    project = lead.project
    return nil if project.blank?
    payments = project.payments.where(is_approved: [true, nil]).where(payment_type: "initial_design")
    if payments.blank?
    self.update_columns(
      closure_time: nil,
      closure_value: 0
      )
      return 
    end
    closure_boqs = Quotation.joins(:payments).where(payments: {id: payments}).where(parent_quotation_id: nil).distinct
    closure_value = closure_boqs.present? ? closure_boqs.pluck(:total_amount).compact.sum : 0
    closure_shangpin_value  = closure_boqs.present? ? closure_boqs.pluck(:shangpin_amount).compact.sum : 0
    self.update_columns(
      closure_time: payments.order(created_at: :asc).limit(1).take.created_at,
      closure_value: closure_value,
      closer_shangpin_value: closure_shangpin_value
      )
  end

  def set_boq_creation_values
    project = lead.project
    return nil if project.blank?
    first_created_boq = project.quotations.order(id: :asc).first
    return nil if first_created_boq.blank?
    self.update_columns(
      boq_creation_time: first_created_boq.created_at,
      boq_creation_value: first_created_boq.total_amount.to_f,
      boq_shangpin_value: first_created_boq.shangpin_amount.to_f
      )
  end

  def set_designer_aggignment_call_values
    project = lead.project
    return nil if project.nil?
    if project.present? && project.designer_projects.present?
      first_designer_allocation_time = project&.designer_projects&.first&.created_at
    end
    first_designer_call = project.events.where(status: "done").first&.scheduled_at
    self.update_columns(
      designer_assign_time: first_designer_allocation_time,
      designer_first_call: first_designer_call
    )
  end

  def set_cm_assigned_date
    return nil if lead.assigned_cm_id.blank?
    versions = lead.versions
    vs = versions.select{|version|  version.changeset&.has_key?('assigned_cm_id')}.first
    cm_assigned_date = vs&.created_at
    self.update_columns(
      cm_assigned_date: cm_assigned_date
    )
  end
end
