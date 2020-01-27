class Api::V1::BrandsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_brand, only: [:show, :update, :destroy]
  load_and_authorize_resource :brand

  # GET /api/v1/brands
  def index
    if params[:type] == "addon"
      @brands = Brand.addon_brands
    elsif params[:type] == "hardware"
      @brands = Brand.hardware_brands
    else
      @brands = Brand.all
    end

    render json: @brands
  end

  # GET /api/v1/brands/1
  def show
    render json: @brand
  end

  # POST /api/v1/brands
  def create
    @brand = Brand.new(brand_params)
    if @brand.save
      render json: @brand, status: :created
    else
      render json: {message: @brand.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/brands/1
  def update
    if @brand.update(brand_params)
      render json: @brand
    else
      render json: @brand.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/brands/1
  def destroy
    @brand.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This brand cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_brand
    @brand = Brand.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def brand_params
    params.require(:brand).permit(:name, :hardware, :addon)
  end
end
