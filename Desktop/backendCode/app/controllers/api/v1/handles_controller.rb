class Api::V1::HandlesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_handle, only: [:show, :update, :destroy]
  load_and_authorize_resource :handle

  # GET /api/v1/handles
  def index
    @handles = Handle.not_hidden
    @handles = @handles.arrivae_select if params[:arrivae_select]
    render json: @handles
  end

  # GET /api/v1/handles/1
  def show
    render json: @handle
  end

  # POST /api/v1/handles
  def create
    @handle = Handle.new(handle_params)
    if @handle.save!
      render json: @handle, status: :created
    else
      render json: {message: @handle.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/handles/1
  def update
    if @handle.update(handle_params)
      render json: @handle
    else
      render json: @handle.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/handles/1
  def destroy
    @handle.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This handle cannot be deleted as it is in use."}, status: 422
  end

  # get data needed for filters in Handle selector
  def filter_data
    h = Hash.new
    @handles = Handle.none
    # Don't include handles without mrp
    if params[:arrivae_select]
      @handles = Handle.not_hidden.arrivae_select.where(category: params[:category]).where.not(mrp: nil)
    else
      @handles = Handle.not_hidden.where(category: params[:category]).where.not(mrp: nil)
    end
    h[:makes] = @handles.pluck(:make).compact.uniq
    h[:handle_class] = Handle::ALLOWED_HANDLE_CLASSES
    h[:min_mrp] = @handles.pluck(:mrp).compact.min
    h[:max_mrp] = @handles.pluck(:mrp).compact.max
    render json: h
  end

  def filter_handles
    shutter_finish = ShutterFinish.find_by(name: params[:shutter_finish_name])
    product_module = ProductModule.find_by_id params[:product_module_id]
    non_modspace_handles = Handle.non_modspace.not_hidden.where.not(mrp: nil).handles_by_module_finish(params[:category], params[:handle_type], shutter_finish, product_module)
    modspace_handles = Handle.modspace.not_hidden.where.not(mrp: nil).handles_by_module_finish(params[:category], params[:handle_type], shutter_finish, product_module)
    # Don't include handles without mrp
    if current_user.has_modspace_pricing?
      @handles = non_modspace_handles.or(modspace_handles)
    else      
      @handles = non_modspace_handles
    end
    @handles = filtered_handles(@handles)

    paginate json: @handles, per_page: 10
  end

  # # for given properties, return a list of handles (for kitchen only)
  # def handle_list
  #   hash = Hash.new
  #   shutter_finish = ShutterFinish.find_by(name: params[:shutter_finish])
  #   product_module = ProductModule.find_by_id params[:product_module_id]
  #   aluminium_profile_shutter_flag = ProductModule.aluminium_profile_shutter.include?(product_module)
    
  #   if aluminium_profile_shutter_flag
  #     hash[:handles] = Handle.kitchen.special.where.not(code: "Top Insert Handle").map{|handle| 
  #       HandleSerializer.new(handle).serializable_hash
  #     }
  #     hash.merge(selected: Handle.find_by(code: "G Section Handle").id) if aluminium_profile_shutter_flag
  #   elsif ShutterFinish.back_painted_glass.include?(shutter_finish)
  #     hash[:handles] = Handle.kitchen.special.map{|handle| 
  #       HandleSerializer.new(handle).serializable_hash
  #     }
  #   else
  #     hash[:handles] = Handle.kitchen.map{|handle| 
  #       HandleSerializer.new(handle).serializable_hash
  #     }
  #   end

  #   render json: hash
  # end

  private
  def filtered_handles(handles_to_filter)
    if params[:search_string].present? || params[:filter_params].present?
      filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      handles_to_filter.search(params[:search_string].to_s, filter_params)
    else
      handles_to_filter
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_handle
    @handle = Handle.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def handle_params
    params.require(:handle).permit(:code, :handle_type, :price, :handle_image, :category, :mrp, :vendor_sku, 
      :spec, :make, :unit, :arrivae_select, :handle_class)
  end
end
