# == Schema Information
#
# Table name: product_configurations
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  code        :string
#  section_id  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe ProductConfiguration, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
