# == Schema Information
#
# Table name: event_users
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  event_id   :integer
#  host       :boolean
#  attendence :boolean
#  email      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryGirl.define do
  factory :event_user do
    
  end
end
