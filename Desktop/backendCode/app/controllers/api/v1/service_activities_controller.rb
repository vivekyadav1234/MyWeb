class Api::V1::ServiceActivitiesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :service_activity, only: [:show, :update, :destroy]
  load_and_authorize_resource :service_activity

  # GET /api/v1/service_activities
  def index
    if params[:service_subcategory_id].present?
      @service_activities = ServiceActivity.where(service_subcategory_id: params[:service_subcategory_id])
    else
      @service_activities = ServiceActivity.all
    end
    render json: @service_activities
  end

  # GET /api/v1/service_activities/1
  def show
    render json: @service_activity
  end

  # POST /api/v1/service_activities
  def create
    @service_activity = ServiceActivity.new(service_activity_params)
    if @service_activity.save
      render json: @service_activity, status: :created
    else
      render json: {message: @service_activity.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/service_activities/1
  def update
    if @service_activity.update!(service_activity_params)
      render json: @service_activity
    else
      render json: @service_activity.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/service_activities/1
  def destroy
    @service_activity.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This activity cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def service_activity
    @service_activity = ServiceActivity.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def service_activity_params
    params.require(:service_activity).permit(:name, :code, :unit, :default_base_price, 
      :installation_price, :service_category_id, :service_subcategory_id, :description)
  end
end
