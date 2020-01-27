module ImosImportModule::CarcassSheetImportModule
  # for these values in the Description (or Material) column, skip the row and go to next barcode.
  MATERIALS_TO_IGNORE = ["Back Panels Grooved"]   #not to be ingored now as per Abhishek, if code is present.
  TAGS_TO_REMOVE = ["<html>", "</html>", "<b>", "</b>"]
  # cannot hardcode these as they change
  # LEGNTH_INDEX = 11
  # BREADTH_INDEX = 12
  LB_ROW = 13

  def carcass_sheet_import(modular_job, module_quantity)
    sli_added_count = 0
    headers = get_headers_carcass
    barcode_rows = get_barcode_rows(headers)

    # Loop through each of the barcodes and populate SLIs.
    barcode_rows.each_with_index do |row, j|
      # check if the row is to be skipped
      next if skip_this_row?(headers, row)
      # if last barcode, then next_row should be last_row+1, else it should be the next barcode's row.
      next_row = row
      if j == barcode_rows.count - 1
        next_row = @workbook.last_row + 1
      else
        next_row = barcode_rows[j+1]
      end
      # core material
      # if it doesn't return false, increment sli_added_count by 1
      sli_added_count+=1 if populate_material_sli(modular_job, module_quantity, row, headers)
      # edge banding
      sli_added_count+=populate_edge_banding_sli(modular_job, module_quantity, row, next_row, headers)
      # finish
      sli_added_count+=populate_finish_sli(modular_job, module_quantity, row, headers)
    end
  end

  # For core material.
  # Parse a string of form:
  # "Back Panels\n\nAR_BWR16_Raw\n"
  def populate_material_sli(modular_job, module_quantity, row, headers)
    str = @workbook.row(row)[headers['description']]
    return false if str.blank?
    barcode = @workbook.row(row)[headers['barcode']]
    imos_code = str.strip.partition("\n\n").last
    vendor_product = ImosMapping.get_master_sli(imos_code)
    if vendor_product.blank?
      @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "No core material master SLI found for IMOS code #{imos_code}. Sheet: #{@current_sheet}. Row: #{row}", modular_job).message_hash
      return false
    end
    quantity = (get_length(row) * get_breadth(row))/92903.to_f  #in sq-ft
    options = { barcode:  barcode, imos_type: 'core_material', imos_sheet: "#{@current_sheet}", imos_row: row }
    job_element = add_sli(modular_job, vendor_product, quantity * module_quantity, options)

    if job_element.save
      return true
    else
      @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "#{job_element.errors.full_messages}. Sheet: #{@current_sheet}. Row: #{row}", modular_job).message_hash
      return false
    end
  end

  # For edge banding
  # next_row is the row where the next panel's barcode is present.
  # Parse a string of form:
  # "1: AR_LM_SR_00031_EDB_2 /22"
  def populate_edge_banding_sli(modular_job, module_quantity, row, next_row, headers)
    sli_added_count = 0
    l = get_length(row)
    b = get_breadth(row)
    barcode = @workbook.row(row)[headers['barcode']]
    (row..next_row-1).each_with_index do |cur_row, i|
      # puts "sheet: #{@current_sheet}; row: #{cur_row}"
      # byebug
      str = @workbook.row(cur_row)[headers['edges']]
      next if str.blank?
      imos_code = str.strip.partition(": ").last
      next if imos_code.blank?
      vendor_product = ImosMapping.get_master_sli(imos_code)
      if vendor_product.blank?
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "No edge banding master SLI found for IMOS code #{imos_code}. Sheet: #{@current_sheet}. Row: #{cur_row}", modular_job).message_hash
        next
      end
      # Qty for 1 - L, Qty for 2 is B, Qty for 3 is L, Qty for 4 is B
      # also, unit for all Vendor Products like this is 'r_mt', so convert accordingly.
      quantity = i%2==0 ? b/1000.0 : l/1000.0
      options = { barcode:  barcode, imos_type: 'edge_banding', imos_sheet: "#{@current_sheet}", imos_row: cur_row }
      job_element = add_sli(modular_job, vendor_product, quantity * module_quantity, options)

      if job_element.save
        sli_added_count += 1
      else
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "#{job_element.errors.full_messages}. Sheet: #{@current_sheet}. Row: #{cur_row}", modular_job).message_hash
      end
    end

    sli_added_count
  end

  # Finish
  # parse a string of form:
  # "AR_LM_L_21091_08mm\n21091 SF:Back White_08mm\n\nAR_LM_L_21091_08mm\n21091 SF:Back White_08mm"
  def populate_finish_sli(modular_job, module_quantity, row, headers)
    # byebug
    sli_added_count = 0
    str = @workbook.row(row)[headers['surface top']]
    return false if str.blank?
    barcode = @workbook.row(row)[headers['barcode']]
    imos_code_arr = get_finish_imos_codes(str)
    imos_code_arr.each do |imos_code|
      next if imos_code.blank?
      vendor_product = ImosMapping.get_master_sli(imos_code)
      if vendor_product.blank?
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "No finish master SLI found for IMOS code #{imos_code}. Sheet: #{@current_sheet}. Row: #{row}", modular_job).message_hash
        next
      end
      quantity = (get_length(row) * get_breadth(row))/92903.to_f  #in sq-ft
      options = { barcode:  barcode, imos_type: 'finish', imos_sheet: "#{@current_sheet}", imos_row: row }
      job_element = add_sli(modular_job, vendor_product, quantity * module_quantity, options)

      if job_element.save
        sli_added_count += 1
      else
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "#{job_element.errors.full_messages}", modular_job).message_hash
      end
    end

    sli_added_count
  end

  # if str is "AR_LM_L_21091_08mm\n21091 SF:Back White_08mm\n\nAR_LM_L_21091_08mm\n21091 SF:Back White_08mm"
  # ["AR_LM_L_21091_08mm", "AR_LM_L_21091_08mm"]
  def get_finish_imos_codes(str)
    str.split("\n\n").map do |m_str|
      if m_str.present?
        m_str.split("\n").first
      else
        nil
      end
    end
  end

  def get_headers_carcass
    headers = Hash.new
    @workbook.row(12).each_with_index do |header,i|
      header_string = remove_tags(header)
      headers[header_string.downcase] = i if header_string.present?
    end
    headers
  end

  def remove_tags(str)
    return str if str.blank?
    TAGS_TO_REMOVE.each do |tag|
      str.gsub!(tag, "")
    end
    str
  end

  # Rows where there is a barcode.
  # This gives us the rows from which the processing of each loop will happen.
  def get_barcode_rows(headers)
    arr = []
    (14..@workbook.last_row).each do |row|
      arr.push(row) if @workbook.row(row)[headers["barcode"]].present?
    end
    arr
  end

  def get_length(row)
    @workbook.row(row)[length_index].partition("\n\n").first.to_f
  end

  def length_index
    @workbook.row(LB_ROW).find_index("L")
  end

  def get_breadth(row)
    @workbook.row(row)[breadth_index].partition("\n\n").first.to_f
  end

  def breadth_index
    @workbook.row(LB_ROW).find_index("B")
  end

  def skip_this_row?(headers, row)
    str = @workbook.row(row)[headers["description"]]
    arr = str.strip.partition("\n\n")
    material_name = arr.first
    code = arr.last
    MATERIALS_TO_IGNORE.include?(material_name) && code.blank?
  end
end
