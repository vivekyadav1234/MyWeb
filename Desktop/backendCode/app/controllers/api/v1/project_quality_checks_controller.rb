require_dependency "#{Rails.root.join('app', 'serializers', 'project_quality_check_serializer')}"
class Api::V1::ProjectQualityChecksController < Api::V1::ApiController
  before_action :set_project
  before_action :set_project_quality_check, only: [:show, :update, :destroy]

  # GET /project_quality_checks
  def index
    @project_quality_checks = ProjectQualityCheck.all

    render json: @project_quality_checks
  end

  # GET /project_quality_checks/1
  def show
    render json: @project_quality_check
  end

  # POST /project_quality_checks
  def create
    @project_quality_check = @project.project_quality_checks.create(project_quality_check_params.merge(status_updated_by: current_user))
    if @project_quality_check.create_content!(document: params[:qc_file][:attachment], scope: params[:project_quality_check][:qc_type], document_file_name: params[:qc_file][:file_name])
      UserNotifierMailer.project_quality_check_created(@project_quality_check).deliver_now!
      render json: {message: "File Uploaded"}, status: 200
    else
      render json: {message: "File Not Uploaded"}, status: 500
    end


  end

  # PATCH/PUT /project_quality_checks/1
  def update
    if @project_quality_check.update(project_quality_check_params.merge(status_updated_by: current_user))
      render json: @project_quality_check
    else
      render json: @project_quality_check.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_quality_checks/1
  def destroy
    @project_quality_check.destroy
  end

  def qc_history
    if params[:qc_type].present?
      qc = @project.project_quality_checks.where(qc_type: params[:qc_type])
      return render json: qc, status: 200
    else
      return render json: {message: "Please select QC type"}, status: 204
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_quality_check
      @project_quality_check = ProjectQualityCheck.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def project_quality_check_params
      params.require(:project_quality_check).permit(:id, :qc_type, :status, :project_id, :remark)
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

end
