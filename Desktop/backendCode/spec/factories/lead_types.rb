# == Schema Information
#
# Table name: lead_types
#
#  id                   :integer          not null, primary key
#  name                 :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  assigned_cs_agent_id :integer
#

FactoryGirl.define do
  factory :lead_type do
    
  end
end
