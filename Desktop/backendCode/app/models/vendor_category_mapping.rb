# == Schema Information
#
# Table name: vendor_category_mappings
#
#  id              :integer          not null, primary key
#  vendor_id       :integer
#  sub_category_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class VendorCategoryMapping < ApplicationRecord
  has_paper_trail
	belongs_to :vendor, required: true
	belongs_to :sub_category, :class_name => 'VendorCategory', required: true
	validates_uniqueness_of :vendor_id, scope: :sub_category_id
end
