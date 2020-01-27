class Catalog::ProductReportJob < ApplicationJob
  queue_as :catalog

  def perform(catalog_type='arrivae')
    # Pre load all required associated objects
    products = Product.not_hidden.of_catalog_type(catalog_type).includes(:catalog_segments, :catalog_categories, :catalog_subcategories, :catalog_classes, :business_units, :master_options)

    # Excel Headers
    header_names = [
      'Unique Sku Code',
      'L(mm)',
      'B(mm)',
      'H(mm)',
      'Material',
      'Warranty',
      'Finish',
      'Color',
      'Remarks',
      'Vendor Sku Code',
      'Product',
      'Configuration',
      'Selling Price',
      'Lead Time',
      'Measurement Unit',
      'No of Units',
      'Space',
      'Range',
      'Options',
      'Unit',
      'Segment',
      'Category',
      'Sub-Category',
      'Class'
    ]


    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end

    package = Axlsx::Package.new
    product_report = package.workbook
    sheet = product_report.add_worksheet(:name => "Product Report")
    sheet.add_row header_names

    products.find_each do |product|
      row_array = []
      row_array[headers["Unique Sku Code"]] = product.unique_sku
      row_array[headers["L(mm)"]] = product.length
      row_array[headers["B(mm)"]] = product.width
      row_array[headers["H(mm)"]] = product.height
      row_array[headers["Material"]] = product.material
      row_array[headers["Warranty"]] = product.warranty
      row_array[headers["Finish"]] = product.finish
      row_array[headers["Color"]] = product.color
      row_array[headers["Remarks"]] = product.remark
      row_array[headers["Vendor Sku Code"]] = product.vendor_sku
      row_array[headers["Product"]] = product.name
      row_array[headers["Configuration"]] = product.product_config
      row_array[headers["Selling Price"]] = product.sale_price
      row_array[headers["Lead Time"]] = product.lead_time
      row_array[headers["Measurement Unit"]] = product.measurement_unit
      row_array[headers["No of Units"]] = product.qty
      row_array[headers["Space"]] = ""
      row_array[headers["Range"]] = ""
      row_array[headers["Options"]] = product.master_options.pluck(:name).join(", ")
      row_array[headers["Unit"]] = product.business_units.pluck(:unit_name).join(", ")
      row_array[headers["Segment"]] = product.catalog_segments.pluck(:segment_name).join(", ")
      row_array[headers["Category"]] = product.catalog_categories.pluck(:category_name).join(", ")
      row_array[headers["Sub-Category"]] = product.catalog_subcategories.pluck(:subcategory_name).join(", ")
      row_array[headers["Class"]] = product.catalog_classes.pluck(:name).join(", ")
      sheet.add_row row_array
    end

    file_name = "Product-Report-#{catalog_type}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    package.serialize(filepath)
  end
end
