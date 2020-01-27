# == Schema Information
#
# Table name: leads
#
#  id                      :integer          not null, primary key
#  name                    :string
#  email                   :string
#  contact                 :string
#  address                 :text
#  details                 :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  city                    :string
#  pincode                 :string
#  status_updated_at       :datetime
#  lead_status             :string           default("not_attempted"), not null
#  source                  :string           default("digital"), not null
#  follow_up_time          :datetime
#  lost_remark             :text
#  created_by              :integer
#  dummyemail              :boolean          default(FALSE)
#  related_user_id         :integer
#  lead_escalated          :boolean          default(FALSE), not null
#  reason_for_escalation   :string
#  lead_campaign_id        :integer
#  lead_source_id          :integer
#  lead_type_id            :integer
#  not_contactable_counter :integer          default(0), not null
#  drop_reason             :string
#  duplicate               :boolean          default(FALSE)
#  remark                  :string
#  lost_reason             :string
#  instagram_handle        :string
#  lead_cv_file_name       :string
#  lead_cv_content_type    :string
#  lead_cv_file_size       :integer
#  lead_cv_updated_at      :datetime
#  tag_id                  :integer
#  assigned_cm_id          :integer
#  referrer_id             :integer
#  referrer_type           :string
#  is_contact_visible      :boolean          default(FALSE)
#  from_fasttrack_page     :boolean          default(FALSE), not null
#  lead_utm_content_id     :integer
#  lead_utm_medium_id      :integer
#  lead_utm_term_id        :integer
#  is_in_pipeline :boolean

