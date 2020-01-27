# == Schema Information
#
# Table name: proposals
#
#  id              :integer          not null, primary key
#  proposal_type   :string
#  proposal_name   :string
#  project_id      :integer
#  designer_id     :integer
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  proposal_status :string
#  is_draft        :string
#

class Proposal < ApplicationRecord
  has_paper_trail

  belongs_to :designer, class_name: 'User', foreign_key: 'designer_id'
  belongs_to :project
  has_many :proposal_docs , dependent: :destroy
  has_many :quotations, through: :proposal_docs, source: :ownerable, source_type: 'Quotation'
  has_many :presentations, through: :proposal_docs, source: :ownerable, source_type: 'Presentation'
  has_many :boq_and_ppt_uploads, through: :proposal_docs, source: :ownerable, source_type: 'BoqAndPptUpload'

  # Values of max discount that these roles can approve.
  DISCOUNT_THRESHOLD = {
    designer: 14.0,
    community_manager: 19.0,
    city_gm: 24.0,
    business_head: 100.0
  }

  scope :proposal_shared, -> { where(proposal_status: 'proposal_shared') }

  def manage_task_sets
    if self.proposal_type == "initial_design"
      self.quotations.each do |quotation|
        if quotation.discount_value.present? && quotation.discount_value != 0
          TaskEscalation.invoke_task(["Discount Proposal", "Discount Approval"], "10 %", quotation)
          TaskEscalation.mark_done_task("Discount Proposal", "10 %", quotation)
        end
        TaskEscalation.mark_done_task("Create Proposal", "10 %", quotation)
      end
    elsif self.proposal_type == "final_design"
      self.quotations.each do |quotation|
        if quotation.discount_value.present? && quotation.discount_value != 0 && quotation.discount_status == "proposed_for_discount"
          TaskEscalation.invoke_task(["Discount Proposal", "Discount Approval"], "10% - 40%", quotation)
          TaskEscalation.mark_done_task("Discount Proposal", "10% - 40%", quotation)
          TaskEscalation.mark_done_task("Create Proposal", "10% - 40%", quotation)
        else
          TaskEscalation.mark_done_task("Create Proposal", "10% - 40%", quotation)
          # TaskEscalation.invoke_task(["Approve Final BOQ by Category", "Approve Final BOQ by CM"], "10% - 40%", quotation)
        end
      end
    end
  end

  def manage_task_for_sharing
    if self.proposal_type == "initial_design"
      self.quotations.each do |quotation|
        TaskEscalation.mark_done_task("Proposal Sharing", "10 %", quotation)
      end
    elsif self.proposal_type == "final_design"
      self.quotations.each do |quotation|
        TaskEscalation.mark_done_task("Proposal Sharing", "10% - 40%", quotation) #if quotation.cm_approval && quotation.category_approval
      end
    end
  end

  def increment_units_sold_count
    quotations.each do |quotation|
      quotation.boqjobs.each do |boqjob|
        product = boqjob.product
        product.update!(units_sold: product.units_sold + boqjob.quantity.to_i)
      end
    end
  end

  def manage_discount_task(quotation)
    if self.proposal_type == "initial_design"
      TaskEscalation.mark_done_task("Discount Approval", "10 %", quotation)
    elsif self.proposal_type == "final_design"
      TaskEscalation.mark_done_task("Discount Approval", "10% - 40%", quotation)
      # TaskEscalation.invoke_task(["Approve Final BOQ by Category", "Approve Final BOQ by CM"], "10% - 40%", quotation)
    end
  end

  def destroy_tasks
    if self.proposal_type == "initial_design"
      self.quotations.each do |quotation|
        TaskEscalation.destroy_task(quotation)
        task_escalations = quotation.task_escalations.where(task_set: TaskSet.where(task_name: ["Discount Proposal", "Discount Approval"])).destroy_all
        if quotation.discount_value.present? && quotation.discount_value != 0
          quotation.update(discount_value: nil, discount_status: nil)
          # TaskEscalation.undo_mark_done_task("Discount Proposal", "10 %", quotation)
        end
        TaskEscalation.undo_mark_done_task("Create Proposal", "10 %", quotation)
      end
    elsif self.proposal_type == "final_design"
      self.quotations.each do |quotation|
        TaskEscalation.destroy_task(quotation)
        task_escalations = quotation.task_escalations.where(task_set: TaskSet.where(task_name: ["Discount Proposal", "Discount Approval"])).destroy_all
        if quotation.discount_value.present? && quotation.discount_value != 0
          quotation.update(discount_value: quotation.parent_quotation.discount_value, discount_status: nil)
          # TaskEscalation.undo_mark_done_task("Discount Proposal", "10% - 40%", quotation)
          TaskEscalation.undo_mark_done_task("Create Proposal", "10% - 40%", quotation)
        else
          TaskEscalation.undo_mark_done_task("Create Proposal", "10% - 40%", quotation)
        end
      end
    end
  end

  def add_ownerables(ownerable_array, proposed_by_id)
  	flag = 0
  	ownerable_array.each do |ownerable|
  	  @proposal_docs = self.proposal_docs.build(ownerable)
      @quotation = @proposal_docs.ownerable if @proposal_docs.ownerable_type == "Quotation"
      if @quotation.present?
        @quotation.wip_status = self.proposal_type == "initial_design" ? "pre_10_percent" : "10_50_percent"

        if ownerable["discount_value"].present? && ownerable["discount_value"].to_f != 0.0
          @proposal_docs.discount_status = "proposed_for_discount"
          if @quotation.present?
            @quotation.discount_status = "proposed_for_discount"
            @quotation.discount_value =  ownerable["discount_value"]
            @quotation.save!
            UserNotifierMailer.complete_discount_approval_email(@quotation).deliver_now! 
            #UserNotifierMailer.discount_for_approval(self, proposed_by_id, @quotation).deliver_now! 
          end
          flag = 1
        else
          @proposal_docs.discount_status = "no_discount"
          if @quotation.present?
            @quotation.discount_status = "no_discount"
            @quotation.save!
          end
    	  end
      end
  	  @proposal_docs.save!
  	end
    if flag == 0
      self.update_attributes!(proposal_status: "pending")
    else
      self.update_attributes!(proposal_status: "proposal_for_discount")
    end
  end

  def quotations_check
    quotations = self.quotations
    msg = ""
    quotations.each do |quotation|
      if quotation.need_category_approval == true
        msg = "#{quotation.reference_number} is not approved by Category"
        break
      end
      if quotation.project_handovers&.last&.status == "rejected"
        msg = "#{quotation.reference_number} is Rejected by Category"
        break
      end
    end
    return msg
  end

end
