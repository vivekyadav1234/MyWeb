# == Schema Information
#
# Table name: project_booking_form_files
#
#  id                           :integer          not null, primary key
#  project_booking_form_id      :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

class ProjectBookingFormFile < ApplicationRecord
	belongs_to :project_booking_form

	#paperclip
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :attachment_file
  
end
