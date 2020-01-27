# == Schema Information
#
# Table name: purchase_elements
#
#  id                    :integer          not null, primary key
#  purchase_order_id     :integer
#  job_element_vendor_id :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

require 'rails_helper'

RSpec.describe PurchaseElement, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
