# == Schema Information
#
# Table name: event_users
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  event_id   :integer
#  host       :boolean
#  attendence :boolean
#  email      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class EventUser < ApplicationRecord
  belongs_to :user, required: true
  belongs_to :event, required: true
  validates_uniqueness_of :user_id, :scope => :event_id
end
