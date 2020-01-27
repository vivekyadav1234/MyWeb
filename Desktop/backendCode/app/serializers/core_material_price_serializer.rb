# == Schema Information
#
# Table name: core_material_prices
#
#  id               :integer          not null, primary key
#  thickness        :float
#  price            :float
#  core_material_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  category         :string           default("kitchen")
#

class CoreMaterialPriceSerializer < ActiveModel::Serializer
  attributes :id, :thickness, :price, :core_material_id, :created_at, :updated_at, :category

  attribute :core_material_name

  def core_material_name
    object.core_material&.name
  end
end
