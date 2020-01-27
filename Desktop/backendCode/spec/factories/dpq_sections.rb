# == Schema Information
#
# Table name: dpq_sections
#
#  id           :integer          not null, primary key
#  section_name :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

FactoryGirl.define do
  factory :dpq_section do
    section_name "MyString"
  end
end
