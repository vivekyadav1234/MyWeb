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

class SliDynamicAttribute < ApplicationRecord
  has_paper_trail

  belongs_to :mli_attribute, required: true
  belongs_to :vendor_product, required: true

  validates_presence_of :attr_value
  validate :reference_object_present

  def master_line_item
    mli_attribute.master_line_item
  end

  def reference_data_type?
    mli_attribute.attr_data_type == 'reference'
  end

  def reference_table_name
    mli_attribute.reference_table_name
  end

  def reference_object
    reference_table_name&.constantize&.find_by_id(attr_value)
  end

  # eg if object is a record of Addon, then we want addon.code. For CoreMaterial record, we want core_material.name.
  def reference_object_value
    reference_object&.send(MliAttribute::REFERENCE_OBJECT_VALUE_MAP[reference_table_name])
  end

  private
  # In the case of a reference attribute, make sure that the object referred to is valid.
  # object class: reference_table_name
  # object id: attr_value
  def reference_object_present
    errors.add(:attr_value, "No object of class #{reference_table_name} with ID #{attr_value} found.") if reference_data_type? && reference_object.blank?
  end
end
