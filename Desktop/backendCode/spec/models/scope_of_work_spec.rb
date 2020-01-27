# == Schema Information
#
# Table name: scope_of_works
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  client_details :text
#  date           :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe ScopeOfWork, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
