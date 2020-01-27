# == Schema Information
#
# Table name: urban_ladder_queues
#
#  id                :integer          not null, primary key
#  product_id        :integer          not null
#  job_id            :integer
#  status            :string           default("pending"), not null
#  status_updated_at :datetime
#  details           :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class UrbanLadderQueue < ApplicationRecord
  validates_presence_of :product_id

  ALL_STATUSES = ['pending', 'success', 'failed']
  validates_inclusion_of :status, in: ALL_STATUSES
end
