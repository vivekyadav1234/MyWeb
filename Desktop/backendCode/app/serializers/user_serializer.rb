# == Schema Information
#
# Table name: users
#
#  id                         :integer          not null, primary key
#  provider                   :string           default("email"), not null
#  uid                        :string           default(""), not null
#  encrypted_password         :string           default(""), not null
#  reset_password_token       :string
#  reset_password_sent_at     :datetime
#  remember_created_at        :datetime
#  sign_in_count              :integer          default(0), not null
#  current_sign_in_at         :datetime
#  last_sign_in_at            :datetime
#  current_sign_in_ip         :string
#  last_sign_in_ip            :string
#  confirmation_token         :string
#  confirmed_at               :datetime
#  confirmation_sent_at       :datetime
#  unconfirmed_email          :string
#  name                       :string
#  nickname                   :string
#  image                      :string
#  email                      :string
#  tokens                     :json
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  contact                    :string
#  avatar_file_name           :string
#  avatar_content_type        :string
#  avatar_file_size           :integer
#  avatar_updated_at          :datetime
#  is_active                  :boolean          default(TRUE)
#  pincode                    :string
#  address_proof_file_name    :string
#  address_proof_content_type :string
#  address_proof_file_size    :integer
#  address_proof_updated_at   :datetime
#  gst_number                 :string
#  pan                        :string
#  online_status              :boolean
#  kyc_approved               :boolean          default(FALSE)
#  cm_id                      :integer
#  dummyemail                 :boolean          default(FALSE)
#  last_request_at            :datetime
#  designer_status            :string           default("not_applicable")
#  cm_for_site_supervisor_id  :integer
#  call_type                  :string
#  extension                  :string
#  sales_manager_id           :integer
#  otp_secret_key             :string
#  user_level                 :integer          default(1)
#  parent_id                  :integer
#  invited_by_id              :integer
#  is_champion                :boolean          default(FALSE)
#  is_cm_enable               :boolean          default(TRUE)
#  allow_password_change      :boolean          default(FALSE), not null
#  internal                   :boolean          default(FALSE)
#  catalog_type               :string           default("arrivae"), not null
#

 class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :contact, :roles, :nickname, :avatar, :is_active,
    :pincode, :gst_number, :pan, :address_proof, :kyc_approved, :project_details,
    :created_at, :project_tasks, :dummyemail, :last_request_at, :designer_status, 
    :extension, :user_level, :parent_id, :invited_by_id, :is_champion, :is_cm_enable

  attribute :online_status
  attribute :designer_list
  attribute :customer_list
  attribute :designhead_list
  attribute :leadhead_list
  attribute :cs_list
  attribute :cm_list
  attribute :cataloguelead_list
  attribute :boqhead_list
  attribute :admin_list
  attribute :parent

  def roles
    object.roles.pluck(:name).uniq
  end

  def online_status
    object.online_status ? "online" : "offline"
  end

  # Need to be in different serializer. This is not correct way.(For CM)

  def project_details
    object.projects.last
  end

  def project_tasks
    project = object.projects.last
    if project.present?
      project_tasks = []
      project_tasks = project.project_tasks
      # upstream_dependencies = []
      # downstream_dependencies = []
      # task_list.each do |tl|
      #   task_hash = {}
      #   upstream_dependencies = tl.upstream_dependencies
      #   downstream_dependencies = tl.downstream_dependencies
      #   # null = nil
      #   tl = tl.to_json
      #   tl["upstream"] = "upstream_dependencies"
      #   tl["downstream"] = "downstream_dependencies"
      #   project_tasks = project_tasks.push(tl)
      # end
    end
    project_tasks
  end

  def all_clients
    array = []
    clients = User.with_role :customer
    clients.each_with_index do |client,index|
      client_hash = {}
      project = client.projects.last
      client_hash['client_id'] = client.id
      client_hash['email'] = client.email
      client_hash['name'] = client.name
      client_hash['created_at'] = client.created_at
      client_hash['contact'] = client.contact
      client_hash['pincode'] = client.pincode
      if project.present?
        client_hash['project_id'] = project.id
        client_hash['assigned_to'] = project.designers.pluck(:email) if project.designers.present?
        client_hash['project'] = project
        client_hash['project_tasks'] = project.project_tasks
      end
      array.push(client_hash)
    end
    array
  end

  def lead_questionnaire
    attr_hash = nil
    lead = Lead.find_by(contact: object.contact) || object.leads.last
    if lead && lead.note_records.present?
      note_record = lead.note_records.last
      attr_hash = note_record.attributes.merge({ "lead_floorplan_url" => note_record.lead_floorplan&.url })
    end
    attr_hash
  end

  def designer_list
    User.with_role :designer
  end

  def customer_list
    User.with_role :customer
  end

  def designhead_list
    User.with_role :design_head
  end

  def leadhead_list
    User.with_role :lead_head
  end

  def cs_list
    User.with_role :cs_agent
  end

  def cm_list
    User.with_role :community_manager
  end

  def cataloguelead_list
    User.with_role :catalogue_head
  end

  def boqhead_list
    User.with_role :boq_head
  end

  def admin_list
    User.with_role :admin
  end

  def parent
    record = object.parent
    if record.blank?
      return nil
    else
      record.attributes.slice('name', 'email', 'contact')
    end
  end
end

