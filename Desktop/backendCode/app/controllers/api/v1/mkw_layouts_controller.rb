require "#{Rails.root.join('app','serializers','mkw_layout_job_customization_serializer')}"

class Api::V1::MkwLayoutsController < Api::V1::ApiController
  before_action :set_mkw_layout, only: [:show, :destroy, :customization]
  load_and_authorize_resource :mkw_layout
  
  # GET /api/v1/mkw_layouts
  def index
    @mkw_layouts_to_show = MkwLayout.none
    category_role_users_ids = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:id)
    mkw_layouts_by_category = MkwLayout.where(category: params[:category]).where(created_by_id: category_role_users_ids)
    if current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)
      @mkw_layouts_to_show = mkw_layouts_by_category
    elsif current_user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
      mkw_layouts_by_user = MkwLayout.where(category: params[:category], created_by_id: [current_user.id])
      @mkw_layouts_to_show = mkw_layouts_by_user.or(mkw_layouts_by_category)
    end
        
    paginate json: @mkw_layouts_to_show
  end

  # GET /api/v1/mkw_layouts/1
  def show
    render json: @mkw_layout, serializer: MkwLayoutDetailsSerializer
  end

  def customization
    @modular_job = @mkw_layout.modular_jobs.find(params[:modular_job_id])
    render json: @modular_job, serializer: MkwLayoutJobCustomizationSerializer
  end

  # POST /api/v1/mkw_layouts
  def create
    @mkw_layout = MkwLayout.new(mkw_layout_params)
    @mkw_layout.created_by = current_user
    @mkw_layout.global = current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
    if @mkw_layout.save
      ActiveRecord::Base.transaction do 
        @mkw_layout.import_modules_into_layout(params[:modular_job_ids])
        @mkw_layout.import_appliances_into_layout(params[:appliance_job_ids])
        @mkw_layout.import_extras_into_layout(params[:extra_job_ids])
      end
      render json: @mkw_layout, status: :created
    else
      render json: {message: @mkw_layout.errors}, status: :unprocessable_entity
    end
  end

  # # PATCH/PUT /api/v1/mkw_layouts/1
  # def update
  #   if @mkw_layout.update(mkw_layout_params)
  #     render json: @mkw_layout
  #   else
  #     render json: @mkw_layout.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /api/v1/mkw_layouts/1
  def destroy
    @mkw_layout.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This mkw_layout cannot be deleted as it is in use."}, status: 422
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_mkw_layout
    @mkw_layout = MkwLayout.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def mkw_layout_params
    params.require(:mkw_layout).permit(:category, :name, :remark)
  end
end
