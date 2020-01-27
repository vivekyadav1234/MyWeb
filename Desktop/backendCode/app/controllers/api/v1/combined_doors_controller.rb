class Api::V1::CombinedDoorsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :combined_door, only: [:show, :update, :destroy]
  load_and_authorize_resource :combined_door

  # GET /api/v1/combined_doors
  def index
    @combined_doors = CombinedDoor.all
    render json: @combined_doors
  end

  # GET /api/v1/combined_doors/1
  def show
    render json: @combined_door
  end

  # POST /api/v1/combined_doors
  def create
    @combined_door = CombinedDoor.new(combined_door_params)
    if @combined_door.save
      render json: @combined_door, status: :created
    else
      render json: {message: @combined_door.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/combined_doors/1
  def update
    if @combined_door.update!(combined_door_params)
      render json: @combined_door
    else
      render json: @combined_door.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/combined_doors/1
  def destroy
    @combined_door.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This element cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def combined_door
    @combined_door = CombinedDoor.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def combined_door_params
    params.require(:combined_door).permit(:name, :code, :price, :brand_id)
  end
end
