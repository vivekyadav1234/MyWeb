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
#

class LeadSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  attributes :id, :name, :details, :email, :contact,:is_contact_visible, :status_updated_at, :lead_status,
       :city, :pincode, :source, :created_at, :hours_ago, :lost_remark,:lost_reason,
       :created_by, :timestamp, :dummyemail, :lead_escalated, :reason_for_escalation, :drop_reason,
       :duplicate,:remark, :instagram_handle, :lead_cv, :follow_up_time, :assigned_cm, :referrer_id, :referrer_type,
       :from_fasttrack_page, :is_in_pipeline, :is_new

  belongs_to :referrer

  attribute :agent
  attribute :user_reference
  attribute :lead_source
  attribute :lead_source_id
  attribute :lead_type
  attribute :lead_type_id
  attribute :lead_campaign
  attribute :lead_campaign_id
  attribute :event_scheduled_time
  attribute :next_scheduled_event
  attribute :referal_partner_name
  attribute :is_from_arrivae_champion
  attribute :utm_content
  attribute :utm_medium
  attribute :utm_term

  def assigned_cm
    object.assigned_cm&.email
  end

  def lead_source
    object.lead_source&.name
  end

  def lead_source_id
    object.lead_source&.id
  end

  def lead_type
    object.lead_type&.name
  end

  def lead_type_id
    object.lead_type&.id
  end

  def lead_campaign
    object.lead_campaign&.name
  end

  def lead_campaign_id
    object.lead_campaign&.id
  end

  def timestamp
    object.created_at
  end

  def created_at
    object.created_at
  end

  def updated_at
    object.updated_at
  end

  def utm_content
    object.lead_utm_content&.name
  end

  def utm_medium
    object.lead_utm_medium&.name
  end

  def utm_term
    object.lead_utm_term&.name
  end

  def hours_ago
    time_ago_in_words(object.created_at) + " ago"
  end

  # forcefully assigned only
  def agent
    object&.lead_users.where(active: true, claimed: 'force_yes' ).last&.user
  end

  def event_scheduled_time
    event_time_hash = Hash.new
    if object.lead_status == "follow_up"
      time = object.events.find_by(agenda: "follow_up",status: ["scheduled","rescheduled"])
      event_time_hash[("follow_up_time").to_sym] = time.present? ? time.scheduled_at : nil
    elsif object.lead_status == "not_contactable"
      time = object.events.find_by(agenda: "follow_up_for_not_contactable",status: ["scheduled","rescheduled"])
      event_time_hash[("not_contactable_time").to_sym] = time.present? ? time.scheduled_at : nil
    else
      nil
    end
  end

  def user_reference
    user = nil
    if object.lead_status == "qualified"
      contact = object.contact
      user = User.find_by_contact(contact)
    end
    user
  end

  def referrer
    ref_user = nil
    if object.referrer_id.present?
      ref_user = User.find(object.referrer_id)
    else
      ref_user = User.find(object.created_by) if object.created_by.present?
    end
    if ref_user.present?
      {id: ref_user.id, name: ref_user.name, email: ref_user.email}
    else
      nil
    end
  end

  def next_scheduled_event
    project = object.project
    if project.present?
      upcoming_events = project.events.where("scheduled_at > ? AND status IN (?)",Time.now, ["scheduled","rescheduled"]).order(scheduled_at: :asc)
      upcoming_events.present? ? upcoming_events.first : nil
    end
  end

  def referal_partner_name
    ref_user = nil
    if object.referrer_id.present?
      ref_user = User.find(object.referrer_id)
    else
      ref_user = User.find(object.created_by) if object.created_by.present?
    end
    if ref_user.present? && ref_user.is_a_referrer?
      ref_user.name
    else
      nil
    end
  end

  # Returns whether lead is created by arrivae champion
  def is_from_arrivae_champion
    object.created_by.present? ? User.find(object.created_by).is_champion : false
  end

end

class MobileLeadSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  attributes :id, :name, :address, :details, :email, :contact,:is_contact_visible, :status_updated_at, :lead_status,
    :city, :pincode, :source, :hours_ago, :lost_remark,:lost_reason,
    :created_by, :timestamp, :dummyemail, :lead_escalated, :reason_for_escalation, :drop_reason,
    :duplicate,:remark, :instagram_handle, :lead_cv, :follow_up_time, :assigned_cm, :referrer_id, :referrer_type,
    :from_fasttrack_page, :is_in_pipeline, :is_new , :assigned_at

  belongs_to :referrer
  attribute :agent
  attribute :user_reference
  attribute :lead_source
  attribute :lead_source_id
  attribute :lead_type
  attribute :lead_type_id
  attribute :lead_campaign
  attribute :lead_campaign_id
  attribute :event_scheduled_time
  attribute :next_scheduled_event
  attribute :referal_partner_name
  attribute :is_from_arrivae_champion
  attribute :utm_content
  attribute :utm_medium
  attribute :utm_term
  attribute :project
  attribute :number_of_calls
  attribute :number_of_meetings
  attribute :pending_events
  attribute :customer_name
  attribute :customer_id
  attribute :created_at

  def customer_name
    object&.related_user&.name&.titleize
  end

  def customer_id
    object&.related_user&.id
  end

  def assigned_at
    object.project&.designer_projects&.active&.last&.updated_at
  end

  def number_of_calls
    if object.project
      Recording.where(event_id: object.project.events.pluck(:id)).count
    else
      0
    end
  end

  def number_of_meetings
    if object.project
      object.project.events.manual_events.completed_events.number_of_meetings
    else
      0
    end
  end

  def pending_events
    if object.project
      object.project.events.active_events.count
    else
      0
    end
  end

  def project
    if object.project
      address = ""
      address += object.project.project_booking_form&.flat_no.to_s.squish
      address += ', ' if address.length > 0 && address[-1] != ','
      address += object.project.project_booking_form&.floor_no.to_s.squish
      address += ', ' if address.length > 0 && address[-1] != ','
      address += object.project.project_booking_form&.building_name.to_s.squish
      address += ', ' if address.length > 0 && address[-1] != ','
      address += object.project.project_booking_form&.location.to_s.squish
      address += ', ' if address.length > 0 && address[-1] != ','
      address += object.project.project_booking_form&.city.to_s.squish
      address += ', ' if address.length > 0 && address[-1] != ','
      address += object.project.project_booking_form&.pincode.to_s.squish
      address += address[0..-2] if address.length > 2 && address[-1] == ','
      
      {
        id: object.project.id,
        name: "#{object.project.name}",
        status: "#{object.project.status}",
        remarks: "#{object.project.remarks}",
        wip_time: "#{object.project.wip_time}",
        count_of_calls: object.project.count_of_calls,
        status_updated_at: "#{object.project.status_updated_at}",
        reason_for_lost: "#{object.project.reason_for_lost}",
        sub_status: "#{object.project.sub_status}",
        new_handover_file: "#{object.project.new_handover_file}",
        last_handover_at: "#{object.project.last_handover_at}",
        created_at: "#{object.project.created_at}",
        address: address.length == 0 ? object.address : address
      }
    else
      {}
    end
  end

  def assigned_cm
    object.assigned_cm&.email
  end

  def lead_source
    object.lead_source&.name
  end

  def lead_source_id
    object.lead_source&.id
  end

  def lead_type
    object.lead_type&.name
  end

  def lead_type_id
    object.lead_type&.id
  end

  def lead_campaign
    object.lead_campaign&.name
  end

  def lead_campaign_id
    object.lead_campaign&.id
  end

  def timestamp
    object.created_at
  end

  def created_at
    object.created_at
  end

  def updated_at
    object.updated_at
  end

  def utm_content
    object.lead_utm_content&.name
  end

  def utm_medium
    object.lead_utm_medium&.name
  end

  def utm_term
    object.lead_utm_term&.name
  end

  def hours_ago
    time_ago_in_words(object.created_at) + " ago"
  end

  # forcefully assigned only
  def agent
    object&.lead_users.where(active: true, claimed: 'force_yes' ).last&.user
  end

  def event_scheduled_time
    event_time_hash = Hash.new
    if object.lead_status == "follow_up"
      time = object.events.find_by(agenda: "follow_up",status: ["scheduled","rescheduled"])
      event_time_hash[("follow_up_time").to_sym] = time.present? ? time.scheduled_at : nil
    elsif object.lead_status == "not_contactable"
      time = object.events.find_by(agenda: "follow_up_for_not_contactable",status: ["scheduled","rescheduled"])
      event_time_hash[("not_contactable_time").to_sym] = time.present? ? time.scheduled_at : nil
    else
      nil
    end
  end

  def user_reference
    user = nil
    if object.lead_status == "qualified"
      contact = object.contact
      user = User.find_by_contact(contact)
    end
    user
  end

  def referrer
    ref_user = nil
    if object.referrer_id.present?
      ref_user = User.find(object.referrer_id)
    else
      ref_user = User.find(object.created_by) if object.created_by.present?
    end
    if ref_user.present?
      {id: ref_user.id, name: ref_user.name, email: ref_user.email}
    else
      nil
    end
  end

  def next_scheduled_event
    project = object.project
    if project.present?
      upcoming_events = project.events.where("scheduled_at > ? AND status IN (?)",Time.now, ["scheduled","rescheduled"]).order(scheduled_at: :asc)
      upcoming_events.present? ? upcoming_events.first : nil
    end
  end

  def referal_partner_name
    ref_user = nil
    if object.referrer_id.present?
      ref_user = User.find(object.referrer_id)
    else
      ref_user = User.find(object.created_by) if object.created_by.present?
    end
    if ref_user.present? && ref_user.is_a_referrer?
      ref_user.name
    else
      nil
    end
  end

  # Returns whether lead is created by arrivae champion
  def is_from_arrivae_champion
    object.created_by.present? ? User.find(object.created_by).is_champion : false
  end

