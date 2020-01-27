class Api::V1::ServiceCategoriesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :service_category, only: [:show, :update, :destroy]
  load_and_authorize_resource :service_category

  # GET /api/v1/service_categories
  def index
    @service_categories = ServiceCategory.all
    render json: @service_categories
  end

  # GET /api/v1/service_categories/1
  def show
    render json: @service_category
  end

  # POST /api/v1/service_categories
  def create
    @service_category = ServiceCategory.new(service_category_params)
    if @service_category.save
      render json: @service_category, status: :created
    else
      render json: {message: @service_category.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/service_categories/1
  def update
    if @service_category.update!(service_category_params)
      render json: @service_category
    else
      render json: @service_category.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/service_categories/1
  def destroy
    @service_category.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This category cannot be deleted as it is in use."}, status: 422
  end


  # def fetch_module_type_mapping
  #   categories = []
  #   categories_all = ServiceCategory.all
  #   categories_all.each do |s|
  #     category_module = Hash.new
  #     category_module["id"] = s.id
  #     category_module["name"] = s.name
  #     category_module["mapping_for"] = "module_type"
  #     category_module["mappings"] = s.category_module_types.pluck(:module_type_id)
  #     categories.push category_module
  #   end
  #   render json: {categories: categories}, status: 200
  # end

  # def add_module_type_mapping
  #   if params[:categories].present?
  #     params[:categories].each do |cat_key, values|
  #       category = ServiceCategory.where(id: cat_key).first
  #       category.category_module_types.destroy_all if category.present?
  #       if category.present?
  #         values.each do |v|
  #           x=category.category_module_types.where(module_type_id: v).first_or_initialize
  #           unless x.save
  #             p "================="
  #             p x.errors.full_messages
  #           end
  #         end
  #       end
  #     end
  #     render json: {message: "Mapping Updated"}, status: 200
  #   end
  # end

  # def service_categories_module_type
  #   render json: @service_category.allowed_module_types
  # end


  private
  # Use callbacks to share common setup or constraints between actions.
  def service_category
    @service_category = ServiceCategory.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def service_category_params
    params.require(:service_category).permit(:name)
  end

end
