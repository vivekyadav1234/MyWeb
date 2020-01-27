class SectionCatalogSerializer < ActiveModel::Serializer
  include CatalogModule

  attributes :id, :name

  attribute :products
  attribute :product_configurations

  def products
    object.products.map do |product|
      product_attrs(product)
    end
  end

  def product_configurations
    object.product_configurations.map do |configuration|
     hash = product_configuration_attrs(configuration)
     hash[:count] = configuration.products.count
     hash
    end
  end
end
