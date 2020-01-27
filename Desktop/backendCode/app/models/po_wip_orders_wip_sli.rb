# == Schema Information
#
# Table name: po_wip_orders_wip_slis
#
#  id                :integer          not null, primary key
#  wip_sli_id        :integer
#  po_wip_order_id   :integer
#  quantity          :float
#  recieved_quantity :float            default(0.0)
#  recieved_at       :datetime
#  parent_wip_sli_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class PoWipOrdersWipSli < ApplicationRecord
	belongs_to :wip_sli
	belongs_to :po_wip_order

	belongs_to :parent_wip_sli, :class_name => "PoWipOrdersWipSli"
	has_many :child_wip_slis, :foreign_key => "parent_wip_sli_id", :class_name => "PoWipOrdersWipSli"

	def add_to_inventory
		inventory = PoInventory.find_or_create_by(vendor_product_id: self.wip_sli.vendor_product_id)
		inventory.location = self.po_wip_order.shipping_address
		inventory.quantity = inventory.quantity.to_i + self.recieved_quantity
		inventory.lats_ordered = DateTime.now
		inventory.save!
	end
end
