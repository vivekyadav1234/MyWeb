# == Schema Information
#
# Table name: media_pages
#
#  id                :integer          not null, primary key
#  logo_file_name    :string
#  logo_content_type :string
#  logo_file_size    :integer
#  logo_updated_at   :datetime
#  title             :string
#  description       :string
#  read_more_url     :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class MediaPage < ApplicationRecord
  has_attached_file :logo, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :logo, content_type: /\Aimage\/.*\z/
end