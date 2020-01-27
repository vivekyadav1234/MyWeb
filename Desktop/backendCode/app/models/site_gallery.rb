# == Schema Information
#
# Table name: site_galleries
#
#  id                          :integer          not null, primary key
#  site_measurement_request_id :integer
#  site_image_file_name        :string
#  site_image_content_type     :string
#  site_image_file_size        :integer
#  site_image_updated_at       :datetime
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#

class SiteGallery < ApplicationRecord
  belongs_to :site_measurement_request
  has_attached_file :site_image, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :site_image
end
