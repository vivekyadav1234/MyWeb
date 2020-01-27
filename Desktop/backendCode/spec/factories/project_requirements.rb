# == Schema Information
#
# Table name: project_requirements
#
#  id               :integer          not null, primary key
#  project_id       :integer
#  requirement_name :string
#  budget           :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  service          :text
#  color_preference :text
#

FactoryGirl.define do
  factory :project_requirement do
    project nil
    requirement_name "MyString"
    budget "MyString"
  end
end
