# == Schema Information
#
# Table name: dp_questionnaires
#
#  id          :integer          not null, primary key
#  designer_id :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryGirl.define do
  factory :dp_questionnaire do
    designer nil
    ownerable nil
  end
end
