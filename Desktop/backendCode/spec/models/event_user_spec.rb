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

require 'rails_helper'

RSpec.describe EventUser, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
