# == Schema Information
#
# Table name: whatsapps
#
#  id             :integer          not null, primary key
#  to             :string
#  ownerable_type :string
#  ownerable_id   :integer
#  message        :string
#  response       :json
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Whatsapp < ApplicationRecord
  belongs_to :ownerable, polymorphic: true, optional: true
  NOT_CONTACTABLE_MESSAGE = "Your dream home should be Made By You. To help you with it we were trying to connect with you. Please visit the below link and let us know a good time when we can chat."
  SCHEDULE_VISIT  = "https://arrivae.com/visit_us#schedule_a_meeting_modal"
  LEAD_CREATION_SMS_TO_LEAD = "Welcome to Arrivae! Our team will connect with you shortly. You can also reach us on 022-48900151 or wecare@arrivae,com. Explore 1000's of design ideas at https://arrivae.com/your_spaces"

  require 'uri'
  require 'net/http'

  def send_message(to, msg)
    url = URI("https://panel.apiwha.com/send_message.php?apikey=QWQ9029TI6TV0D21PBVP&number=91#{to}&text=#{msg}")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)

    response = http.request(request)
    response
  end
end