end

class LeadLogSerializer < LeadSerializer
  attribute :change_log

  def change_log
    arr = []
    note_record_versions = object.note_records.first.present? ? object.note_records.first.versions : []
    project = object.project
    project_wip_time = []
    projct_versions = []
    booking_form_versions = []
    designer_project_versions = []
    exotel_versions = []
    lead_user_versions = []
    if project.present?
      project_wip_time = project.wip_time
      projct_versions = project.wip_time.present? ? project.versions.where("created_at < ?", project_wip_time) : project.versions
      booking_form_versions = project.designer_booking_form.present? ? project.designer_booking_form.versions : []
      designer_projects = project.designer_projects.map{|dp| designer_project_versions.push dp.versions}
      designer_project_versions = designer_project_versions.flatten if designer_project_versions.count > 0
    end
    exotel_versions = object.inhouse_call.present? ? object.inhouse_call : []
    lead_user_versions = object.lead_users.map{|lu| lead_user_versions.push lu.versions }
    lead_user_versions =lead_user_versions.flatten if lead_user_versions.present?

    all_versions = object.versions + note_record_versions + projct_versions + booking_form_versions + designer_project_versions + exotel_versions + lead_user_versions
    all_versions = all_versions.sort_by(&:created_at).uniq{|x| x.created_at}
    all_versions.each_with_index do |version, i|
      if version.class.name == "InhouseCall"
        called_by = version.user
        call_details = version.call_details
        recording_url = "-"
        duration = "-"
        status = "-"
        begin
          recording_url = (call_details.present? && JSON.parse(call_details)["Call"].present?) ? JSON.parse(call_details)["Call"]["RecordingUrl"] : "-"
          duration = (call_details.present? && JSON.parse(call_details)["Call"].present?) ?  JSON.parse(call_details)["Call"]["Duration"] : "-"
          status = (call_details.present? && JSON.parse(call_details)["Call"].present?) ? JSON.parse(call_details)["Call"]["Status"].titleize : "-"
        rescue
          nil
        end
        change_hash = {
          exotel: true,
          custom_id: version.created_at.to_i + i,
          whodunnit: called_by.name,
          name: called_by.name,
          role: called_by&.roles&.first&.name&.titleize,
          recording_url: recording_url,
          duration: duration,
          status: status,
          called_at: version.created_at,
          created_at: version.created_at
        }

      else
        changes = version.changeset
        object_changes_array = []
        changes.each do |key, value|
          changes_hash = Hash.new
          key = key.present? ? key == "lead_type_id" ? "lead_type" : key == "lead_source_id" ? "lead_source" : key == "lead_campaign_id" ? "lead_campaign" : key : key
          changes_hash[:name] = key.titleize
          if key.present? && (key=="lead_type" || key=="lead_campaign")
            initial = value[0].present? ? key.camelize.constantize.find(value[0]).name : "-"
            final   = value[1].present? ? key.camelize.constantize.find(value[1]).name : "-"
          elsif key.present? && (key == "created_by" || key.downcase == "user_id" || key.downcase == "designer_id")
            initial = value[0].present? ? User.find(value[0]).name : "-"
            final   = value[1].present? ? User.find(value[1]).name : "-"
            test1 = "aagaya"
          elsif key.present? && (key == "created_at" || key == "updated_at")
            initial = value[0].present? ? value[0] : "-"
            final   = value[1].present? ? value[1] : "-"
          elsif key.present? && key == "lead_id"
            initial = value[0].present? ? Lead.find(value[0]).name : "-"
            final   = value[1].present? ? Lead.find(value[1]).name : "-"
          elsif key.present? && key == "project_id"
            initial = value[0].present? ? Project.find(value[0]).name : "-"
            final   = value[1].present? ? Project.find(value[1]).name : "-"
          else
            initial = value[0].present? ? value[0] : "-"
            final = value[1].present? ? value[1] : "-"
          end
          changes_hash[:initial]= initial&.to_s&.titleize
          changes_hash[:final] = final&.to_s&.titleize
          changes_hash[:test] = test1
          object_changes_array.push changes_hash
        end
        next if changes.blank?
        user = User.find_by_id(version.whodunnit)
        role = user&.roles&.first&.name&.titleize
        item_type = version.item_type
        owner = item_type == "NoteRecord" ? "Questionnaire" : item_type == "Project" ? "Lead" : item_type == "DesignerBookingForm" ? "Designer Booking Form" : item_type == "DesignerProject" ? "Project" : "Lead"
        change_hash = {
          exotel: false,
          custom_id: version.created_at.to_i + i,
          whodunnit: user&.email,
          name: user&.name,
          user_image: user&.avatar&.url,
          created_at: version.created_at,
          date: version.created_at.strftime("%d-%b-%Y"),
          time: version.created_at.strftime("%I:%M %p"),
          object_changes: object_changes_array,
          owner: owner,
          role: role,
          event: version.event.present? ? version.event + "d" : "made changes"
        }

      end
      arr.push change_hash
    end
    arr
  end
