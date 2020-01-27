# == Schema Information
#
# Table name: designs
#
#  id                           :integer          not null, primary key
#  name                         :string
#  floorplan_id                 :integer
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  designer_id                  :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  status                       :integer          default("pending")
#  design_type                  :string
#

class Design < ApplicationRecord

  has_paper_trail
  #associations
  belongs_to :designer, class_name: 'User', foreign_key: 'designer_id'
  belongs_to :floorplan

  # has_many :quotations,as: :quotationable, dependent: :destroy

  after_create do
      UserNotifierMailer.design_uploaded_mail_to_cm(self.designer,self.design_type).deliver_later!(wait: 15.minutes)
  end
  #enum
  enum status: [:pending, :approved, :rejected]
  #rolify
  # resourcify

  #paperclip
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :attachment_file

  #methods

  #change the status of the design.
  def approve(status_type)
    self.status = status_type
    UserNotifierMailer.design_status_email(self).deliver_later!(wait: 15.minutes)
    SmsModule.send_sms("Status of your design #{self.name} has been changed to self.status", self.designer.contact)
    save!
  end

end
