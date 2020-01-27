# == Schema Information
#
# Table name: proposals
#
#  id              :integer          not null, primary key
#  proposal_type   :string
#  proposal_name   :string
#  project_id      :integer
#  designer_id     :integer
#  sent_at         :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  proposal_status :string
#  is_draft        :string
#

require 'rails_helper'

RSpec.describe Proposal, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
