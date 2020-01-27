#Module helpful serializing catalog data
module CatalogModule
  def image_urls(product)
    [product.product_image.url]
  end

  def product_attrs(product)
    product.attributes.slice('id','name','color').merge(image_urls: image_urls(product), price: product.sale_price)
  end

  def product_configuration_attrs(configuration)
    configuration.attributes.slice('id', 'name', 'description', 'code')
  end
end