class CsagentSerializer < UserSerializer
  attribute :all_leads_assigned
  attribute :leads_claimed
  attribute :leads_qualified
  attribute :active_leads
  attribute :active_claimed_leads

  def all_leads_assigned
    object.all_assigned_active_leads.count
  end

  def leads_claimed
    object.claimed_leads.count
  end

  def active_claimed_leads
    object.active_claimed_leads.count
  end

  def leads_qualified
    object.qualified_active_leads.count
  end

  def active_leads
    leads = nil
    if object.online_status
      leads = object.csagent_visible_leads
    else
      leads = Lead.where(id: 0)
    end
    ActiveModelSerializers::SerializableResource.new(leads, each_serializer: LeadSerializer, except: [:agent]).serializable_hash
  end
end

class DesignerForCMSerializer < ActiveModel::Serializer
  attributes :id,:name,:email,:contact
  attribute :project_details

  def project_details
    arr = []
    designer_projects = object.designer_projects.where(active: true).where.not(lead_id: nil)
    designer_projects.each do |designer_project|
      project = designer_project.project
      lead = project.lead
      hash = Hash.new
      hash[:id] = project.id
      hash[:name] = project.name
      hash[:created_at] = project.created_at
      hash[:lead_name] = lead.name
      arr << hash
    end
    arr
  end
end

class CommunityManagerSerializer < ActiveModel::Serializer
  attributes :id,:name,:email,:contact, :cities, :is_cm_enable

  def cities
    arr = []
    cities = object.cities
    cities.each do |city|
      arr << city.slice(:id,:name)
    end if cities.present?
    arr
  end
end

class DesignerSerializer < UserSerializer

  attribute :customer_status
  attribute :customer_meeting_time
  attribute :customer_remarks
  attribute :project_details
  attribute :lead_details
  attribute :lead_questionnaire

  # overriding
  def project_details
    instance_options[:project]&.attributes
  end

  def lead_details
    lead = Lead.find_by(contact: object.contact) || object.leads.last
    lead&.attributes
  end

  # def lead_questionnaire
  #   lead = Lead.find_by(contact: object.contact) || object.leads.last
  #   lead&.note_records&.last&.attributes
  # end

  def customer_status
    instance_options[:projec]&.status
  end

  def customer_meeting_time
    instance_options[:designer_project]&.customer_meeting_time
  end

  def customer_remarks
    instance_options[:designer_project]&.customer_remarks
  end
end

class DesignerProfileSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :contact, :gst_number, :pan, :pincode, :instagram_handle, :designer_cv, :status, :avatar, :extension
  attribute :exophone

  def instagram_handle
    object&.designer_detail&.instagram_handle
  end

  def designer_cv
    object&.designer_detail&.designer_cv
  end

  def status
    object&.designer_detail&.active
  end

  def exophone
    User::COMMON_EXOPHONE
  end
end

class DesignerListCMSerializer < ActiveModel::Serializer
  attributes :id,:name,:email,:contact
end

class DesignerDashboardSerializer < ActiveModel::Serializer
  attributes :id,:name, :email, :contact, :pincode, :created_at, :gst_number, :pan, :kyc_approved, :avatar,:address_proof, :event_scheduled_at,
  :project_details,:lead_details,:customer_status,:customer_call_back_time,:designer_assignement_date,:customer_remarks,:customer_do_not_disturb

  attributes :next_scheduled_event
  def is_active
   object.project&.user&.is_active
  end

  def gst_number
    object.project&.user&.gst_number
  end

  def pan
    object.project&.user&.gst_number
  end

  def kyc_approved
    object.project&.user.kyc_approved
  end

  def avatar
    object.project&.user&.avatar&.url
  end

  def address_proof
    object.project&.user&.address_proof&.url
  end

  def event_scheduled_at
    project = object.project
    event_time_hash= Hash.new
    Event::ALL_AGENDAS.each do |agenda|
      time = project.events.find_by(agenda: agenda,status: ["scheduled","rescheduled"])
      event_time_hash[(agenda).to_sym] = time.present? ? time.scheduled_at : nil
    end
    event_time_hash
  end

  def project_details
    object&.project&.attributes
  end

  def lead_details
    object.attributes
  end

  def customer_status
    object&.project&.status
  end

  def customer_call_back_time
    project = object&.project
    (project.events.present? && ["scheduled","rescheduled"].include?(project.events.last.status.to_s)) ? project.events.last.scheduled_at : ""
  end

  def designer_assignement_date
    designer_project = DesignerProject.where(project: object&.project, designer: instance_options[:user]).last&.created_at
  end

  def customer_remarks
    object&.project&.remarks
  end

  def customer_do_not_disturb
    hash = {}
    begin
      hash = JSON.parse(InhouseCall.new.check_number(object.contact))
    rescue
      return nil
    end
    hash.dig('Numbers', 'DND')
  end

  def next_scheduled_event
    project = object.project
    if project.present?
      upcoming_events = project.events.where("scheduled_at > ? AND status IN (?)",Time.now, ["scheduled","rescheduled"]).order(scheduled_at: :asc)
      upcoming_events.present? ? upcoming_events.first : nil
    end
  end
end

class UserDataMigrationSerializer < ActiveModel::Serializer
  attributes :from, :to, :migrated_data, :created_at, :updated_at

  def from
    User.find(object.from).email
  end

  def to
    User.find(object.to).email
  end
end

class ReferrersUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :contact, :roles

  belongs_to :sales_manager

  def roles
    object.roles.pluck(:name).uniq
  end

  def sales_manager
    sm = object.sales_manager
    { id: sm.id, name: sm.name, email: sm.email } if sm.present?
  end
end

class SalesManagerReferrersUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :contact, :roles
  
  def roles
    object.roles.pluck(:name).uniq
  end
end

class UserReferrersByRoleSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
end
