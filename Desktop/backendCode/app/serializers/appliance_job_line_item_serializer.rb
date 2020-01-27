# This is for use when rendering line items of a BOQ. So only include attributes needed for that,
# and not even one more!
class ApplianceJobLineItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :make, :rate, :quantity, :amount, :space, :created_at, :updated_at, :vendor_sku

  attribute :subcategory
  attribute :image_url
  attribute :lead_time
  attribute :labels

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def initialize(*args)
    super
    @kitchen_appliance = object.kitchen_appliance
  end

  def lead_time
    @kitchen_appliance&.lead_time || 0
  end
  
  def subcategory
    @kitchen_appliance.module_type&.name
  end

  def image_url
    @kitchen_appliance.appliance_image.url
  end
end
