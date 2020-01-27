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

FactoryGirl.define do
  factory :site_layout do
    
  end
end
