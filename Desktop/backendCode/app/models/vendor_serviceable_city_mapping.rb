# == Schema Information
#
# Table name: vendor_serviceable_city_mappings
#
#  id                  :integer          not null, primary key
#  serviceable_city_id :integer
#  vendor_id           :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class VendorServiceableCityMapping < ApplicationRecord
  has_paper_trail
	
	belongs_to :vendor, required: true
	belongs_to :serviceable_city, :class_name => 'City', required: true
	validates_uniqueness_of :vendor_id, scope: :serviceable_city
end
