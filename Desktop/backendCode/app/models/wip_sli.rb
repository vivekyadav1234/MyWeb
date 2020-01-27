# == Schema Information
#
# Table name: wip_slis
#
#  id                :integer          not null, primary key
#  quantity          :float            default(0.0)
#  tax_type          :string
#  tax               :float
#  amount            :float
#  vendor_product_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  status            :string           default("pending")
#  vendor_id         :integer
#  name              :string
#  unit              :string
#  rate              :float
#  custom            :boolean
#  sli_type          :string
#

class WipSli < ApplicationRecord
	belongs_to :vendor_product, optional: true
	belongs_to :vendor
	has_many :po_wip_orders_wip_slis, dependent: :destroy
	has_many :po_wip_orders, through: :po_wip_orders_wip_slis
	TAX_TYPE = ["igst", "cgst-sgst"]
	STATUS = ["pending", "po_created", "modify_po", "cancelled", "po_recieved"]
  validates_inclusion_of :tax_type, in: TAX_TYPE

	before_validation :populate_vendor_id

	def populate_vendor_id
		if self.vendor_product_id.present? && self.vendor_id.blank?
			self.vendor_id = self.vendor_product.vendor.id
		end
	end

end
