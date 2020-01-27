class FjaDesignerWipSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,:name, :email, :contact, :pincode, :created_at
  
  def serializable_hash
    data = super
    data[:data]
  end

  # attribute :is_active do |object|
  #   object.project&.user&.is_active
  # end

  attribute :gst_number do |object|
    object.project&.user&.gst_number
  end
  
  attribute :pan do |object|
    object.project&.user&.gst_number
  end

  # attribute :kyc_approved do |object|
  #   object.project&.user.kyc_approved
  # end

  attribute :avatar do |object|
    object.project&.user&.avatar&.url
  end

  attribute :address_proof do |object|
    object.project&.user&.address_proof&.url
  end

  attribute :event_scheduled_at do |object|
    event_time_hash= Hash.new 
    event_time_hash = object.project.events.where(agenda: Event::ALL_AGENDAS ,status: ["scheduled","rescheduled"]).pluck("events.agenda", "events.scheduled_at").to_h
    event_time_hash
  end

  attribute :project_details do |object|
    object&.project&.attributes
  end

  attribute :lead_details do |object|
    object.attributes
  end

  attribute :customer_status do |object|
    object&.project&.status
  end

  attribute :customer_call_back_time do |object|
    project = object&.project
    (project.events.present? && ["scheduled","rescheduled"].include?(project.events.last.status.to_s)) ? project.events.last.scheduled_at : ""
  end

  # attribute :designer_assignement_date do |object, params|
  #   designer_project = DesignerProject.where(project: object&.project, designer: params[:user]).last&.created_at
  # end

  attribute :customer_remarks do |object|
    object&.project&.remarks
  end

  # attribute :customer_do_not_disturb do |object|
  #   dndStatus = InhouseCall.new
  #   hash = JSON.parse(dndStatus.check_number(object.contact))
  #   hash.dig('Numbers', 'DND')
  # end
end