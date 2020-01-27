class Api::V1::DesignsController < Api::V1::ApiController
  before_action :set_design, only: [:show, :update, :destroy, :approve_design]
  before_action :set_floorplan
  load_and_authorize_resource :floorplan
  load_and_authorize_resource :design, :through => :floorplan
  # GET /api/v1/designs
  def index
    @designs = @floorplan.designs
    render json: @designs
  end

  # GET /api/v1/designs/1
  def show
    render json: @design
  end

  # POST /api/v1/designs
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class DesignSerializer
  def create
    @design = @floorplan.designs.new(design_params)
    @design.designer_id = current_user.id

    # if params[:attachment_file].present?
    #
    #   image = Paperclip.io_adapters.for(params[:attachment_file]['result'])
    #   image.original_filename = params[:attachment_name]
    #   @design.attachment_file = image
    # end

    if @design.save
      render json: @design, status: :created, location: v1_project_floorplan_design_path(@design.floorplan.project.id, @design.floorplan.id, @design)
    else
      render json: {message: @design.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/designs/1
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class DesignSerializer
  def update
    if @design.update(design_params)
      render json: @design
    else
      render json: {message: @design.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/designs/1
  def destroy
    @design.destroy
  end

  def approve_design
    begin
      @design.approve(params[:design][:status_type])
      render json: @design
    rescue
      render json: {message: @design.errors}, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_design
      @design = Project.find(params[:project_id]).floorplans.find(params[:floorplan_id]).designs.find(params[:id])
    end

    def set_floorplan
      @floorplan = Project.find(params[:project_id]).floorplans.find(params[:floorplan_id])
    end

    # Only allow a trusted parameter "white list" through.
    def design_params
      params.require(:design).permit(:name, :details, :designer_id, :attachment_file, :design_type)
    end
end
