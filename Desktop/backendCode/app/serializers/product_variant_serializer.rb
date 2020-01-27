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

class ProductVariantSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data]
  end
  attributes :id, :name, :product_variant_code, :fabric_image

  attribute :thumbnail do |object|
    object.fabric_image.url(:thumb)
  end

  attribute :medium_image do |object|
  	object.fabric_image.url(:medium)
  end

end
