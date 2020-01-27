require "#{Rails.root.join('app', 'serializers', 'tag_serializer')}"
class Api::V1::TagsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_tag, only: [:show, :update, :destroy, :brand_list]
  load_and_authorize_resource except: [:all_ranges, :all_spaces]

  # GET /api/v1/tag_tags
  def index
    @tag_tags =  params[:type].present? ? Tag.where(tag_type: params[:type]) : Tag.all
    render json: @tag_tags
  end

  # GET /api/v1/tag_tags/1
  def show
    render json: @tag
  end

  # POST /api/v1/tag_tags
  def create
    @tag = Tag.new(tag_params)
    if @tag.save
      render json: @tag, status: :created
    else
      render json: {message: @tag.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tag_tags/1
  def update
    if @tag.update(tag_params)
      render json: @tag
    else
      render json: {message: @tag.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tag_tags/1
  def destroy
    @tag.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This tag cannot be deleted as it is in use."}, status: 422
  end

  # for a given category and tag code, send the brands available
  def brand_list
    brand_ids = Tag.where(code: @tag.code, category: @tag.category).pluck(:brand_id)
    @brands = Brand.where(id: brand_ids)

    render json: @brands, each_serializer: BrandSerializer
  end

  def all_ranges
    render json: Tag.non_panel_ranges, each_serializer: TagWithProductCountSerializer
  end

  # get all tags for spaces belonging to Loose Furniture
  def all_spaces
    render json: Tag.loose_spaces, each_serializer: TagWithProductCountSerializer
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_tag
    @tag = Tag.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def tag_params
    params.require(:tag).permit(:name, :tag_type,
      tag_mappings_attributes: [:id, :tag_id])
  end
end
