class FjaEventSerializer
  include FastJsonapi::ObjectSerializer

  # attributes :id, :agenda, :description, :schedule_data_time, :status, :location, :users
  attributes :id, :title, :start, :agenda, :remark, :description, :status, :location, :users, :ownerable_id, :ownerable_type, :contact_type, :mom_status

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :is_manual_event do |object|
    object.agenda.in?(Event::MANUAL_EVENTS)
  end

  attribute :color do |object|
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

  attribute :title do |object|
    object.scheduled_at.strftime("%I:%M%p")+" / "+object.agenda.split("_").join(" ").capitalize  if object.scheduled_at.present? && object.agenda.present?
  end

  attribute :scheduled_at do |object|
    object.scheduled_at.in_time_zone(TZInfo::Timezone.get('Asia/Kolkata')) if object.scheduled_at.present?
  end

  attribute :start do |object|
    object.scheduled_at.strftime("%Y-%m-%d") if object.scheduled_at.present?
  end

  attribute :users do |object|
    object.users&.select(:id, :name, :email)&.map {|user| {id: user.id, name: user.name, email: user.email}}
  end

  attribute :ownerable_name do |object|
    if object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.name if object.ownerable.present?
    else
      object.ownerable.name if object.ownerable.present?
    end
  end

  attribute :ownerable_remark do |object|
    if object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.remarks
    elsif object.ownerable_type == "Project"
      object.ownerable.remarks
    end
  end

  attribute :datetime do |object|
    object.scheduled_at.strftime("%Y-%m-%d - %I:%M%p") if object.scheduled_at.present?
  end

  # attribute :designers do |object|
  #   designer = object.users.with_role :designer
  #   if designer.present?
  #    designer.pluck(:name)
  #   else
  #     nil
  #   end
  # end

  attribute :customer_name do |object|
    if object.ownerable_type != "SiteMeasurementRequest"
      object.ownerable.class.name == "Project" ? object.ownerable.user.name : object.ownerable&.name
    else
      object.ownerable.project.lead.name
    end
  end

  attribute :customer_id do |object|
    if object.ownerable_type != "SiteMeasurementRequest"
      object.ownerable.class.name == "Project" ? object.ownerable.user.id : object.ownerable&.id
    else
      object.ownerable.project.lead.name
    end
  end
  
  attribute :designer do |object|
    hash = Hash.new
    designer = object.ownerable.class.name == "Project" ? object.ownerable.designer_projects.where(active: true).first&.designer : nil
    if designer.present?
      hash[:name] = designer&.name
      hash[:email] = designer&.email
    end
    hash
  end

  # attribute :site_supervisor do |object|
  #   hash = Hash.new
  #   supervisor = object.ownerable.class.name == "SiteMeasurementRequest" ? object.ownerable.sitesupervisor : nil
  #   if supervisor.present?
  #     hash[:name] = supervisor&.name
  #     hash[:email] = supervisor&.email
  #   end
  #   hash
  # end

  attribute :lead_id do |object|
    if object.ownerable_type == "Lead"
       object.ownerable_id
    elsif object.ownerable_type == "Project"
       object.ownerable.lead_id
    elsif object.ownerable_type == "SiteMeasurementRequest"
      object.ownerable.project.lead_id
    end
  end

end
