# == Schema Information
#
# Table name: floorplans
#
#  id                           :integer          not null, primary key
#  name                         :string
#  project_id                   :integer
#  url                          :string
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

class Floorplan < ApplicationRecord
  has_paper_trail
  #associations
  belongs_to :project
  has_many :designs, dependent: :destroy
  has_many :project_handovers, as: :ownerable, dependent: :destroy
  #paperclip
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :attachment_file


  after_create :change_sub_status_of_project
  after_create :complete_task

  private
    def complete_task
      @floorplan_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Upload Floor Plan"), status: "no")
      @floorplan_task.update(status: "yes", completed_at: DateTime.now) if @floorplan_task.present?
      if TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Upload Requirement Sheet"), status: "yes").present?
        TaskEscalation.invoke_task(["Create Initial BOQ"], "10 %", project) if !TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Create Initial BOQ"), status: "yes").present?
        if project.quotations.present?
          @initial_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Create Initial BOQ"), status: "no")
          @initial_task.update(status: "yes", completed_at: DateTime.now) if @initial_task.present?
        end
      end
    end

    def change_sub_status_of_project
      project_sub_status = Project::ALLOWED_SUB_STATUSES
      if project.present? && project_sub_status.index("floorplan_and_requirement_sheet_uploaded") > project_sub_status.index(project.sub_status).to_i
         project.update_column("sub_status", "floorplan_and_requirement_sheet_uploaded") if project.project_requirement.present?
      end
    end
end
