# == Schema Information
#
# Table name: user_zipcode_mappings
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  zipcode_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class UserZipcodeMapping < ApplicationRecord
  belongs_to :user
  belongs_to :zipcode
end