end

class MobileLeadLogSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  # attributes :id, :name, :email, :contact, :is_contact_visible,
  #     :status_updated_at, :lead_status,
  #     :city, :pincode, :source, :created_at,
  #     :lost_remark, :lost_reason,
  #     :created_by
  attribute :leads

  def leads
    arr = []
    note_record_versions = object.note_records.first.present? ? object.note_records.first.versions : []
    project = object.project
    project_wip_time = []
    projct_versions = []
    booking_form_versions = []
    designer_project_versions = []
    exotel_versions = []
    lead_user_versions = []
    if project.present?
      project_wip_time = project.wip_time
      projct_versions = project.wip_time.present? ? project.versions.where("created_at < ?", project_wip_time) : project.versions
      booking_form_versions = project.designer_booking_form.present? ? project.designer_booking_form.versions : []
      designer_projects = project.designer_projects.map{|dp| designer_project_versions.push dp.versions}
      designer_project_versions = designer_project_versions.flatten if designer_project_versions.count > 0
    end
    exotel_versions = object.inhouse_call.present? ? object.inhouse_call : []
    lead_user_versions = object.lead_users.map{|lu| lead_user_versions.push lu.versions }
    lead_user_versions =lead_user_versions.flatten if lead_user_versions.present?

    all_versions = object.versions + note_record_versions + projct_versions + booking_form_versions + designer_project_versions + exotel_versions + lead_user_versions
    all_versions = all_versions.sort_by(&:created_at).uniq{|x| x.created_at}
    all_versions.each_with_index do |version, i|
      if version.class.name == "InhouseCall"
        called_by = version.user
        call_details = version.call_details
        recording_url = "-"
        duration = "-"
        status = "-"
        begin
          recording_url = (call_details.present? && JSON.parse(call_details)["Call"].present?) ? JSON.parse(call_details)["Call"]["RecordingUrl"] : "-"
          duration = (call_details.present? && JSON.parse(call_details)["Call"].present?) ?  JSON.parse(call_details)["Call"]["Duration"] : "-"
          status = (call_details.present? && JSON.parse(call_details)["Call"].present?) ? JSON.parse(call_details)["Call"]["Status"].titleize : "-"
        rescue
          nil
        end
        change_hash = {
          exotel: true,
          custom_id: version.created_at.to_i + i,
          whodunnit: called_by.name,
          name: called_by.name,
          role: called_by&.roles&.first&.name&.titleize,
          recording_url: recording_url,
          duration: duration,
          status: status,
          called_at: version.created_at,
          created_at: version.created_at
        }

      else
        changes = version.changeset
        object_changes_array = []
        changes.each do |key, value|
          changes_hash = Hash.new
          key = key.present? ? key == "lead_type_id" ? "lead_type" : key == "lead_source_id" ? "lead_source" : key == "lead_campaign_id" ? "lead_campaign" : key : key
          changes_hash[:name] = key.titleize
          if key.present? && (key=="lead_type" || key=="lead_campaign")
            initial = value[0].present? ? key.camelize.constantize.find(value[0]).name : "-"
            final   = value[1].present? ? key.camelize.constantize.find(value[1]).name : "-"
          elsif key.present? && (key == "created_by" || key.downcase == "user_id" || key.downcase == "designer_id")
            initial = value[0].present? ? User.find(value[0]).name : "-"
            final   = value[1].present? ? User.find(value[1]).name : "-"
            test1 = "aagaya"
          elsif key.present? && (key == "created_at" || key == "updated_at")
            initial = value[0].present? ? value[0] : "-"
            final   = value[1].present? ? value[1] : "-"
          elsif key.present? && key == "lead_id"
            initial = value[0].present? ? Lead.find(value[0]).name : "-"
            final   = value[1].present? ? Lead.find(value[1]).name : "-"
          elsif key.present? && key == "project_id"
            initial = value[0].present? ? Project.find(value[0]).name : "-"
            final   = value[1].present? ? Project.find(value[1]).name : "-"
          else
            initial = value[0].present? ? value[0] : "-"
            final = value[1].present? ? value[1] : "-"
          end
          changes_hash[:initial]= initial&.to_s&.titleize
          changes_hash[:final] = final&.to_s&.titleize
          changes_hash[:test] = test1
          object_changes_array.push changes_hash
        end
        next if changes.blank?
        user = User.find_by_id(version.whodunnit)
        role = user&.roles&.first&.name&.titleize
        item_type = version.item_type
        owner = item_type == "NoteRecord" ? "Questionnaire" : item_type == "Project" ? "Lead" : item_type == "DesignerBookingForm" ? "Designer Booking Form" : item_type == "DesignerProject" ? "Project" : "Lead"
        change_hash = {
          exotel: false,
          custom_id: version.created_at.to_i + i,
          whodunnit: user&.email,
          name: user&.name,
          user_image: user&.avatar&.url,
          created_at: version.created_at,
          date: version.created_at.strftime("%d-%b-%Y"),
          time: version.created_at.strftime("%I:%M %p"),
          object_changes: object_changes_array,
          owner: owner,
          role: role,
          event: version.event.present? ? version.event + "d" : "made changes"
        }

      end
      arr.push change_hash
    end
    arr
  end
