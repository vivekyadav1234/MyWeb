# This is for use when rendering line items of a BOQ. So only include attributes needed for that,
# and not even one more!
class ModularJobLineItemSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :rate, :amount, :space, :category, :dimensions, :created_at, 
    :updated_at, :kitchen_category_name, :combined, :combined_module_id, 
    :custom_shelf_unit_width, :thickness, :length, :breadth, :width, :depth, :height

  attribute :name
  attribute :code
  attribute :module_type
  attribute :brand_name
  attribute :combined_door
  attribute :included_modules
  attribute :module_image_url
  attribute :customizable_dimensions
  attribute :timeline
  attribute :labels

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def initialize(*args)
    super
    @product_module = object.product_module
  end

  def name
    object.name || @product_module&.module_type&.name
  end

  # for a combined module, this will contain the details of the included modules
  def included_modules
    object.modular_jobs.map{ |modular_job|
      ModularJobLineItemSerializer.new(modular_job).serializable_hash
    }
  end

  def combined_door
    CombinedDoorSerializer.new(object.combined_door).serializable_hash if object.combined_door.present?
  end

  def code
    @product_module&.code
  end

  def module_type
    @product_module&.module_type&.name
  end

  def brand_name
    object.brand&.name
  end

  def module_image_url
    @product_module&.module_image&.url
  end

  def customizable_dimensions
    @product_module&.module_type&.customizable_dimensions
  end

  def timeline
    object.time_line_from_columns
  end
end
