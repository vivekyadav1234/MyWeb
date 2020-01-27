class Api::V1::HardwareElementsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_hardware_element, only: [:show, :update, :destroy]
  load_and_authorize_resource :hardware_element

  # GET /api/v1/hardware_elements
  def index
    @hardware_elements = params[:category].present? ?  HardwareElement.where(category: params[:category]) :HardwareElement.all
    render json: @hardware_elements
  end

  # GET /api/v1/hardware_elements/1
  def show
    render json: @hardware_element
  end

  # POST /api/v1/hardware_elements
  def create
    @hardware_element = HardwareElement.new(hardware_element_params)
    if @hardware_element.save
      render json: @hardware_element, status: :created
    else
      render json: {message: @hardware_element.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/hardware_elements/1
  def update
    if @hardware_element.update(hardware_element_params)
      render json: @hardware_element
    else
      render json: @hardware_element.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/hardware_elements/1
  def destroy
    @hardware_element.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This element cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_hardware_element
    @hardware_element = HardwareElement.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def hardware_element_params
    params.require(:hardware_element).permit(:code, :category, :unit, :price, :product_module_id,
      :brand_id, :quantity, :hardware_type_id, :hardware_element_type_id)
  end
end
