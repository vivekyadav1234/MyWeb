class Api::V1::LeadPrioritiesController < Api::V1::ApiController
  before_action :set_lead_priority, only: [:show, :update, :destroy, :change_priority]
  load_and_authorize_resource

  # GET /lead_priorities
  def index
    @lead_priorities = LeadPriority.highest_to_lowest
    hash_to_render = ActiveModelSerializers::SerializableResource.new(@lead_priorities, 
      each_serializer: LeadPrioritySerializer).serializable_hash.merge(
        select_options: LeadPriority.select_options
      )

    render json: hash_to_render
  end

  # GET /lead_priorities/1
  def show
    render json: @lead_priority
  end

  # POST /lead_priorities
  def create
    @lead_priority = LeadPriority.new(lead_priority_params)

    if @lead_priority.save
      render json: @lead_priority, status: :created
    else
      render json: @lead_priority.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /lead_priorities/1
  def update
    if @lead_priority.update(lead_priority_params)
      render json: @lead_priority
    else
      render json: @lead_priority.errors, status: :unprocessable_entity
    end
  end

  # DELETE /lead_priorities/1
  def destroy
    if @lead_priority.destroy
      render json: {message: 'Lead priority successfully deleted.'}
    else
      render json: @lead_priorities.errors, status: :unprocessable_entity
    end
  end

  def change_priority
    if params[:change_params][:new_priority_number].present?
      new_priority_number = params[:change_params][:new_priority_number]
      if (new_priority_number < 1) || (new_priority_number > LeadPriority.pluck(:priority_number).max)
        return render json: {message: 'New priority number must be between 1 and highest priority number'}, status: 400
      else
        @lead_priority.move_to_number(new_priority_number)
      end
    elsif params[:change_params][:direction] == 'up' && params[:change_params][:steps] == '1'
      @lead_priority.move_up_one_step
    elsif params[:change_params][:direction] == 'up' && params[:change_params][:steps] == 'max'
      @lead_priority.move_to_top
    elsif params[:change_params][:direction] == 'down' && params[:change_params][:steps] == '1'
      @lead_priority.move_down_one_step
    elsif params[:change_params][:direction] == 'down' && params[:change_params][:steps] == 'max'
      @lead_priority.move_to_bottom
    else
      return render json: {message: 'Insufficient or wrong value for parameters direction and steps'}, status: 400
    end
    
    render json: {message: 'Priority successfully change'}
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_lead_priority
    @lead_priority = LeadPriority.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def lead_priority_params
    params.require(:lead_priority).permit(:priority_number, :lead_source_id, :lead_type_id, :lead_campaign_id)
  end
end
