# == Schema Information
#
# Table name: edge_banding_shades
#
#  id                       :integer          not null, primary key
#  name                     :string
#  code                     :string
#  shade_image_file_name    :string
#  shade_image_content_type :string
#  shade_image_file_size    :integer
#  shade_image_updated_at   :datetime
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class EdgeBandingShade < ApplicationRecord
  has_paper_trail

  has_many :shades

  validates_presence_of :code
  validates_uniqueness_of :code

  has_attached_file :shade_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :shade_image, content_type: /\Aimage\/.*\z/
end
