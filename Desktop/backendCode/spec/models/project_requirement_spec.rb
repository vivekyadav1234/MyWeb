# == Schema Information
#
# Table name: project_requirements
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  requirement_name :string
#  budget           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  service          :text
#  color_preference :text
#

require 'rails_helper'

RSpec.describe ProjectRequirement, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
