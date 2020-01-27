class Api::V1::BoqGlobalConfigsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_boq_global_config, only: [:update, :destroy, :update_and_apply]
  load_and_authorize_resource :boq_global_config
  
  # GET /api/v1/boq_global_configs
  def index
    modspace_pricing_flag = current_user.has_modspace_pricing?
    hash = Hash.new
    if modspace_pricing_flag
      if params[:arrivae_select]
        hash[:core_material] = CoreMaterial.modspace_visible.arrivae_select.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      else
        hash[:core_material] = CoreMaterial.modspace_visible.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      end
      hash[:skirting_config_type] = SkirtingConfig.where({"skirting_type"=>"Aluminum finish PVC", "skirting_height"=>100}).map{|skirting_config_type| skirting_config_type.attributes.slice("id","skirting_type")}
      hash[:hinge_type] = ["normal", "soft"]
      hash[:channel_type] = ["normal"]
      hash[:modspace] = true
    else
      if params[:arrivae_select]
        hash[:core_material] = CoreMaterial.not_hidden.arrivae_select.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      else
        hash[:core_material] = CoreMaterial.not_hidden.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      end
      hash[:skirting_config_type] = SkirtingConfig.all.map{|skirting_config_type| skirting_config_type.attributes.slice("id","skirting_type")}
      hash[:hinge_type] = BoqGlobalConfig::ALL_HINGE_TYPES.keys
      hash[:channel_type] = BoqGlobalConfig::ALL_CHANNEL_TYPES.keys
      hash[:modspace] = false
    end
    # same values for shutter_material
    hash[:shutter_material] = hash[:core_material]
    hash[:shutter_finish] = []
    hash[:shutter_shade_code] = []
    hash[:edge_banding_shade_code] = EdgeBandingShade.all.map{ |shade| EdgeBandingShadeSerializer.new(shade).serializable_hash }
    hash[:skirting_config_height] = []
    # if params[:category] == "kitchen"
    #   hash[:door_handle_code] = Handle.kitchen.map{|door_handle| 
    #     HandleSerializer.new(door_handle).serializable_hash
    #   }
    # elsif params[:category] == "wardrobe"
    #   hash[:door_handle_code] = Handle.wardrobe.drawer.map{|door_handle|
    #     HandleSerializer.new(door_handle).serializable_hash 
    #   }
    #   hash[:shutter_handle_code] = Handle.wardrobe.shutter.map{|shutter_handle|
    #     HandleSerializer.new(shutter_handle).serializable_hash 
    #   }
    # end
    hash[:hardware_brand] = Brand.hardware_brands.map{|brand| brand.attributes.slice("id", "name")}
    hash[:modular_wardrobe_id] = Section.find_by_name "Modular Wardrobe"
    hash[:modular_kitchen_id] = Section.find_by_name "Modular Kitchen"
    # 14/03/2019 - Asked by Abhishek that only 'none' should be available as countertop option.
    # hash[:countertop] = BoqGlobalConfig::ALL_COUNTERTOPS.keys
    hash[:countertop] = ['none']
    hash[:category] = params[:category]

    render json: hash
  end

  # GET /api/v1/boq_global_configs/1
  def get_config
    unless params[:quotation_id].present? && params[:category].present?
      return render json: {message: "quotation_id and category are required."}, status: 400
    end
    @boq_global_config = BoqGlobalConfig.find_by(quotation_id: params[:quotation_id], category: params[:category])
    render json: @boq_global_config
  end

  # POST /api/v1/boq_global_configs
  def create
    @boq_global_config = BoqGlobalConfig.new(boq_global_config_params)
    # for global variable preset only
    if params[:boq_global_config][:is_preset]
      @boq_global_config.is_preset = true
      @boq_global_config.preset_created_by = current_user
    end
    if @boq_global_config.save
      render json: @boq_global_config, status: :created
    else
      render json: {message: @boq_global_config.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/boq_global_configs/1
  def update
    if @boq_global_config.is_preset && @boq_global_config.preset_created_by != current_user
      return render json: {message: "Unauthorized."}, status: :unauthorized
    end
    if @boq_global_config.update(boq_global_config_params)
      @boq_global_config.quotation.set_amounts if @boq_global_config.quotation.present?
      render json: @boq_global_config
    else
      render json: {message: @boq_global_config.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/boq_global_configs/1
  def destroy
    if @boq_global_config.is_preset && @boq_global_config.preset_created_by != current_user
      return render json: {message: "Unauthorized."}, status: :unauthorized
    end
    @boq_global_config.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This global config cannot be deleted as it is in use."}, status: 422
  end

  def list_of_spaces
    spaces = BoqGlobalConfig::SPACES
    hash = {
      spaces: spaces
    }

    render json: hash
  end

  # update the boq global config and apply to all of its existing modular jobs (of same category)
  def update_and_apply
    @quotation = @boq_global_config.quotation
    if @boq_global_config.update(boq_global_config_params)
      error_array = []
      @quotation.modular_jobs.where(category: @boq_global_config.category).each do |modular_job|
        unless modular_job.apply_global_config(@boq_global_config, { save_now: true })
          error_array << { modular_job.product_module.code => modular_job.errors }
        end
      end

      # hash_to_render = BoqGlobalConfigSerializer.new(@boq_global_config).serializable_hash.merge(errors: error_array)
      render json: @boq_global_config, serializer: BoqGlobalConfigSerializer
    else
      render json: {message: @boq_global_config.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def list_presets
    category_role_users_ids = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:id)
    presets_by_category = BoqGlobalConfig.presets.where(category: params[:category]).where(preset_created_by_id: category_role_users_ids)
   
   if current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)
      @presets_to_show = presets_by_category
    elsif current_user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
      presets_by_user = BoqGlobalConfig.presets.where(category: params[:category], preset_created_by_id: [current_user.id])
      @presets_to_show = presets_by_user.or(presets_by_category)
    else
      raise CanCan::AccessDenied
    end
        
    paginate json: @presets_to_show
  end

  def load_preset
    unless params[:quotation_id].present? && params[:category].present? && params[:preset_id]
      return render json: {message: "quotation_id, preset_id and category are required."}, status: 400
    end

    @quotation = Quotation.find params[:quotation_id]
    @preset = BoqGlobalConfig.find params[:preset_id]
    @boq_global_config = @quotation.boq_global_configs.where(category: params[:category]).first_or_initialize
    @boq_global_config = @preset.copy_from_preset
    @boq_global_config.quotation = @quotation
    if @boq_global_config.save
      render json: @boq_global_config
    else
      render json: {message: @boq_global_config.errors.full_messages}, status: :unprocessable_entity
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_boq_global_config
    @boq_global_config = BoqGlobalConfig.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def boq_global_config_params
    params.require(:boq_global_config).permit(:core_material, :shutter_material, :shutter_finish, 
      :shutter_shade_code, :edge_banding_shade_code, :skirting_config_type, :skirting_config_height, :door_handle_code, 
      :shutter_handle_code, :hinge_type, :channel_type, :brand_id, :skirting_config_id, 
      :category, :quotation_id, :countertop, :civil_kitchen, :countertop_width, :is_preset, :preset_name, :preset_remark, 
      civil_kitchen_parameter_attributes: [:id, :depth, :drawer_height_1, :drawer_height_2, :drawer_height_3])
  end
end
