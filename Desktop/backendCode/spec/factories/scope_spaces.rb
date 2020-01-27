# == Schema Information
#
# Table name: scope_spaces
#
#  id               :integer          not null, primary key
#  scope_of_work_id :integer
#  space_name       :string
#  space_type       :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryGirl.define do
  factory :scope_space do
    scope_of_work nil
    space_name "MyString"
    space_type "MyString"
  end
end
