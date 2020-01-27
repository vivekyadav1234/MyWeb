# Special serializer when all products' data is to be retireved
class AllProductCatalogSerializer < ActiveModel::Serializer
  include CatalogModule

  attribute :id
  attribute :name
  attribute :color
  attribute :sale_price, key: :price
  attribute :section_id
  attribute :img_urls, key: :image_urls

  def img_urls
    image_urls(object)
  end
end
