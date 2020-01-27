# == Schema Information
#
# Table name: products
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  sale_price                   :float
#  section_id                   :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  image_name                   :string
#  model_no                     :string
#  color                        :string
#  finish                       :string
#  product_config               :string
#  length                       :integer
#  width                        :integer
#  height                       :integer
#  vendor_sku                   :string
#  vendor_name                  :string
#  vendor_location              :string
#  cost_price                   :float
#  model3d_file                 :string
#  manufacturing_time_days      :integer
#  product_url                  :string
#  material                     :text
#  dimension_remark             :text
#  warranty                     :string
#  remark                       :text
#  measurement_unit             :string
#  qty                          :integer
#  unique_sku                   :string
#  product_configuration_id     :integer
#  parent_product_id            :integer
#  product_image_file_name      :string
#  product_image_content_type   :string
#  product_image_file_size      :integer
#  product_image_updated_at     :datetime
#  lead_time                    :integer
#  hidden                       :boolean          default(FALSE)
#  units_sold                   :integer          default(0)
#  origin                       :string           default("arrivae"), not null
#  imported_sku                 :string
#  last_imported_at             :datetime
#  catalog_type                 :string           default("arrivae"), not null
#

class ProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :image_name, :image_url, :image_relative_url, :product_url, :length, :width, :height, 
  :unique_sku, :material, :dimension_remark, :warranty, :finish, :vendor_sku, :color, :product_config, 
  :cost_price, :sale_price, :vendor_name, :lead_time, :remark, :measurement_unit, :qty, :section_id, :catalog_type

  attribute :variations
  attribute :parent_id
  attribute :parent_name
  attribute :section_name
  attribute :image_urls
  attribute :dimensions
  attribute :business_units
  attribute :catalog_segments
  attribute :catalog_categories
  attribute :catalog_subcategories
  attribute :catalog_classes
  attribute :units_sold

  def image_urls
    get_urls(object)
  end

  def image_url
    object.product_image.url
  end

  def image_relative_url
    base_url = "/assets/img/catalogue/images"
    img_name = object.unique_sku+".jpg"
    final_url = base_url+"/"+img_name
  end

  def variations
    arr = []
    arr.push object.attributes.merge(image_urls: get_urls(object))
    object.variations.each do |variation|
      arr.push variation.attributes.merge(image_urls: get_urls(object))
    end
    arr
  end

  def parent_id
    object.section&.parent&.id
  end

  def parent_name
    object.section&.parent&.name
  end

  def section_name
    object.section&.name
  end

  def business_units
    object.business_units.pluck(:unit_name)
  end

  def catalog_segments
    object.catalog_segments.pluck(:segment_name)
  end

  def catalog_categories
    object.catalog_categories.pluck(:category_name)
  end

  def catalog_subcategories
    object.catalog_subcategories.pluck(:subcategory_name)
  end

  def catalog_classes
    object.catalog_classes.pluck(:name)
  end

  def get_urls(object_to_consider)
    [object_to_consider.product_image.url]
  end

  def dimensions
    object.dimensions
  end

  def units_sold
    if object.units_sold < 20
      rand(1..20)
    else
      object.units_sold
    end
  end
end

class ProductSerializerForShow < ProductSerializer
  attribute :all_image_urls
  attribute :liked
  attribute :new_product
  attribute :similar_products
  attribute :breadcrumb

  def initialize(*args)
    super
    @catalog_type = instance_options[:catalog_type]
  end

  def all_image_urls
    arr = [{thumbnail: object.product_image.url(:thumb),medium: object.product_image.url}]
    products_images = object.product_images
    products_images.each do |image|
     arr << {thumbnail: image.product_image.url(:thumb),medium: image.product_image.url}
    end
    arr
  end

  # Return true if liked by passed user, else false.
  def liked
    current_user = instance_options[:current_user]
    current_user.present? && current_user.liked_products.include?(object)
  end

  def new_product
    object.created_at > 30.days.ago
  end

  # There is no algo currently.
  # So, just send 4 products from the same subcategory currently.
  def similar_products
    subcategory = object.catalog_subcategories.of_catalog_type(@catalog_type).first
    unless subcategory.present?
      []
    else
      subcategory.products.of_catalog_type(@catalog_type).not_hidden.limit(4).map{ |product| ProductLandingSerializer.new(product, {current_user: instance_options[:current_user]}).serializable_hash }
    end
  end

  # For now, just send the first segment, category, subcategory names.
  def breadcrumb
    subcategory = object.catalog_subcategories.of_catalog_type(@catalog_type).first
    category = subcategory&.catalog_categories&.of_catalog_type(@catalog_type)&.first
    segment = category&.catalog_segments&.of_catalog_type(@catalog_type)&.first
    if subcategory.present? && segment.present? && category.present?
      {
        segment: {
          id: segment.id, 
          name: segment.segment_name
        }, 
        category: {
          id: category.id, 
          name: category.category_name
        }, 
        subcategory: {
          id: subcategory.id, 
          name: subcategory.subcategory_name
        }, 
        product: {
          id: object.id, 
          name: object.name
        }
      }
    else
      {}
    end
  end
end
