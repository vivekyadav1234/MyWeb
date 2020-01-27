class AddDpQuestionireIdToDpqProjects < ActiveRecord::Migration[5.0]
  def change
  	add_reference :dpq_projects, :dp_questionnaire, foreign_key: true
  end
end
