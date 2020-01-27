# == Schema Information
#
# Table name: payments
#
#  id                  :integer          not null, primary key
#  project_id          :integer
#  quotation_id        :integer
#  payment_type        :string
#  amount_to_be_paid   :float
#  mode_of_payment     :string
#  bank                :string
#  branch              :string
#  date_of_checque     :date
#  amount              :float
#  date                :datetime
#  is_approved         :boolean
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  payment_status      :string
#  image_file_name     :string
#  image_content_type  :string
#  image_file_size     :integer
#  image_updated_at    :datetime
#  remarks             :string
#  payment_stage       :string
#  transaction_number  :string
#  ownerable_id        :integer
#  ownerable_type      :string
#  description         :string
#  finance_approved_at :datetime
#

require 'rails_helper'

RSpec.describe Payment, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
