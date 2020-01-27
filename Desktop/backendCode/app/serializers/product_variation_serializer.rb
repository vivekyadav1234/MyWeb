class ProductVariationSerializer < ActiveModel::Serializer
  attributes :id, :name, :material, :color, :product_id, :created_at, :updated_at

  belongs_to :product
end
