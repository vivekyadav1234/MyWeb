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

class ProposalDoc < ApplicationRecord
  belongs_to :proposal
  belongs_to :ownerable, polymorphic: true
  validates_uniqueness_of :ownerable_id, scope: [:ownerable_type ], conditions: -> { where(ownerable_type: 'Quotation') }
end
