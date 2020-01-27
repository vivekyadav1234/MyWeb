# == Schema Information
#
# Table name: projects
#
#  id                :integer          not null, primary key
#  name              :string
#  user_id           :integer
#  details           :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  lead_id           :integer
#  status            :string
#  remarks           :string
#  wip_time          :datetime
#  count_of_calls    :integer
#  status_updated_at :datetime
#  reason_for_lost   :string
#  sub_status        :string
#  new_handover_file :boolean          default(FALSE)
#  last_handover_at  :datetime
#

class Project < ApplicationRecord

  has_paper_trail
  #associations
  belongs_to :user
  belongs_to :lead
  has_many :send_to_factory_url, dependent: :destroy
  has_many :payment_invoices, dependent: :destroy

  has_one :project_detail, dependent: :destroy
  has_one :designer_booking_form, dependent: :destroy
  has_many :payments, dependent: :destroy
  has_many :task_categories, dependent: :destroy
  has_many :project_tasks, dependent: :destroy

  has_many :quotations, dependent: :destroy
  has_many :boq_labels, through: :quotations, source: :boq_labels
  has_many :bank_transactions

  has_many :floorplans, dependent: :destroy
  has_many :presentations, dependent: :destroy
  has_many :comments,as: :commentable, dependent: :destroy
  has_many :designer_projects, dependent: :destroy
  has_many :designers, through: :designer_projects

  has_many :events, as: :ownerable, dependent: :destroy
  has_many :proposals, dependent: :destroy

  has_many :site_measurement_requests, dependent: :destroy

  has_many :custom_elements
  has_one :project_requirement
  has_one :scope_of_work
  has_one :project_booking_form
  has_one :customer_profile

  has_many :cad_drawings, dependent: :destroy

  has_many :boq_and_ppt_uploads

  has_many :task_escalations, as: :ownerable, dependent: :destroy
  has_many :task_sets, through: :task_escalations

  #Category Handover Flow Dependencies
  has_many :three_d_images, dependent: :destroy
  has_many :line_markings, dependent: :destroy
  has_many :reference_images, dependent: :destroy
  has_many :line_markings, dependent: :destroy
  has_many :elevations, dependent: :destroy
  has_many :project_handovers, dependent: :destroy
  has_many :project_handover_urls, dependent: :destroy
  has_many :requested_files, dependent: :destroy

  #validations
  validates_presence_of :name

  before_create :populate_details
  after_create :populate_default_tasks

  has_many :sms_logs, as: :ownerable, dependent: :destroy
  has_many :purchase_orders

  has_many :project_quality_checks

   scope :search_projects, -> (search_param) {
    joins(:lead).where( "CAST(projects.id AS TEXT) ilike ? or LOWER(projects.name) ilike ? or LOWER(leads.name) ilike ? or CAST(leads.id AS TEXT) ilike ?","%#{search_param}%","%#{search_param}%", "%#{search_param}%", "%#{search_param}%")
  }

  #rolify
  resourcify

  # def assign_project(designer_id)
  #   unless self.designer_projects.find_by(designer_id: designer_id).present?
  #     self.designer_projects.create(designer_id: designer_id)
  #   end
  # end

  ALLOWED_CUSTOMER_STATUSES = ["qualified", "meeting_fixed", "not_contactable", "follow_up", "lost", "wip", "installation","handover", "on_hold", "inactive", "pre_10_percent", "10_50_percent", "50_percent", "installation", "delayed_possession", "delayed_project"]

  ALLOWED_SUB_STATUSES = [nil,"floorplan_and_requirement_sheet_uploaded","initial_proposal_submitted","initial_proposal_rejected","initial_proposal_accepted","initial_payment_recieved", "site_measurement_done","final_proposal_submitted","final_proposal_rejected","final_proposal_accepted","40%_payment_recieved"]

  AFTER_WIP_STATUSES = ["wip", "installation", "on_hold", "inactive"]

  WIP_DASHBOARD_STATUSES = ["active", "inactive", "on_hold", "completed"]
  PIPELINE_ACTIVE_STATUS = ["wip", "qualified", "follow_up", "not_contactable"]

  validates_inclusion_of :status, in: ALLOWED_CUSTOMER_STATUSES
  validates_inclusion_of :sub_status, in: ALLOWED_SUB_STATUSES

  after_save :check_event_1st_call_with_gm

  def check_event_1st_call_with_gm
    if self.sub_status == 'initial_proposal_submitted'
      self.creation_of_first_call_with_gm
    end
  end

  def creation_of_first_call_with_gm
    if self.events.where(agenda: '1st_call_by_gm').count.zero?
      if (Time.zone.now.hour + 4).to_i >= 19
        t_hour = (Time.zone.now.hour - 5).to_i
        t_hour = 10 if t_hour >= 19
        schedule_data_time = Time.zone.tomorrow + t_hour.hours + Time.zone.now.strftime('%M').to_i.minutes
      elsif (Time.zone.now.hour + 4).to_i <= 10
        schedule_data_time = Time.zone.now.to_date + 10.hours + Time.zone.now.strftime('%M').to_i.minutes
      else
        schedule_data_time = Time.zone.now + 4.hours
      end
      gm = self.lead&.assigned_cm&.gms.last
      if gm
        event = self.events.create!(
          agenda: "1st_call_by_gm", contact_type: "phone_call",
          scheduled_at: schedule_data_time, ownerable: self)
        event.event_users.create!(user: gm)
      end
    end
  end

  scope :projects_available_to_cad, ->{ where(status: 'wip', sub_status: ["initial_payment_recieved", "site_measurement_done","final_proposal_submitted","final_proposal_rejected","final_proposal_accepted","40%_payment_recieved"]) }

  def self.populate_all_details
    Project.all.map{|p| p.populate_details(true)}
  end

  # return true if any cad_uploads in any 40% approved boqs in this project need to be approved.
  def cad_approval_pending?
    quotations.map(&:cad_upload_approval_pending?).include?(true)
  end

  #assign designer to project.
  def assign_project(designer_id)
    self.update!(status: "qualified") if !self.status.in?(AFTER_WIP_STATUSES)
    # self.designer_project_ids = []
    ActiveRecord::Base.transaction do
      # Make sure other designers are unassigned and expire their tokens
      designer_projects.map{|dp| dp.update!(active: false, mail_token: nil, token_uses_left: 0)}
      designer_project = designer_projects.where(designer_id: designer_id).first_or_create!
      designer_project.update!(active: true)
      designer_project.renew_token
      designer_project.send_notifications
    end
  end

  # return the assigned designer for this project
  def assigned_designer
    designer_projects.where(active: true).last&.designer
  end

  def populate_details(save_flag=false)
    self.build_project_detail
    self.build_designer_booking_form
    self.save! if save_flag
  end

  def populate_default_tasks
    filepath = Rails.root.join('app','data','scheduler_spec.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each_with_index do |row,i|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['description']]
      internal_name = workbook.row(row)[headers['sr no']]
      action_point = workbook.row(row)[headers['action point']].to_i
      process_owner = workbook.row(row)[headers['process owner']].to_i
      dependencies = workbook.row(row)[headers['previous dependency']].to_s
      duration = workbook.row(row)[headers['tat']].to_i
      remarks = workbook.row(row)[headers['remarks']]

      project_task = self.project_tasks.create!(internal_name: internal_name, name: name,
        duration: duration, percent_completion: 0, status: 'not_started', :remarks => remarks)
      project_task.update!(start_date: Date.today) if i==0

      dependencies.split(',').each do |taskid|
        taskid = taskid.to_f if numeric?(taskid)
        dep = project_tasks.find_by(internal_name: taskid.to_s.strip)
        # puts "+++++++++#{taskid}+++++++++"
        # puts dep.inspect
        project_task.upstream_dependencies << dep if dep.present?
      end if dependencies.present?
    end

  end

  def numeric?(string)
    # `!!` converts parsed number to `true`
    !!Kernel.Float(string)
  rescue TypeError, ArgumentError
    false
  end

  def change_status
    puts "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
    if scope_of_work.present? && ["assigned", "pending"].&(site_measurement_requests.all.pluck(:request_status)).empty?
      flag =0
      quotations.where(copied: false, status: "shared").each do |boq|
        if boq.paid_amount >= (0.10 * boq.total_amount)
          boq.update(wip_status: "10_50_percent")
          flag = 1
        end
      end
      self.update(status: "10_50_percent") if flag == 1
    end
    puts "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
  end

  def self.project_status_after_wip_filters(status)
    if status == "inactive" || status == "on_hold"
      return status
    elsif status == "active"
      return ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"]
    elsif status == "completed"
      return "handover"
    end
  end

  def change_sub_status
    project_sub_status = Project::ALLOWED_SUB_STATUSES
    shared_boqs = self.quotations.where(status: "shared")
    pre_10_shared_boqs = shared_boqs.where(wip_status: "pre_10_percent")
    ten_50_shared_boqs = shared_boqs.where(wip_status: "10_50_percent")
    plus_50_boqs = shared_boqs.where(wip_status: "50_percent")
    # paid_10_boqs = pre_10_shared_boqs.map(&:ten_per_true)
    # paid_50_boqs = ten_50_shared_boqs.map(&:per_50_true)
    if plus_50_boqs.present?
      sub_status = "50_percent"
    elsif ten_50_shared_boqs.present?
      sub_status = "10_50_percent"
    elsif pre_10_shared_boqs.present?
      sub_status = "pre_10_percent"
      final_proposal = proposals.where(proposal_type: "final_design", is_draft: "no")
      if final_proposal.present?
        final_proposal_accepted = ProposalDoc.joins(:proposal).where(proposal_id: final_proposal).uniq.pluck(:is_approved).compact.include?(true)
        sub_status = final_proposal_accepted.present? ? final_proposal_accepted == true ? "final_proposal_accepted" : "final_proposal_rejected" : "final_proposal_submitted"
      end
    elsif shared_boqs.present?
      approved_boqs = shared_boqs.pluck(:is_approved).compact.include?(true)
      sub_status = approved_boqs.present? ? approved_boqs == true ?   "initial_proposal_accepted" : "initial_proposal_rejected" : "initial_proposal_submitted"
    else
      sub_status = ""
    end

    self.update!(sub_status: sub_status)
  end

  def project_address
    booking_form = self.project_booking_form
    booking_form.present? ? "#{booking_form.flat_no}, #{booking_form.floor_no}, #{booking_form.building_name}, #{booking_form.location}, #{booking_form.city} - #{booking_form.pincode} " : nil
  end

  def check_present_handover_list(data, class_name)
    used_id = self.project_handovers.where(ownerable_type: class_name).pluck(:ownerable_id)
    data.where.not(id: used_id)
  end

  # This may be use full in future
  # def get_last_status_of_project
  #  all_versions =  self.versions.order(created_at: :asc)
  #   all_versions.each do |project_versions|
  #     if project_versions.object_changes.present? && (YAML::load project_versions.object_changes)["status"].present? && (YAML::load project_versions.object_changes)["status"][1].in?([""])

  #     end
  #   end
  # end

end
