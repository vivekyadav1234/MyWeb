# == Schema Information
#
# Table name: user_data_migrations
#
#  id            :integer          not null, primary key
#  from          :integer
#  to            :integer
#  migrated_data :json             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryGirl.define do
  factory :user_data_migration do
    
  end
end
