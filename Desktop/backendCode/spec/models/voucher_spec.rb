# == Schema Information
#
# Table name: vouchers
#
#  id         :integer          not null, primary key
#  lead_id    :integer
#  code       :string
#  is_used    :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Voucher, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
