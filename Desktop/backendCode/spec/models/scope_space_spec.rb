# == Schema Information
#
# Table name: scope_spaces
#
#  id               :integer          not null, primary key
#  scope_of_work_id :integer
#  space_name       :string
#  space_type       :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

require 'rails_helper'

RSpec.describe ScopeSpace, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
