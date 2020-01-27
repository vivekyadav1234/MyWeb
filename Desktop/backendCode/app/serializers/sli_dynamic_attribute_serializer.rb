# == Schema Information
#
# Table name: sli_dynamic_attributes
#
#  id                :integer          not null, primary key
#  attr_value        :string
#  mli_attribute_id  :integer
#  vendor_product_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class SliDynamicAttributeSerializer < ActiveModel::Serializer
  attributes :id, :attr_value, :mli_attribute_id, :vendor_product_id, :created_at, :updated_at

  attribute :mli_attribute_name
  attribute :reference_object_value

  def mli_attribute_name
    object.mli_attribute&.attr_name
  end

  def reference_object_value
    object.reference_object_value
  end
end
