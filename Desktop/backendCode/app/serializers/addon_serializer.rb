# == Schema Information
#
# Table name: addons
#
#  id                       :integer          not null, primary key
#  code                     :string
#  name                     :string
#  specifications           :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  category                 :string
#  addon_image_file_name    :string
#  addon_image_content_type :string
#  addon_image_file_size    :integer
#  addon_image_updated_at   :datetime
#  vendor_sku               :string
#  extra                    :boolean          default(FALSE)
#  mrp                      :float
#  allowed_in_custom_unit   :boolean          default(FALSE)
#  lead_time                :integer          default(0)
#  hidden                   :boolean          default(FALSE), not null
#  arrivae_select           :boolean          default(FALSE), not null
#

class AddonSerializer < ActiveModel::Serializer
  attributes :id, :code, :name, :specifications, :brand_id, :created_at, :updated_at, :category, 
    :addon_image, :price, :vendor_sku, :extra, :mrp, :arrivae_select, :hidden

  attribute :brand_name
  attribute :slot   #at the request of Riya
  attribute :addon_tags

  def brand_name
    object.brand&.name
  end

  def slot
    instance_options[:slot]
  end

  def addon_tags
    tags = []
    object.addon_tags.each do |addon_tag|
      tags.push TagSerializer.new(addon_tag).serializable_hash
    end
    tags
  end
end
