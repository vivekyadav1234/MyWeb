# == Schema Information
#
# Table name: inhouse_calls
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  call_from     :string
#  call_to_id    :integer
#  call_to_type  :string
#  call_to       :string
#  call_for      :string
#  call_response :json
#  call_type     :string           default("outgoing")
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  contact_type  :string           default("call")
#  sid           :string
#  lead_id       :integer
#

class InhouseCallSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :call_from, :call_to, :call_for, :call_response, :call_type, :call_time, :recording_url, :call_status, :duration

  def call_to
    if object.call_to_id.present? && object.call_to_type.present?
      if object.call_to_type == "Lead"
        user = Lead.find(object.call_to_id).name
      else
        user = User.find(object.call_to_id).name
      end
      user
    end
  end

  def call_for
    object.call_for if object.call_for.present?
  end

  def call_from
    object.call_from if object.call_from.present?
  end

  def recording_url
    get_responce["Call"]["RecordingUrl"] if (get_responce).present? && get_responce["Call"].present?
  end

  def call_time
    get_responce["Call"]["StartTime"] if (get_responce).present? && get_responce["Call"].present?
  end

  def call_status
    get_responce["Call"]["Status"] if (get_responce).present? && get_responce["Call"].present?
  end

  def call_type
    get_responce["Call"]["Direction"] if (get_responce).present? && get_responce["Call"].present?
  end

  def duration
    get_responce["Call"]["Duration"] if (get_responce).present? && get_responce["Call"].present?
  end

  def get_responce
    res = object.call_details
    begin
      res.present? ? JSON.parse(res) : nil
    rescue
      nil
    end
  end
end

class SmsSerializer < InhouseCallSerializer
  attributes :sms_type, :sms_sent, :sms_delivered, :sms_body, :sms_status

  def sms_type
    if object.sms_details.present?
      object.sms_details["SMSMessage"]["Direction"] if object.sms_details.has_key?("SMSMessage")
    else
      nil
    end
  end

  def sms_sent
    object.created_at
  end

  def sms_delivered
    if object.sms_details.present?
      object.sms_details["SMSMessage"]["DateSent"] if object.sms_details.has_key?("SMSMessage")
    else
      nil
    end
  end

  def sms_body
    if object.call_response.class == Hash && object.call_response.has_key?("code") && object.call_response["code"]=="000"
      object.call_response["body"]
    else
      if object.sms_details.present?
        if object.sms_details.has_key?("SMSMessage")
          object.sms_details["SMSMessage"]["Body"]
        elsif object.sms_details.has_key?("RestException")
          object.sms_details["RestException"]["Message"]
        else
          nil
        end
      else
        nil
      end
    end
  end

  def sms_status
    if object.sms_details.present?
      if object.sms_details.has_key?("SMSMessage")
        object.sms_details["SMSMessage"]["Status"]
      elsif object.sms_details.has_key?("RestException")
        "failed"
      else
        "failed"
      end
    else
      "failed"
    end
  end

end
