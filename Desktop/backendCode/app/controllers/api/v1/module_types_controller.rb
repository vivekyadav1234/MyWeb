class Api::V1::ModuleTypesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_module_type, only: [:show, :update, :destroy, :customizable_dimensions]
  load_and_authorize_resource :module_type

  # GET /api/v1/module_types
  def index
    @module_types =  params[:category].present? ? ModuleType.where(category: params[:category]) : ModuleType.all
    render json: @module_types
  end

  # GET /api/v1/module_types/1
  def show
    render json: @module_type
  end

  # POST /api/v1/module_types
  def create
    @module_type = ModuleType.new(module_type_params)
    if @module_type.save
      render json: @module_type, status: :created
    else
      render json: {message: @module_type.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/module_types/1
  def update
    if @module_type.update(module_type_params)
      render json: @module_type
    else
      render json: @module_type.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/module_types/1
  def destroy
    @module_type.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This module type cannot be deleted as it is in use."}, status: 422
  end

  # get a list of modules for a given module_type
  def list_modules
    if params[:module_type_id].present?
      @module_type = ModuleType.find params[:module_type_id]
    elsif params[:module_type_name].present? && params[:category].present?
      @module_type = ModuleType.find_by(name: params[:module_type_name], category: params[:category])
    else
      return render json: {message: "Insufficient parameters."}, status: 400
    end

    modspace_modules = @module_type.product_modules.modspace.not_hidden
    non_modspace_modules = @module_type.product_modules.non_modspace.not_hidden
    if current_user.has_modspace_pricing?
      @product_modules = non_modspace_modules.or(modspace_modules)
    else
      @product_modules = non_modspace_modules
    end
    render json: @product_modules
  end

  def customizable_dimensions
    render json: @module_type.customizable_dimensions
  end

  # get a list of module_type which belong to the category(s) for Appliances.
  def appliance_types
    @module_types = ModuleType.joins(:kitchen_categories).where(kitchen_categories: { id: KitchenCategory.appliance_category })
    render json: @module_types
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_module_type
    @module_type = ModuleType.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def module_type_params
    params.require(:module_type).permit(:name, :category)
  end
end
