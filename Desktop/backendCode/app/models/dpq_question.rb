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

class DpqQuestion < ApplicationRecord
  has_paper_trail
  belongs_to :dpq_section
  has_many :dpq_answers
  validates_presence_of :question
  validates_uniqueness_of :question, :scope => :dpq_section
end
