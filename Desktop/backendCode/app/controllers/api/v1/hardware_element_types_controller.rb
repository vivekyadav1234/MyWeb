class Api::V1::HardwareElementTypesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :hardware_element_type, only: [:show, :update, :destroy]
  load_and_authorize_resource :hardware_element_type

  # GET /api/v1/hardware_element_types
  def index
    @hardware_element_types = params[:category].present? ? HardwareElementType.where(category: params[:category]) : HardwareElementType.all
    render json: @hardware_element_types
  end

  # GET /api/v1/hardware_element_types/1
  def show
    render json: @hardware_element_type
  end

  # POST /api/v1/hardware_element_types
  def create
    @hardware_element_type = HardwareElementType.new(hardware_element_type_params)
    if @hardware_element_type.save
      render json: @hardware_element_type, status: :created
    else
      render json: {message: @hardware_element_type.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/hardware_element_types/1
  def update
    if @hardware_element_type.update!(hardware_element_type_params)
      render json: @hardware_element_type
    else
      render json: @hardware_element_type.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/hardware_element_types/1
  def destroy
    @hardware_element_type.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This type cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def hardware_element_type
    @hardware_element_type = HardwareElementType.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def hardware_element_type_params
    params.require(:hardware_element_type).permit(:name, :category)
  end
end
