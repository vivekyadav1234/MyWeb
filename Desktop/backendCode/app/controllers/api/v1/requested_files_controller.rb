class Api::V1::RequestedFilesController < ApplicationController
  before_action :set_project
  before_action :set_requested_file, only: [:show, :update, :destroy, :resolve_request]

  # GET /requested_files
  def index
    requested_files = @project.requested_files

    render json: requested_files
  end

  # GET /requested_files/1
  def show
    render json: @requested_file
  end

  # POST /requested_files
  def create
    requested_file = @project.requested_files.new(requested_file_params.merge(raised_by_id: current_user.id))
    UserNotifierMailer.additional_file_requested(@project, requested_file).deliver
    if requested_file.save
      render json: {message: "Request Sent"}, status: 200
    else
      render json: requested_file.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /requested_files/1
  def update
    if @requested_file.update(requested_file_params)
      render json: @requested_file
    else
      render json: @requested_file.errors, status: :unprocessable_entity
    end
  end

  # DELETE /requested_files/1
  def destroy
    @requested_file.destroy
  end

  def resolve_request
    if @requested_file.update!(resolved: true)
      UserNotifierMailer.additional_request_resolved(@requested_file).deliver
      render json: {message: "Request Resolved"}, status: 200
    else
      render json: {message: @requested_file.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private
    def set_project
      @project = Project.find(params[:project_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_requested_file
      @requested_file = RequestedFile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def requested_file_params
      params.require(:requested_file).permit(:raised_by_id, :resolved, :project_id, :remarks)
    end
end
