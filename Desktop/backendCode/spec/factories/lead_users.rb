# == Schema Information
#
# Table name: lead_users
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  lead_id       :integer
#  claimed       :string           default("pending")
#  processed_at  :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  active        :boolean          default(FALSE)
#  seen_by_agent :boolean          default(FALSE)
#

FactoryGirl.define do
  factory :lead_user do
    
  end
end
