# == Schema Information
#
# Table name: project_booking_forms
#
#  id                         :integer          not null, primary key
#  date                       :datetime
#  lead_id                    :integer
#  project_id                 :integer
#  flat_no                    :string
#  floor_no                   :string
#  building_name              :text
#  location                   :text
#  city                       :string
#  pincode                    :string
#  possession_by              :string
#  profession                 :string
#  designation                :string
#  company                    :string
#  professional_details       :string
#  annual_income              :string
#  landline                   :string
#  primary_mobile             :string
#  secondary_mobile           :string
#  primary_email              :string
#  secondary_email            :string
#  current_address            :text
#  order_value                :string
#  order_date                 :date
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  other_professional_details :string
#  billing_address            :text
#  gst_number                 :string
#  billing_name               :string
#  address_type               :text
#

class ProjectBookingForm < ApplicationRecord
  has_paper_trail
  
  belongs_to :lead
  belongs_to :project
  has_many :project_booking_form_files, dependent: :destroy
  validates_uniqueness_of :project_id

  after_create :complete_task

  def complete_task
  	@task_set = TaskSet.find_by(task_name: "Booking form", stage: "10 %")
    @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
  end

  def generate_pdf
    pdf_content = ProjectBookingFormPdf.new(self)
    filepath = Rails.root.join("tmp","project_booking_form_#{self.id}.pdf")
    pdf_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end
  
end
