class Api::V1::EdgeBandingShadesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_edge_banding_shade, only: [:show, :update, :destroy]
  load_and_authorize_resource :edge_banding_shade

  # GET /edge_banding_shades
  def index
    @edge_banding_shades = EdgeBandingShade.all

    render json: @edge_banding_shades
  end

  # GET /edge_banding_shades/1
  def show
    render json: @edge_banding_shade
  end

  # POST /edge_banding_shades
  def create
    @edge_banding_shade = EdgeBandingShade.new(edge_banding_shade_params)

    if @edge_banding_shade.save
      render json: @edge_banding_shade, status: :created
    else
      render json: @edge_banding_shade.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /edge_banding_shades/1
  def update
    if @edge_banding_shade.update(edge_banding_shade_params)
      render json: @edge_banding_shade
    else
      render json: @edge_banding_shade.errors, status: :unprocessable_entity
    end
  end

  # DELETE /edge_banding_shades/1
  def destroy
    @edge_banding_shade.destroy
  end

  # def fetch_edge_banding_shades_mapping
  #   render json: {shutter_finish: @edge_banding_shade.shuter_finish}, status: 200
  # end

  # def add_edge_banding_shades_mapping
  #   if params[:edge_banding_shades].present?
  #     params[:edge_banding_shades].each do |shade_id, value|
  #       shade = EdgeBandingShade.find_by_id(shade_id)
  #       if shade.present?
  #         finish = ShutterFinish.find_by_id(value)
  #         shade.update!(shutter_finish: finish)
  #       end
  #     end
  #   end
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_edge_banding_shade
      @edge_banding_shade = EdgeBandingShade.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def edge_banding_shade_params
      params.require(:edge_banding_shade).permit(:name, :code, :shade_image)
    end
end
