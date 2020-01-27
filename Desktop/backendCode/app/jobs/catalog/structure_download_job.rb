# Download the structure of catalog ie BU-segment-category-subcategory-class mapping in an excel.
class Catalog::StructureDownloadJob < ApplicationJob
  queue_as :catalog

  def perform
    # Pre load all required associated objects
    business_units = BusinessUnit.includes(catalog_segments: { catalog_categories: { catalog_subcategories: :catalog_classes } })

    # Excel Headers
    header_names = [
     'Business Unit',
     'Segment',
     'Category',
     'Subcategory',
     'Class'
    ]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end

    package = Axlsx::Package.new
    product_report = package.workbook
    sheet = product_report.add_worksheet(:name => "Catalog Structure")
    sheet.add_row header_names

    business_units.each do |bu|
      # Ensure that this business unit is there even if no segments are mapped against it.
      unless bu.catalog_segments.exists?
        sheet.add_row [bu.unit_name]
      end
      bu.catalog_segments.each do |segment|
        unless segment.catalog_categories.exists?
          sheet.add_row [bu.unit_name, segment.segment_name]
        end
        segment.catalog_categories.each do |category|
          unless category.catalog_subcategories.exists?
            sheet.add_row [bu.unit_name, segment.segment_name, category.category_name]
          end
          category.catalog_subcategories.each do |subcategory|
            unless subcategory.catalog_classes.exists?
              sheet.add_row [bu.unit_name, segment.segment_name, category.category_name, subcategory.subcategory_name]
            end
            subcategory.catalog_classes.each do |klass|
              row_array = []
              row_array[headers["Business Unit"]] = bu.unit_name
              row_array[headers["Segment"]] = segment.segment_name
              row_array[headers["Category"]] = category.category_name
              row_array[headers["Subcategory"]] = subcategory.subcategory_name
              row_array[headers["Class"]] = klass.name
              sheet.add_row row_array
            end
          end
        end
      end
    end

    file_name = "Catalog Structure - #{Time.zone.now}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
  end
end
