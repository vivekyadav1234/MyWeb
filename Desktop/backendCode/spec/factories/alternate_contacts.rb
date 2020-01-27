# == Schema Information
#
# Table name: alternate_contacts
#
#  id             :integer          not null, primary key
#  name           :string
#  contact        :string
#  relation       :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :alternate_contact do
    
  end
end
