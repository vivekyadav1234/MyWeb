# == Schema Information
#
# Table name: product_variants
#
#  id                        :integer          not null, primary key
#  name                      :string
#  product_variant_code      :string
#  catalogue_option_id       :integer
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  fabric_image_file_name    :string
#  fabric_image_content_type :string
#  fabric_image_file_size    :integer
#  fabric_image_updated_at   :datetime
#

class ProductVariant < ApplicationRecord
  has_paper_trail
  belongs_to :catalogue_option
  has_many :boqjobs

  has_attached_file :fabric_image, styles: { medium: "400x400>", thumb: "70x70>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :fabric_image, content_type: /\Aimage\/.*\z/
end
