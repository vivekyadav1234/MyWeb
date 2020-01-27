class Api::V1::ProjectRequirementsController < Api::V1::ApiController
  before_action :set_project_requirement, only: [:show, :update, :destroy]

  # GET /project_requirements
  def index
    @project_requirements = ProjectRequirement.all

    render json: @project_requirements
  end

  # GET /project_requirements/1
  def show
    render json: @project_requirement
  end

  # GET requirement for project


  # POST /project_requirements
  def create
    @project_requirement = ProjectRequirement.new(project_requirement_params)

    if @project_requirement.save
      render json: @project_requirement, status: :created
    else
      render json: @project_requirement.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /project_requirements/1
  def update
    if @project_requirement.update(project_requirement_params)
      
      # params[:project_requirement][:requirement_sheets_attributes].each do |requirement_sheets_attribute|
      #   requirement_sheet_hash = requirement_sheet_params(requirement_sheets_attribute)
      #   @requirement_sheet = @project_requirement.requirement_sheets.create!(requirement_sheet_hash) if requirement_sheet_hash[:id] == ""
      # end
      
      
      render json: @project_requirement
    else
      render json: @project_requirement.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_requirements/1
  def destroy
    @project_requirement.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_requirement
      @project_requirement = ProjectRequirement.find(params[:id])
    end
    
    def requirement_sheet_params(r_s_params)
      r_s_params.permit(:id,:space_type, :space_name, requirement_space_q_and_as_attributes: [:id, :question, :answer])
    end
    # Only allow a trusted parameter "white list" through.
    def project_requirement_params
      params.require(:project_requirement).permit(:id, :project_id, :requirement_name, :budget, :service, :color_preference, requirement_sheets_attributes: [:id, :space_type, :space_name, requirement_space_q_and_as_attributes: [:id, :question, :answer]])
    end
end
