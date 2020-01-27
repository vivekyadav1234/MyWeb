# == Schema Information
#
# Table name: lead_queues
#
#  id               :integer          not null, primary key
#  priority         :integer          default(1)
#  status           :string           default("queued")
#  lead_id          :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  lead_priority_id :integer
#

class LeadQueue < ApplicationRecord
  belongs_to :lead, required: true
  belongs_to :lead_priority, optional: true

  validates_uniqueness_of :lead_id

  ALL_STATUSES = %w(queued processing done)
  validates_inclusion_of :status, in: ALL_STATUSES

  # higher priority value means higher priority here
  scope :ordered_by_priority, ->{ order("priority DESC, id ASC") }
  scope :reordered_by_priority, ->{ reorder("priority DESC, id ASC") }

  # Take in an array of lead_ids, then insert them into this table
  # priority default is 1 in the db.
  def self.add_to_queue(lead_ids, priority = nil, lead_priority = nil)
    if priority.present?
      lead_ids.map { |lead_id| LeadQueue.create!(lead_id: lead_id, priority: priority, 
        lead_priority: lead_priority) }
    else
      lead_ids.map { |lead_id| LeadQueue.create!(lead_id: lead_id, lead_priority: lead_priority) }
    end
  end
end
