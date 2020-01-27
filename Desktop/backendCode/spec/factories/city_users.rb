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

FactoryGirl.define do
  factory :city_user do
    city nil
    user nil
  end
end
