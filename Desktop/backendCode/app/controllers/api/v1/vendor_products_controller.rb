class Api::V1::VendorProductsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_vendor_product, only: [:show, :update, :destroy]
  load_and_authorize_resource :vendor_product

  # GET /v1/vendor_products
  def index
    @vendor_products = VendorProduct.all
    if params[:master_line_item_id].present?
      puts "==========1====="
      @vendor_products = @vendor_products.where(master_line_item_id: params[:master_line_item_id])
    end
    if params[:vendor_id].present?
      puts "==========2====="
      @vendor_products = @vendor_products.where(vendor_id: params[:vendor_id])
    end
    if params[:search].present?
      puts "==========3====="
      @vendor_products = @vendor_products.where("sli_name ILIKE ? OR sli_group_code ILIKE ? OR
        sli_code ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    paginate json: @vendor_products
  end

  def list
    if params[:master_line_item_id].present?
      puts "==========1====="
      @vendor_products = @vendor_products.where(master_line_item_id: params[:master_line_item_id])
    end
    if params[:vendor_id].present?
      puts "==========2====="
      @vendor_products = @vendor_products.where(vendor_id: params[:vendor_id])
    end
    if params[:search].present?
      puts "==========3====="
      @vendor_products = @vendor_products.where("sli_name ILIKE ? OR sli_group_code ILIKE ? OR
        sli_code ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%")
    end

    render json: @vendor_products
  end


  # GET /api/v1/vendor_products/1
  def show
    render json: @vendor_product, serializer: VendorProductWithAttrubtesSerializer
  end

  # POST /api/v1/vendor_products
  def create
    @vendor_product = VendorProduct.new(vendor_product_params)
    if @vendor_product.save
      if set_dynamic_attributes
        render json: @vendor_product, serializer: VendorProductWithAttrubtesSerializer, status: :created
      else
        @vendor_product.destroy
        render json: {message: @vendor_product.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {message: @vendor_product.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/vendor_products/1
  def update
    if @vendor_product.update(vendor_product_params)
      if set_dynamic_attributes
        render json: @vendor_product, serializer: VendorProductWithAttrubtesSerializer
      else
        render json: {message: @vendor_product.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {message: @vendor_product.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/vendor_products/1
  def destroy
    @vendor_product.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This vendor product cannot be deleted as it is in use."}, status: 422
  end

  def list_units
    render json: VendorProduct::UNITS
  end
  
  def list_units_array
    render json: VendorProduct::UNITS.values
  end

  def list_units_array
    render json: VendorProduct::UNITS.values
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_vendor_product
    @vendor_product = VendorProduct.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def vendor_product_params
    params.require(:vendor_product).permit(:sli_group_code, :sli_code, :sli_name, :vendor_code, :unit, :rate,
      :vendor_id, :master_line_item_id,
      sli_dynamic_attributes: [])
  end

  def set_dynamic_attributes
    @vendor_product.sli_dynamic_attributes.destroy_all
    params[:dynamic_attributes].each do |dynamic_attribute_hash|
      if dynamic_attribute_hash[:attr_value].present?
        dynamic_attribute = @vendor_product.sli_dynamic_attributes.where(mli_attribute_id: dynamic_attribute_hash[:mli_attribute_id]).first_or_initialize
        dynamic_attribute.attr_value = dynamic_attribute_hash[:attr_value]
        dynamic_attribute.save!
      end
    end
    rescue
      return false
  end
end
