# == Schema Information
#
# Table name: module_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe ModuleType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
