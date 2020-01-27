class Api::V1::ServiceSubcategoriesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :service_subcategory, only: [:show, :update, :destroy]
  load_and_authorize_resource :service_subcategory

  # GET /api/v1/service_subcategories
  def index
    if params[:service_category_id].present?
      @service_subcategories = ServiceSubcategory.where(service_category_id: params[:service_category_id]).not_hidden
    else
      @service_subcategories = ServiceSubcategory.not_hidden
    end
    render json: @service_subcategories
  end

  # GET /api/v1/service_subcategories/1
  def show
    render json: @service_subcategory
  end

  # POST /api/v1/service_subcategories
  def create
    @service_subcategory = ServiceSubcategory.new(service_subcategory_params)
    if @service_subcategory.save
      render json: @service_subcategory, status: :created
    else
      render json: {message: @service_subcategory.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/service_subcategories/1
  def update
    if @service_subcategory.update!(service_subcategory_params)
      render json: @service_subcategory
    else
      render json: @service_subcategory.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/service_subcategories/1
  def destroy
    @service_subcategory.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This category cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def service_subcategory
    @service_subcategory = ServiceSubcategory.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def service_subcategory_params
    params.require(:service_subcategory).permit(:name, :service_category_id)
  end
end
