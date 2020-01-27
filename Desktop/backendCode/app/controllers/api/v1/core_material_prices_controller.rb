class Api::V1::CoreMaterialPricesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_core_material_price, only: [:show,:update,:destroy,:add_finish_mapping,:remove_finish_mapping]
  load_and_authorize_resource :core_material
  
  # GET /api/v1/core_material_prices
  def index
    @core_material_prices = CoreMaterialPrice.all
    render json: @core_material_prices
  end

  # GET /api/v1/core_material_prices/1
  def show
    render json: @core_material_price
  end

  # POST /api/v1/core_material_price_prices
  def create
    @core_material_price = CoreMaterialPrice.new(core_material_price_params)
    if @core_material_price.save
      render json: @core_material_price, status: :created
    else
      render json: {message: @core_material_price.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/core_material_price_prices/1
  def update
    if @core_material_price.update(core_material_price_params)
      render json: @core_material_price
    else
      render json: @core_material_price.errors.full_messages, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/core_material_price_prices/1
  def destroy
    @core_material_price.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This price cannot be deleted as it is in use."}, status: 422
  end

  # add a shutter_finish allowed for this core material (when read as shutter material)
  def add_finish_mapping
    @shutter_finish = params[:shutter_finish_id]
    @core_material_price.add_finish(@shutter_finish)
  end

  # remove a shutter_finish allowed for this core material (when read as shutter material)
  def remove_finish_mapping
    @shutter_finish = params[:shutter_finish_id]
    @core_material_price.remove_finish(@shutter_finish)
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_core_material_price
    @core_material_price = CoreMaterialPrice.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def core_material_price_params
    params.require(:core_material_price).permit(:thickness, :price, :core_material_id, :category)
  end
end
