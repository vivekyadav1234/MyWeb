class Api::V1::CmMkwVariablePricingsController < Api::V1::ApiController
  before_action :set_cm_mkw_variable_pricing, only: [:destroy]
  load_and_authorize_resource :cm_mkw_variable_pricing

  def index
    cm_user = params[:cm_id].present? ? User.find(params[:cm_id]) : current_user
    @cm_mkw_variable_pricing = cm_user.cm_mkw_variable_pricing

    if @cm_mkw_variable_pricing.present?
      render json: @cm_mkw_variable_pricing
    else
      render json: {message: "Given CM doesn't have variable pricing instances."}, status: 204
    end
  end

  # def show
  #   render json: @cm_mkw_variable_pricing
  # end

  # def create
  #   @cm_mkw_variable_pricing = CmMkwVariablePricing.new(cm_mkw_variable_pricing_params)

  #   if @cm_mkw_variable_pricing.save
  #     render json: @cm_mkw_variable_pricing, status: :created
  #   else
  #     render json: @cm_mkw_variable_pricing.errors, status: :unprocessable_entity
  #   end
  # end

  def import
    cm = User.find params[:cm_id]
    cm_mkw_variable_pricing_instance = CmMkwVariablePricing.where(cm: cm).first_or_initialize
    
    str = params[:attachment_file]&.partition(";base64,")&.last
    filepath = Rails.root.join("tmp").join("#{cm.id}_variable_pricing.yml")
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    price_factor_hash = YAML.load_file filepath

    if params[:type] == "full_home"
      cm_mkw_variable_pricing_instance.full_home_factors = price_factor_hash
    elsif params[:type] == "mkw"
      cm_mkw_variable_pricing_instance.mkw_factors = price_factor_hash
    else
      render json: {message: "Invalid :type parameter"}, status: 400
    end

    if cm_mkw_variable_pricing_instance.save
      render json: cm.cm_mkw_variable_pricing
    else
      render json: { message: cm_mkw_variable_pricing_instance.errors.full_messages }, status: :unprocessable_entity
    end

    rescue
      render json: { message: "Couldn't upload file. Please ensure that it is in valid YAML format." }, status: 415
  end

  # def update
  #   if @cm_mkw_variable_pricing.update(cm_mkw_variable_pricing_params)
  #     render json: @cm_mkw_variable_pricing
  #   else
  #     render json: @cm_mkw_variable_pricing.errors, status: :unprocessable_entity
  #   end
  # end

  def destroy
    if params[:tag_name] == "full_home"
      @cm_mkw_variable_pricing.update! full_home_factors: {}
      return render json: @cm_mkw_variable_pricing
    elsif params[:tag_name] == "mkw"
      @cm_mkw_variable_pricing.update! mkw_factors: {}
      return render json: @cm_mkw_variable_pricing
    else
      @cm_mkw_variable_pricing.destroy
      return render json: @cm_mkw_variable_pricing
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_cm_mkw_variable_pricing
    @cm_mkw_variable_pricing = CmMkwVariablePricing.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def cm_mkw_variable_pricing_params
    params.require(:cm_mkw_variable_pricing).permit(:full_home_factors, :mkw_factors)
  end
end
