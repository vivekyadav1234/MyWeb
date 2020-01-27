# == Schema Information
#
# Table name: shades
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
#  edge_banding_shade_id    :integer
#  hidden                   :boolean          default(FALSE)
#  lead_time                :integer          default(0)
#  arrivae_select           :boolean          default(FALSE), not null
#

class Shade < ApplicationRecord
  has_paper_trail

  belongs_to :edge_banding_shade, optional: true

  has_many :shutter_finish_shades, dependent: :destroy
  has_many :shutter_finishes, through: :shutter_finish_shades

  # validates_presence_of :name
  validates_presence_of :code
  validates_uniqueness_of :code

  has_attached_file :shade_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :shade_image, content_type: /\Aimage\/.*\z/

  # the hidden shades will exist in DB, but will not be available to selected in BOQs
  scope :not_hidden, -> {where(hidden: false)}
  scope :arrivae_select, -> {where(arrivae_select: true)}

  def Shade.custom_shade_code?(shade_code)
    Shade.find_by_code(shade_code).blank?
  end
end
