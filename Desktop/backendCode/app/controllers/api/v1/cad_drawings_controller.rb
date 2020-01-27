class Api::V1::CadDrawingsController < Api::V1::ApiController
  before_action :set_cad_drawing, only: [:show, :update, :destroy, :update_panel]
  before_action :set_project, only: [:index,:create]
  load_and_authorize_resource :cad_drawing

  # GET /cad_drawings
  def index
    @cad_drawings = @project.cad_drawings.all

    render json: @cad_drawings
  end

  # GET /cad_drawings/1
  def show
    render json: @cad_drawing
  end

  # POST /cad_drawings
  def create
    @cad_drawing = @project.cad_drawings.new(cad_drawing_params)
    @cad_drawing.cad_drawing_file_name = params[:cad_drawing][:file_name]
    if @cad_drawing.save
      render json: @cad_drawing, status: :created
    else
      render json: @cad_drawing.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /cad_drawings/1
  def update
    if @cad_drawing.update(cad_drawing_params)
      @cad_drawing.update(cad_drawing_file_name: params[:cad_drawing][:file_name])
      render json: @cad_drawing
    else
      render json: @cad_drawing.errors, status: :unprocessable_entity
    end
  end

  # DELETE /cad_drawings/1
  def destroy
    if @cad_drawing.project_handovers.present?
      render json: {message: "file is in handover state"}, status: :unprocessable_entity
    else
      @cad_drawing.destroy
    end
  end

  def update_panel
    if @cad_drawing.update!(panel: params[:panel])
      render json: {message: "File updated"}, status: 200
    else
      render json: {message: @cad_drawing.errors.full_messages}, status: 422
    end
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cad_drawing
      @cad_drawing = CadDrawing.find(params[:id])
    end

    def set_project
      @project = Project.find params[:project_id]
    end

    # Only allow a trusted parameter "white list" through.
    def cad_drawing_params
      params.require(:cad_drawing).permit(:project_id, :cad_drawing, :name, :panel)
    end
end
