# == Schema Information
#
# Table name: product_module_types
#
#  id                :integer          not null, primary key
#  product_module_id :integer
#  module_type_id    :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

require 'rails_helper'

RSpec.describe ProductModuleType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
