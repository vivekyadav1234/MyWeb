class Api::V1::HardwareTypesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_hardware_type, only: [:show, :update, :destroy]
  load_and_authorize_resource :hardware_type
  
  # GET /api/v1/hardware_types
  def index
    @hardware_types = HardwareType.all
    render json: @hardware_types
  end

  # GET /api/v1/hardware_types/1
  def show
    render json: @hardware_type
  end

  # POST /api/v1/hardware_types
  def create
    @hardware_type = HardwareType.new(hardware_type_params)
    if @hardware_type.save
      render json: @hardware_type, status: :created
    else
      render json: {message: @hardware_type.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/hardware_types/1
  def update
    if @hardware_type.update(hardware_type_params)
      render json: @hardware_type
    else
      render json: @hardware_type.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/hardware_types/1
  def destroy
    @hardware_type.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This type cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_hardware_type
    @hardware_type = HardwareType.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def hardware_type_params
    params.require(:hardware_type).permit(:name)
  end
end
