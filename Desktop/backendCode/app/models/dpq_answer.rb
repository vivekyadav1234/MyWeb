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

class DpqAnswer < ApplicationRecord
  has_paper_trail
  belongs_to :dpq_question
  belongs_to :dp_questionnaire

  validates_uniqueness_of :dpq_question_id, :scope => :dp_questionnaire_id
end
