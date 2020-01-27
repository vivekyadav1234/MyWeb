class Api::V1::CoreMaterialsController < Api::V1::ApiController
  skip_before_action :authenticate_user!
  before_action :set_core_material, only: [:show, :update, :destroy, :add_finish_mapping, :remove_finish_mapping]
  load_and_authorize_resource :core_material
  
  # GET /api/v1/core_materials
  def index
    @core_materials = CoreMaterial.not_hidden
    render json: @core_materials
  end

  # GET /api/v1/core_materials/1
  def show
    render json: @core_material
  end

  # POST /api/v1/core_materials
  def create
    @core_material = CoreMaterial.new(core_material_params)
    if @core_material.save
      render json: @core_material, status: :created
    else
      render json: {message: @core_material.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/core_materials/1
  def update
    if @core_material.update(core_material_params)
      render json: @core_material
    else
      render json: @core_material.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/core_materials/1
  def destroy
    @core_material.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This core material cannot be deleted as it is in use."}, status: 422
  end

  # add a shutter_finish allowed for this core material (when read as shutter material)
  def add_finish_mapping
    @shutter_finish = params[:shutter_finish_id]
    @core_material.add_finish(@shutter_finish)
  end

  # remove a shutter_finish allowed for this core material (when read as shutter material)
  def remove_finish_mapping
    @shutter_finish = params[:shutter_finish_id]
    @core_material.remove_finish(@shutter_finish)
  end

  # get list of shutter materials allowed for a chosen core material (both CoreMaterial model only)
  def list_shutter_materials
    if params[:core_material_id].present?
      @core_material = CoreMaterial.find params[:core_material_id]
    elsif params[:core_material_name].present?
      @core_material = CoreMaterial.find_by(name: params[:core_material_name])
    else
      return render json: {message: "Insufficient parameters."}, status: 400
    end

    unless @core_material.present?
      return render json: {message: "No core material found, so cannot fetch shutter materials."}, status: 404
    end

    modspace_pricing_flag = current_user.has_modspace_pricing?
    if modspace_pricing_flag
      if params[:arrivae_select]
        @shutter_materials = @core_material.shutter_materials.modspace_shutter.arrivae_select.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      else
        @shutter_materials = @core_material.shutter_materials.modspace_shutter.map{|core_material| core_material.attributes.slice("id","name", "arrivae_select")}
      end
    else
      if params[:arrivae_select]
        @shutter_materials = CoreMaterial.not_hidden.arrivae_select.map{|core_material| core_material.attributes.slice("id", "name", "arrivae_select")}
      else
        @shutter_materials = CoreMaterial.not_hidden.map{|core_material| core_material.attributes.slice("id", "name", "arrivae_select")}
      end
    end

    render json: @shutter_materials.to_json
  end

  # get a list of finishes for a given material chosen as shutter_material
  def list_finishes
    if params[:shutter_material_id].present?
      @shutter_material = CoreMaterial.find params[:shutter_material_id]
    elsif params[:shutter_material_name].present?
      @shutter_material = CoreMaterial.find_by(name: params[:shutter_material_name])
    else
      return render json: {message: "Insufficient parameters."}, status: 400
    end

    modspace_pricing_flag = current_user.has_modspace_pricing?
    if modspace_pricing_flag
      @shutter_finishes = @shutter_material.modspace_shutter_finishes.modspace_visible
    else
      @shutter_finishes = @shutter_material.shutter_finishes.not_hidden
    end
    @shutter_finishes = @shutter_finishes.arrivae_select if params[:arrivae_select]
    render json: @shutter_finishes
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_core_material
    @core_material = CoreMaterial.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def core_material_params
    params.require(:core_material).permit(:name)
  end
end
