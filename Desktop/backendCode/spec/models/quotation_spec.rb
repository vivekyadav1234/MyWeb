# == Schema Information
#
# Table name: quotations
#
#  id                      :integer          not null, primary key
#  name                    :string
#  terms                   :text
#  net_amount              :float            default(0.0)
#  total_amount            :float            default(0.0)
#  status                  :string           default("0")
#  project_id              :integer
#  user_id                 :integer
#  generation_date         :date
#  expiration_date         :date
#  expiration_in_days      :integer
#  billing_address         :string
#  flat_amount             :float            default(0.0)
#  customer_notes          :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  reference_number        :string
#  presentation_id         :integer
#  designer_id             :integer
#  spaces                  :text             default([]), is an Array
#  spaces_kitchen          :text             default([]), is an Array
#  spaces_loose            :text             default([]), is an Array
#  spaces_services         :text             default([]), is an Array
#  spaces_custom           :text             default([]), is an Array
#  countertop_cost         :float
#  discount_value          :float
#  discount_status         :string
#  disc_status_updated_at  :datetime
#  disc_status_updated_by  :integer
#  final_amount            :float
#  is_approved             :boolean
#  paid_amount             :float
#  wip_status              :string
#  parent_quotation_id     :integer
#  copied                  :boolean
#  per_10_approved_by_id   :integer
#  per_10_approved_at      :datetime
#  per_50_approved_by_id   :integer
#  per_50_approved_at      :datetime
#  category_appoval_by_id  :integer
#  category_appoval_at     :datetime
#  remark                  :text
#  cm_approval_at          :datetime
#  cm_approval_by_id       :integer
#  cm_approval             :boolean
#  category_approval       :boolean
#  sli_flag                :string
#  customer_viewing_option :text             default(["\"boq\""]), is an Array
#  seen_by_category        :boolean          default(FALSE)
#  client_approval_by_id   :integer
#  client_approval_at      :datetime
#  price_increase_factor   :float            default(1.0)
#  estimated_cogs          :float            default(0.0)
#  shangpin_amount         :float            default(0.0)
#  spaces_custom_furniture :string           default([]), is an Array
#  can_edit                :boolean          default(TRUE)
#  duration                :integer
#  payment_50_comp_date    :datetime
#  need_category_approval  :boolean
#  delivery_tnc            :text
#

require 'rails_helper'

RSpec.describe Quotation, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
