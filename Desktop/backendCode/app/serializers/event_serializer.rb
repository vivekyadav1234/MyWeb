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
#

class EventSerializer < ActiveModel::Serializer
  # include FastJsonapi::EventSerializer

  # attributes :id, :agenda, :description, :schedule_data_time, :status, :location, :users
  attributes :id, :title, :start, :agenda, :remark, :description, :status,
  :location, :users, :datetime, :ownerable_name, :scheduled_at, :ownerable_id,
  :ownerable_type, :ownerable_remark, :contact_type, :color,
  :designers, :mom_status, :review_location, :recording

  attributes :designer, :site_supervisor, :customer_name , :customer_id,
  :lead_id, :is_manual_event

  def is_manual_event
    object.agenda.in?(Event::MANUAL_EVENTS)
  end

  def color
    if object.agenda == "site_visit" && object.status.in?(["scheduled","rescheduled"])
      color = "#ac7339"
    elsif object.agenda == "lead_assigned" && object.status != "done"
      color = "#057272"
    elsif object.agenda.in?(["follow_up_call", "first_meeting", "on_hold", "follow_up_meeting", "ppt_boq_concept", "client_request", "design_and_boq_presentation"]) && object.status.in?(["scheduled","rescheduled"])
      color = "#3399ff"
    elsif object.status == "done"
      color = "#6d9c21"
    elsif object.status == "cancelled"
      color = "#505050"
    else
      color = "#AA3D56"
    end
    color
  end

  def title
  	object.scheduled_at.strftime("%I:%M%p")+" / "+object.agenda.split("_").join(" ").capitalize  if object.scheduled_at.present? && object.agenda.present?
  end

  def scheduled_at
    object.scheduled_at.in_time_zone(TZInfo::Timezone.get('Asia/Kolkata')) if object.scheduled_at.present?
  end

  def start
    object.scheduled_at.strftime("%Y-%m-%d") if object.scheduled_at.present?
  end

  def users
    object.users&.select(:id, :name, :email)&.map {|user| {id: user.id, name: user.name, email: user.email}}
  end

  def ownerable_name
    if object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.name if object.ownerable.present?
    else
  	  object.ownerable.name if object.ownerable.present?
    end
  end

  def ownerable_remark
    if object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.remarks
    elsif object.ownerable_type == "Project"
      object.ownerable.remarks
    end
  end



  def datetime
  	object.scheduled_at.strftime("%Y-%m-%d - %I:%M%p") if object.scheduled_at.present?
  end

  def designers
    designer = object.users.with_role :designer
    if designer.present?
     designer.pluck(:name)
    else
      nil
    end
  end

  def customer_name
    if object.ownerable_type != "SiteMeasurementRequest"
      object.ownerable.class.name == "Project" ? object.ownerable.user.name : object.ownerable&.name
    else
      object.ownerable.project.lead.name
    end
  end

  def customer_id
    if object.ownerable_type != "SiteMeasurementRequest"
      object.ownerable.class.name == "Project" ? object.ownerable.user.id : object.ownerable&.id
    else
      object.ownerable.project.lead.name
    end
  end

  def designer
    hash = Hash.new
    designer = object.ownerable.class.name == "Project" ? object.ownerable.designer_projects.where(active: true).first&.designer : nil
    if designer.present?
      hash[:name] = designer&.name
      hash[:email] = designer&.email
    end
    hash
  end

  def site_supervisor
    hash = Hash.new
    supervisor = object.ownerable.class.name == "SiteMeasurementRequest" ? object.ownerable.sitesupervisor : nil
    if supervisor.present?
      hash[:name] = supervisor&.name
      hash[:email] = supervisor&.email
    end
    hash
  end

  def lead_id
    if object.ownerable_type == "Lead"
       object.ownerable_id
    elsif object.ownerable_type == "Project"
       object.ownerable.lead_id
    elsif object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.lead_id
    end
  end

end
