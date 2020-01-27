# == Schema Information
#
# Table name: carcass_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  aluminium  :boolean          default(FALSE)
#  glass      :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe CarcassElementType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
