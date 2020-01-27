class ConfigurationCatalogSerializer < ActiveModel::Serializer
  include CatalogModule

  attributes :id, :name, :description, :code, :section_id

  attribute :products

  def products
    object.products.map do |product|
      product_attrs(product)
    end
  end
end