end

# Admin/Lead Head page for designer leads.
class DesignerLeadSerializer < LeadSerializer
  attributes :cm_details, :internal, :related_user_id, :tag, :digital_physical

  def cm_details
    hash = Hash.new
    user = object.related_user&.cm
    hash[:id] = user&.id
    hash[:name] = user&.name
    hash[:email] = user&.email
    hash
  end

  def internal
    object.related_user&.internal
  end

  def tag
    object.tag&.name == "both" ? "Full Home" :  object.tag&.name&.humanize
  end

  def digital_physical
    object.lead_source&.name&.in?(Lead::DIGITAL_SOURCES_AWS) ? "Digital" : "Physical"
  end

end

class LeadProjectSerializer < LeadSerializer
  attribute :project_id
  attribute :project_name
  attribute :project_location
  attribute :assigned_designer
  attribute :assigned_at
  attribute :community_manager
  attribute :project_status
  attribute :project_sub_status
  attribute :event_scheduled_at
  attribute :status_updated_at

  def assigned_designer
    hash ||= user_project_hash
    hash[:assigned_designer]
  end

  def project_id
    hash ||= user_project_hash
    hash[:project_id]
  end

  def project_name
    hash ||= user_project_hash
    hash[:project_name]
  end

  def project_sub_status
    hash ||= user_project_hash
    hash[:project_sub_status]
  end

  def project_location
    object.note_records.last.location if object.note_records.present?
  end

  def assigned_at
    hash ||= user_project_hash
    hash[:assigned_at]
  end

  def project_status
    hash ||= user_project_hash
    hash[:project_status]
  end

  def community_manager
    hash ||= user_project_hash
    hash[:community_manager]
  end

  def event_scheduled_at
    hash ||= user_project_hash
    hash[:event_scheduled_at]
  end

  def user_project_hash
    @user_project_hash = Hash.new
    project = object.project
    if project
      designer = project.assigned_designer
      designer_project = project.designer_projects.where(designer: designer).last
      @user_project_hash[:assigned_designer] = designer.slice(:name,:email) if designer
      @user_project_hash[:project_name] = project.name
      @user_project_hash[:project_id] = project.id
      @user_project_hash[:assigned_at] = designer_project.created_at if designer_project
      @user_project_hash[:community_manager] = designer&.cm&.slice(:name,:email)
      @user_project_hash[:project_status] = project.status
      @user_project_hash[:project_sub_status] = project.sub_status
      @user_project_hash[:event_scheduled_at] = project.events.last.present? ? project.events.last.scheduled_at : nil
    end
    @user_project_hash
  end
