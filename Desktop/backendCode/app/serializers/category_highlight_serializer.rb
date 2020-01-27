# Do NOT make this serializer heavy. Let it contain just attributes. Anything more should be 
# put in a new serializer.
class CategoryHighlightSerializer < CatalogCategorySerializer
  attribute :starting_price
  attribute :number_products
  attribute :number_subcategories
  attribute :highlight_image

  def initialize(*args)
    super
    @catalog_type = instance_options[:catalog_type]
    @products = object.products.not_hidden.of_catalog_type(@catalog_type)
    @subcategories = object.catalog_subcategories.of_catalog_type(@catalog_type)
  end

  def starting_price
    @products.minimum(:sale_price)
  end

  def number_products
    @products.count
  end

  def number_subcategories
    @subcategories.count
  end

  def highlight_image
    products_with_images = @products.where.not(product_image_file_name: nil)
    if products_with_images.present?
      return products_with_images.sample&.product_image&.url
    else
      return @products.sample&.product_image&.url
    end
  end
end
