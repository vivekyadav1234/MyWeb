# IMPORTANT - Do NOT make this serializer heavy. Only include data that is needed for the landing
# page. If you need more data for another end-point, create a new serializer - inherit from this if needed.
class ProductLandingSerializer < ActiveModel::Serializer
  attributes :id, :name, :unique_sku, :sale_price, :created_at, :updated_at

  attribute :image_url
  attribute :liked
  attribute :new_product
  attribute :units_sold

  def image_url
    object.product_image.url
  end

  # Return true if liked by passed user, else false.
  def liked
    current_user = instance_options[:current_user]
    current_user.present? && current_user.liked_products.include?(object)
  end

  def new_product
    object.created_at > 30.days.ago
  end

  def units_sold
    if object.units_sold < 20
      rand(1..20)
    else
      object.units_sold
    end
  end
end
