module UrbanLadderModule::Scripts
  def run_all(dirpath=nil)
    dirpath ||= Rails.root.join('app', 'data', 'urban_ladder', 'ul_mapping')
    excel_files = Dir.new(dirpath).entries - [".", "..", ".DS_Store"]
    problems = []

    excel_files.each do |filename|
      problems.push import_associations(dirpath.join(filename))
    end

    puts problems
  end

  def import_associations(filepath)
    workbook = Roo::Spreadsheet.open filepath.to_s
    problems = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      if header.present?
        headers[header.downcase] = i
      else
        next
      end
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      begin
        # byebug if filepath.to_s.include?("Taxon-305-2019-01-18") && row == 3
        # only variants imported as product, so skip master.
        variant_sku = workbook.row(row)[headers['sku']]&.strip
        next if variant_sku.blank?
        
        error_arr = []
        product = Product.find_by(imported_sku: variant_sku)

        if product.blank?
          problems << {
            file: filepath,
            row: row,
            variant_sku: variant_sku,
            errors: "No such products"
          }
          next
        end

        # Business Unit association - add error if not found
        business_unit_names = workbook.row(row)[headers['unit']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
        if business_unit_names.present?
          business_unit_names.each do |unit_name|
            business_unit = BusinessUnit.find_by(unit_name: unit_name)
            if business_unit.present?
              product.unit_product_mappings.where(business_unit: business_unit).first_or_create!
            else
              error_arr << "No business unit named #{unit_name} found."
            end
          end
        else
          error_arr << "No business unit specified."
        end

        # Segment association - add error if not found
        segment_names = workbook.row(row)[headers['segment']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
        if segment_names.present?
          segment_names.each do |segment_name|
            catalog_segment = CatalogSegment.find_by(segment_name: segment_name)
            if catalog_segment.present?
              product.product_segments.where(catalog_segment: catalog_segment).first_or_create!
            else
              error_arr << "No segment named #{segment_name} found."
            end
          end
        else
          error_arr << "No segment specified."
        end

        # Category association - add error if not found
        category_names = workbook.row(row)[headers['category']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
        if category_names.present?
          category_names.each do |category_name|
            catalog_category = CatalogCategory.find_by(category_name: category_name)
            if catalog_category.present?
              product.product_categories.where(catalog_category: catalog_category).first_or_create!
            else
              error_arr << "No category named #{category_name} found."
            end
          end
        else
          error_arr << "No category specified."
        end

        # Subcategory association - add error if not found
        subcategory_names = workbook.row(row)[headers['sub-category']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
        if subcategory_names.present?
          subcategory_names.each do |subcategory_name|
            catalog_subcategory = CatalogSubcategory.find_by(subcategory_name: subcategory_name)
            if catalog_subcategory.present?
              product.product_subcategories.where(catalog_subcategory: catalog_subcategory).first_or_create!
            else
              error_arr << "No sub-category named #{subcategory_name} found."
            end
          end
        else
          error_arr << "No sub-category specified."
        end

        # Class association - add error if not found
        klass_names = workbook.row(row)[headers['class']]&.split(',')&.map{|str| BusinessUnit.format_name(str.strip)}
        if klass_names.present?
          klass_names.each do |klass_name|
            catalog_class = CatalogClass.find_by(name: klass_name)
            if catalog_class.present?
              product.product_classes.where(catalog_class: catalog_class).first_or_create!
            else
              error_arr << "No class named #{klass_name} found."
            end
          end
        else
          error_arr << "No class specified."
        end

        problems << {
          file: filepath.to_s,
          row: row,
          variant_sku: variant_sku,
          errors: error_arr
        } if error_arr.present?

      rescue StandardError => e
        puts "Error in file #{filepath} - please check."
        raise e
      end
    end

    puts problems
    problems
  end
end