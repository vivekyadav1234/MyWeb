class Api::V1::AddonsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_addon, only: [:show, :update, :destroy, :brand_list, :update_tags]
  load_and_authorize_resource :addon

  # GET /api/v1/addons
  def index
    @addons =  params[:category].present? ? Addon.where(category: params[:category]) : Addon.all

    @addons = filter_addons(@addons)
    if params[:category] == 'kitchen'
      @addon_combinations = AddonCombination.all
    else
      @addon_combinations = AddonCombination.none
    end
    addon_in_combination_ids = @addon_combinations.map{|addon_combination| addon_combination.addons.pluck(:id)}.flatten.uniq
    @addons_in_combinations = filter_addons(Addon.where(id: addon_in_combination_ids))
    @addon_combinations = AddonCombination.joins(:addons).where(addons: {id: @addons_in_combinations}).distinct
    addon_array = []
    if @filter_params[:addon_type].to_s.in?(['', 'combination', 'both'])
      addon_array << @addon_combinations.map{|addon_combination| AddonCombinationSerializer.new(addon_combination).serializable_hash}
    end
    if @filter_params[:addon_type].to_s.in?(['', 'single', 'both'])
      addon_array << @addons.map{|addon| AddonSerializer.new(addon).serializable_hash}
    end

    paginated_array = paginate addon_array.flatten
    render json: {addons: paginated_array}
  end

  # Return all addons which are marked as extras.
  # As of 06-09-2019, even wardrobes can have extra addons. This was added for Modspace, but can be extended to others later.
  # Also, as of 09-09-2019, AddonCombination can also be extra.
  def extras
    @addons = Addon.where(category: params[:category]).extra.not_hidden
    # As of now, we want all AddonCombination to be available as extras to non-Modspace CMs.
    # Also, only MK has combinations, not MW.
    if current_user.has_modspace_pricing? || params[:category] == 'wardrobe'
      @addon_combinations = AddonCombination.none 
    else
      @addon_combinations = AddonCombination.extra
    end
    @addons = filter_addons(@addons, addon_filter_options)
    addon_in_combination_ids = @addon_combinations.map{|addon_combination| addon_combination.addons.pluck(:id)}.flatten.uniq
    @addons_in_combinations = filter_addons(Addon.where(id: addon_in_combination_ids))
    @addon_combinations = AddonCombination.joins(:addons).where(addons: {id: @addons_in_combinations}).distinct
    addon_array = []

    if @filter_params[:addon_type].to_s.in?(['', 'combination', 'both'])
      addon_array << @addon_combinations.map{|addon_combination| AddonCombinationSerializer.new(addon_combination).serializable_hash}
    end
    if @filter_params[:addon_type].to_s.in?(['', 'single', 'both'])
      addon_array << @addons.map{|addon| AddonSerializer.new(addon).serializable_hash}
    end

    paginated_array = paginate addon_array.flatten
    render json: {addons: paginated_array}
  end

  # GET /api/v1/addons/1
  def show
    render json: @addon
  end

  # POST /api/v1/addons
  def create
    @addon = Addon.new(addon_params)
    if @addon.save
      update_tag_mappings
      render json: @addon, status: :created
    else
      render json: {message: @addon.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/addons/1
  def update
    if @addon.update(addon_params)
      update_tag_mappings
      render json: @addon
    else
      render json: {message: @addon.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/addons/1
  def destroy
    @addon.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This addon cannot be deleted as it is in use."}, status: 422
  end

  # for a given category and addon code, send the brands available
  def brand_list
    brand_ids = Addon.where(code: @addon.code, category: @addon.category).pluck(:brand_id)
    @brands = Brand.where(id: brand_ids)

    render json: @brands, each_serializer: BrandSerializer
  end

  def update_tags
    @addon.tags = []
    tags = Tag.addons.where(id: params[:addon_tags])
    tags.map{|tag| @addon.tags << tag} unless params[:addon_tags].nil?

    render json: @addon
  end

  def optional_addons_for_addons
    # byebug
    @kitchen_addon_slot = KitchenAddonSlot.find_by(product_module_id: params[:product_module_id], slot_name: params[:slot_name])
    unless @kitchen_addon_slot.present?
      return render json: {message: "No such kitchen addon slot."}, status: 404
    end

    # Here addon_type and addon_id are those of the mandatory addon already added to the module's given slot.
    # In filter_params, :addon_type will refer to the filtered allowed addons/combinations.
    if params[:addon_type] == 'single'
      @kitchen_module_addon_mapping = @kitchen_addon_slot.kitchen_module_addon_mappings.find_by(addon_id: params[:addon_id])
    elsif params[:addon_type] == 'combination'
      @kitchen_module_addon_mapping = @kitchen_addon_slot.kitchen_module_addon_mappings.find_by(addon_combination_id: params[:addon_id])
    else
      return render json: {message: "addon_type must be either \'single\' or \'combination\'."}, status: 400
    end

    unless @kitchen_module_addon_mapping.present?
      return render json: {message: "Optional Addons for Addons can only be chosen after selecting a Mandatory Addon for this slot."}, status: :unprocessable_entity
    end

    @allowed_addons = filter_addons(@kitchen_module_addon_mapping.allowed_addons, addon_filter_options)
    @allowed_combinations = @kitchen_module_addon_mapping.allowed_addon_combinations
    addon_in_combination_ids = @allowed_combinations.map{|addon_combination| addon_combination.addons.pluck(:id)}.flatten.uniq
    @addons_in_combinations = filter_addons(Addon.where(id: addon_in_combination_ids), addon_filter_options)
    @compulsory_combinations = @allowed_combinations.joins(:addons).where(addons: {id: @addons_in_combinations}).distinct
    addon_array = []
    if @filter_params[:addon_type].to_s.in?(['', 'combination', 'both'])
      addon_array << @compulsory_combinations.map{|addon_combination| AddonCombinationSerializer.new(addon_combination).serializable_hash}
    end
    if @filter_params[:addon_type].to_s.in?(['', 'single', 'both'])
      addon_array << @allowed_addons.map{|addon| AddonSerializer.new(addon).serializable_hash}
    end

    paginated_array = paginate addon_array.flatten
    render json: {addons: paginated_array}
  end

  # return a filtered list of compulsory addons for a slot of a product module
  # kitchen only
  def compulsory_addons
    @kitchen_addon_slot = KitchenAddonSlot.find_by(product_module_id: params[:product_module_id], slot_name: params[:slot_name])
    # unless @kitchen_addon_slot.present?
    #   return render json: {message: "No such kitchen addon slot."}, status: 404
    # end

    if @kitchen_addon_slot.present?
      # byebug
      @compulsory_addons = filter_addons(@kitchen_addon_slot.addons, addon_filter_options)
      @compulsory_combinations = @kitchen_addon_slot.addon_combinations
      addon_in_combination_ids = @compulsory_combinations.map{|addon_combination| addon_combination.addons.pluck(:id)}.flatten.uniq
      @addons_in_combinations = filter_addons(Addon.where(id: addon_in_combination_ids), addon_filter_options)
      @compulsory_combinations = @compulsory_combinations.joins(:addons).where(addons: {id: @addons_in_combinations}).distinct
      addon_array = []
      if @filter_params[:addon_type].to_s.in?(['', 'combination', 'both'])
        addon_array << @compulsory_combinations.map{|addon_combination| AddonCombinationSerializer.new(addon_combination).serializable_hash}
      end
      if @filter_params[:addon_type].to_s.in?(['', 'single', 'both'])
        addon_array << @compulsory_addons.map{|addon| AddonSerializer.new(addon).serializable_hash}
      end
      paginated_array = paginate addon_array.flatten
      render json: {addons: paginated_array}
    else
      @compulsory_addons = Hash.new
      @compulsory_addons[:addons] = []
      render json: @compulsory_addons
    end
  end

  # a list of optional addons allowed for this module - available for both kitchens and wardrobes
  def optional_addons
    @product_module = ProductModule.where(category: params[:category]).find(params[:product_module_id])

    @addons = filter_addons(@product_module.allowed_addons, addon_filter_options)
    @addon_combinations = @product_module.allowed_addon_combinations
    addon_in_combination_ids = @addon_combinations.map{|addon_combination| addon_combination.addons.pluck(:id)}.flatten.uniq
    @addons_in_combinations = filter_addons(Addon.where(id: addon_in_combination_ids), addon_filter_options)
    @addon_combinations = @addon_combinations.joins(:addons).where(addons: {id: @addons_in_combinations}).distinct
    addon_array = []
    if @filter_params[:addon_type].to_s.in?(['', 'combination', 'both'])
      addon_array << @addon_combinations.map{|addon_combination| AddonCombinationSerializer.new(addon_combination).serializable_hash}
    end
    if @filter_params[:addon_type].to_s.in?(['', 'single', 'both'])
      addon_array << @addons.map{|addon| AddonSerializer.new(addon).serializable_hash}
    end

    paginated_array = paginate addon_array.flatten
    render json: {addons: paginated_array}

  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_addon
    @addon = Addon.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def addon_params
    params.require(:addon).permit(:code, :name, :specifications, :brand_id, :category, :addon_image, :price, 
      :vendor_sku, :extra, :mrp)
  end

  def update_tag_mappings
    @addon.tags = []
    params[:addon][:addon_tags_attributes].each do |addon_tag_hash|
      tag = Tag.addons.find addon_tag_hash[:id]
      @addon.tags << tag if tag.present?
    end if params[:addon][:addon_tags_attributes].present?
  end

  # default options to be sent to the filter_addons option.
  def addon_filter_options
    { has_modspace_pricing: current_user.has_modspace_pricing? }
  end

  # Addon.seach already has the not_hidden check, so no need to check here.
  # options hash added on Sept 2019 to pass the value to indicate if the designer/cm has modspace pricing.
  def filter_addons(addons_to_filter, options={})
    if params[:search_string].present? || params[:filter_params].present?
      @filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      addons_to_filter.search(params[:search_string].to_s, @filter_params.merge(options))
    else
      @filter_params = {}
      addons_to_filter.search("", options)
    end
  end
end
