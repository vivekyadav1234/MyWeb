class Api::V1::ModularProductsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_modular_product, only: [:show, :update, :destroy]
  load_and_authorize_resource :modular_product
  
  # GET /api/v1/modular_products
  def index
    @modular_products = ModularProduct.all
    render json: @modular_products
  end

  # GET /api/v1/modular_products/1
  def show
    render json: @modular_product
  end

  # POST /api/v1/modular_products
  def create
    @modular_product = ModularProduct.new(modular_product_params)
    if @modular_product.save
      render json: @modular_product, status: :created
    else
      render json: {message: @modular_product.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/modular_products/1
  def update
    if @modular_product.update(modular_product_params)
      render json: @modular_product
    else
      render json: @modular_product.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/modular_products/1
  def destroy
    @modular_product.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This product cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_modular_product
    @modular_product = ModularProduct.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def modular_product_params
    params.require(:modular_product).permit(:name, :modular_product_type, :space, :price, :section_id,)
  end
end
