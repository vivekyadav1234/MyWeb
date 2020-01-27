# == Schema Information
#
# Table name: site_measurement_requests
#
#  id                :integer          not null, primary key
#  project_id        :integer
#  designer_id       :integer
#  sitesupervisor_id :integer
#  request_type      :string
#  address           :text
#  scheduled_at      :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  request_status    :string           default("pending")
#  rescheduled_at    :datetime
#  remark            :text
#  name              :string           default("site_measurement_output")
#

class SiteMeasurementRequest < ApplicationRecord
  has_paper_trail

  belongs_to :project
  belongs_to :designer, class_name: "User", foreign_key: "designer_id"
  belongs_to :sitesupervisor, class_name: "User", foreign_key: "sitesupervisor_id"
  has_one :event, as: :ownerable, dependent: :destroy
  has_many :site_galleries, dependent: :destroy
  has_many :project_handovers, as: :ownerable, dependent: :destroy
  after_create :manage_task_set

  def manage_task_set
    @request_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Request site measurement"))
    TaskEscalation.create!(ownerable: project, task_set: TaskSet.find_by_task_name("Request site measurement"), status: "yes", completed_at: DateTime.now) if !@request_task.present?
    # TaskEscalation.invoke_task(["Assign SS for site measurement"], "10% - 40%", project)  if @request_task.present?
  end

  def complete_assigning_task
    @assigned_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Assign SS for site measurement"))
    TaskEscalation.create!(ownerable: project, task_set: TaskSet.find_by_task_name("Assign SS for site measurement"), status: "yes", completed_at: DateTime.now) if !@assigned_task.present?
    # TaskEscalation.invoke_task(["upload measurements"], "10% - 40%", project)  if @assigned_task.present?
  end

  def complete_task
    @assigned_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("upload measurements"))
    TaskEscalation.create!(ownerable: project, task_set: TaskSet.find_by_task_name("upload measurements"), status: "yes", completed_at: DateTime.now) if !@assigned_task.present?
  end

  def self.site_supervisor_dashboard_count(user)
  	hash = Hash.new
  	hash[:total_requests] = user.sitesupervisors_site_measurement_requests.where.not(request_status: ["pending", "discarded"]).count
  	hash[:live_projects] = self.sitesupervisor_projects("live_projects",user).count
  	hash[:finished_projects] = self.sitesupervisor_projects("finished_projects",user).count
  	hash
  end

  def self.sitesupervisor_projects(status, user)
  	project_ids = user.sitesupervisors_site_measurement_requests.pluck(:project_id)
  	if status == "live_projects"
  		Project.where(id: project_ids).where.not(status: ["installation", "on_hold", "inactive"])
  	elsif status == "finished_projects"
  		Project.where(id: project_ids, status: "installation")
  	end
  end



end
