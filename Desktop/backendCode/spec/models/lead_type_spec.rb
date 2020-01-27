# == Schema Information
#
# Table name: lead_types
#
#  id                   :integer          not null, primary key
#  name                 :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  assigned_cs_agent_id :integer
#

require 'rails_helper'

RSpec.describe LeadType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
