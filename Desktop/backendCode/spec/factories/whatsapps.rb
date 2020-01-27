# == Schema Information
#
# Table name: whatsapps
#
#  id             :integer          not null, primary key
#  to             :string
#  ownerable_type :string
#  ownerable_id   :integer
#  message        :string
#  response       :json
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :whatsapp do
    
  end
end
