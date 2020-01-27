# == Schema Information
#
# Table name: scope_of_works
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  client_details :text
#  date           :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :scope_of_work do
    project nil
    client_details "MyText"
    date "2018-05-05 20:58:18"
  end
end
