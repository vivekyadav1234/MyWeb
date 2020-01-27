# == Schema Information
#
# Table name: project_requirements
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  requirement_name :string
#  budget           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  service          :text
#  color_preference :text
#

class ProjectRequirement < ApplicationRecord
  has_paper_trail

  belongs_to :project
  has_many :requirement_sheets , dependent: :destroy
  accepts_nested_attributes_for :requirement_sheets
  validates_uniqueness_of :project_id

  after_create :change_sub_status_of_project
  after_save :complete_task

  private
    def complete_task
      @requirement_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Upload Requirement Sheet"), status: "no")
      @requirement_task.update(status: "yes", completed_at: DateTime.now) if @requirement_task.present?
      if TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Upload Floor Plan"), status: "yes").present?
        TaskEscalation.invoke_task(["Create Initial BOQ"], "10 %", project) if !TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Create Initial BOQ"), status: "yes").present?
        if project.quotations.present?
          @initial_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Create Initial BOQ"), status: "no")
          @initial_task.update(status: "yes", completed_at: DateTime.now) if @initial_task.present?
        end
      end
    end

    def change_sub_status_of_project
      project_sub_status = Project::ALLOWED_SUB_STATUSES 
      if project.present? && project_sub_status.index("floorplan_and_requirement_sheet_uploaded").to_i > project_sub_status.index(project.sub_status).to_i
        project.update_column("sub_status", "floorplan_and_requirement_sheet_uploaded") if project.floorplans.present? 
      end
    end
end
