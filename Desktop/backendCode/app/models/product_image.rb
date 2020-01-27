# == Schema Information
#
# Table name: product_images
#
#  id                         :integer          not null, primary key
#  product_image_file_name    :string
#  product_image_content_type :string
#  product_image_file_size    :integer
#  product_image_updated_at   :datetime
#  image_name                 :string
#  product_id                 :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#

class ProductImage < ApplicationRecord
	belongs_to :product
	validates_uniqueness_of :image_name, scope: :product_id
	has_attached_file :product_image, styles: { medium: "500x500>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :product_image, content_type: /\Aimage\/.*\z/
end
