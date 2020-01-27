class VendorProductWithAttrubtesSerializer < VendorProductSerializer
  attribute :dynamic_attributes

  def dynamic_attributes
    object.sli_dynamic_attributes.map{ |sli_dynamic_attribute|
      SliDynamicAttributeSerializer.new(sli_dynamic_attribute).serializable_hash
    }
  end
end
