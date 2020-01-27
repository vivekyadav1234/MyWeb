# == Schema Information
#
# Table name: purchase_orders
#
#  id                     :integer          not null, primary key
#  project_id             :integer
#  quotation_id           :integer
#  status                 :string           default("pending")
#  contact_person         :string
#  contact_number         :string
#  shipping_address       :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  vendor_id              :integer
#  billing_address        :string
#  billing_contact_person :string
#  billing_contact_number :string
#  vendor_gst             :string
#  modifying              :boolean          default(FALSE)
#  movement               :string
#  release_count          :integer          default(0)
#  tag_snag               :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe PurchaseOrder, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
