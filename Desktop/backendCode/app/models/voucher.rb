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

class Voucher < ApplicationRecord
	belongs_to :lead, optional:  true
end
