# == Schema Information
#
# Table name: designer_projects
#
#  id                    :integer          not null, primary key
#  designer_id           :integer
#  project_id            :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  customer_status       :string           default("qualified")
#  customer_meeting_time :datetime
#  customer_remarks      :string
#  mail_token            :string
#  token_uses_left       :integer          default(0), not null
#  lead_id               :integer
#  active                :boolean          default(FALSE)
#  count_of_calls        :integer
#

class DesignerProject < ApplicationRecord
  has_paper_trail
  # include SmsModule
  # column active tells which designer is currently assigned - value true. Rest must be false.
  has_secure_token :mail_token

  #callbacks
  # Lead ID population
  before_create do
    self.lead_id = self.project.lead_id
    self.customer_status = 'qualified' if self.customer_status.blank?
  end

  before_save :check_status_validity
  before_save :create_corresponding_event

  #associations
  belongs_to :lead, optional: true
  belongs_to :project
  # has_many :events, through: :lead
  belongs_to :designer, class_name: "User", foreign_key: "designer_id"
  after_create :mark_lead_as_new
  scope :active, -> {where(active: true)}

  ALLOWED_CUSTOMER_STATUSES = ["qualified", "meeting_fixed", "not_contactable",
    "follow_up", "lost", "wip", "pre_10_percent", "10_50_percent", "50_percent",
    "installation", "on_hold", "inactive"]
  validates_inclusion_of :customer_status, in: ALLOWED_CUSTOMER_STATUSES
  validates_uniqueness_of :designer_id, scope: :project_id, on: :create

  # For Mobile Lead
  def mark_lead_as_new
    if self.project && self.project.lead
      self.project.lead.update_attributes({is_new: true})
    end
  end

  # Handle First Call Events
  def create_corresponding_event
    if self.project && self.project.events.where(agenda: "1st_call").count.zero? &&
      !self.project.status.in?(Project::AFTER_WIP_STATUSES + Project::WIP_DASHBOARD_STATUSES)
      if (Time.zone.now.hour + 4).to_i >= 19
        t_hour = (Time.zone.now.hour - 5).to_i
        t_hour = 10 if t_hour >= 19
        schedule_data_time = Time.zone.tomorrow + t_hour.hours + Time.zone.now.strftime('%M').to_i.minutes
      elsif (Time.zone.now.hour + 4).to_i <= 10
        schedule_data_time = Time.zone.now.to_date + 10.hours + Time.zone.now.strftime('%M').to_i.minutes
      else
        schedule_data_time = Time.zone.now + 4.hours
      end
      event = self.project.events.create(
        agenda: "1st_call", contact_type: "phone_call", status: "scheduled",
        scheduled_at: schedule_data_time, ownerable: self.project
      )
      event.event_users.create(user: self.designer)
    end
  end

  # If mail_token used, then regenerate token so that it cannot be used, or lower token_uses_left
  # by 1.
  def use_token
    if token_uses_left >= 2
      self.token_uses_left -= 1
      self.save!
    else
      self.update!(token_uses_left: 0, mail_token: nil)
    end
  end

  def renew_token
    regenerate_mail_token
    self.update!(token_uses_left: 2)
  end

  def ownerable_details
    if self.project.lead.present? && self.project.status.in?(["wip",
      "pre_10_percent", "10_50_percent", "50_percent", "installation"])
      hash = Hash.new
      hash[:ownerable_type] = "Project"
      hash[:ownerable_id] = self.project_id
      hash[:name] = self.project&.lead&.name
      hash[:lead_id] = self.project&.lead&.id
      hash[:project_name] = self.project&.name
      hash
    end
  end

  def send_notifications
    # designer_assigned_email
    project_assigned_email
    designer_assigned_sms
    project_assigned_sms
  end

  def self.wip_leads_count_of_designers(designer_id)
    hash = Hash.new
    Project::WIP_DASHBOARD_STATUSES.each do |status|
      project_status = Project.project_status_after_wip_filters(status)
      hash[status] = wip_leads_of_designers(designer_id, project_status, "count")
    end
    hash
  end

  # def self.wip_leads_of_designers(designer_id, status, return_type)
  #   designer_projects_active = DesignerProject.where(active: true,designer_id: designer_id).pluck(:project_id)
  #   lead_ids = Project.where(id: designer_projects_active, status: status).pluck(:lead_id)
  #   if return_type == "list"
  #     return Lead.where(id: lead_ids)
  #   elsif return_type == "count"
  #     return lead_ids.count
  #   end
  # end

  def self.wip_leads_of_designers(designer_id, status, return_type)
    if return_type == "list"
      return Lead.joins(:project).joins(:designer_projects).includes(project: :user).includes(project: :designer_projects).includes(project: :events).where(projects: {designer_projects: {active: true, designer_id: designer_id}, status: status})
    elsif return_type == "count"
      return Project.joins(:designer_projects).where(designer_projects: {active: true, designer_id: designer_id}, status: status).pluck(:lead_id).count
    end
  end

  # email trigger when designer is assigned to project. This mail is sent to the user to whom the
  # project belongs.
  def designer_assigned_email
    UserNotifierMailer.designer_assigned_email(self).deliver_later!(wait: 15.minutes)
  end

  #email trigger when project is assigned to a designer - sent to designer.
  def project_assigned_email
    UserNotifierMailer.project_assigned_email(self).deliver_later!(wait: 15.minutes)
  end

  # sms sent to user when designer is assigned to his project.
  def designer_assigned_sms
    @contact = self.project.user.contact
    SmsModule.send_sms("Designer has been assigned to your project #{self.project.name}.", @contact)
  end

  def project_assigned_sms
    @contact = self.designer.contact
    SmsModule.send_sms("Hello #{self.designer.name}, A project #{self.project.name} has been assigned to you. Customer name: #{self.project&.user&.name&.humanize}", @contact)
  end

  def check_status_validity
    unless ['meeting_fixed','follow_up'].include?(self.customer_status)
      self.customer_meeting_time = nil
    end
  end
end
