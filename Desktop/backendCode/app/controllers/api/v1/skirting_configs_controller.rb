class Api::V1::SkirtingConfigsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_skirting_config, only: [:show, :update, :destroy]
  load_and_authorize_resource :skirting_config
  
  # GET /api/v1/skirting_configs
  def index
    @skirting_configs = SkirtingConfig.all
    render json: @skirting_configs
  end

  # GET /api/v1/skirting_configs/1
  def show
    render json: @skirting_config
  end

  # POST /api/v1/skirting_configs
  def create
    @skirting_config = SkirtingConfig.new(skirting_config_params)
    if @skirting_config.save
      render json: @skirting_config, status: :created
    else
      render json: {message: @skirting_config.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/skirting_configs/1
  def update
    if @skirting_config.update(skirting_config_params)
      render json: @skirting_config
    else
      render json: @skirting_config.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/skirting_configs/1
  def destroy
    @skirting_config.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This skirting config cannot be deleted as it is in use."}, status: 422
  end

  # for a given skirting_type, provide a list of skirting_heights
  def list_configs
    if params[:skirting_type].present? || current_user.has_modspace_pricing?
      @skirting_types = SkirtingConfig.where(skirting_type: params[:skirting_type])
    else
      return render json: {message: "Insufficient parameters."}, status: 400
    end

    if @skirting_types.exists?
      render json: @skirting_types
    else
      render json: @skirting_types.to_json  #to handle error
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_skirting_config
    @skirting_config = SkirtingConfig.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def skirting_config_params
    params.require(:skirting_config).permit(:skirting_type, :skirting_height, :price)
  end
end
