# == Schema Information
#
# Table name: dpq_questions
#
#  id             :integer          not null, primary key
#  dpq_section_id :integer
#  question       :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

FactoryGirl.define do
  factory :dpq_question do
    dpq_section nil
    question "MyText"
  end
end
