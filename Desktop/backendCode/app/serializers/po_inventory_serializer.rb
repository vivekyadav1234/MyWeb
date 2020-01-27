# == Schema Information
#
# Table name: po_inventories
#
#  id                :integer          not null, primary key
#  vendor_product_id :integer
#  quantity          :integer
#  lats_ordered      :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  location          :text
#  tat               :float
#  min_stock         :float
#

class PoInventorySerializer
	include FastJsonapi::ObjectSerializer

	def serializable_hash
    data = super
    data[:data]
	end

  attributes :id, :quantity, :location, :lats_ordered, :created_at, :updated_at, :min_stock, :tat

  attribute :sli_name do |object|
  	object.vendor_product&.sli_name
  end

  attribute :unit do |object|
  	object.vendor_product&.unit
  end

  attribute :rate do |object|
  	object.vendor_product&.rate
  end

  attribute :vendor_name do |object|
  	object.vendor_product&.vendor&.name
  end

end
