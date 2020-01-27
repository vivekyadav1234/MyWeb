class Api::V1::ShangpinLayoutsController < Api::V1::ApiController
  before_action :set_shangpin_layout, only: [:show, :destroy]
  load_and_authorize_resource :shangpin_layout

  # GET /api/v1/shangpin_layouts
  def index
    @shangpin_layouts_to_show = ShangpinLayout.none
    category_role_users_ids = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:id)
    shangpin_layouts_by_category = ShangpinLayout.where(created_by_id: category_role_users_ids)
    if current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)
      @shangpin_layouts_to_show = shangpin_layouts_by_category
    elsif current_user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
      shangpin_layouts_by_user = ShangpinLayout.where(created_by_id: [current_user.id])
      @shangpin_layouts_to_show = shangpin_layouts_by_user.or(shangpin_layouts_by_category)
    end
        
    paginate json: @shangpin_layouts_to_show
  end

  # GET /api/v1/shangpin_layouts/1
  def show
    render json: @shangpin_layout, serializer: ShangpinLayoutDetailsSerializer
  end

  # POST /api/v1/shangpin_layouts
  def create
    @shangpin_layout = ShangpinLayout.new(shangpin_layout_params)
    @shangpin_layout.created_by = current_user
    if @shangpin_layout.save
      ActiveRecord::Base.transaction do 
        @shangpin_layout.import_shangpin_into_layout(params[:shangpin_job_ids])
      end
      render json: @shangpin_layout, status: :created
    else
      render json: {message: @shangpin_layout.errors}, status: :unprocessable_entity
    end
  end

  # # PATCH/PUT /api/v1/shangpin_layouts/1
  # def update
  #   if @shangpin_layout.update(shangpin_layout_params)
  #     render json: @shangpin_layout
  #   else
  #     render json: @shangpin_layout.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /api/v1/shangpin_layouts/1
  def destroy
    @shangpin_layout.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This shangpin_layout cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_shangpin_layout
    @shangpin_layout = ShangpinLayout.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def shangpin_layout_params
    params.require(:shangpin_layout).permit(:name, :remark)
  end
end
