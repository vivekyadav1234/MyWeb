require "#{Rails.root.join('app','serializers','product_serializer')}"

class Api::V1::ProductsController < Api::V1::ApiController
  before_action :set_product, only: [:show, :update, :get_product_master_fabrics, :like]
  load_and_authorize_resource except: [:create, :update, :all_product_list, :all_ranges, :import_excel]

  def index
    @section = Section.find(params[:section_id])
    @products = @section.products

    paginate json: @products
  end

  def all_product_list
    @products = Product.all
    paginate json: @products
  end

  def show
    @catalog_type = current_user&.catalog_type || Product::DEFAULT_CATALOG_TYPE
    render json: @product, serializer: ProductSerializerForShow, current_user: current_user, catalog_type: @catalog_type
  end

  def create
    @section = Section.find(params[:section_id])
    @product = product_params.map {|product_param| @section.products.create(product_param)}
    paginate json: @products, status: :created
  end

  def update
    if @product.update(product_params)
      render json: @product
    else
      render json: {message: @product.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This product cannot be deleted as it is in use."}, status: 422
  end

  # the min,max values for various sliders viz sale_price, lead_time, width, length, height
  # this is used to populate the min, max values of the silders for the filter.
  def slider_ranges
    hash = {}
    catalog_type = current_user&.catalog_type || Product::DEFAULT_CATALOG_TYPE
    # first filter the products
    products_to_filter = Product.none
    subcategory_ids = JSON.parse(params[:subcategory_ids]) if params[:subcategory_ids].present?
    if subcategory_ids.present?
      subcategories = CatalogSubcategory.where(id: subcategory_ids)
      products_to_filter = Product.joins(:catalog_subcategories).where(catalog_subcategories: { id: subcategories }).where(catalog_type: catalog_type)
    else
      products_to_filter = Product.where(catalog_type: catalog_type)
    end
    products = filter_products(products_to_filter)

    # sliders
    price_array = products.pluck(:sale_price).uniq
    hash[:minimum_price] = price_array.compact.min
    hash[:maximum_price] = price_array.compact.max
    lead_time_array = products.pluck(:lead_time).uniq
    hash[:minimum_lead_time] = lead_time_array.compact.min
    hash[:maximum_lead_time] = lead_time_array.compact.max
    width_array = products.pluck(:width).uniq
    hash[:minimum_width] = width_array.compact.min
    hash[:maximum_width] = width_array.compact.max
    length_array = products.pluck(:length).uniq
    hash[:minimum_length] = length_array.compact.min
    hash[:maximum_length] = length_array.compact.max
    height_array = products.pluck(:height).uniq
    hash[:minimum_height] = height_array.compact.min
    hash[:maximum_height] = height_array.compact.max
    hash[:classes] = CatalogClass.joins(:product_classes).where(product_classes: { product_id: products.pluck(:id) }).distinct.map{ |klass| klass.attributes.slice("id", "name")}
    # sub-filters
    # hash[:materials] = products.pluck(:material).compact.uniq
    # hash[:finishes] = products.pluck(:finish).compact.uniq
    # hash[:colors] = products.pluck(:color).compact.uniq

    render json: hash
  end

  def filter
    @catalog_type = current_user&.catalog_type || Product::DEFAULT_CATALOG_TYPE
    products_to_filter = Product.none
    subcategory_ids = JSON.parse(params[:subcategory_ids]) if params[:subcategory_ids].present?
    subcategories = nil
    if subcategory_ids.present?
      subcategories = CatalogSubcategory.where(id: subcategory_ids)
      products_to_filter = Product.joins(:catalog_subcategories).where(catalog_subcategories: { id: subcategories }).of_catalog_type(@catalog_type)
    else
      products_to_filter = Product.of_catalog_type(@catalog_type)
    end
    products = paginate filter_products(products_to_filter)
    hash_to_render = ActiveModelSerializers::SerializableResource.new(products, each_serializer: ProductLandingSerializer, current_user: current_user).serializable_hash
    hash_to_render[:breadcrumb] = subcategories.first.breadcrumb if subcategories.present?
    hash_to_render[:catalog_type] = @catalog_type

    render json: hash_to_render
  end

  # If a product is not liked by a user, mark it as liked. If it was liked, then remove the like.
  def like
    if @product.toggle_like(current_user)
      render json: {message: "Added to your liked products."}
    else
      render json: {message: "Removed from your liked products."}
    end
  rescue
    render json: {message: "Something went wrong. The requested action could not be performed."}, status: :unprocessable_entity
  end

  def download_products_pdf
    filepath = Rails.root.join("public","Catalog-Report.pdf")
    render json: {products_pdf: Base64.encode64(File.open(filepath).to_a.join)}
  end

  def get_product_master_fabrics
    @master_options = @product.master_options&.select(:id, :name)
    render json: @master_options, status: 200
  end

  def get_product_master_sub_options
    @master_option = MasterOption.find params[:master_option_id]
    @master_sub_option = @master_option&.master_sub_options&.select(:id, :name).as_json
    render json: @master_sub_option, status: 200
  end

  def get_product_catalogue_options
    @master_sub_option = MasterSubOption.find params[:master_sub_option_id]
    @catalogue_options = @master_sub_option&.catalogue_options&.select(:id, :name).as_json
    render json: @catalogue_options, status: 200
  end

  def get_product_variants
    @catalogue_options = CatalogueOption.find params[:catalogue_option_id]
    @product_variants = @catalogue_options&.product_variants
    render json: ProductVariantSerializer.new(@product_variants).serialized_json, status: 200
  end

  def get_product_variant_images
    product_variant = ProductVariant.find(params[:product_variant_id])&.fabric_image&.url
    render json: {image_url: "https:#{product_variant}"}, status: 200
  end

  def import_excel
    str = params[:attachment].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    filename = "products-#{Time.zone.now}.xlsx"
    filepath = Rails.root.join("tmp").join(filename)
    begin
      File.open(filepath, "wb") do |f|
        f.write(Base64.decode64(str))
        f.close
      end
    rescue
      return render json: {message: ["Given file could not be read. Please check that the file is a valid excel file."]}, status: :unprocessable_entity
    end

    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    errors = []

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      error_arr = []
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['Product']]
      unique_sku = workbook.row(row)[headers['Unique SKU Code']]
      # product_url = workbook.row(row)[headers['URL']]
      length = workbook.row(row)[headers['L (mm)']]
      width = workbook.row(row)[headers['B (mm)']]
      height = workbook.row(row)[headers['H (mm)']]

      material = workbook.row(row)[headers['Material']]
      # dimension_remark = workbook.row(row)[headers['Remarks on Dimensions']]
      warranty = workbook.row(row)[headers['Warranty']]
      finish = workbook.row(row)[headers['Finish']]

      # vendor_sku = workbook.row(row)[headers['Vendor SKU Code']]
      color = workbook.row(row)[headers['Color']]
      product_config = workbook.row(row)[headers['Configuration']]&.gsub('&', 'and')

      # cost_price = workbook.row(row)[headers['Cost Price']]
      sale_price = workbook.row(row)[headers['Selling Price']]
      # vendor_name = workbook.row(row)[headers['Supplier']]

      lead_time = workbook.row(row)[headers['Lead Time']]
      remark = workbook.row(row)[headers['Remarks']]
      measurement_unit = workbook.row(row)[headers['Measurement Units']]
      qty = workbook.row(row)[headers['No of units']]
      parent_sku = headers['Parent SKU'].present? ? workbook.row(row)[headers['Parent SKU']]  : ""

      # assign space tags
      space_tag_names  = workbook.row(row)[headers['Space']]&.split(',')&.map{|str| Tag.format_name(str.strip)}

      # assign range tags
      range_tag_names  = workbook.row(row)[headers['Range']]&.split(',')&.map{|str| Tag.format_name(str.strip)}
      # space_tags = Tag.non_panel_ranges.where(name: tag_name_array).first_or_create!

      # set catalog_type - 'arrivae' by default, else 'polka'
      catalog_type = workbook.row(row)[headers['Polka']] == 'Yes' ? 'polka' : Product::DEFAULT_CATALOG_TYPE

      # Temporary - restore previous line after catalog revamp is done.
      product = Product.where(unique_sku: unique_sku).first_or_initialize

      # Business Unit association - add error if not found
      business_unit_names = workbook.row(row)[headers['Unit']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
      if business_unit_names.present?
        business_unit_names.each do |unit_name|
          business_unit = BusinessUnit.find_by(unit_name: unit_name)
          if business_unit.present?
            product.unit_product_mappings.where(business_unit: business_unit).first_or_initialize
          else
            error_arr << "No business unit named #{unit_name} found."
          end
        end
      else
        error_arr << "No business unit specified."
      end

      # Segment association - add error if not found
      segment_names = workbook.row(row)[headers['Segment']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
      if segment_names.present?
        segment_names.each do |segment_name|
          catalog_segment = CatalogSegment.find_by(segment_name: segment_name)
          if catalog_segment.present?
            product.product_segments.where(catalog_segment: catalog_segment).first_or_initialize
          else
            error_arr << "No segment named #{segment_name} found."
          end
        end
      else
        error_arr << "No segment specified."
      end

      # Category association - add error if not found
      category_names = workbook.row(row)[headers['Category']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
      if category_names.present?
        category_names.each do |category_name|
          catalog_category = CatalogCategory.find_by(category_name: category_name)
          if catalog_category.present?
            product.product_categories.where(catalog_category: catalog_category).first_or_initialize
          else
            error_arr << "No category named #{category_name} found."
          end
        end
      else
        error_arr << "No category specified."
      end

      # Subcategory association - add error if not found
      subcategory_names = workbook.row(row)[headers['Sub-Category']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
      if subcategory_names.present?
        subcategory_names.each do |subcategory_name|
          catalog_subcategory = CatalogSubcategory.find_by(subcategory_name: subcategory_name)
          if catalog_subcategory.present?
            product.product_subcategories.where(catalog_subcategory: catalog_subcategory).first_or_initialize
          else
            error_arr << "No sub-category named #{subcategory_name} found."
          end
        end
      else
        error_arr << "No sub-category specified."
      end

      # Class association - add error if not found
      klass_names = workbook.row(row)[headers['Class']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
      if klass_names.present?
        klass_names.each do |klass_name|
          catalog_class = CatalogClass.find_by(name: klass_name)
          if catalog_class.present?
            product.product_classes.where(catalog_class: catalog_class).first_or_initialize
          else
            error_arr << "No class named #{klass_name} found."
          end
        end
      else
        error_arr << "No class specified."
      end

      parent = Product.find_by unique_sku: parent_sku
      product.assign_attributes(
        name: name,
        # image_name: image_name,
        # product_url: product_url,
        length: length,
        width: width,
        height: height,
        material: material,
        # dimension_remark: dimension_remark,
        warranty: warranty,
        finish: finish,
        # vendor_sku: vendor_sku,
        color: color,
        product_config: product_config,
        # cost_price: cost_price,
        sale_price: sale_price,
        # vendor_name: vendor_name,
        lead_time: lead_time,
        remark: remark,
        measurement_unit: measurement_unit,
        qty: qty,
        parent_product: parent,
        catalog_type: catalog_type
      )

      if product.valid?
        product.save
      else
        error_arr << product.errors.full_messages.join('')
      end

      errors.push({
        unique_sku: unique_sku,
        errors: error_arr
      }) if error_arr.present?
    end

    # Delete it later. Sample.
    # error_messages = [
    #   {
    #     unique_sku: "LFM0001",
    #     errors: ["Name cannot be blank", "Unique sku cannot be blank"]
    #   },
    #   {
    #     unique_sku: "LQR0021",
    #     errors: ["Category named Pottery was not found"]
    #   }
    # ]

    render json: errors.to_json
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_product
    @product = Product.find(params[:id])
  end

  # Product must belong to a section
  def set_section
    @section = Section.find params[:section_id]
  end

  # Only allow a trusted parameter "white list" through.
  def product_params
    params.permit(product: [:name, :price, :description, :section_id, :attachment_file]).require(:product)
  end

  def filter_products(products_to_filter)
    if params[:search_string].present? || params[:filter_params].present?
      filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      filter_params[:current_user] = current_user
      products_to_filter.search(params[:search_string].to_s, filter_params)
    else
      products_to_filter
    end
  end
end
