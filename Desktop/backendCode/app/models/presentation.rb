# == Schema Information
#
# Table name: presentations
#
#  id               :integer          not null, primary key
#  title            :string           not null
#  ppt_file_name    :string
#  ppt_content_type :string
#  ppt_file_size    :integer
#  ppt_updated_at   :datetime
#  project_id       :integer
#  designer_id      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class Presentation < ApplicationRecord
  has_paper_trail
  belongs_to :project
  belongs_to :designer, class_name: 'User'


  has_many :slides, dependent: :destroy
  has_many :presentations_products, dependent: :destroy
  has_many :products, through: :presentations_products
  has_one :quotation, dependent: :destroy
  has_many :proposal_docs, as: :ownerable, dependent: :destroy
  has_many :proposals, through: :proposal_docs


  validates_presence_of :title

  has_attached_file :ppt, default_url: "/images/:style/missing.png"
  # validates_attachment_presence :ppt
  validates_attachment_size :ppt, less_than: 10.megabytes 

  # Should add this later
  # validates_attachment_content_type :ppt, :content_type => []

  accepts_nested_attributes_for :slides, reject_if: :all_blank, allow_destroy: true
  after_create :manage_tasks

  def manage_tasks
    project_sub_status = Project::ALLOWED_SUB_STATUSES 
    if project&.status == "wip" && project_sub_status.index("initial_payment_recieved") > project_sub_status.index(project&.sub_status).to_i
      @task_set = TaskSet.find_by(task_name: "Client PPT", stage: "10 %")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    else
      @task_set = TaskSet.find_by(task_name: "Client final PPT with 3D render", stage: "10% - 40%")
      @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
    end
  end

end
