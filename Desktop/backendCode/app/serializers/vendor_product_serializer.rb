# == Schema Information
#
# Table name: vendor_products
#
#  id                  :integer          not null, primary key
#  sli_code            :string
#  sli_name            :string
#  vendor_code         :string
#  unit                :string
#  rate                :float
#  vendor_id           :integer
#  master_line_item_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  sli_group_code      :string
#

class VendorProductSerializer < ActiveModel::Serializer
  attributes :id, :sli_group_code, :sli_code, :sli_name, :vendor_code, :unit, :vendor_id, :master_line_item_id, 
    :created_at, :updated_at

  attribute :vendor_name
  attribute :master_line_item_name
  attribute :rate

  def vendor_name
    object.vendor&.name
  end

  def master_line_item_name
    object.master_line_item&.mli_name
  end

  def rate
    object.rate&.round(2)
  end
end