end

# CM dashboard list of leads shown to him
class LeadSerializerForCM < LeadSerializer
  attribute :project_details
  attribute :assigned_to
  attribute :assigned_to_name
  attribute :assigned_at
  attribute :project_status
  attribute :client_id
  # attribute :follow_up_time   #overwriting lead's own column as this references designer_project
  attribute :status_updated_at
  attribute :event_scheduled_at
  attribute :delayed_date

  def project_details
    object.project&.attributes
  end

  def assigned_to
    hash ||= designer_info_hash
    hash[:assigned_to]
  end

  def assigned_to_name
    hash ||= designer_info_hash
    hash[:assigned_to_name]
  end

  def assigned_at
    hash ||= designer_info_hash
    hash[:assigned_at]
  end

  def project_status
    hash ||= designer_info_hash
    hash[:project_status]
  end

  # def follow_up_time
  #   hash ||= designer_info_hash
  #   hash[:follow_up_time]
  # end

  def event_scheduled_at
    hash ||= designer_info_hash
    hash[:event_scheduled_at]
  end

  def designer_info_hash
    @designer_info = Hash.new
    project = object.project
    if project
      designer = project.assigned_designer
      designer_project = project.designer_projects.where(designer: designer).last
      @designer_info[:assigned_to] = designer.email if designer
      @designer_info[:assigned_to_name] = designer.name if designer
      @designer_info[:assigned_at] = designer_project.created_at if designer_project
      @designer_info[:project_status] = project.status
      hash = Hash.new
      Event::ALL_AGENDAS.each do |agenda|
        time = project.events.find_by(agenda: agenda,status: ["scheduled","rescheduled"])
        hash[(agenda+"_time").to_sym] = time.present? ? time.scheduled_at : nil
      end
      @designer_info[:event_scheduled_at] = hash
    end
    @designer_info
  end

  def client_id
    object.related_user&.id
  end

  def delayed_date
    project = object.project
    return nil unless project.present?
    if project.status == "delayed_possession"
      project.events.where(agenda: "delayed_possession", status: ["scheduled", "rescheduled"]).first&.scheduled_at&.to_date
    elsif project.status == "delayed_project"
      project.events.where(agenda: "delayed_project", status: ["scheduled", "rescheduled"]).first&.scheduled_at&.to_date
    end
  end
end

