class LeadForCmSerializer < FjaLeadSerializer

  attribute :project_details do |object|
    object.project&.attributes
  end

  attribute :assigned_to do |object|
    hash ||= designer_info_hash(object)
    hash[:assigned_to]
  end

  attribute :assigned_to_name do |object|
    hash ||= designer_info_hash(object)
    hash[:assigned_to_name]
  end

  attribute :assigned_at do |object|
    hash ||= designer_info_hash(object)
    hash[:assigned_at]
  end

  attribute :project_status do |object|
    hash ||= designer_info_hash(object)
    hash[:project_status]
  end

  attribute :event_scheduled_at do |object|
    hash ||= designer_info_hash(object)
    hash[:event_scheduled_at]
  end

  def self.designer_info_hash(object)
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

  attribute :designer_info_hash do |object|
    designer_info_hash(object)
  end

  attribute :client_id do |object|
    object.related_user&.id
  end
end