class Lead < ApplicationRecord
  attr_accessor :invited  #if this is set to truthy, then no email will be sent on signup
  require "uri"

  has_paper_trail
  #pagination
  # paginates_per 15

  #associations
  belongs_to :related_user, class_name: "User", optional: true
  belongs_to :lead_campaign, optional: true
  belongs_to :lead_source, required: true
  belongs_to :lead_type, required: true
  belongs_to :tag, optional: true
  belongs_to :assigned_cm, optional: true, :class_name => "User", :foreign_key => "assigned_cm_id"
  belongs_to :referral_partner, optional: true, :class_name => "User", :foreign_key => "referrer_id"

  belongs_to :lead_utm_content, optional: true
  belongs_to :lead_utm_medium, optional: true
  belongs_to :lead_utm_term, optional: true

  has_many :inhouse_call

  has_one :project
  has_one :lead_queue, dependent: :destroy
  has_one :lead_statistics_datum, dependent: :destroy

  has_many :designer_projects, dependent: :destroy
  #For CS Agent Mapping
  has_many :lead_users, dependent: :destroy
  has_many :users, through: :lead_users
  has_many :price_configurators, as: :pricable
  # Questionnaire
  has_many :note_records, :as => "ownerable", dependent: :destroy

  has_many :events, as: :ownerable, dependent: :destroy
  has_one :project_booking_form
  has_many :vouchers

  has_many :whatsapps, as: :ownerable, dependent: :destroy

  has_many :alternate_contacts, as: :ownerable, dependent: :destroy

  # If this lead was created from FB pinging our webhook, that data must be saved in an FbLeadgen record.
  has_one :fb_leadgen

  #validations
  validates_presence_of [:contact]  #contact uniqueness removed, duplication introduced

  ALL_LEAD_STATUSES = %w(not_attempted not_claimed claimed not_contactable lost follow_up lost_after_5_tries qualified dropped delayed_possession delayed_project)
  validates_inclusion_of :lead_status, in: ALL_LEAD_STATUSES

  STATUSES_AUTO_ASSIGN = %w(not_attempted not_claimed)
  TIME_TO_REASSIGN_NOT_CLAIMED = 1.minute
  TIME_TO_REASSIGN_CLAIMED = 20.minutes
  TIME_TO_ESCALATE_CALLBACK_LEADS = 2.hours
  TIME_TO_ESCALATE_FOLLOW_UP_LEADS = 2.hours
  TIME_TO_ESCALATE_ANY_LEAD = 48.hours  #if not attempted

  validate :escalated_lead_must_have_reason, on: :update
  validate :is_ready_for_pipeline?
  #enum
  enum user_type: [:customer, :designer, :cs_agent, :community_manager, :design_head,
                   :catalogue_head, :customer_head, :lead_head, :broker, :manufacturer, :finance, :sitesupervisor]

  alias campaign lead_campaign

  #callbacks
  before_create :check_duplicate
  after_create :send_signup_mail
  # after_create :send_email_sms_to_customer
  after_create :populate_status_updated_at
  after_save :not_contactable_watcher, on: :update

  #scopes
  #IMP NOTE - All queries will run in this scope only. Use unscope block to override it.
  default_scope { where(duplicate: false) }
  # END IMP
  scope :latest_created_at_first, -> { order(created_at: :desc) }
  scope :designer_only, -> { joins(:lead_type).where(lead_types: {name: :designer}).distinct }
  scope :customer_only, -> { joins(:lead_type).where(lead_types: {name: :customer}).distinct }
  scope :approved_users, -> { where(lead_status: "qualified") }
  scope :lost_leads, -> { where(lead_status: ["lost", "lost_after_5_tries"]) }
  scope :with_project, -> { joins(:project).distinct }
  scope :dropped, -> {where(lead_status: 'dropped')}
  scope :contact_visible, -> {where(is_contact_visible: true)}

  # Score to check Pipeline Logic
  scope :not_in_nil_pipeline_items, -> {where(
              is_in_pipeline: nil,
              id: Project.where(status: Project::PIPELINE_ACTIVE_STATUS).pluck(:lead_id)
            ).where.not(
              id: Project.where(status: Project::PIPELINE_ACTIVE_STATUS).where(
                id: Quotation.shared.pluck(:project_id)
              ).joins(:events).where(
                id: Event.manual_events.where(ownerable_type: 'Project', status: 'done').group(:ownerable_id).count.select{|k,v| v>1}.keys
              ).pluck(:lead_id)
            )}

  scope :nil_pipeline_items, -> {where(
            is_in_pipeline: nil, 
            id: Project.where(status: Project::PIPELINE_ACTIVE_STATUS).where(
              id: Quotation.shared.pluck(:project_id)
            ).joins(:events).where(
              id: Event.manual_events.where(ownerable_type: 'Project', status: 'done').group(:ownerable_id).count.select{|k,v| v>1}.keys
            ).pluck(:lead_id)
          )}

  #Leads assigned to CS Agents
  scope :forced_assigned_leads, -> { joins(:lead_users).where(lead_users: {active: true, claimed: ["force_yes", "pending"]}) }

  # include claimed as well because it may or may not become not_attempted/not_claimed within the hour.
  scope :available_for_queue, -> { where(lead_status: ["not_attempted", "not_claimed"], lead_escalated: false).where.not(id: Lead.joins(:lead_users).where(lead_users: {active: true, claimed: ["force_yes"]})) }

  has_attached_file :lead_cv, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :lead_cv

  include AdminScreenConcern
  include ArrivaeWeeklyStatisticsConcern

  def manual_events_count_for_pipeline
    self.project.events.manual_events.count
  end

  # Mark Lead as old if lead has been visited
  def mark_as_read
    self.update_attributes({is_new: false})
  end
  
  # Check if lead is eligible to be moved in Pipeline
  def is_ready_for_pipeline?
    if self.is_in_pipeline == true
      if self.project.quotations.shared.count.zero?
        self.errors.add(:base, 
        "No BOQ shared yet. Cannot move to Pipeline.")
      end
    end
  end
  # # Send an email & SMS on lead create
  # def send_email_sms_to_customer
  #   if self.email
  #     UserNotifierMailer.lead_creation_mail_to_lead(self).deliver_now!
  #   end
  #   begin
  #     SmsModule.send_sms(Whatsapp::LEAD_CREATION_SMS_TO_LEAD, self.contact)
  #   rescue => error
  #     render json: {message: error.message}, status: :unprocessable_entity
  #   end
  # end

  # Do this ie change setter method instead of adding before_save callback.
  def email=(value)
    if value.present?
      self[:email] = value.to_s.squish.gsub(/\s+/, "")
    else
      self[:email] = value
    end
  end

  def contact=(value)
    self[:contact] = Lead.format_contact(value)
  end

  def self.unassign_leads

    leads = Lead.approved_users.where(assigned_cm_id: nil, created_at: 1.day.ago..Time.now)

    first_row = ["sr_no","id", "name", "email", "contact"]
    headers = Hash.new
      first_row.each_with_index do |n, i|
      headers[n] = i
    end
      xl= Axlsx::Package.new
      unassign_xlsx = xl.workbook
      unassign_xlsx.add_worksheet(:name => "Worksheet") do |sheet|
        sheet.add_row first_row
        number = 1

        leads.each do |lead|
          row_array = []
          row_array[headers["sr_no"]] = number
          row_array[headers["id"]] = lead.id
          row_array[headers["name"]] = lead.name
          row_array[headers["email"]] = lead.email
          row_array[headers["contact"]] = lead.contact
          sheet.add_row row_array
          number += 1
        end
        file_name = "Unassigned-leads-Report.xlsx"
        filepath = Rails.root.join("tmp",file_name)
        xl.serialize(filepath)
        UserNotifierMailer.unassigned_lead_in_a_day(filepath, file_name).deliver_now
      end
  end

  def lead_all_filters
    return self.none if options.blank? #empty relation

    from_time = options["from_date"].present? ? Date.parse(options["from_date"].to_s).beginning_of_day : Time.zone.now - 10.years
    to_time = options["to_date"].present? ? Date.parse(options["to_date"].to_s).end_of_day : Date.today.end_of_day

    if options["column_name"] == "assigned_to_cm"
      leads.where(status_updated_at: from_time..to_time).distinct
    elsif options["column_name"] == "assigned_to_designer"
      leads.joins(:designer_projects).where(designer_projects: {active: true, created_at: from_time..to_time}).distinct
    elsif options["column_name"] == "lead_created_at"
      leads.where(created_at: from_time..to_time).distinct
    else
      none
    end
  end

  #search
  scope :search, lambda { |query|
    # Searches the students table on the 'first_name' and 'last_name' columns.
    # Matches using LIKE, automatically appends '%' to each term.
    # LIKE is case INsensitive with MySQL, however it is case
    # sensitive with PostGreSQL. To make it work in both worlds,
    # we downcase everything.
    # condition query, parse into individual keywords
    if query.present?
      terms = query.downcase.split(/\s+/)

      # replace "*" with "%" for wildcard searches,
      # append '%', remove duplicate '%'s
      terms = terms.map { |e|
        (e.gsub("*", "%").prepend("%") + "%").gsub(/%+/, "%")
      }
      # configure number of OR conditions for provision
      # of interpolation arguments. Adjust this if you
      # change the number of OR conditions.
      num_or_conds = 3
      where(
        terms.map { |term|
          "(LOWER(leads.name) LIKE ? OR LOWER(leads.email) LIKE ? OR CAST(contact AS TEXT) LIKE ?)"
        }.join(" AND "),
      *terms.map { |e| [e] * num_or_conds }.flatten
      )
    end
  }

  scope :search_leads, -> (search_param) {
          where("CAST(leads.id AS TEXT) like ? or LOWER(leads.name) like ?  or leads.lead_status like ?  or leads.contact like ? or LOWER(leads.email) like ?", "%#{search_param}%", "%#{search_param}%", "%#{search_param}%", "%#{search_param}%", "%#{search_param}%")
        }

  scope :leads_by_city, -> (city_param) {
          joins(:note_records).where("LOWER(leads.city) = ?  OR LOWER(note_records.city) = ?", city_param.downcase, city_param.downcase)
        }

  # 10 digit phone number logic
  def self.format_contact(phone_number)
    phone_number.to_s.delete("^0-9").last(10)
  end

  # def send_mail_to_cm_for_qualified_leads
  #   emails = []
  #   city = city&.downcase

  #   byebug

  #   if city == "pune" || self.note_records&.last&.city&.downcase == "pune"
  #     emails = ["abhijitkurude@arrivae.com","purbasha@arrivae.com", "nikhilesh@arrivae.com"]
  #   elsif city == "mumbai" || self.note_records&.last&.city&.downcase == "mumbai"
  #     emails =  ["simon@arrivae.com", "nimish@arrivae.com", "kirit@arrivae.com"]
  #   elsif ["delhi_ncr", "new_delhi"].include?(city) || ["delhi_ncr", "new_delhi"].include?(self.note_records&.last&.city&.downcase)
  #     emails =  ["kapil.dabur@modspace.in"]
  #   elsif ["bangalore", "chennai", "kochi", "hyderabad"].include?(city) || ["bangalore", "chennai", "kochi", "hyderabad"].include?(self.note_records&.last&.city&.downcase)
  #     emails =  ["simoncyrus@arrivae.com"]
  #   elsif ["nagpur", 'aurangabad', 'nashik','kolhapur'].include?(city) || ["nagpur", 'aurangabad', 'nashik','kolhapur'].include?(self.note_records&.last&.city&.downcase)
  #     emails = ["fredrick@arrivae.com"]
  #   else
  #     emails = User.with_role(:community_manager).pluck(:email)
  #   end
  #   byebug
  #   UserNotifierMailer.lead_qualified_mail_to_cm(emails,self).deliver_now!
  # end

  def number_of_calls_by_user(user_id)
    self.inhouse_call.where(user_id: user_id).distinct.count
  end

  def lead_attempt_history(lead, cs_agents, designer, cm)
    cs_agent_first_attempt_date = ""
    cs_agent_last_attempt_date = ""
    cs_agent_last_attempt_status = ""
    designer_first_attempt_date = ""
    designer_last_attempt_date = ""
    cm_first_attempt_date = ""
    cm_last_attempt_date = ""
    hours_defference_cs_agent = ""
    hours_defference_designer = ""
    hours_defference_cm = ""
    lead_first_display = lead&.lead_users&.last&.created_at
    designer_last_status = ""
    cm_last_status = ""
    designer_latest_remark = ""

    lead&.versions&.where(whodunnit: cs_agents)&.map(&:object_changes)&.map { |a|
      if a
        YAML::load a
      else
        nil
      end
    }&.map { |sts|
      if sts.present? && sts["lead_status"].present?
        if cs_agent_first_attempt_date.present?
          cs_agent_last_attempt_date = sts["updated_at"][1]
          cs_agent_last_attempt_status = sts["lead_status"][1]
        else
          cs_agent_first_attempt_date = sts["updated_at"][1]
          cs_agent_last_attempt_date = cs_agent_first_attempt_date
          cs_agent_last_attempt_status = sts["lead_status"][1]
          hours_defference_cs_agent = (((sts["updated_at"][1] - lead.created_at) / 86400) * 24).to_i if sts["updated_at"][1].present? && lead.created_at.present?
        end
      end
    }

    designer_project = lead&.project&.designer_projects&.where(active: true)&.first
    lead&.project&.versions&.where(whodunnit: designer)&.map(&:object_changes)&.map { |a|
      if a
        YAML::load a
      else
        nil
      end
    }&.map { |sts|
      if sts.present? && sts["status"].present?
        if designer_first_attempt_date.present?
          designer_last_attempt_date = sts["updated_at"][1]
          designer_last_status = sts["status"][1]
        else
          designer_first_attempt_date = sts["updated_at"][1]
          designer_last_status = sts["status"][1]
          designer_last_attempt_date = designer_first_attempt_date
          hours_defference_designer = (((sts["updated_at"][1] - designer_project&.created_at) / 86400) * 24).to_i if sts["updated_at"][1].present? && designer_project&.created_at.present?
        end

        if sts["remarks"].present?
          designer_latest_remark = sts["remarks"][1]
        end
      end
    }

    lead&.project&.versions&.where(whodunnit: cm)&.map(&:object_changes)&.map { |a|
      if a
        YAML::load a
      else
        nil
      end
    }&.map { |sts|
      if sts.present? && (sts["status"].present? || sts["remarks"].present?)
        if cm_first_attempt_date.present? && sts["status"].present?
          cm_last_attempt_date = sts["updated_at"][1]
          cm_last_status = sts["status"][1]
        elsif sts["status"].present?
          cm_first_attempt_date = sts["updated_at"][1]
          cm_last_status = sts["status"][1]
          cm_last_attempt_date = cm_first_attempt_date
          hours_defference_cm = (((sts["updated_at"][1] - lead&.status_updated_at) / 86400) * 24).to_i if lead&.lead_status == "qualified" if sts["updated_at"][1].present? && lead&.status_updated_at.present?
        end
      end
    }
    return {cs_agent_first_attempt_date: cs_agent_first_attempt_date, cs_agent_last_attempt_date: cs_agent_last_attempt_date,
            designer_first_attempt_date: designer_first_attempt_date, designer_last_attempt_date: designer_last_attempt_date,
            cm_first_attempt_date: cm_first_attempt_date, cm_last_attempt_date: cm_last_attempt_date, hours_defference_cs_agent: hours_defference_cs_agent,
            hours_defference_designer: hours_defference_designer, hours_defference_cm: hours_defference_cm, lead_first_display: lead_first_display,
            cs_agent_last_attempt_status: cs_agent_last_attempt_status, cm_last_status: cm_last_status, designer_last_status: designer_last_status,
            designer_latest_remark: designer_latest_remark}
  end

  def self.leads_download_xlsx(lead_ids, user_role, user)
    cs_agents = User.with_role(:cs_agent).pluck(:id)
    cm_headers = ["Sr. No.", "Lead ID", "Customer Name", "Customer Phone", "Customer Email", "City", "Project Type", "Intended Date to Start Work",
                  "Type of Accommodation", "Scope of Work", "Estimated Month of Possession", "Call Back Day", "Call Back Time",
                  "Do you have a floorplan", "Additional Comments", " Society / Building Name", "Do you have a home loan",
                  "Lead Generator", "Location", "Source", "Home Value", "Budget", "Type of Home", "Date of Lead Assigned to Community Manager",
                  "Time of Lead Assigned to Community Manager", "Timestamp of Lead Assigned to Community Manager", "Community Manager Status",
                  "Community Manager Remark", "Date of Last Status Update of Community Manager", "Time of Last Status Update of Community Manager",
                  "Timestamp of Last Status Update of Community Manager", "Designer Name", "Designer Email", "Date of Lead Assigned to Designer",
                  "Time of Lead Assigned to Designer", "Timestamp of Lead Assigned to Designer", "Designer Status", "Designer Latest Remark",
                  "Date of Last Status Update of Designer", "Time of Last Status Update of Designer", "Timestamp of Last Status Update of Designer",
                  "WIP Status", "Date of marking WIP", "Time of marking WIP", "Timestamp of marking WIP", "WIP Sub Status", "Date of Last Status Update on Sub Status",
                  "Time of Last Status Update on Sub Status", "Timestamp of Last Status Update on Sub Status", "Remark", "Date of Latest Remark",
                  "Time of Latest Remark", "Timestamp of Latest Remark", "No of Phone Calls", "No of Meetings", "First Attempt By CS agent", "First Attempt By CS agent Time",
                  "First Attempt By CS agent Timestamp", "Last Attemt By CS agent", "Last Attemt By CS agent Time", "Last Attemt By CS agent Timestamp",
                  "First Attempt By Designer", "First Attempt By Designer Time", "First Attempt By Designer Timestamp", "Last Attemt By Designer",
                  "Last Attemt By Designer Time", "Last Attemt By Designer Timestamp", "First Attempt By Community Manager", "First Attempt By Community Manager Time",
                  "First Attempt By Community Manager Timestamp", "Last Attemt By Community Manager", "Last Attemt By Community Manager Time",
                  "Last Attemt By Community Manager Timestamp", "No of hours between acquisition and first cs agent attempt",
                  "No of hours between designer assignment and first designer attempt", "No of hours between cm assignment and first cm attempt",
                  "Lead First Displayed", "Lead First Displayed Time", "Lead First Displayed Timestamp", "Calls By CS Agent",
                  "Calls By CMs", "Calls By Designers", "No. of Meetings", "Pincode"]

    designer_headers = ["Sr. No.", "Lead ID", "Customer Name", "Customer Email", "City", "Project Type", "Intended Date to Start Work",
                        "Type of Accommodation", "Scope of Work", "Estimated Month of Possession", "Call Back Day", "Call Back Time",
                        "Do you have a floorplan", "Additional Comments", " Society / Building Name", "Do you have a home loan",
                        "Lead Generator", "Location", "Source", "Home Value", "Budget", "Type of Home", "Date of Lead Assigned to Community Manager",
                        "Time of Lead Assigned to Community Manager", "Timestamp of Lead Assigned to Community Manager", "Community Manager Status",
                        "Community Manager Remark", "Date of Last Status Update of Community Manager", "Time of Last Status Update of Community Manager",
                        "Timestamp of Last Status Update of Community Manager", "Designer Name", "Designer Email", "Date of Lead Assigned to Designer",
                        "Time of Lead Assigned to Designer", "Timestamp of Lead Assigned to Designer", "Designer Status", "Designer Latest Remark",
                        "Date of Last Status Update of Designer", "Time of Last Status Update of Designer", "Timestamp of Last Status Update of Designer",
                        "WIP Status", "Date of marking WIP", "Time of marking WIP", "Timestamp of marking WIP", "WIP Sub Status", "Date of Last Status Update on Sub Status",
                        "Time of Last Status Update on Sub Status", "Timestamp of Last Status Update on Sub Status", "Remark", "Date of Latest Remark",
                        "Time of Latest Remark", "Timestamp of Latest Remark", "No of Phone Calls", "No of Meetings", "First Attempt By CS agent", "First Attempt By CS agent Time",
                        "First Attempt By CS agent Timestamp", "Last Attemt By CS agent", "Last Attemt By CS agent Time", "Last Attemt By CS agent Timestamp",
                        "First Attempt By Designer", "First Attempt By Designer Time", "First Attempt By Designer Timestamp", "Last Attemt By Designer",
                        "Last Attemt By Designer Time", "Last Attemt By Designer Timestamp", "First Attempt By Community Manager", "First Attempt By Community Manager Time",
                        "First Attempt By Community Manager Timestamp", "Last Attemt By Community Manager", "Last Attemt By Community Manager Time",
                        "Last Attemt By Community Manager Timestamp", "No of hours between acquisition and first cs agent attempt",
                        "No of hours between designer assignment and first designer attempt", "No of hours between cm assignment and first cm attempt",
                        "Lead First Displayed", "Lead First Displayed Time", "Lead First Displayed Timestamp", "Calls By CS Agent",
                        "Calls By CMs", "Calls By Designers", "No. of Meetings"]

    p = Axlsx::Package.new
    lead_download_sheet = p.workbook

    leads = Lead.where(id: lead_ids)
    lead_download_sheet.add_worksheet(:name => "Basic Worksheet") do |sheet|
      if user_role == "cm"
        cm_designers = user.designers_for_cm&.pluck(:id)
        sheet.add_row cm_headers
      else
        sheet.add_row designer_headers
      end
      sr_no = 1
      leads.find_each do |lead|
        note_record = lead&.note_records&.last
        city = note_record.present? ? note_record&.city : lead.city
        designer = lead&.project&.assigned_designer
        project_wip_status = ""
        project_wip_time = lead&.project&.wip_time
        project_details = lead&.project
        date_of_designer_assigned = lead&.designer_projects&.where(designer_id: designer&.id, active: true)&.last&.created_at&.in_time_zone("Asia/Kolkata")&.strftime("%Y/%m/%d - %I:%M:%S%p")
        if Project::AFTER_WIP_STATUSES.include?(lead&.project&.status)
          project_wip_status = lead&.project&.status
        end

        cm_remarks = ""
        if lead&.lead_status == "dropped"
          cm_remarks = lead&.drop_reason.to_s
          if lead&.drop_reason.to_s == "Others"
            cm_remarks = lead&.drop_reason.to_s + ":- " + lead&.lost_remark.to_s
          end
        end

        if user_role == "cm"
          cm_status = lead&.lead_status == "dropped" ? "dropped" : "qualified"

          designer_remarks = ""
          cm_status_time = lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%Y/%m/%d - %I:%M:%S%p")
          lead&.project&.versions&.where(whodunnit: user.id)&.map(&:object_changes)&.map { |a|
            if a
              YAML::load a
            else
              nil
            end
          }&.map { |sts|
            if sts.present? && sts["status"].present?
              cm_status = sts["status"][1]
              cm_status_time = sts["updated_at"][1]&.in_time_zone("Asia/Kolkata")&.strftime("%Y/%m/%d - %I:%M:%S%p")
              cm_remarks = sts["remarks"][1] if sts["status"][1] == "follow_up"
            end
          }

          if designer.present?
            designer_status = "qualified"
            designer_status_time = date_of_designer_assigned
            designer_substatus_date = nil
            project_remark_date = nil
            lead&.project&.versions&.where(whodunnit: designer.id)&.map(&:object_changes)&.map { |a|
              if a
                YAML::load a
              else
                nil
              end
            }&.map { |sts|
              if sts.present? && sts["status"].present?
                designer_status = sts["status"][1]
                designer_status_time = sts["updated_at"][1]

                designer_remarks = sts["remarks"][1] if sts["remarks"].present?

                if sts["status"][1] == "lost"
                  designer_remarks = sts["reason_for_lost"][1] if sts["reason_for_lost"].present?
                  if sts["reason_for_lost"].present? && sts["reason_for_lost"][1] == "others" && sts["remarks"].present?
                    designer_remarks = sts["reason_for_lost"][1].to_s + ":- " + sts["remarks"][1].to_s
                  end
                  project_remark_date = sts["updated_at"][1]
                end
              end

              if sts.present? && sts["sub_status"].present?
                designer_substatus_date = sts["updated_at"][1]
              end

              if sts.present? && sts["remarks"].present?
                project_remark_date = sts["updated_at"][1]
              end
            }
          end
          lead_history = lead.lead_attempt_history(lead, cs_agents, designer, user)
        else
          designer_status = "qualified"
          designer_status_time = date_of_designer_assigned
          designer_substatus_date = nil
          project_remark_date = nil
          designer_remarks = ""

          lead&.project&.versions&.where(whodunnit: user.id)&.map(&:object_changes)&.map { |a|
            if a
              YAML::load a
            else
              nil
            end
          }&.map { |sts|
            if sts.present? && sts["status"].present?
              cm_status = sts["status"][1]
              cm_status_time = sts["updated_at"][1]&.in_time_zone("Asia/Kolkata")

              designer_remarks = sts["remarks"][1] if sts["remarks"].present?
              if sts["status"][1] == "lost"
                designer_remarks = sts["reason_for_lost"][1] if sts["remarks"].present? && sts["reason_for_lost"].present?
                if sts["reason_for_lost"].present? && sts["reason_for_lost"][1] == "others" && sts["remarks"].present?
                  designer_remarks = sts["reason_for_lost"][1].to_s + ":- " + sts["remarks"][1].to_s
                end
                project_remark_date = sts["updated_at"][1]
              end
            end

            if sts.present? && sts["sub_status"].present?
              designer_substatus_date = sts["updated_at"][1]
            end

            if sts.present? && sts["remarks"].present?
              project_remark_date = sts["updated_at"][1]
            end
          }

          lead_history = lead.lead_attempt_history(lead, cs_agents, user.id, user.cm.id)
        end

        if project_wip_time.present?
          no_of_meeting = (lead.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + lead.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count)
          no_of_calls = lead.inhouse_call.where("created_at < ?", DateTime.now).count
        else
          no_of_meeting = 0
          no_of_calls = 0
        end

        project_remark = ""
        if project_details.present?
          project_remark = project_details.remarks
          if project_details.status == "lost"
            project_remark = project_details.reason_for_lost
            if project_details.reason_for_lost == "other"
              project_remark = project_details.reason_for_lost.to_s + ":- " + project_details.remarks.to_s
            end
          end
        end
        no_of_all_meeting = project_wip_time.present? ? (lead.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + lead.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count) : 0

        if user_role == "cm"
          calls_by_cs_agent = lead.number_of_calls_by_user(User.with_role(:cs_agent).pluck(:id))
          calls_by_cm = lead.number_of_calls_by_user(user.id)
          calls_by_designer = lead.number_of_calls_by_user(User.with_role(:designer).pluck(:id))
          no_of_meeting = project_wip_time.present? ? (lead.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + lead.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count) : 0

          sheet.add_row [sr_no, lead.id, lead.name, lead.contact, lead.email, city, note_record&.project_type, note_record&.intended_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), note_record&.accomodation_type,
                         note_record&.scope_of_work&.map { |i| i.to_s }&.join(","), note_record&.possession_status_date, note_record&.call_back_day,
                         note_record&.call_back_time, note_record&.have_floorplan, note_record&.notes, note_record&.society, note_record&.have_homeloan,
                         note_record&.lead_generator, note_record&.location, lead&.lead_source&.name&.humanize, note_record&.home_value, note_record&.budget_value,
                         note_record&.home_type, lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         cm_status, cm_remarks, cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         designer&.name, designer&.email, date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         designer_status, designer_remarks, designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_wip_status, project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_details&.sub_status, designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_remark, project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"), no_of_meeting, no_of_calls,
                         lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:hours_defference_cs_agent], lead_history[:hours_defference_designer], lead_history[:hours_defference_cm], lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead.number_of_calls_by_user(cs_agents), lead.number_of_calls_by_user(user), lead.number_of_calls_by_user(cm_designers), no_of_all_meeting, lead.pincode]
        else
          sheet.add_row [sr_no, lead.id, lead.name, lead.email, city, note_record&.project_type, note_record&.intended_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), note_record&.accomodation_type,
                         note_record&.scope_of_work&.map { |i| i.to_s }&.join(","), note_record&.possession_status_date, note_record&.call_back_day,
                         note_record&.call_back_time, note_record&.have_floorplan, note_record&.notes, note_record&.society, note_record&.have_homeloan,
                         note_record&.lead_generator, note_record&.location, lead&.lead_source&.name&.humanize, note_record&.home_value, note_record&.budget_value,
                         note_record&.home_type, lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead&.status_updated_at&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         cm_status, cm_remarks, cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), cm_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         designer&.name, designer&.email, date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), date_of_designer_assigned&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         designer_status, designer_remarks, designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), designer_status_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_wip_status, project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), project_details&.wip_time&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_details&.sub_status, designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), designer_substatus_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         project_remark, project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), project_remark_date&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"), no_of_meeting, no_of_calls,
                         lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cs_agent_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cs_agent_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:designer_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:designer_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cm_first_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:cm_last_attempt_date]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead_history[:hours_defference_cs_agent], lead_history[:hours_defference_designer], lead_history[:hours_defference_cm], lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y"), lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%I:%M:%S %p"), lead_history[:lead_first_display]&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y %I:%M:%S %p"),
                         lead.number_of_calls_by_user(cs_agents), lead.number_of_calls_by_user(user), lead.number_of_calls_by_user(cm_designers), no_of_all_meeting]
        end
        sr_no += 1
      end
    end
    file_name = "Lead-Report-#{user.id}-#{DateTime.now.in_time_zone("Asia/Kolkata").strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp", file_name)
    p.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  # use this filter when directly filtering by a column of Lead
  def self.filter_by_date(leads, options = {})
    return self.none if options.blank? || options["column_name"].blank?  #empty relation
    from_time = options["from_date"].present? ? Date.parse(options["from_date"].to_s).beginning_of_day : Time.zone.now - 10.years
    to_time = options["to_date"].present? ? Date.parse(options["to_date"].to_s).end_of_day : Date.today.end_of_day
    leads.where({options["column_name"] => from_time..to_time})
  end

  def self.filter_customer_by_date(leads, options = {})
    return self.none if options.blank? || options["column_name"].blank?  #empty relation

    from_time = options["from_date"].present? ? Date.parse(options["from_date"].to_s).beginning_of_day : Time.zone.now - 10.years
    to_time = options["to_date"].present? ? Date.parse(options["to_date"].to_s).end_of_day : Date.today.end_of_day

    if options["column_name"] == "assigned_at"
      leads.where(status_updated_at: from_time..to_time).distinct
      # joins(:designer_projects).where(designer_projects: {active: true, created_at: from_time..to_time}).distinct
      # leads.find_all{|lead| lead&.project&.assigned_designer}
    elsif options["column_name"] == "created_at"
      leads.where(created_at: from_time..to_time).distinct
    else
      none
    end
  end

  def self.filter_leads_for_designers(leads, options = {})
    return self.none if options.blank? || options["column_name"].blank?  #empty relation

    from_time = options["from_date"].present? ? Date.parse(options["from_date"].to_s).beginning_of_day : Time.zone.now - 10.years
    to_time = options["to_date"].present? ? Date.parse(options["to_date"].to_s).end_of_day : Date.today.end_of_day

    if options["column_name"] == "assigned_to_cm"
      leads.where(status_updated_at: from_time..to_time).distinct
    elsif options["column_name"] == "assigned_to_designer"
      leads.joins(:designer_projects).where(designer_projects: {active: true, created_at: from_time..to_time}).distinct
    elsif options["column_name"] == "lead_created_at"
      leads.where(created_at: from_time..to_time).distinct
    else
      none
    end
  end

  def user_type
    lead_type&.name
  end

  # escalate any eligible leads. obviously, dont consider escalated leads.
  def self.escalate_eligible_leads
    escalated_lead_ids = []
    statuses_for_escalation = ["not_claimed", "claimed", "follow_up", "not_contactable"]
    eligible_leads = Lead.where(lead_status: statuses_for_escalation)
    eligible_leads.each do |lead|
      escalated_lead_ids << lead.id if lead.qualifies_for_escalation?
    end
    escalated_lead_ids
  end

  # check if a lead should be escalated and if so, do that with the reason. Else return false.
  def qualifies_for_escalation?
    # LeadCampaign.request_a_callback_campaign
    if lead_status == "claimed" && (status_updated_at < 20.minutes.ago)
      self.update!(lead_escalated: true, reason_for_escalation: "CS agent working on a lead for more than 20 mins.")
    elsif ["follow_up", "not_contactable"].include?(lead_status) && (event_scheduled_at.blank? || event_scheduled_at < 2.hours.ago)
      self.update!(lead_escalated: true, reason_for_escalation: "Any follow up lead which was supposed to be attempted but has not been attempted for Follow Up Time + 2 Hours.")
    else
      return false
    end
  end

  # eg time for which a follow up call has been scheduled
  def event_scheduled_at
    events.last&.scheduled_at
  end

  #convert the lead to user.
  def approve(options = {})
    self.populate_dummy_email({save_now: true}) if email.blank?
    email = self.email
    password = (0...8).map { (65 + rand(26)).chr }.join
    user = nil
    if create_new_user_on_approve?
      is_champion = options[:is_champion].present? ? options[:is_champion] : false
      user = User.new(email: email, dummyemail: dummyemail, password: password, name: self.name,
                      contact: self.contact, pincode: self.pincode, is_champion: is_champion)
      user.save!
      role_assign = ["designer", "cs_agent", "community_manager", "design_head", "catalogue_head", "lead_head", "customer_head", "broker", "manufacturer", "finance", "sitesupervisor"].include?(self.user_type)
      role_assign ? user.add_role(user_type.to_sym) : user.add_role(:customer)
      # if user.has_role?(:customer)
      user.skip_confirmation_notification!
      user.confirm
      # end
    else
      user = related_user_by_email
    end

    # Mark lead as qualified
    self.update!(lead_status: "qualified", related_user: user)
    #create empty project for customer leads, if a project isn't already present.
    # A lead can have only one project.
    if user.has_role?(:customer) && self.project.blank?
      if self.note_records.present? && self.note_records.last&.project_name.present?
        user.projects.build(:name => self.note_records.last.project_name, :details => "Update project details here.", lead: self, status: "qualified")
      else
        proj_name = name || "No Name Given"
        x = user.projects.create(:name => proj_name, :details => "Update project details here.", lead: self, status: "qualified")
      end
      user.save!
    end
    self.assign_to_cm if self.related_user.has_role?(:customer)

    if user.has_role?(:designer) && self.lead_type.name == "designer"
      if user.designer_detail.present?
        lead_cv = self.lead_cv
        user.designer_detail.update(instagram_handle: self&.instagram_handle, designer_cv: lead_cv, active: false)
      else
        lead_cv = self.lead_cv
        @designer_detail = user.build_designer_detail(instagram_handle: self&.instagram_handle, designer_cv: lead_cv, active: false)
        @designer_detail.save!
      end
    end

    #email job with users details
    if user.has_any_role? :designer, :cs_agent, :community_manager, :design_head, :catalogue_head, :customer_head, :lead_head, :broker, :manufacturer, :finance, :sitesupervisor
      UserNotifierMailer.user_approved_email(user, password).deliver_now!
      if Rails.env.production?
        SmsModule.send_sms("Welcome to Arrivae.com. Your request has been qualified.", user.contact)
      end
    end
  end

  # agent is a user with role 'cs_agent' (forcefully assign, most likely by lead head)
  def assign_to_csagent(agent, options = {})
    ActiveRecord::Base.transaction do
      active_lead_user&.update!(claimed: "force_reassigned")
      lead_users.map { |lu| lu.update!(active: false) }
      lead_user = lead_users.where(user: agent).first_or_initialize
      # self.lock!
      lead_user.lock!
      lead_user.claimed = "force_yes"
      #==============
      # if options[:lead_status].present?
      #   self.lead_status = options[:lead_status]
      # else
      #   self.lead_status = "claimed"
      # end
      # self.lead_escalated = false
      # self.reason_for_escalation = nil
      #==============
      # self.status_updated_at = Time.zone.now
      lead_user.active = true
      # self.save!
      lead_user.save!
    end
  end

  # Auto assign lead (via background job ideally)
  def auto_assign(agent)
    ActiveRecord::Base.transaction do
      # active_lead_user&.update!(claimed: "auto_reassigned")
      lead_users.map { |lu| lu.update!(active: false) }
      lead_user = lead_users.where(user: agent).first_or_initialize
      self.lock!
      lead_user.lock!
      # lead_user.claimed = "pending"
      # self.lead_status = "not_claimed"
      # self.status_updated_at = Time.zone.now
      lead_user.active = true
      lead_user.seen_by_agent = true
      lead_user.claimed = "pending"
      # self.save!
      lead_user.save!
    end
  end

  # have a lead claimed by a cs_agent
  def claim_lead(agent)
    ActiveRecord::Base.transaction do
      lead_user = lead_users.where(user: agent).take
      return false unless (lead_user.present? && lead_user.active)  #only active leads may be claimed

      # lead_user.update!(claimed: 'yes')
      # self.update!(lead_status: 'claimed', status_updated_at: Time.zone.now)
      self.update!(lead_status: "claimed")
    end
  end

  def lead_user_change(agent)
    ActiveRecord::Base.transaction do
      # active_lead_user&.update!(claimed: "auto_reassigned")
      lead_users.map { |lu| lu.update!(active: false) }
      lead_user = lead_users.where(user: agent).first_or_initialize
      # self.status_updated_at = Time.zone.now
      lead_user.active = true
      self.save!
      lead_user.save!
    end
  end

  # Remove a lead assigned to a cs_agent so that it can be assigned to others
  def unassign
    ActiveRecord::Base.transaction do
      self.lock!
      # active_lead_user&.update!(claimed: "auto_reassigned")
      # self.update!(lead_status: "not_attempted") if self.lead_status == "claimed"
      if self.active_lead_user.present? && self.active_lead_user.claimed == "force_yes"
        self.update!(lead_escalated: true, reason_for_escalation: "CS Agent Skipped the lead")
      end
      lead_users.map { |lu| lu.update!(active: false) }
      # self.lead_status = 'not_attempted'
      # self.status_updated_at = Time.zone.now
      # self.save!
    end
  end

  # active describes it perfectly. At a time, only one cs_agent can be active for a lead.
  def active_lead_user
    lead_users.where(active: true).last
  end

  # assigned world is wrong - it should probably be active.
  def assigned_cs_agent
    active_lead_user&.user
  end

  # Is this lead assigned to this user. Again, instead of assigned, it should be active.
  def is_assigned_to?(user)
    user.has_role?(:cs_agent) && assigned_cs_agent == user
  end

  def ownerable_details
    hash = Hash.new
    hash[:ownerable_type] = "Lead"
    hash[:ownerable_id] = self.id
    hash[:name] = self.name
    hash[:project_name] = self.project ? self.project.name : "No Project Present"
    hash
  end

  #email trigger when lead registers.
  def send_signup_mail
    if self.email.present?
      UserNotifierMailer.lead_signup_email(self).deliver! unless (has_dummy_email? || invited)
    end
    SmsModule.send_sms(Whatsapp::LEAD_CREATION_SMS_TO_LEAD, self.contact)
  end

  def has_dummy_email?
    dummyemail
  end

  # When this lead is approved, should a new user be created? If false
  def create_new_user_on_approve?
    related_user_by_email.blank?
  end

  def populate_dummy_email(options = {})
    self.email = Lead.generate_dummy_email
    self.dummyemail = true
    self.save if options[:save_now]
  end

  def self.generate_dummy_email
    domain = "@dummyarrivae.com"
    mail = "dummy1" + domain

    # Generate a random dummy email. If no leads or users exist with that email,
    # then accept it. Else repeat.
    10000.times do
      mail = "dummy" + SecureRandom.random_number(100000).to_s + domain
      break if Lead.where(email: mail).blank? && User.where(email: mail).blank?
    end

    mail
  end

  # Lead Status mail to Lead Head
  def status_of_lead_to_lead_head
    mail_ids = User.with_role(:lead_head).pluck(:email)
    UserNotifierMailer.status_of_lead_to_lead_head(self, mail_ids).deliver_later!(wait: 15.minutes)
  end

  def related_user_by_email
    User.find_by(email: self.email)
  end

  def has_fhi_cm?
    self.assigned_cm&.tags&.pluck(:name)&.include? "full_home"
  end

  # def self.create_projects_if_empty(leads)
  #   loaded_leads = leads.load
  #   leads_without_project_ids = loaded_leads.where.not(id: loaded_leads.joins(:project).distinct).pluck :id

  #   leads_without_project = Lead.where(id: leads_without_project_ids)
  #   leads_without_project.joins(:lead_type).where(lead_type: {name: 'customer'}).each do |lead|
  #     lead.populate_project if lead.project.blank
  #   end
  # end

  # def populate_project
  #   # A lead can have only one project.
  #   user = related_user
  #   if note_records.present? && note_records.last&.project_name.present?
  #     user.projects.build(:name => note_records.last.project_name, :details => "Update project details here.", lead: self, status: "qualified")
  #   else
  #     x = user.projects.create(:name => Bazaar.heroku, :details => "Update project details here.", lead: self, status: "qualified")
  #   end
  #   user.save!
  # end

  def assign_to_cm
    return true if ( disable_cm_auto_assign || self.project&.assigned_designer&.present? )
    if self.lead_type&.name == "customer"
      city = self.city.present? ? self.city : (self.note_records.present? && self.note_records.last.city.present?) ? self.note_records.last.city : ""

      if self.pincode.present?
        users = User.joins(:zipcodes).where(users: {is_cm_enable: true}, zipcodes: {code: self.pincode}).with_role(:community_manager)
      elsif city.present?
        city = City.where(name: city).first
        users = city.users.with_role(:community_manager) if city.present?
      else
        #for GM assignment
        city_user = city.present? ? city.users.with_role(:community_manager) : []
        zip_users = User.joins(:zipcodes).where(users: {is_cm_enable: true},zipcodes: {code: self.pincode}).with_role(:community_manager)
        users = city_user + zip_users
      end
      tag = self.tag
      if tag.present?
        users_with_same_tag = tag.users.with_role(:community_manager).where(is_cm_enable: true)
        zipcode = Zipcode.where(code: self.pincode).first
        zip_users = zipcode.users.with_role(:community_manager).where(is_cm_enable: true) if zipcode.present?
        users_with_same_tag = zip_users.present? ? zip_users.joins(:tags).where(tags: {id: self.tag_id}) : ""
        # users_with_same_tag = users_with_same_tag.joins(:zipcodes).where(zipcodes: {code: self.pincode}).pluck(:id)
        # users_with_same_tag = users_with_same_tag.uniq
        # users_with_same_tag = User.where(id: users_with_same_tag)
        if users_with_same_tag.present?
          # check if mamta is present in that zip code and
          # home value is less than 99 lacs
          mamta_user = users_with_same_tag.where(email: "mamta@arrivae.com").last
          if ["Less than 30 Lacs", "30 - 50 Lacs", "50 - 70 Lacs", "70 - 99 Lacs"].include?(self.note_records.last.home_value) && mamta_user
            cm = mamta_user
          else
            cm = users_with_same_tag.sample
          end
        else
          cm = users.sample if users.present?
        end
      else
        users = User.joins(:zipcodes).where(users: {is_cm_enable: true},zipcodes: {code: self.pincode}).with_role(:community_manager)
        cms = []
        users.each do |u|
          cms.push u.id if u.tags.count > 1
        end
        cms = cms.count > 1 ? User.where(id: cms.uniq) : users
        cm = cms.sample
      end

      if self.assigned_cm_id.present?
        assigned_cm = User.find(self.assigned_cm_id)
        assigned_cm_tags = assigned_cm.tags.pluck(:id)
      end

      created_by_user = User.where(id: self.created_by).first
      if created_by_user.present? && created_by_user.has_role?(:designer)
        return
      else
        if self.assigned_cm_id.present? && assigned_cm_tags.include?(self.tag_id) && (zip_users.present? && self.assigned_cm_id.in?(zip_users.pluck(:id)))
          return
        else
          self.update!(assigned_cm_id: cm.id) if cm.present?
        end
      end
    else
      return true
    end
  end

  def generate_sales_life_cycle_pdf
    pdf_content = LeadSalesReportPdf.new(self, self.life_cycle_data)
    filepath = Rails.root.join("tmp", "lead_sales_report_#{self.id}.pdf")
    pdf_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  def life_cycle_data
    report = {}

    cs_agents = User.with_role(:cs_agent).pluck(:id)
    designer = self.project&.assigned_designer
    cm = self.assigned_cm
    lead_history = self.lead_attempt_history(self, cs_agents, designer, cm)

    ### Lead Acquisition Stage
    report[:"Lead Acquisition Stage"] = {}
    lead_acquisition_date = self.created_at.strftime("%d-%m-%Y")
    report[:"Lead Acquisition Stage"][:"Lead Acquisition Date"] = lead_acquisition_date
    first_attempt_date = self.versions.select { |version| (version.changeset.keys.include?("lead_status") and (version.changeset["lead_status"][0] != nil)) }&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"Lead Acquisition Stage"][:"First Attempt Date"] = first_attempt_date
    no_of_calls_by_cs_agent = self.number_of_calls_by_user(cs_agents)
    report[:"Lead Acquisition Stage"][:"No of Calls by CS Agent"] = no_of_calls_by_cs_agent
    lead_qualification_date = self.versions.select { |version| (version.changeset.keys.include?("lead_status") and (version.changeset["lead_status"][1] == "qualified")) }&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"Lead Acquisition Stage"][:"Lead Qualification Date"] = lead_qualification_date

    ### Community Stage
    report[:"Community Stage"] = {}
    lead_assigned_to_designer = self.designer_projects&.where(designer_id: designer&.id, active: true)&.last&.created_at&.in_time_zone("Asia/Kolkata")&.strftime("%d-%m-%Y")
    report[:"Community Stage"][:"Lead Assigned to Designer"] = lead_assigned_to_designer
    lead_drop_date = self.versions.select { |version| (version.changeset.keys.include?("lead_status") and (version.changeset["lead_status"][1] == "dropped")) }&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"Community Stage"][:"Lead Dropped Date"] = lead_drop_date

    ### Designer Stage
    report[:"Designer Stage"] = {}
    first_attempt_by_designer = lead_history[:designer_first_attempt_date].present? ? lead_history[:designer_first_attempt_date].strftime("%d-%m-%Y") : nil
    report[:"Designer Stage"][:"First Attempt by Designer"] = first_attempt_by_designer
    no_of_calls_by_designer = self.number_of_calls_by_user(User.with_role(:designer).pluck(:id))
    report[:"Designer Stage"][:"No of Calls by Designer"] = no_of_calls_by_designer
    project_wip_time = self.project&.wip_time
    if project_wip_time.present?
      no_of_meeting = (self.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + self.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count)
      first_meeting_date = self.project&.events&.where(agenda: "first_meeting")&.first&.scheduled_at&.strftime("%d-%m-%Y")
    else
      no_of_meeting = 0
      first_meeting_date = nil
    end
    report[:"Designer Stage"][:"No of Meeting by Designer"] = no_of_meeting
    report[:"Designer Stage"][:"Date of First Meeting"] = first_meeting_date

    ### Pre-Bid Stage
    report[:"Pre-Bid Stage"] = {}
    floorplan_updated = self.project&.floorplans&.last&.updated_at&.strftime("%d-%m-%Y")
    report[:"Pre-Bid Stage"][:"Floor Plan Updated"] = floorplan_updated
    requirement_sheet_updated = self.project&.project_requirement&.updated_at&.strftime("%d-%m-%Y")
    report[:"Pre-Bid Stage"][:"Requirement Sheet Updated"] = requirement_sheet_updated

    shared_proposals = ProposalDoc.joins(:proposal).where(proposals: {project: self.project})&.distinct&.where(ownerable_type: "Quotation")
    shared_approved_proposals = shared_proposals&.where(is_approved: true)

    ## 10% STAGE
    report[:"10% Stage"] = {}
    #boq_created  = self.project&.quotations&.where(wip_status: 'pre_10_percent')
    #boq_created  = self.project&.quotations&.where.not(status: ['draft', 'rejected'])&.where(wip_status: [nil, 'pre_10_percent'])
    boq_created = self.project.quotations.where.not(status: ["draft"]).where(wip_status: [nil, "pre_10_percent"])
    boq_created = boq_created.select do |boq|
      if boq.parent_quotation.present?
        boq.parent_quotation.wip_status != "10_50_percent"
      else
        true
      end
    end if boq_created
    no_of_boq_created = boq_created&.count
    report[:"10% Stage"][:"No of BOQs Created"] = no_of_boq_created
    value_of_boq_created = boq_created&.map(&:total_amount)&.compact&.sum&.round(2)
    report[:"10% Stage"][:"Value of BOQs Created"] = value_of_boq_created
    boq_shared = Quotation.where(id: shared_proposals&.pluck(:ownerable_id), wip_status: "pre_10_percent")
    no_of_boq_shared = boq_shared&.count
    report[:"10% Stage"][:"No of BOQs Shared"] = no_of_boq_shared
    value_of_boq_shared = boq_shared&.map(&:total_amount)&.compact&.sum&.round(2)
    report[:"10% Stage"][:"Value of BOQs Shared"] = value_of_boq_shared
    first_boq_creation_date = boq_created&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"10% Stage"][:"Date of Creating First BOQ"] = first_boq_creation_date
    first_boq_shared_date = shared_proposals&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"10% Stage"][:"Date of Sharing First BOQ"] = first_boq_shared_date
    last_boq_shared_date = shared_proposals&.last&.created_at&.strftime("%d-%m-%Y")
    report[:"10% Stage"][:"Date of Sharing Last BOQ"] = last_boq_shared_date
    date_of_last_boq_approved = shared_proposals&.where(is_approved: true)&.last&.approved_at&.strftime("%d-%m-%Y")
    report[:"10% Stage"][:"Date of BOQ Approval"] = date_of_last_boq_approved
    last_discount_approved = boq_created&.select { |boq| boq.discount_status == "accepted" }&.last&.discount_value
    report[:"10% Stage"][:"Discount Approved"] = last_discount_approved
    pre_10_all_payments = self.project&.payments&.where(payment_stage: "pre_10_precent")
    date_of_adding_last_payment = pre_10_all_payments&.last&.created_at&.strftime("%d-%m-%Y")
    report[:"10% Stage"][:"Date of Adding Last Payment"] = date_of_adding_last_payment
    total_amount_of_payment_added = pre_10_all_payments&.map(&:amount)&.compact&.sum&.round(2)
    report[:"10% Stage"][:"Total Amount of Payment Added"] = total_amount_of_payment_added

    ## 10-40% STAGE
    report[:"10-40% Stage"] = {}
    date_of_site_measurement = self.project&.site_measurement_requests&.where(request_status: "complete")&.first&.scheduled_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of Site Measurement"] = date_of_site_measurement
    shared_final_boqs = self.project&.quotations&.joins(:proposals)&.where(proposals: {proposal_type: "final_design"}, status: "shared")&.distinct
    date_of_sharing_final_boq_first = shared_final_boqs&.first&.proposal_docs&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of Sharing Final BOQ - First"] = date_of_sharing_final_boq_first
    date_of_sharing_final_boq_last = shared_final_boqs&.first&.proposal_docs&.last&.created_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of Sharing Final BOQ - Last"] = date_of_sharing_final_boq_last
    cad_file_upload_date = CadUpload.where(quotation_id: shared_approved_proposals&.pluck(:ownerable_id))&.first&.created_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"CAD Files Upload Date"] = cad_file_upload_date
    #design_qc_date = ???
    ten_40_boq_created = self.project&.quotations&.where(wip_status: "10_50_percent")
    ten_40_boq_shared = ten_40_boq_created&.where(id: shared_proposals&.pluck(:ownerable_id))
    date_of_category_approval = ten_40_boq_shared&.where(category_approval: true)&.first&.category_appoval_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of Category Approval"] = date_of_category_approval
    date_of_cm_approval = ten_40_boq_shared&.where(cm_approval: true)&.first&.cm_approval_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of CM Approval"] = date_of_cm_approval
    ten_40_all_payments = self.project&.payments&.where(payment_stage: "10_50_percent")
    ten_40_last_discount_approved = ten_40_boq_created&.where(discount_status: "accepted")&.last&.discount_value
    report[:"10-40% Stage"][:"Discount Approved"] = ten_40_last_discount_approved
    ten_40_date_of_adding_last_payment = ten_40_all_payments&.last&.created_at&.strftime("%d-%m-%Y")
    report[:"10-40% Stage"][:"Date of Adding Last Payment"] = ten_40_date_of_adding_last_payment
    ten_40_total_amount_of_payment_added = ten_40_all_payments&.map(&:amount)&.compact&.sum&.round(2)
    report[:"10-40% Stage"][:"Total Amount of Payment Added"] = ten_40_total_amount_of_payment_added
    report
  end

  # set it to 11 AM on the 1st of the month (eg if Feb-2019, set it to 01-02-2019 11:00AM)
  # date_to_parse can be a string or date/datetime.
  # 15-10-2019: Same logic for both delay types, as per Abhishek's request.
  def intended_time(delay_type)
    date_to_parse = nil
    delayed_date = nil
    intended_date = nil
    if delay_type == "delayed_possession" || delay_type == "delayed_project"
      str1 = note_records.first&.possession_status_date
      delayed_date = (ActiveSupport::TimeZone["Asia/Kolkata"].parse(str1).beginning_of_month + 11.hours) if str1.present?
      str2 = note_records.first&.intended_date  #this is time already, so don't parse.
      intended_date = ( str2.beginning_of_month + 11.hours ) if str2.present?
    end

    # 15-11-2019: New logic on Abhishek's request.
    if delayed_date.present? && intended_date.present?
      return [delayed_date, intended_date].max
    elsif delayed_date.present?
      return delayed_date
    elsif intended_date.present?
      return intended_date
    else
      return nil
    end
  end

  def schedule_delay(schedule_at)
    self.events.where(status: ["scheduled", "rescheduled"]).update(status: "done")
    # Lead should become available ('not_attempted') 2 months before, on the 1st day, at 11 AM.
    parsed_time = schedule_at.to_time.beginning_of_month - 2.months + 11.hours
    # If that time is in this month, then it should have come on the 1st of this month. That is not be possible.
    # So, trigger it 10 minutes from now.
    if parsed_time <= Time.zone.now
      parsed_time = Time.zone.now + 10.minutes
    end
    Lead::DelayedPossessionJob.set(wait_until: parsed_time).perform_later(self)
  end

  def digital_physical?
    self.lead_source&.name&.in?(Lead::DIGITAL_SOURCES_AWS) ? "Digital" : "Physical"
  end

  private

  def escalated_lead_must_have_reason
    errors.add(:lead_escalated, "reason_for_escalation must be present if lead is escalated") if lead_escalated && reason_for_escalation.blank?
  end

  def populate_status_updated_at
    self.update_columns(status_updated_at: Time.zone.now) if status_updated_at.blank?
  end

  # mark as duplicate if a lead with same contact number was created within the last week.
  def check_duplicate
    self.duplicate = true if Lead.where(contact: contact).where("created_at > ?", 1.week.ago).present?
  end

  def not_contactable_watcher
    if lead_status_changed?
      self.update_columns(not_contactable_counter: 0) if ["follow_up", "qualified", "dropped", "delayed_possession"].include?(self.lead_status)
      # Following code is commented because not_contactable_counter is being updated in the
      # controller when someone updates the status.
      # self.update_columns(not_contactable_counter: not_contactable_counter + 1) if self.lead_status == 'not_contactable'
      self.events.where(agenda: ["follow_up", "qualified"]).where.not(status: "done").update(status: "done")
      self.update_columns(status_updated_at: Time.zone.now)
    end
    if not_contactable_counter_changed?
      self.update_columns(lead_status: "lost_after_5_tries") if (not_contactable_counter >= 5 && !["follow_up", "qualified", "dropped", "delayed_possession"].include?(self.lead_status))
    end
  end
end
