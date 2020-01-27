class Api::V1::PriceConfiguratorsController < Api::V1::ApiController
  before_action :set_price_configurator, only: [:show, :update, :destroy, :add_specification, :fetch_designs]
  # before_action :set_pricable, only: [:index, :create]
  skip_before_action :authenticate_user!

  def emicalculator
    if valid_emi_params?
      emi = Emicalculator.new(params[:principal].to_f,params[:rate].to_f,params[:tenure].to_i)
      render json: emi.emi_hash, status: :ok
    else
      render json: {error: "Invalid data was entered."}
    end
  end

  # GET /api/v1/price_configurators
  def index
    @price_configurators = PriceConfigurator.all
    render json: @price_configurators
  end

  # GET /api/v1/price_configurators/1
  def show
    render json: @price_configurator
  end

  # POST /api/v1/price_configurators
  def create
    platform_price, hob_price, chimney_price, civil_work_price, tile_price, total_price = [0] * 6
    # if params[:price_configurator][:food_type].present? && params[:price_configurator][:food_type] == 'half_prepared_food'
    if params.dig(:price_configurator, :food_type) == 'half_prepared_food'
      params[:price_configurator][:platform] = '2 ft'.to_unit
      # platform_price += (Price.new.variable_cost["granite_platform"]["default"] * 2)
    elsif params[:price_configurator][:food_type].present?
      params[:price_configurator][:platform] = '2.5 ft'.to_unit
      # platform_price += (Price.new.variable_cost["granite_platform"]["default"] * 2.5)
    end
    platform_price += (Price.new.variable_cost["granite_platform"]["default"] * params[:price_configurator][:platform]&.scalar.to_f)

    #hob
    if params[:price_configurator][:food] == 'non_fried' && params[:price_configurator][:food_option] == 'more_roti' && params[:price_configurator][:family_size].present? && params[:price_configurator][:family_size].to_i <= 4
      params[:price_configurator][:hob] = '2 ft'.to_unit
      params[:price_configurator][:chimney] = '2 ft'.to_unit
      params[:price_configurator][:chimney_type] = 'baffled'
      hob_price += (Price.new.fixed_cost["kitchen_appliances"]["hob_2"])
      chimney_price += (Price.new.fixed_cost["kitchen_appliances"]["chimney_2"])
    elsif params[:price_configurator][:food].present? && params[:price_configurator][:food_option].present? && params[:price_configurator][:family_size].present?
      params[:price_configurator][:hob] = '2.5 ft'.to_unit
      params[:price_configurator][:chimney] = '3 ft'.to_unit
      params[:price_configurator][:chimney_type] = 'mezze'
      hob_price += (Price.new.fixed_cost["kitchen_appliances"]["hob_2_5"])
      chimney_price += (Price.new.fixed_cost["kitchen_appliances"]["chimney_3"])
    end

    #sink
    if params[:price_configurator][:utensil_used] == 'less' && params[:price_configurator][:family_size].present? && params[:price_configurator][:family_size].to_i <= 4 && params[:price_configurator][:vegetable_cleaning] == 'less' && params.dig(:price_configurator,:cleaning_frequency).to_i > 1 && params[:price_configurator][:storage_utensils] == 'less' && params[:price_configurator][:platform] == '2 ft'
      params[:price_configurator][:sink] = '2 ft'.to_unit
    elsif params[:price_configurator][:utensil_used].present? && params[:price_configurator][:family_size].present? && params[:price_configurator][:vegetable_cleaning].present? && params[:price_configurator][:cleaning_frequency].present? && params[:price_configurator][:storage_utensils].present? && params[:price_configurator][:platform].present?
      params[:price_configurator][:sink] = '3 ft'.to_unit
    end

    #dustbin
    if params[:price_configurator][:kind_of_food] == 'veg'
      params[:price_configurator][:dustbin] = '10 lt'
    elsif params[:price_configurator][:kind_of_food].present?
      params[:price_configurator][:dustbin] = '15 lt'
    end

    #bowl_type
    if params[:price_configurator][:sink] == '2 ft'
      params[:price_configurator][:bowl_type] = "single_2_ft_bowl"
    elsif params[:price_configurator][:sink].present?
      params[:price_configurator][:bowl_type] = "double_bowl"
    end

    #drain_board
    if params[:price_configurator][:size_of_utensils] == 'less' && params.dig(:price_configurator,:cleaning_frequency).to_i > 1
      params[:price_configurator][:drain_board] = 0
    elsif params[:price_configurator][:size_of_utensils].present? && params[:price_configurator][:cleaning_frequency].present?
      params[:price_configurator][:drain_board] = 1
    end

    #light
    if params[:price_configurator][:habit] == 'enjoy_cooking'
      params[:price_configurator][:light] = 'shell_mounted'
    elsif params[:price_configurator][:habit].present?
      params[:price_configurator][:light] = 'wall_mounted'
    end

    #preparation_area
    if params[:price_configurator][:family_size].present? && params.dig(:price_configurator, :family_size).to_i <= 4 &&
       params[:price_configurator][:kind_of_food].present? && params.dig(:price_configurator, :kind_of_food) == 'veg' &&
       params[:price_configurator][:drain_board].present? && params.dig(:price_configurator, :drain_board) == 0
      params[:price_configurator][:preparation_area] = '3 ft'.to_unit
    elsif params[:price_configurator][:family_size].present? && params[:price_configurator][:kind_of_food].present? && params[:price_configurator][:drain_board].present?
      params[:price_configurator][:preparation_area] = '4 ft'.to_unit
    end

      if params[:pc_obj].present? && params[:pc_obj][:price_configurator][:id].present?
        @price_configurator = PriceConfigurator.find(params[:pc_obj][:price_configurator][:id])
        @price_configurator.update(price_configurator_params)
      else
        @price_configurator = PriceConfigurator.new(price_configurator_params)
        @price_configurator.save!
      end

    p = params[:price_configurator][:platform]&.scalar.to_f
    h = params[:price_configurator][:hob]&.scalar.to_f
    s = params[:price_configurator][:sink]&.scalar.to_f
    pr = params[:price_configurator][:preparation_area]&.scalar.to_f
    c = params[:price_configurator][:chimney]&.scalar.to_f

    size1 = p + h + s + pr
    size2 = p + h + s + pr - c

    if p>0 && h>0 && s>0 && pr>0
      civil_work_price = size1 * Price.new.variable_cost["granite_platform"]["default"]
      tile_price = size1 * 2 * Price.new.variable_cost["tiles"]["default"]

      if c>0
        total_price = 12000 + chimney_price + hob_price + size1 * Price.new.variable_cost["kitchen_cabinets"]["base"] + size2 * Price.new.variable_cost["kitchen_cabinets"]["wall"]
      end
    else
        total_price = chimney_price + hob_price + platform_price
    end
    hash = {total_price: total_price, chimney_price: chimney_price, 
      hob_price: hob_price, platform_price: platform_price, 
      civil_work_price: civil_work_price, tile_price: tile_price, 
      price_configurator: @price_configurator}

    puts hash
    render json: hash

  end

  def fetch_designs
    url = "https://s3.amazonaws.com/arrivae-assets/price_configurator/"
    kitchen_type = @price_configurator.kitchen_type
    finish_type = @price_configurator.finish_type

    if kitchen_type == "parallel"
      if finish_type == "pu_finish_calibrated_ply"
        url_array = [url+"AK01.jpg", url+"AK02.jpg"]
      elsif finish_type == "pvc_foil_mdf"
        url_array = [url+"AK14.jpg", url+"AK16.jpg"]
      elsif finish_type == "pu_finish_calibrated_ply_for_wall"
        url_array = [url+"AK15.jpg"]
      elsif finish_type == "laminated_finish_melamine"
        url_array = [url+"AK05.jpg", url+"AK17.jpg", url+"AK18.jpg"]
      else
        url_array = [url+"AK01.jpg", url+"AK02.jpg", url+"AK14.jpg", url+"AK16.jpg", url+"AK15.jpg", url+"AK05.jpg", url+"AK17.jpg", url+"AK18.jpg"]
      end
    elsif kitchen_type == "l_type"
      if finish_type == "back_painted_with_pu_finish_for_opencarcas"
        url_array = [url+"AK03.jpg"]
      elsif finish_type == "laminated_finish_melamine"
        url_array = [url+"AK06.jpg", url+"AK07.jpg"]
      else
        url_array = [url+"AK06.jpg", url+"AK07.jpg", url+"AK03.jpg"]
      end
    elsif kitchen_type == "straight"
      if finish_type == "laminated_finish_melamine"
        url_array = [url+"AK04.jpg", url+"AK13.jpg"]
      elsif finish_type == "pu_finish_calibrated_ply_for_wall"
        url_array = [url+"AK12.jpg"]
      else
        url_array = [url+"AK04.jpg", url+"AK13.jpg", url+"AK12.jpg"]
      end
    elsif kitchen_type == "u_type"
      if finish_type == "pvc_foil_mdf"
        url_array = [url+"AK08.jpg", url+"AK09.jpg", url+"AK10.jpg"]
      elsif finish_type == "pu_finish_calibrated_ply_for_wall"
        url_array = [url+"AK11.jpg"]
      else
        url_array = [url+"AK08.jpg", url+"AK09.jpg", url+"AK10.jpg", url+"AK11.jpg"]
      end
    end
      
    
    render json: {:image_url => url_array}
  end


  # PATCH/PUT /api/v1/price_configurators/1
  def update
    if @price_configurator.update(price_configurator_params)
      render json: @price_configurator
    else
      render json: @price_configurator.errors, status: :unprocessable_entity
    end
  end


  # DELETE /api/v1/price_configurators/1
  def destroy
    @price_configurator.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_price_configurator
      @price_configurator = PriceConfigurator.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def price_configurator_params
      params.require(:price_configurator).permit(:total_price_cents, :pricable_id, 
        :pricable_type,  :food_option, :food_type, :food, :family_size, :utensil_used, 
        :vegetable_cleaning, :cleaning_frequency, :storage_utensils, :kind_of_food, 
        :size_of_utensils, :habit, :platform, :hob, :chimney, :chimney_type, :sink, 
        :dustbin, :bowl_type, :drain_board, :light, :preparation_area, :kitchen_type, :finish_type)
    end

    def set_pricable
      @pricable = params[:pricable_type].constantize.find(params[:pricable_id])
    end

    def valid_emi_params?
      params[:principal].to_f>0  && params[:rate].to_f>8.55 && params[:tenure].to_i>0
    end
end
