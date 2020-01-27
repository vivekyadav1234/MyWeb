class Api::V1::KitchenAppliancesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :kitchen_appliance, only: [:show, :update, :destroy]
  load_and_authorize_resource :kitchen_appliance

  # GET /api/v1/kitchen_appliances
  def index
    @kitchen_appliances = KitchenAppliance.none
    if params[:module_type_id].present?
      @kitchen_appliances = KitchenAppliance.where(module_type_id: params[:module_type_id])
    else
      @kitchen_appliances = KitchenAppliance.all
    end
    @kitchen_appliances = @kitchen_appliances.arrivae_select if params[:arrivae_select]
    render json: @kitchen_appliances
  end

  # GET /api/v1/kitchen_appliances/1
  def show
    render json: @kitchen_appliance
  end

  # POST /api/v1/kitchen_appliances
  def create
    @kitchen_appliance = KitchenAppliance.new(kitchen_appliance_params)
    if @kitchen_appliance.save
      render json: @kitchen_appliance, status: :created
    else
      render json: {message: @kitchen_appliance.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/kitchen_appliances/1
  def update
    if @kitchen_appliance.update!(kitchen_appliance_params)
      render json: @kitchen_appliance
    else
      render json: @kitchen_appliance.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/kitchen_appliances/1
  def destroy
    @kitchen_appliance.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This appliance cannot be deleted as it is in use."}, status: 422
  end

  # get data needed for filters in KitchenAppliance selector
  def filter_data
    h = Hash.new
    if params[:module_type_id].present?
      @kitchen_appliances = KitchenAppliance.where(module_type_id: params[:module_type_id])
    else
      @kitchen_appliances = KitchenAppliance.all
    end
    @kitchen_appliances = @kitchen_appliances.arrivae_select if params[:arrivae_select]
    h[:makes] = @kitchen_appliances.pluck(:make).compact.uniq
    kitchen_category = KitchenCategory.appliance_category.take
    h[:types] = kitchen_category.allowed_module_types.map{|module_type| module_type.attributes.slice('id', 'name')}
    h[:min_mrp] = @kitchen_appliances.pluck(:mrp).compact.min
    h[:max_mrp] = @kitchen_appliances.pluck(:mrp).compact.max
    render json: h
  end

  def filter_appliances
    if params[:module_type_id].present?
      @kitchen_appliances = KitchenAppliance.where(module_type_id: params[:module_type_id])
    else
      @kitchen_appliances = KitchenAppliance.all
    end
    @kitchen_appliances = filter_kitchen_appliances(@kitchen_appliances)

    paginate json: @kitchen_appliances, per_page: 10
  end

  private
  def filter_kitchen_appliances(kitchen_appliances_to_filter)
    if params[:search_string].present? || params[:filter_params].present?
      filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      kitchen_appliances_to_filter.search(params[:search_string].to_s, filter_params)
    else
      kitchen_appliances_to_filter
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def kitchen_appliance
    @kitchen_appliance = KitchenAppliance.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def kitchen_appliance_params
    params.require(:kitchen_appliance).permit(:name, :code, :make, :price, :appliance_image, 
      :module_type_id, :vendor_sku, :specifications, :warranty, :vendor_sku, 
      :specifications, :warranty, :mrp, :arrivae_select)
  end
end
