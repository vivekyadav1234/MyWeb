class FjaLeadSerializer
  include FastJsonapi::ObjectSerializer
  include ActionView::Helpers::DateHelper
  attributes :id, :name, :details, :email, :contact, :status_updated_at, :lead_status,
       :city, :pincode, :source, :created_at, :hours_ago, :created_by, :timestamp, :dummyemail, :lead_escalated, :reason_for_escalation, :drop_reason, 
       :duplicate,:remark, :instagram_handle, :lead_cv
       #:follow_up_time
       # :lost_remark,:lost_reason

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :job_elements_details do |object|
    object.lead_source&.name
  end

  attribute :lead_source_id do |object|
    object.lead_source&.id
  end

  attribute :lead_type do |object|
    object.lead_type&.name
  end

  attribute :lead_type_id do |object|
    object.lead_type&.id
  end

  attribute :lead_campaign do |object|
    object.lead_campaign&.name
  end

  attribute :lead_campaign_id do |object|
    object.lead_campaign&.id
  end

  attribute :timestamp do |object|
    object.created_at
  end

  attribute :hours_ago do |object|
    '#{time_ago_in_words(object.created_at) + " ago"}'
  end

  attribute :event_scheduled_time do |object|
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

  attribute :user_reference do |object|
    user = nil
    if object.lead_status == "qualified"
      contact = object.contact
      user = User.find_by_contact(contact)
    end
    user
  end
end

# CM dashboard list of leads shown to him
# Not Attempted - not_attempted
# Not Claimed - not_claimed
# Qualified - qualified
# Follow Up with date and time of follow up - follow_up + follow_up_time
# Lost with Remarks for Lost lost + lost_remark
# Not Contactable - Automatically to another CS Agent after 3 Hours - not_contactable
# Lost after 5 Tries - lost_after_5_tries