# == Schema Information
#
# Table name: dp_questionnaires
#
#  id          :integer          not null, primary key
#  designer_id :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class DpQuestionnaire < ApplicationRecord
  has_paper_trail
  belongs_to :designer, :class_name => 'User'
  has_many :dpq_projects, dependent: :destroy
  has_many :dpq_answers, dependent: :destroy
  has_many :dpq_questions, through: :dpq_answers

  accepts_nested_attributes_for :dpq_projects, :dpq_answers, :allow_destroy => true
end
