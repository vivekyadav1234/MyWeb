require "#{Rails.root.join('app','serializers','product_module_serializer')}"
class Api::V1::ProductModulesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_product_module, only: [:show, :update, :destroy, :fetch_kitchen_module_addons]
  load_and_authorize_resource :product_module

  # GET /api/v1/product_modules
  def index
    @product_modules = params[:category].present? ? ProductModule.where(category: params[:category]).not_hidden : ProductModule.not_hidden
    render json: @product_modules
  end

  # GET /api/v1/product_modules/1
  def show
    render json: @product_module
  end

  # POST /api/v1/product_modules
  def create
    @product_module = ProductModule.new(product_module_params)
    if @product_module.save!
      @product_module.carcass_element_ids = []
      @product_module.hardware_element_ids = []
      params[:product_module][:carcass_elements].each do |carcass_element_hash|
        carcass_element = CarcassElement.find carcass_element_hash[:id]
        @product_module.carcass_elements << carcass_element
        ModuleCarcassElement.find_by(product_module: @product_module, carcass_element: carcass_element).update!(quantity: carcass_element_hash[:quantity])
      end
      params[:product_module][:hardware_elements].each do |hardware_element_hash|
        hardware_element = HardwareElement.find hardware_element_hash[:id]
        element = @product_module.hardware_elements << hardware_element
        ModuleHardwareElement.find_by(product_module: @product_module, hardware_element: hardware_element).update!(quantity: hardware_element_hash[:quantity])
      end

      # @product_module.module_carcass_elements.where(carcass_element_id: params[:product_module][:carcass_element_ids]).first_or_create!
      # @product_module.module_hardware_elements.where(hardware_element_id: params[:product_module][:hardware_element_ids]).first_or_create!
      render json: @product_module, status: :created
    else
      render json: {message: @product_module.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/product_modules/1
  def update
    if @product_module.update(product_module_params)
      @product_module.carcass_element_ids = []
      @product_module.hardware_element_ids = []
      params[:product_module][:carcass_elements].each do |carcass_element_hash|
        carcass_element = CarcassElement.find carcass_element_hash[:id]
        @product_module.carcass_elements << carcass_element
        ModuleCarcassElement.find_by(product_module: @product_module, carcass_element: carcass_element).update!(quantity: carcass_element_hash[:quantity])
      end
      params[:product_module][:hardware_elements].each do |hardware_element_hash|
        hardware_element = HardwareElement.find hardware_element_hash[:id]
        element = @product_module.hardware_elements << hardware_element
        ModuleHardwareElement.find_by(product_module: @product_module, hardware_element: hardware_element).update!(quantity: hardware_element_hash[:quantity])
      end

      # @product_module.module_carcass_elements.where(carcass_element_id: params[:product_module][:carcass_element_ids]).first_or_create!
      # @product_module.module_hardware_elements.where(hardware_element_id: params[:product_module][:hardware_element_ids]).first_or_create!
      render json: @product_module, status: 200
    else
      render json: @product_module.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/product_modules/1
  def destroy
    @product_module.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This module cannot be deleted as it is in use."}, status: 422
  end

  def fetch_addons_mapping
    pm = []
    pm_all = ProductModule.not_hidden
    pm_all.each do |c|
      pm_finish = Hash.new
      pm_finish["id"] = c.id
      pm_finish["code"] = c.code
      pm_finish["mapping_for"] = "addons"
      pm_finish["mappings"] = c.product_module_addons.pluck(:addon_id)
      pm_finish["category"] = c.category
      pm.push pm_finish
    end
    render json: {product_modules: pm}, status: 200
  end

  def add_addons_mapping
    if params[:product_modules].present?
      params[:product_modules].each do |pm_key, values|
        pm = ProductModule.find_by_id(pm_key)
        pm.product_module_addons.destroy_all if pm.present?
        if pm.present?
          values.each{|v| pm.product_module_addons.where(addon_id: v).first_or_create}
        end
      end
      render json: {message: "Mapping Updated"}, status: 200
    end

  end

  def fetch_kitchen_module_addons
    if @product_module.category == "kitchen"
      render json: @product_module, serializer: KitchenModuleAddonMappingSerializer
    else
      render json: {message: "Product dose not belongs to category 'Kitchen' "}, status: 204
    end
  end

  def add_kitchen_module_addons
    km = ProductModule.find_by_id(params[:kitchen_modules][:id])
    if km.present?
      if params[:kitchen_modules][:slots].present?
        params[:kitchen_modules][:slots].each do |slot|
          mapping = km.kitchen_module_addon_mappings.where(name: slot[:name]).first_or_initialize
          # mapping.addons = slot[:addon_ids]
          addon_arr = []
          slot[:addon_ids].each do |addon|
              addon_arr.push addon[:id]
          end
          mapping.addons = addon_arr
          if mapping.persisted?
            mapping.save
          end
        end
      end
    end

    if km.save
      render json: {message: "Mapping Updated"}, status: 200
    else
      render json: {message: km.errors.full_messages}, status: 422
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_product_module
    @product_module = ProductModule.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def product_module_params
    params.require(:product_module).permit(:code, :description, :width, :depth,
      :height, :modular_product_id, :module_type_id, :number_kitchen_addons, :category, 
      :module_image, :number_shutter_handles, :number_door_handles, :special_handles_only)
  end
end
