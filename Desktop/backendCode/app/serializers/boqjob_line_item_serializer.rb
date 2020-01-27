# This is for use when rendering line items of a BOQ. So only include attributes needed for that,
# and not even one more!
class BoqjobLineItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :quantity, :rate, :amount, :created_at, :updated_at, :space, :lead_time

  attribute :image_urls
  attribute :finish
  attribute :material
  attribute :dimensions
  attribute :product_variant
  attribute :lead_time
  attribute :labels

  def initialize(*args)
    super
    @product = object.product
    @product_variant = object.product_variant
  end

  def image_urls
    get_urls(@product)
  end

  def finish
    @product&.finish
  end

  def material
    @product&.material
  end

  def dimensions
    @product.dimensions
  end

  def product_variant
    hash = Hash.new
    if @product_variant.present?
       hash[:product_variant_id] = @product_variant.id
       hash[:name] = @product_variant.name
       hash[:product_variant_code] = @product_variant.product_variant_code
       hash[:fabric_image] = "https:#{@product_variant&.fabric_image&.url}"
    end
    hash
  end

  def lead_time
    @product&.lead_time
  end

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  private
  def get_urls(object_to_consider)
    [object_to_consider.product_image.url]
  end
end
