# == Schema Information
#
# Table name: events
#
#  id              :integer          not null, primary key
#  agenda          :string
#  description     :string
#  scheduled_at    :datetime
#  status          :string           default("scheduled")
#  ownerable_type  :string
#  ownerable_id    :integer
#  location        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  contact_type    :string
#  remark          :string
#  mom_status      :string           default("pending")
#  mom_description :text
#  review_location :string

class Event < ApplicationRecord
  has_paper_trail

  has_many :event_users , dependent: :destroy
  has_many :users, through: :event_users

  belongs_to :ownerable, polymorphic: true

  has_attached_file :recording
  has_many :recordings

  validates_presence_of :scheduled_at
  validates_uniqueness_of :agenda, scope: :ownerable, conditions: ->  { where(agenda: "first_meeting").where.not(status: "cancelled") }, message: "First meeting is already scheduled"

  # validate :check_valid_time  #scheduled_at must be later than current time
  before_create :check_valid_event_types
  ALL_STATUSES = %w(scheduled rescheduled done cancelled)
  validates_inclusion_of :status, in: ALL_STATUSES, allow_blank: true
  ALL_AGENDAS =  %w(lead_assigned 1st_call 1st_call_by_cm 1st_call_by_gm follow_up follow_up_call follow_up_for_not_contactable on_hold first_meeting follow_up_meeting ppt_boq_concept client_request site_visit design_and_boq_presentation delayed_possession delayed_project closure)

  MANUAL_EVENTS = %w(follow_up_call first_meeting follow_up_meeting design_and_boq_presentation closure)

  # New events for mobile app
  AUTOMATED_EVENTS = %w(1st_call 1st_call_by_cm 1st_call_by_gm)
  MOBILE_EVENTS = %w(follow_up_call follow_up 1st_call 1st_call_by_cm 1st_call_by_gm on_hold first_meeting follow_up_meeting design_and_boq_presentation delayed_possession delayed_project closure)

  ALLOWED_MOM_STATUS = %w( pending present shared)
  CALL_AGENDAS = %w(follow_up_call 1st_call 1st_call_by_cm 1st_call_by_gm on_hold delayed_possession delayed_project)
  MEETING_AGENDA = %w(first_meeting follow_up_meeting design_and_boq_presentation closure)
  validates_inclusion_of :mom_status, in: ALLOWED_MOM_STATUS

  # Mobile Event Hooks
  validate :check_event_flow
  after_create :manage_tasks
  after_save :create_next_event

  scope :active_events, -> {where(status: ['scheduled', 'rescheduled'])}
  scope :completed_events, -> {where(status: ['done'])}
  scope :cancelled_events, -> {where(status: ['cancelled'])}
  scope :mobile_events, -> { where(agenda: MOBILE_EVENTS)}

  # Manual Events for 2C3M
  scope :manual_events, -> {where(agenda: MANUAL_EVENTS - ['follow_up_call'])}
  scope :number_of_meetings, -> { where(agenda: MEETING_AGENDA).count}
  #call backs

  def number_of_successful_calls
    recordings.count
  end

  def manage_tasks
    if ownerable_type == "Project" && contact_type == "experience_center"
      @task_set = TaskSet.find_by(task_name: "EC Visit", stage: "pre bid")
      @task_set.task_escalations.create(ownerable: ownerable, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: ownerable).present?
    elsif ownerable_type == "Project" && contact_type == "site_visit"
      @task_set = TaskSet.find_by(task_name: "Site Visit", stage: "pre bid")
      @task_set.task_escalations.create(ownerable: ownerable, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: ownerable).present?
    end
  end

  # Create 1st_call_by_cm and 1st_call_by_gm after save is status is changed to done
  # Call by CM after 1st Meeting  | Call by GM after BOQ Sharing

  def check_event_flow
    if (MANUAL_EVENTS - ['first_meeting']).include?(self.agenda) && self.ownerable&.events &&
      (self.ownerable&.events.where(agenda: 'first_meeting', status:  'done').count.zero?)
      self.errors.add(:agenda, "Event has not been created because First Meeting is not completed yet.")
    end
  end

  def create_next_event
    if (Time.zone.now.hour + 4).to_i >= 19
      t_hour = (Time.zone.now.hour - 5).to_i
      t_hour = 10 if t_hour >= 19
      schedule_data_time = Time.zone.tomorrow + t_hour.hours + Time.zone.now.strftime('%M').to_i.minutes
    elsif (Time.zone.now.hour + 4).to_i <= 10
      schedule_data_time = Time.zone.now.to_date + 10.hours + Time.zone.now.strftime('%M').to_i.minutes
    else
      schedule_data_time = Time.zone.now + 4.hours
    end
    if self.agenda == 'first_meeting' && self.ownerable_type == "Project"
      self.ownerable.events.where(agenda: '1st_call').active_events.update_all(status: 'done')
      self.ownerable.update_attributes!(status: 'wip') if self.status != 'done' && 
      !self.ownerable.status.in?(['on_hold', 'inactive', 'delayed_possession', 'delayed_project', 'follow_up'])
    end
    # if self.agenda.in?(['delayed_possession','delayed_project']) && self.status != 'done'
    #   self.ownerable.update_attributes!(status: 'on_hold')
    # end
    if self.ownerable.events.where(agenda: '1st_call_by_cm').count.zero? and
      self.ownerable.events.where(
        agenda: 'first_meeting', status: 'done'
      ).count == 1 and !self.ownerable.status.in?(['on_hold','inactive', 'delayed_possession', 'delayed_project'])
      event = self.ownerable.events.create(
        agenda: "1st_call_by_cm", contact_type: "phone_call",
        scheduled_at: schedule_data_time, ownerable: self.ownerable)
      cm = self.ownerable&.lead&.assigned_cm
      event.event_users.create(user: cm)

    end
  end

  def add_participants(emails, current_user)
    emails.each do |email|
      user = User.find_by_email(email)
      if user.present?
        host = user.id == current_user ? 1 : 0
        if !self.event_users.where(user_id: user.id,event_id: self.id).present?
          participants = self.event_users.create!(user_id: user.id, host: host)
        end
      elsif email.present?
        UserNotifierMailer.event_created_email_for_outsider(self,email).deliver_later!(wait: 15.minutes)
      end
    end
  end

  def ownerable_status
    if ownerable_type == 'Lead'
      ownerable&.lead_status
    elsif ownerable_type == 'Project'
      ownerable&.status
    else
      false
    end
  end

  def self.download_event(events, user, user_type)
    event_headers = ["Sr. No.",
     "Client Name",
     "Lead ID",
     "Agenda",
     "Type",
     "Description",
     "Scheduled Date",
     "Scheduled Time",
     "Scheduled Timestamp",
     "Location",
     "Notification",
     "Mark Done Date",
     "Mark Done Time",
     "Mark Done Timestamp",
     "Remark",
     "Designer Name",
     "Date Assigned to Designer",
     "Community Manager Name",
     "Time Difference In Minutes"]

    headers = Hash.new
    event_headers.each_with_index do |n, i|
      headers[n] = i
    end

    cm = ""
    if user_type == "cm"
      cm = user.name
    end
    p = Axlsx::Package.new
    event_xlsx = p.workbook
    event_xlsx.add_worksheet(:name => "Basic Worksheet") do |sheet|
      sheet.add_row event_headers
      sr_no = 1
      events.each do |event|
        designer = event.users.pluck(:id).include?(event&.ownerable&.assigned_designer&.id) ? event&.ownerable&.assigned_designer : nil

        mark_done_time = nil
        if event.status == "done"
          mark_done_time = event
        end

        if user_type == "lead_head"
          cm = event&.ownerable&.lead&.assigned_cm&.name
        end
        assigned_designer_time = nil
        if event.ownerable_type == "Project"
          assigned_designer_time = event.ownerable.designer_projects&.where(designer_id: designer)&.last
        end

        time_diff = nil
        if event.scheduled_at.present? && mark_done_time.present? #&& !event.ownerable&.lead_status.in?(["lost", "dropped"]) && event.ownerable.status != "lost" && event.status == "done"
          time_diff = (((event.scheduled_at - mark_done_time&.updated_at)/86400) * 24).to_i
        end



      row_array = []
      row_array[headers["Sr. No."]] = sr_no
      row_array[headers["Client Name"]] = event.ownerable&.lead&.name
      row_array[headers["Lead ID"]] = event.ownerable&.lead_id
      row_array[headers["Agenda"]] = event.agenda&.humanize
      row_array[headers["Type"]] = event.contact_type&.humanize
      row_array[headers["Description"]] = event.description
      row_array[headers["Scheduled Date"]] = event.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
      row_array[headers["Scheduled Time"]] = event.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
      row_array[headers["Scheduled Timestamp"]] = event.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Location"]] = event.location
      row_array[headers["Notification"]] = event.status
      row_array[headers["Mark Done Date"]] = mark_done_time&.updated_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
      row_array[headers["Mark Done Time"]] = mark_done_time&.updated_at&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
      row_array[headers["Mark Done Timestamp"]] = mark_done_time&.updated_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
      row_array[headers["Remark"]] = event.remark
      row_array[headers["Designer Name"]] = designer&.name
      row_array[headers["Date Assigned to Designer"]] = assigned_designer_time&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%Y-%m-%d")
      row_array[headers["Community Manager Name"]] = cm
      row_array[headers["Time Difference In Minutes"]] = time_diff

      sheet.add_row row_array
      sr_no += 1
      end
    end
    file_name = "event_#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    p.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end


  protected
  # def check_valid_time
  #   puts scheduled_at.to_datetime
  #   puts Time.zone.now
  #   a = scheduled_at.to_datetime < Time.zone.now
  #   puts a
  #   errors.add(:scheduled_at, "Please enter valid date and time") if scheduled_at.to_datetime < Time.zone.now
  # end

  def check_valid_event_types
    if agenda.in?(["follow_up_call", "follow_up_for_not_contactable", "follow_up"])
      unless contact_type.in?(["phone_call","video_call"])
        errors.add("Contact Type must be Phone Call or Video Call")
      end
    elsif agenda.in?(["follow_up_meeting", "first_meeting"])
      unless contact_type.in?(["experience_center", "site_visit"])
        errors.add("Contact Type must be EC Visit or Site Visit")
      end
    elsif agenda.in?(["design_and_boq_presentation"])
      unless contact_type.in?(["video_call", "site_visit", "experience_center"])
        errors.add("Contact Type must be EC Visit, Site Visit or Video Call")
      end
    end
  end
end
