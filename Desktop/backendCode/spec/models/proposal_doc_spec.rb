# == Schema Information
#
# Table name: proposal_docs
#
#  id                     :integer          not null, primary key
#  proposal_id            :integer
#  ownerable_type         :string
#  ownerable_id           :integer
#  is_approved            :boolean
#  approved_at            :datetime
#  discount_value         :float
#  disc_status_updated_by :integer
#  disc_status_updated_at :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  discount_status        :string
#  remark                 :text
#  seen_by_category       :boolean          default(FALSE)
#  customer_remark        :text
#

require 'rails_helper'

RSpec.describe ProposalDoc, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
