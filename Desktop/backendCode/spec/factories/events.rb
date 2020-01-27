# == Schema Information
#
# Table name: events
#
#  id              :integer          not null, primary key
#  agenda          :string
#  description     :string
#  scheduled_at    :datetime
#  status          :string           default("scheduled")
#  ownerable_type  :string
#  ownerable_id    :integer
#  location        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  contact_type    :string
#  remark          :string
#  mom_status      :string           default("pending")
#  mom_description :text
#

FactoryGirl.define do
  factory :event do
    
  end
end
