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

class PoInventory < ApplicationRecord
	belongs_to :vendor_product

	scope :search_inventory, -> (search_param) {
          where("LOWER(po_inventories.location) ilike ?", "%#{search_param}%")
        }

end
