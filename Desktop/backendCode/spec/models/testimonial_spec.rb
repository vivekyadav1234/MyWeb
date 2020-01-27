# == Schema Information
#
# Table name: testimonials
#
#  id                     :integer          not null, primary key
#  name                   :string
#  profession             :string
#  testimonial            :text
#  video_file_name        :string
#  video_content_type     :string
#  video_file_size        :integer
#  video_updated_at       :datetime
#  thumbnail_file_name    :string
#  thumbnail_content_type :string
#  thumbnail_file_size    :integer
#  thumbnail_updated_at   :datetime
#  feature                :boolean
#  video_url              :text
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :integer
#

require 'rails_helper'

RSpec.describe Testimonial, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
