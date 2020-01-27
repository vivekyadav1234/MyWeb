# == Schema Information
#
# Table name: events
#
#  id              :integer          not null, primary key
#  agenda          :string
#  description     :string
#  scheduled_at    :datetime
#  status          :string           default("scheduled")
#  ownerable_type  :string
#  ownerable_id    :integer
#  location        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  contact_type    :string
#  remark          :string
#  mom_status      :string           default("pending")
#  mom_description :text
#

require 'rails_helper'

RSpec.describe Event, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
