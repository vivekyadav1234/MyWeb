class Api::V1::KitchenCategoriesController < Api::V1::ApiController

  # skip_before_action :authenticate_user!
  before_action :kitchen_category, only: [:show, :update, :destroy, :kitchen_categories_module_type]
  load_and_authorize_resource :kitchen_category

  # GET /api/v1/kitchen_categories
  def index
    @kitchen_categories = KitchenCategory.where.not(id: KitchenCategory.appliance_category)
    render json: @kitchen_categories
  end

  # GET /api/v1/kitchen_categories/1
  def show
    render json: @kitchen_category
  end

  # POST /api/v1/kitchen_categories
  def create
    @kitchen_category = KitchenCategory.new(kitchen_category_params)
    if @kitchen_category.save
      render json: @kitchen_category, status: :created
    else
      render json: {message: @kitchen_category.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/kitchen_categories/1
  def update
    if @kitchen_category.update!(kitchen_category_params)
      render json: @kitchen_category
    else
      render json: @kitchen_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/kitchen_categories/1
  def destroy
    @kitchen_category.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This category cannot be deleted as it is in use."}, status: 422
  end


  def fetch_module_type_mapping
    categories = []
    categories_all = KitchenCategory.all
    categories_all.each do |s|
      category_module = Hash.new
      category_module["id"] = s.id
      category_module["name"] = s.name
      category_module["mapping_for"] = "module_type"
      category_module["mappings"] = s.category_module_types.pluck(:module_type_id)
      categories.push category_module
    end
    render json: {categories: categories}, status: 200
  end

  def add_module_type_mapping
    if params[:categories].present?
      params[:categories].each do |cat_key, values|
        category = KitchenCategory.where(id: cat_key).first
        category.category_module_types.destroy_all if category.present?
        if category.present?
          values.each do |v|
            x=category.category_module_types.where(module_type_id: v).first_or_initialize
            unless x.save
              p "================="
              p x.errors.full_messages
            end
          end
        end
      end
      render json: {message: "Mapping Updated"}, status: 200
    end
  end

  def kitchen_categories_module_type
    all_allowed_module_types = @kitchen_category.allowed_module_types
    if params[:civil_kitchen].to_s == 'true'
      @allowed_module_types = all_allowed_module_types
    else
      @allowed_module_types = ModuleType.remove_custom_shelf_unit(all_allowed_module_types)
    end

    render json: @allowed_module_types
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def kitchen_category
    @kitchen_category = KitchenCategory.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def kitchen_category_params
    params.require(:kitchen_category).permit(:name)
  end

end
