class Api::V1::CatalogueServicesController < Api::V1::ApiController
  before_action :set_section, except: [:all_product_list, ]
  before_action :set_catalogue_service, only: [:show, :update, :destroy]
  load_and_authorize_resource except: [:create, :update, :all_product_list]

  # GET /catalogue_services
  def index
    # @section = Section.find(params[:parent_id])
    @catalogue_services = @section.catalogue_services

    render json: @catalogue_services
  end

  def all_service_list
    @catalogue_services = CatalogueService.all
    render json: @catalogue_services

  end

  # GET /catalogue_services/1
  def show
    render json: @catalogue_service
  end

  # POST /catalogue_services
  def create

    @catalogue_services = catalogue_service_params.map {|catalogue_service_param| @section.catalogue_services.create(catalogue_service_param)}
    render json: @catalogue_services, status: :created


    # @catalogue_service = @section.catalogue_services.new(catalogue_service_params)

    # if @catalogue_service.save
    #   render json: @catalogue_service, status: :created, location: @catalogue_service
    # else
    #   render json: @catalogue_service.errors, status: :unprocessable_entity
    # end
  end

  # PATCH/PUT /catalogue_services/1
  def update
    if @catalogue_service.update(catalogue_service_params)
      render json: @catalogue_service
    else
      render json: @catalogue_service.errors, status: :unprocessable_entity
    end
  end

  # DELETE /catalogue_services/1
  def destroy
    @catalogue_service.destroy
    
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_catalogue_service
      @catalogue_service = CatalogueService.find(params[:id])
    end

    # Product must belong to a section
    def set_section
      @section = Section.find params[:section_id]
    end

    # Only allow a trusted parameter "white list" through.
    def catalogue_service_params
      # params.fetch(:catalogue_service, {})
      params.permit(catalogue_service: [:name, :image_name, :product_type, :product_subtype, :unique_sku, :attachment_file, :section_id, :brand, :catalogue_code, :specification, :rate_per_unit, :l1_rate, :l1_quote_price, :l2_rate, :l2_quote_price, :contractor_rate, :contractor_quote_price, :measurement_unit]).require(:catalogue_service)
    end
end
