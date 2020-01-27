# == Schema Information
#
# Table name: requirement_sheets
#
#  id                     :integer          not null, primary key
#  project_requirement_id :integer
#  space_type             :string
#  space_name             :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

FactoryGirl.define do
  factory :requirement_sheet do
    project_requirement nil
    space_type "MyString"
    space_name "MyString"
  end
end
