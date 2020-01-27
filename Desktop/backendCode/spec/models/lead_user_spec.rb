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

require 'rails_helper'

RSpec.describe LeadUser, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
