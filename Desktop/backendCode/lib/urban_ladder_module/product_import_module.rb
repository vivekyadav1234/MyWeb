# Currently, this works only for the default case, ie where product_template is null.
module UrbanLadderModule::ProductImportModule
  include UrbanLadderModule::ApiCallModule

  ORIGIN = "urban_ladder"
  SKU_PREFIX = "UL-"
  INCH_TO_MM = 25.4
  WARRANTY_TEXT = "The product comes with 12 month warranty against any manufacturing defects and any other issues with the materials that have been used. The warranty does not cover damages due to usage of the product beyond its intended use and wear and tear in the natural course of product usage."
  ALLOWED_PROPERTIES = ['remark', 'product_config', 'material', 'color']

  # import products given a taxon_id (this method imports data to an excel.)
  def self.import_products_excel(taxon_id)
    total_pages = self.pages_for_taxon(taxon_id)

    product_ids = []
    (1..total_pages).each do |page_number|
      products = self.get_products(taxon_id, page_number)
      products.each do |product_hash|
        product_ids << product_hash[:product_id]
      end
    end

    # Now extract the individual products and add data to sheet.
    package = Axlsx::Package.new
    workbook = package.workbook
    sheet = workbook.add_worksheet(name: "Products")
    add_headers(sheet)
    product_ids.each do |product_id|
      self.import_product_excel(product_id, sheet)
    end

    file_name = "Taxon-#{taxon_id}-#{Time.zone.now.strftime("%Y-%m-%d")}.xlsx"
    filepath = Rails.root.join("app", "data", "urban_ladder", file_name)
    package.serialize(filepath)
  end

  # check if response to get the list of products for a taxon_id is success or not
  def self.taxon_check_status(taxon_id)
    url = UrbanLadderModule::ApiCallModule.taxon_variant_url(taxon_id, 1)
    response = UrbanLadderModule::ApiCallModule.api_call(url)
    response.code.to_i == 200
  end

  # get the no of pages in the variants end point for a taxon
  def self.pages_for_taxon(taxon_id)
    url = UrbanLadderModule::ApiCallModule.taxon_variant_url(taxon_id, 1)
    response = UrbanLadderModule::ApiCallModule.api_call(url)
    h = JSON.parse(response.body).with_indifferent_access
    total_pages = h[:pages].to_i
  end

  # returns an array of products.
  def self.get_products(taxon_id, page)
    url = UrbanLadderModule::ApiCallModule.taxon_variant_url(taxon_id, page)
    response = UrbanLadderModule::ApiCallModule.api_call(url)
    h = JSON.parse(response.body).with_indifferent_access
    h[:products]
  end

  # to excel
  def self.import_product_excel(product_id, sheet)
    url = UrbanLadderModule::ApiCallModule.product_url(product_id)
    begin
      response = UrbanLadderModule::ApiCallModule.api_call(url)
      if response.class == Net::HTTPNotFound
        puts "Response is HTTP 404 for product_id #{product_id}. Skipping."
        return false
      end
      h = JSON.parse(response.body).with_indifferent_access
      unless h[:status] == "success"
        puts "Status is not success. Skipping product_id: #{product_id}"
        return false
      end
    rescue
      puts "Exception occured. Skipping product_id: #{product_id}"
      return false
    end
    product_hash = h[:data]
    # First enter master data
    sheet.add_row([
      product_hash[:id],
      nil,
      product_hash[:name],
      product_hash[:description],
      product_hash[:url],
      product_hash[:master_sku],
      product_hash[:primary_taxon]["name"],
      product_hash[:product_template],
      product_hash[:product_properties],
      product_hash[:non_displayable_product_properties]
    ])

    # Then the variant data.
    product_hash["variants"].each do |variant_hash|
      sheet.add_row([
        variant_hash["id"],
        "false",
        variant_hash["name"],
        nil,
        nil,
        nil,
        nil,
        variant_hash["product_template"],
        nil,
        nil,
        variant_hash["sku"],
        variant_hash["weight"],
        variant_hash["height"],
        variant_hash["width"],
        variant_hash["depth"],
        variant_hash["price"],
        variant_hash["discount_price"],
        variant_hash["total_discount_percentage"],
        variant_hash["in_stock"].to_s,
        variant_hash["pre_order_status"].to_s,
        variant_hash["option_values"],
        variant_hash["variant_properties"]
      ])
    end

    return true
  end

  def self.add_headers(sheet)
    sheet.add_row([
      "id",
      "is_master",
      "name",
      "description",
      "url",
      "master_sku",
      "primary_taxon",
      "product_template",
      "product_properties",
      "non_displayable_product_properties",
      "sku", 
      "weight", 
      "height", 
      "width", 
      "depth", 
      "price", 
      "discount_price", 
      "total_discount_percentage",
      "in_stock", 
      "pre_order_status", 
      "option_values", 
      "variant_properties"
    ])
  end

  # import products given a taxon_id (into the DB)
  def self.import_products(taxon_id, options = {})
    # byebug if taxon_id == -12
    return false unless taxon_check_status(taxon_id)
    total_pages = self.pages_for_taxon(taxon_id)

    product_ids = []
    (1..total_pages).each do |page_number|
      products = self.get_products(taxon_id, page_number)
      products.each do |product_hash|
        product_ids << product_hash[:product_id]
      end
    end

    # Now import the individual products into the DB.
    # Do it now or queue the jobs based on the options provided.
    if options[:import_now]
      product_ids.each do |product_id|
        self.import_product(product_id, options)
      end
    else
      product_ids.each do |product_id|
        job = UrbanLadder::ProductImportJob.perform_later(product_id)
        UrbanLadderQueue.create!(
          product_id: product_id,
          status: 'pending',
          job_id: job.provider_job_id
          )
      end
    end
  end

  # to DB
  # only for import of the default case ie where product_template is 'null'/nil
  def self.import_product(product_id, options = {})
    url = UrbanLadderModule::ApiCallModule.product_url(product_id)
    begin
      response = UrbanLadderModule::ApiCallModule.api_call(url)
      if response.class == Net::HTTPNotFound
        puts "Response is HTTP 404 for product_id #{product_id}. Skipping."
        return false
      end
      h = JSON.parse(response.body).with_indifferent_access
      unless h[:status] == "success"
        puts "Status is not success. Skipping product_id: #{product_id}"
        return false
      end
    rescue
      puts "Exception occured. Skipping product_id: #{product_id}"
      return false
    end
    product_hash = h[:data]
    # First enter master data
    common_attributes = Hash.new
    common_attributes[:product_id] = product_id
    common_attributes[:url] = product_hash[:url]
    common_attributes[:master_sku] = product_hash[:master_sku]
    common_attributes[:product_template] = product_hash[:product_template] || 'null'
    return false unless common_attributes[:product_template] == 'null'

    ALLOWED_PROPERTIES.each do |attr_name|
      options[attr_name] = []
    end
    property_mapping = load_property_mapping
    # Now, add the properties that are sent in the product response, ie common for all variants.
    # Using key "product_properties".
    product_hash['product_properties'].each do |property_hash|
      attr_name = property_mapping[property_hash["name"].strip]   #remove beginning and trailing spaces
      next unless ALLOWED_PROPERTIES.include?(attr_name)
      attr_value = property_hash["value"]
      options[attr_name] << "#{property_hash['presentation']}: #{attr_value}" 
    end

    # now import the variants - each variant is saved as a separate product
    product_hash["variants"].each do |variant_hash|
      import_variant(variant_hash, common_attributes, options)
    end
    return true
  end

  # to DB. Each variant is a separate product.
  def self.import_variant(variant_hash, common_attributes, options = {})
    # only eligible products
    return false unless ( variant_hash["in_stock"] || variant_hash["pre_order_status"] )
    unique_sku = ( SKU_PREFIX + variant_hash["sku"] ) if variant_hash["sku"].present?
    length = variant_hash["width"].to_i > 0 ? (variant_hash["width"].to_i * INCH_TO_MM) : nil
    width = variant_hash["depth"].to_i > 0 ? (variant_hash["depth"].to_i * INCH_TO_MM) : nil
    height = variant_hash["height"].to_i > 0 ? (variant_hash["height"].to_i * INCH_TO_MM) : nil
    product = Product.urban_ladder.where(imported_sku: variant_hash["sku"]).first_or_initialize
    return false unless eligible_for_import?(product)
    product.assign_attributes(
      origin: ORIGIN, 
      imported_sku: variant_hash["sku"], 
      last_imported_at: Time.zone.now, 
      name: variant_hash[:name], 
      unique_sku: unique_sku, 
      sale_price: variant_hash["discount_price"], 
      length: length, 
      width: width, 
      height: height,
      warranty: WARRANTY_TEXT
      )

    # Now, add the ALLOWED_PROPERTIES values from the variant hash.
    # Using key "option_values".
    ALLOWED_PROPERTIES.each do |attr_name|
      options[attr_name] = options[attr_name].present? ? options[attr_name] : []
    end
    property_mapping = load_property_mapping
    variant_hash['option_values'].each do |property_hash|
      # byebug
      attr_name = property_mapping[property_hash["option_type_presentation"].strip]   #remove beginning and trailing spaces
      next unless ALLOWED_PROPERTIES.include?(attr_name)
      attr_value = property_hash["presentation"]
      options[attr_name] << "#{attr_value}" 
    end

    assign_allowed_properties(product, options)

    product.save!
    urban_ladder_info = product.urban_ladder_info.present? ? product.urban_ladder_info : product.build_urban_ladder_info

    urban_ladder_info.assign_attributes(
      master_sku: common_attributes[:master_sku], 
      product_template: common_attributes[:product_template], 
      url: common_attributes[:url],
      ul_product_id: common_attributes[:product_id],
      price: variant_hash["price"]
      )

    urban_ladder_info.save!

    # Now import the images. Then destroy existing images.
    unless options[:skip_images]
      product.product_images.destroy_all
      variant_hash["images"].each do |images_info_hash|
        import_image(product, images_info_hash)
      end
    end
  end

  def self.import_image(product, images_info_hash)
    downloaded_image = open(images_info_hash["url"])
    image_name = get_image_name(images_info_hash["url"])
    if images_info_hash["tag_name"]&.downcase == "base"
      product.update!(product_image: downloaded_image)
    else      
      product.product_images.create!(image_name: image_name, product_image: downloaded_image)
    end
    rescue
      return false
  end

  # Load UL to our DB property name mapping from the YAML file.
  # Note that the keys will be strings, not symbols.
  def self.load_property_mapping
    filepath = Rails.root.join('lib', 'urban_ladder_module', 'property_mapping.yml')
    mapping_hash = YAML.load_file filepath
  end

  def self.assign_allowed_properties(product, options)
    ALLOWED_PROPERTIES.each do |attr_name|
      # byebug
      product.send("#{attr_name}=", options[attr_name].uniq.join("; "))
    end
  end

  # returns the list of missing SKUs (and corresponding product_id) for the given taxon ids
  def self.missing_skus(taxon_ids = nil)
    taxon_ids_for_import = taxon_ids
    taxon_ids_for_import ||= UrbanLadderModule::TaxonomyImport.taxons_for_import
    missing = []
    taxon_ids_for_import.each do |taxon_id|
      # begin
        missing << missing_skus_taxon(taxon_id)
      # rescue
        # taxon_ids_failed << taxon_id
        # next
      # end
    end

    UrbanLadderMailer.missing_skus(missing.flatten).deliver!
  end

  # returns the list of missing SKUs (and corresponding product_id) for a signle taxon id.
  # mostly follows logic similar to the import_products() method.
  def self.missing_skus_taxon(taxon_id)
    unless taxon_check_status(taxon_id)
      return {
        taxon_id: taxon_id,
        error: "API call didn't return success message. This may not ba valid taxon_id."
      }
    end
    total_pages = self.pages_for_taxon(taxon_id)

    product_ids = []
    (1..total_pages).each do |page_number|
      products = self.get_products(taxon_id, page_number)
      products.each do |product_hash|
        product_ids << product_hash[:product_id]
      end
    end

    h = Hash.new
    arr = []

    # check for each inidvidual product_id.
    product_ids.uniq.each do |product_id|
      m_hash = missing_skus_product_id(product_id)
      arr << m_hash if ( m_hash[:missing_skus].present? || m_hash[:error].present? )
    end

    h[:taxon_id] = 305
    h[:missing] = arr.flatten
    # remove those pro
    h
  end

  # check the missing variant skus for a given product_id
  def self.missing_skus_product_id(product_id)
    url = UrbanLadderModule::ApiCallModule.product_url(product_id)
    begin
      response = UrbanLadderModule::ApiCallModule.api_call(url)
      if response.class == Net::HTTPNotFound
        return {
          product_id: product_id,
          error: "Response is HTTP 404 for product_id #{product_id}. Skipping."
        }
      end
      h = JSON.parse(response.body).with_indifferent_access
      unless h[:status] == "success"
        return {
          product_id: product_id,
          error: "Status is not success. Skipping product_id: #{product_id}"
        }
      end
    rescue
      return {
        product_id: product_id,
        error: "Exception occured. Skipping product_id: #{product_id}"
      }
    end

    return_hash = Hash.new
    arr = []
    h[:data]["variants"].each do |variant_hash|
      variant_sku = variant_hash["sku"]
      unless Product.where(imported_sku: variant_sku).present?
        arr << variant_sku
      end
    end

    return_hash[:product_id] = product_id
    return_hash[:missing_skus] = arr
    return_hash
  end

  private
  # convert "https://www.ulcdn.net/images/products/164701/product/Genoa_Wing_Chair_LP.jpg?1518589492"
  # into "Genoa_Wing_Chair_LP"
  def self.get_image_name(url)
    last_part = url.split("/").last
    last_part.partition(".").first
  end

  # check if the given product should be imported or not
  def self.eligible_for_import?(product)
    product.new_record? || ( product.last_imported_at.present? && product.last_imported_at > 6.days.ago )
  end

  # product won't be imported if its last_imported_at is within this time.
  def self.minimum_import_interval
    6.days.ago
  end
end
