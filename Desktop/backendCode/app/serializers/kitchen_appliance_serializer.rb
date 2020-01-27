# == Schema Information
#
# Table name: kitchen_appliances
#
#  id                           :integer          not null, primary key
#  name                         :string
#  code                         :string
#  make                         :string
#  price                        :float
#  appliance_image_file_name    :string
#  appliance_image_content_type :string
#  appliance_image_file_size    :integer
#  appliance_image_updated_at   :datetime
#  module_type_id               :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  vendor_sku                   :string
#  specifications               :string
#  warranty                     :string
#  mrp                          :float
#  lead_time                    :integer          default(0)
#  arrivae_select               :boolean          default(FALSE), not null
#

class KitchenApplianceSerializer < ActiveModel::Serializer
  attributes :id, :name, :code, :make, :price, :appliance_image, :module_type_id, 
    :created_at, :updated_at, :vendor_sku, :specifications, :warranty, :mrp, :arrivae_select

  attribute :module_type
  attribute :category

  def module_type
    object.module_type&.name
  end

  def category
    object.module_type&.get_kitchen_category
  end
end
