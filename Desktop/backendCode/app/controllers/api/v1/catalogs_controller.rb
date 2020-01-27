class Api::V1::CatalogsController < Api::V1::ApiController
  before_action :check_if_authorized!
  before_action :set_catalog_type

  def megamenu
    @marketplace_segments = CatalogSegment.marketplace.of_catalog_type(@catalog_type)
    @segments = CatalogSegment.of_catalog_type(@catalog_type).where.not(id: @marketplace_segments)

    # Don't paginate - all segments need to be shown.
    hash_to_render = Hash.new
    hash_to_render = ActiveModelSerializers::SerializableResource.new(@segments, each_serializer: SegmentDetailedSerializer, catalog_type: @catalog_type).serializable_hash
    hash_to_render[:marketplace] = @marketplace_segments.map do |category_segment|
      SegmentDetailedSerializer.new(category_segment, catalog_type: @catalog_type).serializable_hash
    end

    render json: hash_to_render
  end

  def segment_show
    @segment = CatalogSegment.find params[:segment_id]
    @categories = paginate @segment.catalog_categories.of_catalog_type(@catalog_type)
    hash_to_render = ActiveModelSerializers::SerializableResource.new(@categories, each_serializer: CategoryHighlightSerializer, catalog_type: @catalog_type).serializable_hash
    hash_to_render[:breadcrumb] = @segment.breadcrumb

    render json: hash_to_render
  end

  def category_show
    @category = CatalogCategory.find params[:category_id]
    @subcategories = paginate @category.catalog_subcategories.of_catalog_type(@catalog_type)
    hash_to_render = ActiveModelSerializers::SerializableResource.new(@subcategories, each_serializer: SubcategoryHighlightSerializer, catalog_type: @catalog_type).serializable_hash
    hash_to_render[:breadcrumb] = @category.breadcrumb

    render json: hash_to_render
  end

  private
  def check_if_authorized!
    return false unless current_user.has_any_role?(:admin, :category_head, :community_manager, :designer, *Role::CATEGORY_ROLES)
  end

  def set_catalog_type
    @catalog_type = current_user&.catalog_type || Product::DEFAULT_CATALOG_TYPE
  end
end
