module CatalogScriptsModule
  FOLDER_PATH = Rails.root.join('app', 'data')

  def populate_catalog_images
    dirpath = "#{FOLDER_PATH}/catalog images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_product = []
    corrupted_files = []

    file_names.each do |filename|
      begin
        unique_sku = filename.partition(".")[0]
        products = Product.where(unique_sku: unique_sku)
        if products.blank?
          no_product << unique_sku
          next
        end
        products.each do |product|
          image_file = File.new("#{dirpath}/#{filename}", "r")
          product.update!(product_image: image_file)
        end
      rescue
        corrupted_files << filename
        next
      end
    end

    puts "No such products:"
    pp no_product
    puts "Files corrupted:"
    pp corrupted_files
  end

  # import from folder - each product's image in a separate dir
  # primary image
  def populate_catalog_images_new
    dirpath = "#{FOLDER_PATH}/catalog images"
    child_directories = Dir.new(dirpath).entries - [".", "..", ".DS_Store"]

    no_product = []
    corrupted_files = []
    child_directories.each do |child_directory|
      product = Product.find_by_unique_sku child_directory
      if product.present?
        image_path = dirpath+"/"+child_directory
        images = Dir.new(image_path).entries - [".", "..", ".DS_Store"]
        image = images.first
        next unless ["jpg", "jpeg", "JPG", "JPEG", "png", "PNG"].include?(image.partition(".").last)
        image_name = image.partition(".")[0]
        image_file = File.open("#{image_path}/#{image}", "r")
        begin
          product.update!(product_image: image_file)
        rescue StandardError => e
          corrupted_files << {sku: child_directory, image_name: image}
        ensure
          image_file.close
        end
      else
        no_product << child_directory
      end
    end

    puts "==========no_product==========="
    puts no_product
    puts "==========corrupted==========="
    puts corrupted_files
  end

  # Modified to upload multiple images. First image will be added to product.
  # Images are sorted by its name. Image names in number will be more helpfull.
  def populate_catalog_multiple_images
    dirpath = "#{FOLDER_PATH}/new_product_images"
    child_directories = Dir.new(dirpath).entries - [".", "..", ".DS_Store"]

    no_product = []
    corrupted_files = []
    child_directories.each do |child_directory|
      product = Product.find_by_unique_sku child_directory
      if product.present?
        if product.product_images.present?
          product.product_images.destroy_all
        end

        image_path = dirpath+"/"+child_directory
        images = (Dir.new(image_path).entries - [".", "..", "[imagecyborg.com]", ".DS_Store"]).sort_by{|filename| filename.partition(".").first}
        # First image as primary image.
        # Rest of the images will be secondary.
        images.each_with_index do |image, i|
          image_name = image.partition(".")[0]
          image_file = File.new("#{image_path}/#{image}", "r")
          if i==0
            begin
              product.update!(product_image: image_file)
            rescue StandardError => e
              corrupted_files << {sku: child_directory, image_name: image_name}
            end
          else
            begin
              product.product_images.create(image_name: image_name,product_image: image_file)
            rescue StandardError => e
              corrupted_files << {sku: child_directory,image_name: image_name}
            end
          end
        end
      else
        no_product << child_directory
      end
    end

    puts "==========no_product==========="
    puts "==========no_product==========="
    puts no_product
    puts "==========corrupted==========="
    puts "==========corrupted==========="
    puts corrupted_files
  end

  def rename_product_images
    dirpath = "#{FOLDER_PATH}/new_product_images"
    child_directories = Dir.new(dirpath).entries - [".", "..", ".DS_Store"]
    no_product = []
    corrupted_files = []
    child_directories.each do |child_directory|
        image_path = dirpath+"/"+child_directory
        inside_image_path = image_path+"/"+"[imagecyborg.com]"
        # images = Dir.new(image_path).entries - [".", "..", "[imagecyborg.com]"]
        inside_images = Dir.new(inside_image_path).entries - [".", "..", "[imagecyborg.com]"] if Dir.new(image_path).entries.include?("[imagecyborg.com]")
        # images.each_with_index do |image, i|
          # path = File.join(image_path, image)
          # File.open(path) do |file|
          #   @uniq_path = File.join(image_path, i.to_s+File.extname(file))
          #   File.rename(file, @uniq_path)
          # end
        # end

        inside_images.each_with_index do |image, i|
          path = File.join(inside_image_path, image)
          File.open(path) do |file|
            @uniq_path = File.join(image_path, i.to_s+File.extname(file))
            File.rename(file, @uniq_path)
          end
        end if inside_images.present?
    end
  end

  def find_products_without_images(unique_skus)
    products = Product.where(unique_sku: unique_skus)
    banck_products = []
    products.each do |product|;
     if !product.product_images.present?
        banck_products << product.unique_sku
      end
    end
  end

  def delete_products_by_uniqe_sku
    filepath = "#{Rails.root.join('app', 'data', "ToBeRemoved.xlsx")}"
    workbook = Roo::Spreadsheet.open filepath
    no_product_skus = []
    boq_products = []
    other_products = []
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      product = Product.find_by_unique_sku "#{workbook.row(row)[0]}"
      begin
        product.destroy
      rescue NoMethodError => e
        no_product_skus << workbook.row(row)[0]
      rescue ActiveRecord::InvalidForeignKey => exception
        boq_products << workbook.row(row)[0]
      rescue => e
        other_products << workbook.row(row)[0]
      end
    end
    puts "No such products:"
    pp no_product_skus
    puts "Products in BOQ:"
    pp boq_products
    puts "Other Products:"
    pp other_products
    puts "-----------------"
  end

  def add_fabric_details
    filepath = "#{Rails.root.join('app', 'data', "FabricOptionsForCatalog.xlsx")}"
    workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end
      not_stored_product_variants = []

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        begin
          ActiveRecord::Base.transaction do
            begin
              @master_option = MasterOption.find_or_create_by(name: workbook.row(row)[headers['master options']])
              @master_sub_option =  @master_option.master_sub_options.find_or_create_by(name: workbook.row(row)[headers['sub options']])
              @catalogue_option = @master_sub_option.catalogue_options.find_or_create_by(name: workbook.row(row)[headers['catalog']])
              @catalogue_option.minimum_price = workbook.row(row)[headers['range-min']]
              @catalogue_option.maximum_price = workbook.row(row)[headers['range-max']]
              @catalogue_option.save!
              @product_varient = @catalogue_option.product_variants.find_or_create_by(product_variant_code: workbook.row(row)[headers['options']])
              @product_varient.name =  workbook.row(row)[headers['name of option']]
              @product_varient.save!
            end
          end
        rescue StandardError => e
          not_stored_product_variants << workbook.row(row)[headers['options']]
        end
      end
    puts "not_stored_product_variants".humanize
    not_stored_product_variants
  end



  def fabric_product_association
    filepath = "#{Rails.root.join('app', 'data', "SKUs with Fabric Options.xlsx")}"
    workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.downcase] = i
      end
      product_skus = []
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        begin
          @product = Product.find_by_unique_sku workbook.row(row)[headers['product sku']]
          @product.master_options << MasterOption.first
        rescue StandardError => e
          product_skus << workbook.row(row)[headers['product sku']]
        end
      end
      puts "product_skus".humanize
      product_skus
  end

  def populate_fabric_images
    dirpath = "#{FOLDER_PATH}/fabric Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_product_varient = []
    corrupted_files = []
    file_names.each do |filename|
      begin
        product_variant_code = filename.partition(".")[0]
        product_variant = ProductVariant.find_by(product_variant_code: product_variant_code)
        if product_variant.blank?
          no_product_varient << product_variant_code
          next
        else
          image_file = File.new("#{dirpath}/#{filename}", "r")
          product_variant.update!(fabric_image: image_file)
        end
      rescue
        corrupted_files << filename
        next
      end
    end

    puts "No such product Variants s:"
    pp no_product_varient
    puts "Files corrupted:"
    pp corrupted_files
  end

  def populate_business_units(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Units.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      unit_name = workbook.row(row)[headers['unit']]
      @business_unit = BusinessUnit.where(unit_name: unit_name).first_or_create
    end

    BusinessUnit.count
  end

  def populate_catalog_segments(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Segment.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      segment_name = workbook.row(row)[headers['segment']]
      @business_unit = CatalogSegment.where(segment_name: segment_name).first_or_create
    end

    CatalogSegment.count
  end

  def marketplace_segments
    # first reset, then set
    CatalogSegment.all.update marketplace: false
    names = ["Home Decor"]
    no_segment = []
    names.each do |segment_name|
      catalog_segment = CatalogSegment.find_by segment_name: segment_name
      if catalog_segment.blank?
        no_segment << segment_name
        next
      end
      catalog_segment.update! marketplace: true
    end

    puts "No segments with name:"
    puts no_segment
    CatalogSegment.marketplace.count
  end

  def populate_catalog_categories(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Category.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      category_name = workbook.row(row)[headers['category']]
      @business_unit = CatalogCategory.where(category_name: category_name).first_or_create
    end

    CatalogCategory.count
  end

  def populate_catalog_subcategories(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Sub-Category.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      subcategory_name = workbook.row(row)[headers['sub-category']]
      @business_unit = CatalogSubcategory.where(subcategory_name: subcategory_name).first_or_create
    end

    CatalogSubcategory.count
  end

  def populate_catalog_classes(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Class.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      name = workbook.row(row)[headers['class']]
      @business_unit = CatalogClass.where(name: name).first_or_create
    end

    CatalogClass.count
  end

  def unit_segment_mapping(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Unit to Segment.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_unit = []
    no_segment = []

    headers.each do |k,v|
      business_unit = BusinessUnit.find_by(unit_name: k)
      unless business_unit.present?  #if this unit is not in db
        no_unit << k
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        segment_name = workbook.row(row)[headers[k]]
        segment = CatalogSegment.find_by(segment_name: segment_name)
        #skip if segment or segment_name blank
        if segment_name.blank?
          next
        elsif segment.blank?
          no_segment << segment_name
          next
        end
        segment.unit_segment_mappings.where(business_unit: business_unit).first_or_create!
      end
    end

    puts "No such business unit:"
    pp no_unit
    puts "No such segment:"
    pp no_segment

    UnitSegmentMapping.count
  end

  def segment_category_mapping(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Segment to Category.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_segment = []
    no_category = []

    headers.each do |k,v|
      catalog_segment = CatalogSegment.find_by(segment_name: k)
      unless catalog_segment.present? #if this unit is not in db
        no_segment << k
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        category_name = workbook.row(row)[headers[k]]
        category = CatalogCategory.find_by(category_name: category_name)
        #skip if category or category_name blank
        if category_name.blank?
          next
        elsif category.blank?
          no_category << category_name
          next
        end
        category.segment_category_mappings.where(catalog_segment: catalog_segment).first_or_create!
      end
    end

    puts "No such segment:"
    pp no_segment
    puts "No such category:"
    pp no_category

    SegmentCategoryMapping.count
  end

  def category_subcategory_mapping(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Category to Sub Category.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_category = []
    no_subcategory = []

    headers.each do |k,v|
      catalog_category = CatalogCategory.find_by(category_name: k)
      unless catalog_category.present?  #if this unit is not in db
        no_category << k
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        subcategory_name = workbook.row(row)[headers[k]]
        subcategory = CatalogSubcategory.find_by(subcategory_name: subcategory_name)
        #skip if subcategory or subcategory_name blank
        if subcategory_name.blank?
          next
        elsif subcategory.blank?
          no_subcategory << subcategory_name
          next
        end
        subcategory.category_subcategory_mappings.where(catalog_category: catalog_category).first_or_create!
      end
    end

    puts "No such category:"
    pp no_category
    puts "No such subcategory:"
    pp no_subcategory

    CategorySubcategoryMapping.count
  end

  def subcategory_class_mapping(filepath=nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Sub Category to Class.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_subcategory = []
    no_class = []

    headers.each do |k,v|
      catalog_subcategory = CatalogSubcategory.find_by(subcategory_name: k)
      unless catalog_subcategory.present?  #if this unit is not in db
        no_subcategory << k
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        klass_name = workbook.row(row)[headers[k]]
        klass = CatalogClass.find_by(name: klass_name)
        #skip if klass or klass_name blank
        if klass_name.blank?
          next
        elsif klass.blank?
          no_class << klass_name
          next
        end
        klass.subcategory_class_mappings.where(catalog_subcategory: catalog_subcategory).first_or_create!
      end
    end

    puts "No such subcategory:"
    pp no_subcategory
    puts "No such class:"
    pp no_class

    SubcategoryClassMapping.count
  end

  def change_skus(filepath = nil)
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Change in SKU Name.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_product = []
    duplicates = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      old_sku = workbook.row(row)[headers["Old SKU Name"]]
      new_sku = workbook.row(row)[headers["New SKU Name"]]
      product = Product.find_by(unique_sku: old_sku)
      if product.blank?
        no_product << old_sku
        next
      end
      if Product.where(unique_sku: new_sku).present?
        duplicates << new_sku
        next
      end
      product.update!(unique_sku: new_sku)
    end

    puts "No product with these SKUs:"
    pp no_product
    puts "Products with these SKUs already exist:"
    pp duplicates
  end

  def change_prices
    filepath ||= Rails.root.join('app', 'data', 'catalog_revamp_files', 'Change of price.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase.strip] = i
    end

    no_product = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      sku = workbook.row(row)[headers["sku code"]]
      new_price = workbook.row(row)[headers["revised price"]]
      product = Product.find_by(unique_sku: sku)
      if product.blank?
        no_product << sku
        next
      end
      product.update!(sale_price: new_price)
    end

    puts "No product with these SKUs:"
    pp no_product
  end

  # Script for migrating the products from one subcategory to another.
  # from_subcat is subcategory name from where you want to migrate products.
  # to_subcat is subcategory name to where you want to migrate products.

  def migrate_products_between_subcategories(from_subcat, to_subcat)
    to_subcategory = CatalogSubcategory.find_by_subcategory_name(to_subcat)
    # Get all products of sub category which has to migrate to another sub category
    from_subcat_prods = Product.joins(:catalog_subcategories).where(catalog_subcategories: {subcategory_name: from_subcat}).where.not(id: to_subcategory.products.ids).distinct
    if from_subcat_prods.present? && to_subcategory.present?
      begin
        to_subcategory.products << from_subcat_prods # Associate all available products
      rescue ActiveRecord::RecordInvalid => invalid
        puts "ActiveRecord::RecordInvalid Exception Occured"
        puts invalid.record.errors
      rescue StandardError => e
        puts "Exception Occured"
        puts e.errors
      end
    end
  end
end
