# == Schema Information
#
# Table name: dpq_answers
#
#  id                  :integer          not null, primary key
#  dpq_question_id     :integer
#  dp_questionnaire_id :integer
#  answer              :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  skipped             :boolean
#

FactoryGirl.define do
  factory :dpq_answer do
    dpq_question nil
    answer "MyText"
  end
end
