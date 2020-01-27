# == Schema Information
#
# Table name: site_layouts
#
#  id                        :integer          not null, primary key
#  note_record_id            :integer
#  layout_image_file_name    :string
#  layout_image_content_type :string
#  layout_image_file_size    :integer
#  layout_image_updated_at   :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#

class SiteLayout < ApplicationRecord
  belongs_to :note_record

  has_attached_file :layout_image, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :layout_image
end
