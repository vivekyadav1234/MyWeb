require "#{Rails.root.join('app','serializers','shutter_finish_serializer')}"
class Api::V1::ShutterFinishesController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_shutter_finish, only: [:show, :update, :destroy, :fetch_edge_banding_shades_mapping, :add_edge_banding_shades_mapping]
  load_and_authorize_resource :shutter_finish

  # GET /api/v1/shutter_finishes
  def index
    @shutter_finishes = ShutterFinish.not_hidden
    @shutter_finishes = @shutter_finishes.arrivae_select if params[:arrivae_select]
    render json: @shutter_finishes
  end

  # GET /api/v1/shutter_finishes/1
  def show
    render json: @shutter_finish
  end

  # POST /api/v1/shutter_finishes
  def create
    @shutter_finish = ShutterFinish.new(shutter_finish_params)
    if @shutter_finish.save
      render json: @shutter_finish, status: :created
    else
      render json: {message: @shutter_finish.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/shutter_finishes/1
  def update
    if @shutter_finish.update(shutter_finish_params)
      render json: @shutter_finish
    else
      render json: @shutter_finish.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shutter_finishes/1
  def destroy
    @shutter_finish.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This finish cannot be deleted as it is in use."}, status: 422
  end

  def fetch_shades_mapping
    shades = []
    shades_all = Shade.all
    shades_all.each do |s|
      shade_finish = Hash.new
      shade_finish["id"] = s.id
      shade_finish["code"] = s.code
      shade_finish["mapping_for"] = "shutter"
      shade_finish["mappings"] = s.shutter_finish_shades.pluck(:shutter_finish_id)
      shades.push shade_finish
    end
    render json: {shades: shades}, status: 200
  end

  def add_shades_mapping
    if params[:shades].present?
      params[:shades].each do |shade_key, values|
        shade = Shade.where(id: shade_key).first
        shade.shutter_finish_shades.destroy_all if shade.present?
        if shade.present?
          values.each{|v| shade.shutter_finish_shades.where(shutter_finish_id: v).first_or_create}
        end
      end
      render json: {message: "Mapping Updated"}, status: 200
    end
  end

  def list_shades
    if params[:shutter_finish_id].present?
      @shutter_finish = ShutterFinish.find params[:shutter_finish_id]
    elsif params[:shutter_finish_name].present?
      @shutter_finish = ShutterFinish.find_by(name: params[:shutter_finish_name])
    else
      return render json: {message: "Insufficient parameters."}, status: 400
    end

    unless @shutter_finish.present?
      str = params[:shutter_finish_id].present? ? "id #{params[:shutter_finish_id]}" : "name #{params[:shutter_finish_name]}"
      return render json: {message: "No finish with #{str} found."}, status: 404
    end

    @shades = @shutter_finish.shades.not_hidden
    @shades = @shades.arrivae_select if params[:arrivae_select]
    render json: @shades
  end

  def fetch_core_material_mapping
    cm = []
    cm_all = CoreMaterial.all
    cm_all.each do |c|
      cm_finish = Hash.new
      cm_finish["id"] = c.id
      cm_finish["name"] = c.name
      cm_finish["mapping_for"] = "core_materials"
      cm_finish["mappings"] = c.shutter_material_finishes.pluck(:shutter_finish_id)
      cm.push cm_finish
    end
    render json: {core_materials: cm}, status: 200
  end

  def add_core_material_mapping
    if params[:core_materials].present?
      params[:core_materials].each do |cm_key, values|
        cm = CoreMaterial.where(id: cm_key).first
        cm.shutter_material_finishes.destroy_all if cm.present?
        if cm.present?
          values.each{|v| cm.shutter_material_finishes.where(shutter_finish_id: v).first_or_create}
        end
      end
      render json: {message: "Mapping Updated"}, status: 200
    end
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_shutter_finish
    @shutter_finish = ShutterFinish.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def shutter_finish_params
    params.require(:shutter_finish).permit(:name,:price, :wardrobe_price)
  end
end
