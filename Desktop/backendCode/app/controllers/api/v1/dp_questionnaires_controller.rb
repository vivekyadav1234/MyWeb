class Api::V1::DpQuestionnairesController < Api::V1::ApiController
  before_action :set_user, only: [:index]
  load_and_authorize_resource :dp_questionnaire
  
  def index
	@dp_questionnaire = @user.dp_questionnaire
	render json: @dp_questionnaire
  end
  
  def get_section_wise_questions
  	hash_to_render = DpqSection.sections_hash
	render json: {dp_questionnaire: hash_to_render}
  end

  def create
    if !current_user.dp_questionnaire.present?
	  @dp_questionnaire = current_user.build_dp_questionnaire(dp_questionnaire_params)
      if @dp_questionnaire.save
     		 render json: @dp_questionnaire, status: :created
    	else
      	render json: @dp_questionnaire.errors, status: :unprocessable_entity
    	end
		else
			@dp_questionnaire = current_user.dp_questionnaire
			projects_id = @dp_questionnaire&.dpq_projects&.pluck(:id)
			if @dp_questionnaire.update(dp_questionnaire_params)
				projects_to_remove = projects_id - params[:dp_questionnaire][:project_to_be_keep]
				@dp_questionnaire&.dpq_projects&.where(id: projects_to_remove)&.destroy_all if projects_to_remove.present?
	      render json: @dp_questionnaire
	    else
	      render json: @dp_questionnaire.errors, status: :unprocessable_entity
	    end
		end
	end

	def delete_project
		if params[:dpq_project_id].present?
			@dpq_project = DpqProject.find params[:dpq_project_id]
			if @dpq_project.present?
				@dpq_project.destroy!
				render json: {message: "project destroyed successfully"}, status: 200
			else
				render json: {message: "project not found"}, status: 404
			end
		else
			render json: {message: "pass project id"}, status: 404
		end
	end

  private
  def set_user
  	@user = User.find params[:user_id]
  end

  def dp_questionnaire_params
  	params.require(:dp_questionnaire).permit(:id, :designer_id, dpq_projects_attributes: [:id, :customer_name, :project_type, :budget, :area, :client_pitches_and_design_approval, :dpq_section_id, :_destroy], dpq_answers_attributes: [:id, :dpq_question_id, :answer, :skipped])
  end
end