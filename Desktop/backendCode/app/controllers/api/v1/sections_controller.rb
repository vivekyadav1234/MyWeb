require "#{Rails.root.join('app','serializers','section_serializer')}"
class Api::V1::SectionsController < Api::V1::ApiController
  #Only admin may create/update, but others may view.
  skip_before_action :authenticate_user!, only: [:index, :show, :import_products]
  before_action :set_section, only: [:show, :update, :destroy, :import_products]

  load_and_authorize_resource except: [:create, :update, :import_products, :products_for_catalog, :products_for_configuration]

  def index
    if params[:parent_id].present?
      @parent = Section.find(params[:parent_id])
      @sections = @parent.children
    else
      @sections = Section.roots
    end

    paginate json: @sections
  end

  def show
    render json: @section, serializer: SectionWithDetailsSerializer
  end

  def create
    if params[:parent_id].present?
      @parent = Section.find(params[:parent_id])
      @section = section_params.map {|section_param| @parent.children.create(section_param)}
    else
      @section = section_params.map {|section_param| Section.new(section_param).save}
    end

    render json: @section, status: :created, each_serializer: SectionWithDetailsSerializer
  end

  def update
    if @section.update(update_params)
      render json: @section, serializer: SectionWithDetailsSerializer
    else
      render json: {message: @section.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    @section.children.destroy_all
    if @section.destroy
      render json: {message: "Section successfully deleted."}
    else
      render json: {message: @section.errors}
    end
  end

  # DELETE IF NOT USED ONCE NEW CATALOG GOES LIVE!
  # list all products, configurations for this section - will work only for leaves, not roots
  # def products_for_catalog
  #   if params[:section_id] == 'all'
  #     # All parent products, not variations
  #     @products = Product.where(parent_product_id: nil)
  #     @products = paginate @products
  #     hash = {
  #       id: nil,
  #       name: 'All'
  #     }
  #     hash.merge!(hash.merge(ActiveModelSerializers::SerializableResource.new(@products, each_serializer: AllProductCatalogSerializer).serializable_hash))
  #     render json: {section: hash}
  #   else
  #     @parent = Section.find(params[:section_id])
  #     if @parent.parent.blank?  #it is a root section
  #       @sections = @parent.children
  #       @products = Product.where(parent_product_id: nil, section: @sections)
  #       @products = paginate @products
  #       hash = {
  #         id: nil,
  #         name: @parent.name
  #       }
  #       hash[:sub_sections] = @sections.map{|section| {id: section.id, name: section.name,count: Product.where(parent_product_id: nil, section: section.id).count}}
  #       hash.merge!(hash.merge(ActiveModelSerializers::SerializableResource.new(@products, each_serializer: AllProductCatalogSerializer).serializable_hash))
  #       render json: {section: hash}
  #     else
  #       @section = @parent  #leave sections(s)
  #       render json: @section, serializer: SectionCatalogSerializer
  #     end
  #   end
  # end

  # DELETE IF NOT USED ONCE NEW CATALOG GOES LIVE!
  # list all products for this configuration
  # def products_for_configuration
  #   @product_config = ProductConfiguration.find params[:configuration_id]
  #   render json: @product_config, serializer: ConfigurationCatalogSerializer
  # end

  # DELETE IF NOT USED ONCE NEW CATALOG GOES LIVE!
  # for given array of space tag IDs, return all the categories applicable (Loose Furniture)
  # def categories_for_spaces
  #   if params[:all_categories] == "true"
  #     @categories = Section.loose_furniture.children
  #   else
  #     ids = params[:space_ids] ? JSON.parse(params[:space_ids]) : []
  #     space_tags = Tag.loose_spaces.where(id: ids)
  #     @categories = Section.loose_furniture.children.joins(:tags).where(tags: { id: space_tags.pluck(:id) }).distinct
  #   end
  #   render json: @categories, space_ids: ids, each_serializer: SectionWithProductCountSerializer
  # end

  # DELETE IF NOT USED ONCE NEW CATALOG GOES LIVE!
  # for given array of category IDs, return all the configurations applicable (Loose Furniture)
  # def configurations
  #   space_ids = params[:space_ids] ? JSON.parse(params[:space_ids]) : []
  #   space_tags = Tag.loose_spaces.where(id: space_ids)
  #   ids = params[:category_ids] ? JSON.parse(params[:category_ids]) : []
  #   categories = Section.loose_furniture.children.where(id: ids).joins(:tags).where(tags: { id: space_tags.pluck(:id) }).distinct
  #   products = Product.joins(:section).where(sections: { id: categories.pluck(:id) }).distinct
  #   product_configurations = products.pluck(:product_config).compact.uniq
  #   arr = []
  #   product_configurations.each do |configuration|
  #     arr.push(
  #         {
  #           configuration: configuration, 
  #           count: products.where(product_config: configuration).count, 
  #           category_ids: products.where(product_config: configuration).map(&:section_id).uniq
  #         }
  #       )
  #   end

  #   render json: { configurations: arr }
  # end

  # Upload a catalogue file (excel) and import Section and Products data from it.
  def import_products
    initial_product_names = @section.products.pluck :name
    included_products = []
    no_space = []

    str = params[:attachment_file].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    filepath = Rails.root.join("tmp").join("products.xlsx")
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['Product']]
      included_products << name
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

      # product = Product.where(unique_sku: unique_sku, section_id: @section.id).first_or_initialize
      # Temporary - restore previous line after catalog revamp is done.
      product = Product.where(unique_sku: unique_sku).first_or_initialize
      product.section = @section
      puts "-=-=-=-=-=-"
      puts "#{name}"
      puts "-=-=-=-=-=-"
      puts "++++++#{product.inspect}++++++"

      # if a space tag with this name exists, add it to product. Else don't!
      space_tag_names.each do |tag_name|
        product.space_tags = []
        space_tag = Tag.loose_spaces.find_by(name: tag_name)
        if space_tag.present?
          product.product_space_tags.where(tag: space_tag).first_or_initialize
        else
          no_space << tag_name
        end
      end if space_tag_names.present?

      # if a range tag with this name exists, add it to product. Else create a new one!
      range_tag_names.each do |tag_name|
        product.range_tags = []
        range_tag = Tag.non_panel_ranges.where(name: tag_name).first_or_create!
        if range_tag.present?
          product.product_range_tags.where(tag: range_tag).first_or_initialize
        end
      end if range_tag_names.present?

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
        parent_product: parent
      )

      product.save!

      configuration = ProductConfiguration.where(name: product_config, description: " ", code: " " , section_id: @section.id).first_or_create
    end

    @section.tag_with_spaces

    final_product_names = @section.reload.products.pluck :name
    added_names = final_product_names - initial_product_names

    render json: {new_products: added_names,
      updated_products: included_products - added_names}
  end

  def import_services
    initial_product_names = @section.catalogue_services.pluck :unique_sku
    included_products = []

    str = params[:attachment_file].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    filepath = Rails.root.join("tmp").join("services.xlsx")
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['Product Name']]
      image_name = workbook.row(row)[headers['Unique SKU Code']]
      included_products << image_name

      product_type = workbook.row(row)[headers['Product Type']]
      product_subtype = workbook.row(row)[headers['Product Sub-Type']]
      brand = workbook.row(row)[headers['Brand']]
      unique_sku = image_name
      catalogue_code = workbook.row(row)[headers['Catalogue Code']]
      specification = workbook.row(row)[headers['Specification']]
      rate_per_unit = workbook.row(row)[headers['Rate per unit'].to_f]

      l1_rate = workbook.row(row)[headers['L1 Rate'].to_f]
      l1_quote_price = workbook.row(row)[headers['L1 Price to be quoted'].to_f]
      l2_rate = workbook.row(row)[headers['L2 Rate'].to_f]

      l2_quote_price = workbook.row(row)[headers['L2 Price to be quoted'].to_f]
      contractor_rate = workbook.row(row)[headers['Multifunction Contractor Rate'].to_f]
      contractor_quote_price = workbook.row(row)[headers['Contractor Price to be quoted'].to_f]
      measurement_unit = workbook.row(row)[headers['Unit of Mesurement']]

      service = CatalogueService.where(unique_sku: unique_sku).first_or_create

      service.update!(
        name: name,
        image_name: image_name,
        product_type: product_type,
        product_subtype: product_subtype,
        brand: brand,
        catalogue_code: catalogue_code,
        specification: specification,
        rate_per_unit: rate_per_unit,
        l1_rate: l1_rate,
        l1_quote_price: l1_quote_price,
        l2_rate: l2_rate,
        l2_quote_price: l2_quote_price,
        contractor_rate: contractor_rate,
        contractor_quote_price: contractor_quote_price,
        measurement_unit: measurement_unit
      )
    end

    final_product_names = @section.reload.catalogue_services.pluck :unique_sku
    added_names = final_product_names - initial_product_names

    render json: {new_services: added_names,
      updated_services: included_products - added_names}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_section
      @section = Section.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    # def section_params
    #   params.require(:sections).permit(:name, :description, :parent_id,
    #     products_attributes: [:name, :price, :description, :_destroy])
    # end

    def section_params
      # params.permit(section: [:name, :description, :parent_id, :attachment_file]).require(:section)
      # params.require(:section).permit(:name, :description, :parent_id, :attachment_file)
      params.require(:section).map do |p|
        ActionController::Parameters.new(p).permit(
          :name,
          :description,
          :parent_id,
          :attachment_file
        )
      end
    end

    def update_params
      params.require(:section).permit(:name, :description, :parent_id, :attachment_file)
    end

    # def section_params
    #   params.require(:sections).map do |p|
    #     ActionController::Parameters.new(p).permit(
    #       :name,
    #       :description,
    #       :parent_id
    #     )
    #   end
    # end
end
