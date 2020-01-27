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

require 'rails_helper'

RSpec.describe VendorCategoryMapping, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
