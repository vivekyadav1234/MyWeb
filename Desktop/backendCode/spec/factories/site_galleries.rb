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

FactoryGirl.define do
  factory :site_gallery do
    site_measurement_request nil
    site_image ""
  end
end
