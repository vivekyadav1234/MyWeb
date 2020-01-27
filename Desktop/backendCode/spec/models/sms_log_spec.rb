# == Schema Information
#
# Table name: sms_logs
#
#  id             :integer          not null, primary key
#  to_id          :integer
#  from_id        :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  message        :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe SmsLog, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
