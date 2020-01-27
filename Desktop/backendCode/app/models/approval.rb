# == Schema Information
#
# Table name: approvals
#
#  id                   :integer          not null, primary key
#  approval_scope       :string
#  approvable_type      :string
#  approvable_id        :integer
#  approved_at          :datetime
#  role                 :string
#  approved_by          :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null



class Approval < ApplicationRecord
  belongs_to :approvable, polymorphic: true

  ALLOWED_TYPES = ['discount', 'boq_segment_approval']
  validates_inclusion_of :approval_scope, in: ALLOWED_TYPES
  validates_presence_of :role, :approved_at, :approved_by, :approval_scope

  scope :with_subtype, ->(subtype_name) { where(subtype: subtype_name) }
  scope :boq_segment_approvals, -> { where(approval_scope: 'boq_segment_approval') }
  scope :approved, -> { where(rejected: false) }
  scope :rejected, -> { where(rejected: true) }

  def self.last_by_approved_at
    order(approved_at: :desc).limit(1).take
  end
end
