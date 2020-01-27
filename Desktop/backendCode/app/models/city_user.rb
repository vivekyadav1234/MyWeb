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

class CityUser < ApplicationRecord
  belongs_to :city
  belongs_to :user
  validates_uniqueness_of :user, scope: :city

end
