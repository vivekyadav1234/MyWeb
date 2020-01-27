# == Schema Information
#
# Table name: task_sets
#
#  id              :integer          not null, primary key
#  task_name       :string
#  duration_in_hr  :string
#  notify_to       :text             default([]), is an Array
#  notify_by_email :boolean
#  notify_by_sms   :boolean
#  optional        :boolean
#  stage           :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  task_owner      :string
#

class TaskSet < ApplicationRecord
	has_paper_trail
	validates_presence_of :task_name
	validates_presence_of :stage
	validates_uniqueness_of :task_name, scope: :stage
	has_many :task_escalations

	PROJECT_TASKS = ["Upload Floor Plan", "Site Visit ", "EC Visit ", "Upload Requirement Sheet", "Create Initial BOQ", "Client PPT", "Scope Checklist",
	      "Booking form", "Request site measurement", "Assign SS for site measurement", "upload measurements"]

	QUOTATION_TASKS = ["Custom Elements Estimation", "Create Proposal", "Discount Proposal", "Discount Approval", "Proposal Sharing", "Client Approval", 
				"Payment Addition", "Payment Verification", "CM Approval for less than 10% Payment", "Custom Elements Feasibility", "Create Final BOQ", 
				"Client final PPT with 3D render", "Approve Final BOQ by CM", "Approve Final BOQ by Category", "Upload CAD files", "CM Approval for less than 40% Payment",
				"SLI Creation", "Vendor Selection", "Create Purchase Order", "Purchse Order Release", "Upload PI", "Payment Request", "Payment Release"]
	
  # used to calculated target BOQ shared for Admin Metrics
  BOQ_SHARING_TASK = ["Proposal Sharing"]
  BOQ_SHARING_STAGES = ["10 %", "10% - 40%"]
  BOQ_PAYMENT_ADDITION_TASKS = ["Payment Addition"]
  # END Admin metrics

  SLI_CREATION = "SLI Creation"

	scope :pre_bid_tasks, -> {where(stage: "pre bid").order(:id)}
	scope :ten_per_tasks, -> {where(stage: "10 %").order(:id)}
	scope :ten_to_forty_per_tasks, -> {where(stage: "10% - 40%").order(:id)}
	scope :fifty_per_tasks, -> {where(stage: "50 %").order(:id)}

  def TaskSet.sli_creation_task
    TaskSet.find_by(task_name: "SLI Creation")
  end

  def TaskSet.vendor_selection_task
    TaskSet.find_by(task_name: "Vendor Selection")
  end

  def TaskSet.po_release_task
    TaskSet.find_by(task_name: "Purchse Order Release")
  end

  def TaskSet.pi_upload_task
    TaskSet.find_by(task_name: "Upload PI")
  end

  def TaskSet.payment_release_task
    TaskSet.find_by(task_name: "Payment Release")
  end 

  def next_compulsory_task
    self.class.where("id > ? and optional = ?", id, false)&.first
  end

  def previous
    self.class.where("id < ?", id).last
  end
end
