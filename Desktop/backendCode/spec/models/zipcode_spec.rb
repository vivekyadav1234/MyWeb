# == Schema Information
#
# Table name: zipcodes
#
#  id         :integer          not null, primary key
#  code       :string
#  city_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Zipcode, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
