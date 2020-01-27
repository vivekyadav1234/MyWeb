# == Schema Information
#
# Table name: cad_uploads
#
#  id                  :integer          not null, primary key
#  upload_name         :string
#  upload_type         :string
#  status              :string           default("pending")
#  approval_comment    :string
#  status_changed_at   :datetime
#  upload_file_name    :string
#  upload_content_type :string
#  upload_file_size    :integer
#  upload_updated_at   :datetime
#  quotation_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  approved_by_id      :integer
#  uploaded_by_id      :integer
#  seen_by_category    :boolean          default(FALSE)
#

# this is for cad role to upload files
class CadUpload < ApplicationRecord
  has_paper_trail

  belongs_to :quotation, required: true
  belongs_to :uploaded_by, class_name: 'User'
  belongs_to :approved_by, class_name: 'User'

  has_many :cad_upload_jobs, dependent: :destroy
  has_many :boqjobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'Boqjob'
  has_many :modular_jobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'ModularJob'
  has_many :service_jobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'ServiceJob'
  has_many :appliance_jobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'ApplianceJob'
  has_many :custom_jobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'CustomJob'
  has_many :extra_jobs, through: :cad_upload_jobs, source: :uploadable, source_type: 'ExtraJob'

  has_many :project_handovers, as: :ownerable, dependent: :destroy

  validates_presence_of :upload_name

  has_attached_file :upload, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :upload

  ALLOWED_TYPES = ['furniture_drawings']
  validates_inclusion_of :upload_type, in: ALLOWED_TYPES

  # default is pending from db itself
  ALLOWED_STATUSES = ['pending', 'approved', 'rejected']
  validates_inclusion_of :status, in: ALLOWED_STATUSES

  validate :comment_required_on_rejection

  def manage_cad_task
    @cad_task = TaskEscalation.find_by(ownerable: quotation, task_set: TaskSet.find_by_task_name("Upload CAD files"))
    TaskEscalation.create!(ownerable: quotation, task_set: TaskSet.find_by_task_name("Upload CAD files"), status: "yes", completed_at: DateTime.now) if !@cad_task.present?
    # @cad_task.update(status: "yes", completed_at: DateTime.now) if @cad_task.present?
  end

  private
  def comment_required_on_rejection
    errors.add(:approval_comment, "is required if status is changed to rejected.") if status == 'rejected' && approval_comment.blank?
  end
end