class LeadPastEventSerializer < LeadSerializer
  attributes :events_log

  def events_log
    project_wip_time = object.project.wip_time
    if project_wip_time.present?
      if instance_options[:event_time] == "past"
        if instance_options[:event_type] == "meeting_fixed"
          arr = []
          event_logs = object.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now) + object.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now)
          event_logs = event_logs.uniq
          event_logs.each do |event|
            u = []
            user = event.event_users.where(host: true).first.user
            u.push user.name
            u.push user.email
            u.push user.roles.first.name
            participants = User.where(id: event.event_users.where(host: false).pluck(:user_id)).map{|u| [u.name, u.email]}
            change_hash = {
              exotel: false,
              whodunnit: u,
              user: participants,
              agenda: event.agenda,
              scheduled_at: event.scheduled_at,
              location: event.location,
              status: event.status,
              description: event.description,
              last_updated_at: event.updated_at,
              created_at: event.created_at,
              contact_type: event.contact_type&.humanize
            }
            arr.push change_hash
          end
          return arr
        else
          arr = []
          calls =  object.inhouse_call.where("created_at < ?", DateTime.now)
          calls.all.each_with_index do |call, i|
            called_by = call.user
            call_details = call.call_details
            recording_url = call_details.present? ? JSON.parse(call_details)["Call"]["RecordingUrl"] : "-"
            duration = call_details.present? ?  JSON.parse(call_details)["Call"]["Duration"] : "-"
            status = call_details.present? ? JSON.parse(call_details)["Call"]["Status"].humanize : "-"
            change_hash = {
              exotel: true,
              custom_id: call.created_at.to_i + i,
              whodunnit: called_by.name,
              name: called_by.name,
              role: called_by&.roles&.first&.name&.titleize,
              recording_url: recording_url,
              duration: duration,
              status: status,
              called_at: call.created_at
            }
            arr.push change_hash
          end
          return arr
        end
      end
      if instance_options[:event_time] == "future"
        if instance_options[:event_type] == "meeting_fixed"
           arr = []
           event_logs =   object.events.where("scheduled_at > ?", DateTime.now) + object.project.events.where("scheduled_at > ?", DateTime.now)
           event_logs = event_logs.uniq
           event_logs.each do |event|
              u = []
              user = event.event_users.where(host: true).first.user
              u.push user.name
              u.push user.email
              u.push user.roles.first.name
              participants = User.where(id: event.event_users.where(host: false).pluck(:user_id)).map{|u| [u.name, u.email]}
             change_hash = {
               exotel: false,
               whodunnit: u,
               user: participants,
               agenda: event.agenda,
               scheduled_at: event.scheduled_at,
               location: event.location,
               status: event.status,
               description: event.description,
               last_updated_at: event.updated_at,
               created_at: event.created_at,
               contact_type: event.contact_type&.humanize
             }
             arr.push change_hash
           end
           return arr
        else
          return nil
        end
      end
    else
      return nil
    end
  end
end

class LeadEventCountSerializer < LeadSerializer
  attributes :past_event_count, :future_event_count

  def past_event_count
    project_wip_time = object.project.wip_time
    if project_wip_time.present?
      past_counts = {
        no_of_meeting: (object.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + object.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count),
        no_of_calls: object.inhouse_call.where("created_at < ?", DateTime.now).count
      }
    else
      past_counts = {
        no_of_meeting: 0,
        no_of_calls: 0
      }
    end
    past_counts
  end

  def future_event_count
    project_wip_time = object.project.wip_time
    if project_wip_time.present?
      meeting_count =object.events.where("scheduled_at > ?", DateTime.now).count + object.project.events.where("scheduled_at > ?", DateTime.now).count
      future_counts = {
        no_of_meeting: meeting_count,
        no_of_calls: 0
      }
    else
      future_counts = {
        no_of_meeting: 0,
        no_of_calls: 0
      }
    end
    future_counts
  end
end

class  LeadPriorityDisplaySerializer < ActiveModel::Serializer
  attributes :lead_id,:lead_type, :user_name, :email, :contact, :status, :follow_up_time, :lead_escalated

  def lead_type
    object.lead.lead_type&.name
  end

  def user_name
    object.lead.name
  end

  def email
    object.lead.email
  end

  def lead_id
    object.lead.id
  end

  def contact
    object.lead.contact
  end

  def status
    object.lead.lead_status
  end

  def follow_up_time
    object.lead&.events&.last&.scheduled_at
  end

  def lead_escalated
    object.lead.lead_escalated == true ? "Yes" : "No"
  end

end

