# This concern contains the functionality necessary for a ProjectHandover with respect to segments, 
# eg panel, non_panel etc. Started in Nov 2019 for BOQ handover accept by segment.
module ProjectHandovers::SegmentConcern
  extend ActiveSupport::Concern

  included do
    has_many :category_approvals, ->{ where(approval_scope: 'boq_segment_approval') }, class_name: 'Approval', as: :approvable, dependent: :destroy
  
    # Commented it because this function is now called from ProjectHandoverJob - otherwise BOQ can_edit remains
    # false due to controller code.
    # after_save :mark_accepted_segments, if: Proc.new { ownerable_type == 'Quotation' && status_changed? && status == 'pending_acceptance' }
  end

  # Process the action of a user (category roles for now) accepting or rejecting a project_handover with
  # ownerable_type 'Quotation'.
  def process_handover_action(current_user, params)
    return false unless ownerable_type == 'Quotation'
    user_role = current_user.roles.last.name
    segment_name = params[:segment]
    @segments = ownerable.get_segments
    if segment_name.blank?
      self.errors.add(:base, "Segment must be provided for BOQ accepted.")
      return false
    elsif !@segments.include?(segment_name)
      self.errors.add(:base, "Segment #{segment_name} not present in handover's BOQ.")
      return false      
    end
    # Create approval only if approval/rejection from same segment doesn't exist already.
    unless category_approvals.where(subtype: segment_name).present?
      self.category_approvals.create(approval_scope: 'boq_segment_approval', subtype: segment_name, 
        rejected: params[:status]=='rejected', role: user_role, approved_by: current_user.id, 
        approved_at: Time.zone.now, remarks: params[:remarks])
    else
      self.errors.add(:base, "Approval or rejection already exists for segment #{segment_name}.")
      return false
    end
    # However, process the handover anyway.
    new_handover_status = acceptance_status_from_approvals
    if new_handover_status != status
      self.update(status: new_handover_status, remarks: params[:remarks], status_updated_by: current_user, status_changed_on: DateTime.now)
      #Note - 'pending', not 'pending_acceptance'
      self.ownerable.update(can_edit: true, need_category_approval: false) unless status == 'pending_acceptance'
    else
      return true
    end
  end

  # Based on the approvals of this handover's BOQ's individual segments, determine if it is approved, rejected or neither.
  # If all segments have category approval, then return 'approved'.
  # If any segment has category rejection, then return 'rejected'.
  # Else return 'pending_acceptance'.
  def acceptance_status_from_approvals
    raise "This method cannot be called for ProjectHandover where ownerable_type is not Quotation." unless ownerable_type == "Quotation"
    quotation = ownerable
    @segments ||= ownerable.get_segments
    segment_statuses = @segments.map do |segment|
      segment_status_from_approvals(segment)
    end
    if segment_statuses.include?('rejected')
      return 'rejected'
    elsif segment_statuses.compact.uniq == ['accepted']
      return 'accepted'
    else
      return 'pending_acceptance'
    end
  end

  # Same as method :acceptance_status_from_approvals, except this is for only a single segment.
  # If by mistake 2 approvals exist for the same segment, then the latest one will be considered.
  def segment_status_from_approvals(segment)
    last_approval = category_approvals.boq_segment_approvals.with_subtype(segment).last_by_approved_at
    if last_approval.present?
      last_approval.rejected ? ( return 'rejected' ) : ( return 'accepted' )
    else
      return 'pending_acceptance'
    end
  end

  def segments_with_acceptance
    hsh = Hash.new
    if ownerable_type == "Quotation"
      quotation = ownerable
      @segments ||= ownerable.get_segments
      segment_statuses = @segments.map do |segment|
        hsh[segment] = segment_status_from_approvals(segment)
      end
    end

    hsh
  end

  # Get segments applicable to this BOQ handover with approvals - include only segments with approval.
  def get_segment_approvals
    approval_hash = Hash.new

    if ownerable_type == "Quotation"
      quotation = ownerable
      @segments ||= ownerable.get_segments
      @segments.each do |segment_name|
        segment_approval = category_approvals.with_subtype(segment_name).last_by_approved_at
        if segment_approval.present?
          approving_user = User.find_by_id(segment_approval.approved_by)
          approval_hash[segment_name] = {
            name: approving_user&.name,
            email: approving_user&.email,
            approval_time: segment_approval.approved_at
          }
        end
      end
    end

    approval_hash
  end

  # If this BOQ acceptance was done for a particular segment in a previous handover, and no line item of that segment have been added, 
  # updated or deleted, then for this handover also, that segment should remain accepted.
  # Note - we take only the last approval record (by approved_at) for this BOQ's handovers (no matter whether accepted or rejected).
  # If the last approval is in rejected state for this segment, then anyway segment has to be accepted again.
  def mark_accepted_segments
    quotation = ownerable
    this_boq_handovers = quotation.project_handovers
    quotation.get_segments.each do |segment_name|
      approval_record = Approval.boq_segment_approvals.where(approvable: this_boq_handovers).with_subtype(segment_name).last_by_approved_at
      # Conditions:
      # 1. For this BOQ's handovers, last approval record (by approved_at) must be present and not rejected (ie accepted).
      # 2. This handover doesn't already have an approval record for that segment.
      # 3. BOQ's line items for that segment ust not have been created, updated or deleted.
      if ( approval_record.present? && !approval_record.rejected ) && !category_approvals.boq_segment_approvals.with_subtype(segment_name).exists? && 
        !quotation.line_items_changed_of_segment?(segment_name, approval_record.approved_at)
        new_approval = self.category_approvals.boq_segment_approvals.approved.with_subtype(segment_name).create!(
          approved_by: approval_record.approved_by,
          role: approval_record.role,
          approved_at: approval_record.approved_at,
          remarks: approval_record.remarks
          )
      else
        next
      end
    end

    # Check the handover's status now. This was added for the case where all the segments of a BOQ were accepted,
    # ie the BOQ was accepted. But then the designer went back to the BOQ, didn't change any line item, 
    # handed over the BOQ again. This new handover will have all the segments already accepted, so we
    # are going to mark it as 'accepted'. Please keep this updated with the logic in the method 
    # :process_handover_action, but note that this is similar, not identical.
    new_handover_status = acceptance_status_from_approvals
    if new_handover_status == 'accepted'
      approval_record = Approval.boq_segment_approvals.where(approvable: this_boq_handovers, rejected: false).last_by_approved_at
      self.update(status: 'accepted', remarks: 'All segments already approved, and there was no change in any line items. Auto-approved by system.', 
        status_updated_by_id: approval_record.approved_by, status_changed_on: DateTime.now)
      #Note - 'pending', not 'pending_acceptance'
      quotation.update(can_edit: true, need_category_approval: false)
    end
  end
end
