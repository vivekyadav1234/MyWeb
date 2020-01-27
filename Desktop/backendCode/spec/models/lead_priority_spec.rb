# == Schema Information
#
# Table name: lead_priorities
#
#  id               :integer          not null, primary key
#  priority_number  :integer
#  lead_source_id   :integer
#  lead_type_id     :integer
#  lead_campaign_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe LeadPriority, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
