# == Schema Information
#
# Table name: boqjobs
#
#  id                 :integer          not null, primary key
#  name               :string
#  quantity           :float
#  rate               :float
#  amount             :float
#  ownerable_type     :string
#  ownerable_id       :integer
#  product_id         :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  ppt_linked         :boolean          default(FALSE)
#  section_id         :integer
#  space              :string
#  product_variant_id :integer
#  estimated_cogs     :float            default(0.0)
#  clubbed_job_id     :integer
#  tag_id             :integer
#  no_bom             :boolean          default(FALSE), not null
#

class BoqjobSerializer < ActiveModel::Serializer
  attributes :id, :name, :quantity, :rate, :amount, :ownerable_type, :ownerable_id, :product_id,
    :created_at, :updated_at, :ppt_linked, :section_id, :space

  attribute :section_name
  attribute :image_urls
  attribute :finish
  attribute :material
  attribute :dimensions
  attribute :product_variant
  attribute :lead_time
  attribute :labels

  def section_name
    object.section&.name
  end

  def image_urls
  	get_urls(object.product)
  end

  def get_urls(object_to_consider)
    [object_to_consider.product_image.url]
  end

  def finish
    object.product&.finish
  end

  def material
    object.product&.material
  end

  def dimensions
    product = object.product
    product.dimensions
  end

  def product_variant
    product_variant = object&.product_variant
    hash = Hash.new
    if product_variant.present?
       hash[:product_variant_id] = product_variant.id
       hash[:name] = product_variant.name
       hash[:product_variant_code] = product_variant.product_variant_code
       hash[:fabric_image] = "https:#{product_variant&.fabric_image&.url}"
    end
    hash
  end

  def lead_time
    object.product&.lead_time
  end

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end
end

class BusinessBoqJobSerializer < BoqjobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end
end
