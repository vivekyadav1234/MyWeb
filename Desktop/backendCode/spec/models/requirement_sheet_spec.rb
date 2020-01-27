# == Schema Information
#
# Table name: requirement_sheets
#
#  id                     :integer          not null, primary key
#  project_requirement_id :integer
#  space_type             :string
#  space_name             :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

require 'rails_helper'

RSpec.describe RequirementSheet, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
