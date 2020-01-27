# == Schema Information
#
# Table name: lead_users
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  lead_id       :integer
#  claimed       :string           default("pending")
#  processed_at  :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  active        :boolean          default(FALSE)
#  seen_by_agent :boolean          default(FALSE)
#

class LeadUser < ApplicationRecord
  has_paper_trail
  
  belongs_to :user
  belongs_to :lead

  validates_inclusion_of :claimed, in: %w(yes pending no force_yes auto_reassigned force_reassigned)
  validates_uniqueness_of :lead_id, scope: [:user_id]

  validate :user_is_cs_agent, on: :create

  def role
    self.user.roles.take
  end

  private
  def user_is_cs_agent
    errors.add(:user_id, 'assigned user must have role cs_agent') unless user.has_role?(:cs_agent)
  end
end
