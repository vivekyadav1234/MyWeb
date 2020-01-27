module ImosImportModule::HardwareSheetImportModule
  def hardware_sheet_import(boq_label, label_quantity)
    line_item = boq_label.ownerable
    sli_added_count = 0
    headers = get_headers_hardware
    (14..@workbook.last_row).each do |row|
      quantity = @workbook.row(row)[headers["\#"]]
      description = @workbook.row(row)[headers["description"]]
      order_number = @workbook.row(row)[headers["order number"]]
      manufacturer = @workbook.row(row)[headers["manufacturer"]]
      info_text = @workbook.row(row)[headers["info text"]]

      vendor_code = VendorProduct.new.underscore_to_hyphen(order_number.to_s.strip)
      vendor_product = VendorProduct.new.master_sli_by_order(vendor_code)
      job_element = nil
      if vendor_product.present?
        options = { imos_type: 'hardware', imos_sheet: "#{@current_sheet}", imos_row: row }
        job_element = add_sli(line_item, vendor_product, quantity * label_quantity, options)
      else
        # If no master SLI found, then create a custom SLI. If a custom SLI with the same name already exists for the given line
        # item, then add to its quantity
        sli_name ||= "#{manufacturer}-#{order_number}-#{description}"
        job_element = @quotation.job_elements.where(element_name: sli_name, ownerable: line_item).first_or_initialize
        job_element.quantity = job_element.quantity.to_f + quantity * label_quantity
        job_element.unit = 'nos'
      end

      # only for new records.
      if job_element.new_record?
        job_element.assign_attributes(
          import_type: ImosImportModule::ImosImport::IMPORT_TYPE,
          imos_type: 'hardware_custom',
          imos_sheet: @current_sheet,
          imos_row: row
          )
      end
      job_element.populate_job_element_vendor
      job_element.label_job_elements.build(boq_label: boq_label)
      if job_element.save
        sli_added_count += 1
      else
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "#{job_element.errors.full_messages}. Sheet: #{@current_sheet}. Row: #{row}", line_item).message_hash
      end
    end

    sli_added_count
  end

  def get_headers_hardware
    headers = Hash.new
    @workbook.row(13).each_with_index do |header,i|
      headers[header.downcase] = i if header.present?
    end
    headers
  end
end
