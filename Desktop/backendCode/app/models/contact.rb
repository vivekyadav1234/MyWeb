# == Schema Information
#
# Table name: contacts
#
#  id           :integer          not null, primary key
#  phone_number :string
#  source       :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class Contact < ApplicationRecord

  #validations
  validates :phone_number,:presence => true,
                 :numericality => true,
                 length: { in: 10..13 }
  #callbacks
  after_create do
    UserNotifierMailer.contact_form_email(self.phone_number).deliver
    SmsModule.send_sms('New contact registered on arrivae.com', "+918904671053")
  end

end
