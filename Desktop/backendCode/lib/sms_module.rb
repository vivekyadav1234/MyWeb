module SmsModule
  include Plivo
  include Plivo::Exceptions

  def self.send_sms(text,contact, current_user=nil, project=nil)
    auth_id = ENV["PLIVO_AUTH_ID"]
    auth_token = ENV["PLIVO_AUTH_TOKEN"]

    if contact.present?
      # puts contact

      rest_api = RestClient.new(auth_id, auth_token)
      params = {
          'src' => 'TM-ARR',
          'dst' => '+91'+contact.to_s,
          'text' => text
      }
      # Don't send message if in development env
      if Rails.env.production? || Rails.env.qa?
        contact = Lead.format_contact(contact).to_s
        response = rest_api.messages.create('TM-ARR', ["+91"+contact ] ,text)
        # response = rest_api.send_message(params)
      end
      if project.present?
        project.sms_logs.create(to_id: project.user.id , from_id: current_user.id, message: text)
      end
    end
  end
end
