# == Schema Information
#
# Table name: custom_elements
#
#  id                 :integer          not null, primary key
#  project_id         :integer
#  name               :string
#  dimension          :string
#  core_material      :string
#  shutter_finish     :string
#  designer_remark    :text
#  photo_file_name    :string
#  photo_content_type :string
#  photo_file_size    :integer
#  photo_updated_at   :datetime
#  ask_price          :float
#  price              :float
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  category_remark    :text
#  status             :string           default("pending")
#  seen_by_category   :boolean          default(FALSE)
#  asked_timeline     :integer          default(0)
#  timeline           :integer          default(0)
#  space              :string
#

class CustomElement < ApplicationRecord
  has_paper_trail

  belongs_to :project

  has_many :custom_jobs   #NO dependent: :destroy!!!
  has_attached_file :photo, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :photo

  validates_presence_of :name, :dimension
  ALLOWED_STATUSES = ["pending", "approved", "rejected"]
  validates_inclusion_of :status, in: ALLOWED_STATUSES
  validates_inclusion_of :category_split, in: CATEGORY_SEGMENTS  #global constant

  after_create :manage_tasks

  scope :with_segment, -> (segment) { where(category_split: segment) if segment.present? }

  # How much time category has to approve/reject a custom element.
  TIME_TO_APPROVE = 48.hours

  # DANGEROUS!!! Remove this once it is finalized whether we are keeping :space or
  # :category_split.
  def space=(value)
    self[:space] = value
    self[:category_split] = value
  end

  ### fixed as per requirement from client
  def timeline
    60
  end
  
  def manage_tasks
    project_sub_status = Project::ALLOWED_SUB_STATUSES 
    if project&.status == "wip" && project_sub_status.index("initial_payment_recieved") > project_sub_status.index(project&.sub_status).to_i
      @task_set = TaskSet.find_by(task_name: "Custom Elements Feasibility", stage: "10 %")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    else
      @task_set = TaskSet.find_by(task_name: "Custom Elements Feasibility", stage: "10% - 40%")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    end
  end

  def manage_esitmation_task
    project_sub_status = Project::ALLOWED_SUB_STATUSES 
    if project&.status == "wip" && project_sub_status.index("initial_payment_recieved") > project_sub_status.index(project&.sub_status).to_i
      @task_set = TaskSet.find_by(task_name: "Custom Elements Estimation", stage: "10 %")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    else
      @task_set = TaskSet.find_by(task_name: "Custom Elements Estimation", stage: "10% - 40%")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    end
  end
end
