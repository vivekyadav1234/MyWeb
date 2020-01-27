class Api::V1::CarcassElementTypesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_carcass_element_type, only: [:show, :update, :destroy]
  load_and_authorize_resource :carcass_element_type

  # GET /api/v1/carcass_element_types
  def index
    @carcass_element_types = params[:category].present? ?  CarcassElementType.where(category: params[:category]) : CarcassElementType.all
    render json: @carcass_element_types
  end

  # GET /api/v1/carcass_element_types/1
  def show
    render json: @carcass_element_type
  end

  # POST /api/v1/carcass_element_types
  def create
    @carcass_element_type = CarcassElementType.new(carcass_element_type_params)
    if @carcass_element_type.save
      render json: @carcass_element_type, status: :created
    else
      render json: {message: @carcass_element_type.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/carcass_element_types/1
  def update
    if @carcass_element_type.update(carcass_element_type_params)
      render json: @carcass_element_type
    else
      render json: @carcass_element_type.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/carcass_element_types/1
  def destroy
    @carcass_element_type.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This type cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_carcass_element_type
    @carcass_element_type = CarcassElementType.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def carcass_element_type_params
    params.require(:carcass_element_type).permit(:name, :category, :aluminium, :glass)
  end
end
