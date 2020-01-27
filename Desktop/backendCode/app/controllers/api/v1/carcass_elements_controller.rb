class Api::V1::CarcassElementsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_carcass_element, only: [:show, :update, :destroy]
  load_and_authorize_resource :carcass_element

  # GET /api/v1/carcass_elements
  def index
    @carcass_elements = params[:category].present? ?  CarcassElement.where(category: params[:category]) : CarcassElement.all
    @carcass_elements = params[:type].present? ? @carcass_elements.where(carcass_element_type_id: params[:type]) : @carcass_elements 
    render json: @carcass_elements
  end

  # GET /api/v1/carcass_elements/1
  def show
    render json: @carcass_element
  end

  # POST /api/v1/carcass_elements
  def create
    @carcass_element = CarcassElement.new(carcass_element_params)
    if @carcass_element.save
      render json: @carcass_element, status: :created
    else
      render json: {message: @carcass_element.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/carcass_elements/1
  def update
    if @carcass_element.update(carcass_element_params)
      render json: @carcass_element
    else
      render json: @carcass_element.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/carcass_elements/1
  def destroy
    @carcass_element.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This element cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_carcass_element
    @carcass_element = CarcassElement.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def carcass_element_params
    params.require(:carcass_element).permit(:code, :width, :depth, :height, :length, :breadth,
      :thickness, :edge_band_thickness, :area_sqft, :quantity, :category, :carcass_element_type_id)
  end
end
