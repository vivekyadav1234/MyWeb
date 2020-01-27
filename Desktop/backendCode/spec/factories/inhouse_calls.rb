# == Schema Information
#
# Table name: inhouse_calls
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  call_from     :string
#  call_to_id    :integer
#  call_to_type  :string
#  call_to       :string
#  call_for      :string
#  call_response :json
#  call_type     :string           default("outgoing")
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  contact_type  :string           default("call")
#  sid           :string
#  lead_id       :integer
#

FactoryGirl.define do
  factory :inhouse_call do
    
  end
end
