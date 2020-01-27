require "#{Rails.root.join('app','serializers','vendor_serializer')}"
require "#{Rails.root.join('app','serializers','vendor_category_serializer')}"

class Api::V1::VendorsController < Api::V1::ApiController
  before_action :set_vendor, only: [:show, :update, :destroy]
  load_and_authorize_resource :vendor

  # GET /vendors
  def index
    page_size = 9

    if params[:page_size].present?
      page_size = params[:page_size]
    end
    if params[:filter_by_type].present? && params[:filter_by_id].present?
      filtering_options = {}
      filtering_options["filter_by_type"] = params[:filter_by_type]
      filtering_options["filter_by_id"] = params[:filter_by_id]
      @vendors = Vendor.filtered_vendors(filtering_options)
    else
      @vendors = Vendor.all.order(created_at: :desc)
    end
    
    @vendors = @vendors.search(params[:search].downcase) if params[:search].present?

    paginate json: @vendors, per_page: page_size
    # render json: @vendors, status: 200
  end

  def index_new
    if params[:job_element_id].present?
      job_element = JobElement.find params[:job_element_id]
      vendor_product = job_element.vendor_product
      if vendor_product.present?
        @vendors = Vendor.where(id: vendor_product.vendor)
      else
        @vendors = Vendor.all
      end
    end

    @vendors = filter_multiple_vendors(@vendors)

    render json: @vendors
  end

  def get_vendor_list
    @vendors = Vendor.all.select(:id, :name)
    render json: {vendors: @vendors}, status: 200
  end

  # GET /vendors/1
  def show
    render json: @vendor, serializer: VendorFullInformationSerializer
  end

  # POST /vendors
  def create
    ActiveRecord::Base.transaction do
      begin
        @vendor = Vendor.new(vendor_params)
        linked_vendor = @vendor.create_user
        if linked_vendor.class.to_s == 'Vendor'
          render json: {message: "User already present and linked to another vendor. Vendor Name - #{linked_vendor.name}, PAN - #{linked_vendor.pan_no}"}, status: :unprocessable_entity
        else
          sub_category_ids = params[:sub_category_ids].uniq if params[:sub_category_ids].present?
          serviceable_city_ids = params[:serviceable_city_ids].uniq if params[:serviceable_city_ids].present?
          sub_category_ids&.map { |sub_category_id|  @vendor.sub_categories << VendorCategory.find(sub_category_id)}
          serviceable_city_ids&.map { |serviceable_city_id|  @vendor.serviceable_cities << City.find(serviceable_city_id["id"])}
          if @vendor.save!
            GstNumber.add_gst_number(params[:vendor][:gsts], @vendor.id, "Vendor")  # Add multiple GST numbers
            @vendor.contents.destroy_all
             array_of_contents = []
             params["vendor"]['gst_attachments'].map{|a| array_of_contents.push({:document => a,:scope => "vendor_gst"})} if params["vendor"]['gst_attachments'].present?
             params["vendor"]['dd_upload_attachments'].map{|a| array_of_contents.push({:document => a["document"], :document_file_name => a["file_name"],:scope => "dd_list"})}  if params["vendor"]['dd_upload_attachments'].present?
             @vendor.contents.create!(array_of_contents) if array_of_contents.present?
              #  #add multiple gst files
              #  #if params["vendor"]["dd_attachments"].present?
              # array_of_dd_contents=params["vendor"]['dd_attachments'].map{|a| {:document => a,:scope => "dd_list"}}
              # @vendor.contents.new(array_of_dd_contents)
              # @vendor.save!
            # end
            render json: @vendor
          else
            render json: {message: @vendor.errors.full_messages}, status: :unprocessable_entity
          end
        end
      end
    end
  end

  # PATCH/PUT /vendors/1
  def update
    if @vendor.update(vendor_params)
      GstNumber.add_gst_number(params[:vendor][:gsts], @vendor.id, "Vendor") # Add multiple GST numbers
      # @vendor.contents.destroy_all
      @vendor.contents&.where(id: params[:contents_to_delete])&.destroy_all
      # if params["vendor"]['gst_attachments'].present?
      #   array_of_contents=params["vendor"]['gst_attachments'].map{|a| {:document => a,:scope => "vendor_gst"}}
      #   @vendor.contents.new(array_of_contents) #add multiple gst files
      #   @vendor.save!
      # end
      array_of_contents = []
      params["vendor"]['gst_attachments'].map{|a| array_of_contents.push({:document => a,:scope => "vendor_gst"})} if params["vendor"]['gst_attachments'].present?
      params["vendor"]['dd_upload_attachments'].map{|a| array_of_contents.push({:document => a["document"], :document_file_name => a["file_name"],:scope => "dd_list"})}  if params["vendor"]['dd_upload_attachments'].present?
      @vendor.contents.create!(array_of_contents) if array_of_contents.present?

      serviceable_city_ids = []
      params[:serviceable_city_ids]&.map { |serviceable_city_id|  serviceable_city_ids.push(serviceable_city_id["id"])}
      city_ids = @vendor.serviceable_cities.pluck(:id)
      cities_for_delete = city_ids - serviceable_city_ids
      cities_for_delete&.map { |city_for_delete|  @vendor.serviceable_cities.delete(City.find(city_for_delete))}
      cities_for_add = serviceable_city_ids - city_ids
      cities_for_add&.map { |city_for_add|  @vendor.serviceable_cities << City.find(city_for_add)}
      
      sub_category_ids = @vendor.sub_categories.pluck(:id)
      sub_category_for_delete = sub_category_ids - params[:sub_category_ids]
      sub_category_for_delete&.map { |sub_category_id|  @vendor.sub_categories.delete(VendorCategory.find(sub_category_id))}
      sub_category_for_add = params[:sub_category_ids] - sub_category_ids
      sub_category_for_add&.map { |sub_category_id|  @vendor.sub_categories << VendorCategory.find(sub_category_id)}

      render json: @vendor
    else
      render json: @vendor.errors, status: :unprocessable_entity
    end
  end

  # DELETE /vendors/1
  def destroy
    @vendor.destroy
  end

  def get_vendor_categories
    @vendor_categories = VendorCategory.where(parent_category_id: nil)
    render json: @vendor_categories
  end

  def get_vendor_sub_categories
    if params[:parent_category_id].present?
      @vendor_categories = VendorCategory.where(parent_category_id: params[:parent_category_id])
      render json: @vendor_categories
    else
      render json: {message: "Send Proper Parent Category ID"}
    end
  end
  

  def sample_dd_files
    output = {}
    begin
      non_panel_file = Base64.encode64(File.open(Rails.root.join('app', 'data', 'sample dd list','DD sheet Non Panel.xls')).read) if params[:file_type].in?(['non_panel_file','both'])
      panel_file = Base64.encode64(File.open(Rails.root.join('app', 'data', 'sample dd list','Due Diligence Panel.xlsx')).read) if params[:file_type].in?(['panel_file','both'])

      output[:non_panel_file] = non_panel_file if non_panel_file.present?
      output[:panel_file] = panel_file if panel_file.present?

      render json: output, status: 200
    rescue StandardError => e
      render json: {message: "Something went Wrong"}, status: 400
    end
  end

  
  private
  # Use callbacks to share common setup or constraints between actions.
  def set_vendor
    @vendor = Vendor.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def vendor_params
    params.require(:vendor).permit(:name, :address, :contact_person, :contact_number, :email,
      :pan_no, :gst_reg_no, :account_holder, :account_number, :bank_name, :branch_name,
      :ifsc_code, :pan_copy, :gst_copy, :cancelled_cheque, :city, :dd_score)
  end

  def filter_multiple_vendors(vendors_to_filter)
    if params[:search_string].present? || params[:filter_params].present?
      filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      vendors_to_filter.search(params[:search_string].to_s, filter_params)
    else
      vendors_to_filter
    end
  end
end
