# == Schema Information
#
# Table name: quotation_payments
#
#  id           :integer          not null, primary key
#  quotation_id :integer
#  payment_id   :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  amount       :float
#

require 'rails_helper'

RSpec.describe QuotationPayment, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
