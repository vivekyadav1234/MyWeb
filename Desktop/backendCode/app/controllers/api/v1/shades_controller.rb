class Api::V1::ShadesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_shade, only: [:show, :update, :destroy, :matching_edge_banding_shade]
  load_and_authorize_resource :shade
  
  # GET /api/v1/shades
  def index
    @shades = Shade.not_hidden
    @shades = @shades.arrivae_select if params[:arrivae_select]
    render json: @shades
  end

  # GET /api/v1/shades/1
  def show
    render json: @shade
  end

  # POST /api/v1/shades
  def create
    @shade = Shade.new(shade_params)
    if @shade.save
      render json: @shade, status: :created
    else
      render json: {message: @shade.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/shades/1
  def update
    if @shade.update(shade_params)
      render json: @shade
    else
      render json: @shade.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shades/1
  def destroy
    @shade.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This shade cannot be deleted as it is in use."}, status: 422
  end

  def matching_edge_banding_shade
    @matching_shade =  @shade.edge_banding_shade

    if @matching_shade.present?
      render json: @matching_shade, serializer: EdgeBandingShadeSerializer
    else
      render json: @matching_shade
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_shade
    @shade = Shade.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def shade_params
    params.require(:shade).permit(:name, :code, :shade_image, :edge_banding_shade_id, :arrivae_select)
  end
end
