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

require 'rails_helper'

RSpec.describe VendorServiceableCityMapping, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
