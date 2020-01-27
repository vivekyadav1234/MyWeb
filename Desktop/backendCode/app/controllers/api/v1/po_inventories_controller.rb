class Api::V1::PoInventoriesController < Api::V1::ApiController
  # load_and_authorize_resource :wip_sli
  def index
  	@inventories = PoInventory.all
    @inventories = @inventories.search_inventory(params[:location]) if params[:location].present?
    if @inventories.present?
  	   render json: PoInventorySerializer.new(@inventories).serializable_hash, status: 200
    else
      render json: {message: "No Data Found"}, status: 200
    end
  end

  def update_min_stock_and_tat
    inventory = PoInventory.find(params[:id])
    inventory.min_stock = params[:min_stock] if params[:min_stock].present?
    inventory.tat = params[:tat] if params[:tat].present?
    if inventory.save
      return render json: {messsage: "Inventory Updated"}, status: 200
    else
      render json: {message: inventory.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def inventory_locations
    locations = PoInventory.pluck(:location).uniq
    locations = locations.map{|l| l&.split(',')&.first}
    locations = locations.compact
    render json: {locations: locations}, status: 200
  end

end
