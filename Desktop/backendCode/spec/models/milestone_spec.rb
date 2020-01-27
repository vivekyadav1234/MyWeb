# == Schema Information
#
# Table name: milestones
#
#  id                    :integer          not null, primary key
#  milestone_object_id   :integer
#  milestone_object_type :string
#  percentage_amount     :string
#  interval              :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  description           :text
#  estimate_date         :datetime
#

require 'rails_helper'

RSpec.describe Milestone, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
