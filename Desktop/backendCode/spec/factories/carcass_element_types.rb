# == Schema Information
#
# Table name: carcass_element_types
#
#  id         :integer          not null, primary key
#  name       :string
#  category   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  aluminium  :boolean          default(FALSE)
#  glass      :boolean          default(FALSE)
#

FactoryGirl.define do
  factory :carcass_element_type do
    
  end
end