class BrokerAppSerializer < LeadSerializer
  attributes :project_status, :project_sub_status, :assigned_designer, :shared_boq_present, :payment_verification_done

  def project_status
    object.project&.status
  end

  def project_sub_status
    object.project&.sub_status
  end

  def assigned_designer
    hash = Hash.new
    hash[:id] = object.project&.assigned_designer&.id
    hash[:name] = object.project&.assigned_designer&.name
    hash
  end

  def shared_boq_present
    project = object.project
    shared_statuses = %w(shared paid expired rejected)
    project.present? && project.quotations.where(status: shared_statuses).present?
  end

  # If ANY Payment against BOQ of this Lead has been approved, return true. Else false.
  def payment_verification_done
    project = object.project
    return false if project.blank?
    quotation_ids = project.quotations.pluck(:id)
    Payment.where(ownerable_type: 'Quotation', ownerable_id: quotation_ids, is_approved: true).present?
  end
end


class LeadGmSerializer < ActiveModel::Serializer
  attributes :id, :cm_name, :designer_name, :cm_status, :designer_status, :delayed_project_possession, :cm_assignment_date,
    :designer_first_attempt, :total_boq_created_value, :total_boq_shared_value, :total_closuer_value, :first_boq_creation_date,
    :first_sharing_date, :first_clouser_date, :customer_name, :date_of_first_meet, :lead_asgmt_to_designer_first_attempt,
    :lead_asgmt_to_designer_boq_creation, :lead_asgmt_to_designer_boq_sharing, :lead_assignment_to_closure

    def initialize(*args)
      super
      @project = object.project
      @quotations = @project&.quotations
      @lead_desigent_assignment = @project&.designer_projects&.first
    end

    def date_of_first_meet
      object&.lead_statistics_datum&.first_meeting_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def customer_name
      object&.related_user&.name&.titleize
    end

    def cm_name
      object.assigned_cm&.name&.titleize
    end

    def designer_name
      object.designer_projects&.where(active: true)&.first&.designer&.name&.titleize
    end

    def cm_status
    end

    def designer_status
    end

    def delayed_project_possession
      object.lead_status.in?(["delayed_possession", "delayed_project"]) ? "Yes" : "No"
    end

    def cm_assignment_date
      object.lead_statistics_datum&.lead_qualification_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def designer_first_attempt
      object.lead_statistics_datum&.first_meeting_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def total_boq_created_value
      @quotations&.pluck(:total_amount)&.sum&.round(0) || 0
    end

    def total_boq_shared_value
      @quotations.where(status: "shared")&.pluck(:total_amount)&.sum.round(0) || 0
    end

    def total_closuer_value
      object.lead_statistics_datum&.closure_value&.round(0) || 0
    end

    def first_boq_creation_date
      object.lead_statistics_datum&.boq_creation_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def first_sharing_date
      object.lead_statistics_datum&.first_shared_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def first_clouser_date
      object.lead_statistics_datum&.closure_time&.strftime("%e %b %Y %H:%M:%S%p") || "-"
    end

    def lead_asgmt_to_designer_first_attempt
      first_meeting = @project&.events&.where(agenda: "first_meeting", status: "done")&.first&.updated_at
      ((first_meeting - @lead_desigent_assignment.created_at  )/86400)&.to_i if first_meeting.present?
    end

    def lead_asgmt_to_designer_boq_creation
      first_boq = object.lead_statistics_datum&.boq_creation_time
      ((first_boq - @lead_desigent_assignment.created_at)/86400).to_i if first_boq.present?
    end

    def lead_asgmt_to_designer_boq_sharing
      first_sharing = object.lead_statistics_datum&.first_shared_time
      ((first_sharing - @lead_desigent_assignment.created_at)/86400).to_i if first_sharing.present?
    end

    def lead_assignment_to_closure
      closure_date = object.lead_statistics_datum&.closure_time
      ((closure_date - @lead_desigent_assignment.created_at)/86400).to_i if closure_date.present?
    end


end
# Not Attempted - not_attempted
# Not Claimed - not_claimed
# Qualified - qualified
# Follow Up with date and time of follow up - follow_up + follow_up_time
# Lost with Remarks for Lost lost + lost_remark
# Not Contactable - Automatically to another CS Agent after 3 Hours - not_contactable
# Lost after 5 Tries - lost_after_5_tries
