# == Schema Information
#
# Table name: dpq_sections
#
#  id           :integer          not null, primary key
#  section_name :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class DpqSection < ApplicationRecord
  has_paper_trail
  has_many :dpq_projects
  has_many :dpq_questions

  validates_presence_of :section_name
  validates_uniqueness_of :section_name

  def self.sections_hash
  	sections_arr = []
  	@sections = DpqSection.all
  	@sections.each do |section|
  		if section.dpq_questions.present?
  			questions_arr = []
  			section.dpq_questions.each do |question|
  				questions_hash = {dpq_question_id: question.id, question: question.question}
  				questions_arr.push(questions_hash)
  			end
        hash = {dpq_section_id: section.id, section_name: section.section_name, dpq_questions: questions_arr}
        sections_arr.push(hash)
  		else
  			hash = {dpq_section_id: section.id, section_name: section.section_name, dpq_projects: ""}
        sections_arr.push(hash)
  		end
  	end
  	sections_arr
  end
end
