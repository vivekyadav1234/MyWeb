# == Schema Information
#
# Table name: dp_questionnaires
#
#  id          :integer          not null, primary key
#  designer_id :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class DpQuestionnaireSerializer < ActiveModel::Serializer
	attributes :id, :answers, :projects

	def answers
  	@answers = object.dpq_answers
  	answers =[]
  	@answers.each do |answer|
  		answers_hash = answer.attributes
  		answers_hash["dpq_section_id"] = answer&.dpq_question&.dpq_section&.id
  		answers.push(answers_hash)
  	end if @answers.present?
  	answers
	end

	def projects
		@projects = object.dpq_projects
		projects = []
		@projects.each do |project|
  		projects_hash = project.attributes
  		projects.push(projects_hash)
  	end if @projects.present?
  	projects
	end
end
