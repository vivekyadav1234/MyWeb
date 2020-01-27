# == Schema Information
#
# Table name: performa_invoices
#
#  id                     :integer          not null, primary key
#  quotation_id           :integer
#  vendor_id              :integer
#  amount                 :float
#  description            :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  base_amount            :float            default(0.0)
#  tax_percent            :float            default(0.0)
#  pi_upload_file_name    :string
#  pi_upload_content_type :string
#  pi_upload_file_size    :integer
#  pi_upload_updated_at   :datetime
#  purchase_order_id      :integer
#

require 'rails_helper'

RSpec.describe PerformaInvoice, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
