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

class ProjectRequirementSerializer < ActiveModel::Serializer
  attributes :id, :project_id, :requirement_name, :budget, :service, :color_preference, :requirement_sheets, :created_at, :updated_at

  def requirement_sheets
  	requirement_sheets = object.requirement_sheets
  	arr = []
  	requirement_sheets.each do |requirement_sheet|
  	  hash = requirement_sheet.slice(:id,:space_type, :space_name)
  	  space_q_and_a = []
  	  requirement_space_q_and_as = requirement_sheet.requirement_space_q_and_as
  	  requirement_space_q_and_as.each do |requirement_space_q_and_a|
  	  	q_n_a_hash = requirement_space_q_and_a.slice(:id, :question, :answer)
  	  	space_q_and_a.push(q_n_a_hash)
  	  end
  	  hash[:requirement_space_q_and_as] = space_q_and_a
  	  arr.push(hash)
  	end
  	arr
  end

end
