# == Schema Information
#
# Table name: scope_of_works
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  client_details :text
#  date           :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class ScopeOfWork < ApplicationRecord
  has_paper_trail

  belongs_to :project
  has_many :scope_spaces, dependent: :destroy
  accepts_nested_attributes_for :scope_spaces
  validates_uniqueness_of :project_id
  after_create :complete_task

  def complete_task
	  @task_set = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Scope Checklist"))
	  @task_set.update(status: "yes", completed_at: DateTime.now) if @task_set.present? && @task_set.status == "no"
    if @task_set.blank?
      @new_task_set = TaskSet.find_by(task_name: "Scope Checklist", stage: "10 %")
      @new_task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @new_task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@new_task_set.task_escalations.where(ownerable: project).present?
    end
  end
end
