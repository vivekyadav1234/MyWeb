# == Schema Information
#
# Table name: city_users
#
#  id         :integer          not null, primary key
#  city_id    :integer
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe CityUser, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
