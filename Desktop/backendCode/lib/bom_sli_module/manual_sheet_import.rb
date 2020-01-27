# Manual method import excel
class BomSliModule::ManualSheetImport
  include BomSliModule::CommonModule

  IMPORT_TYPE = 'bom_sli_manual_sheet'  #saved in job_elements column :import_type
  # Cutting List sheet
  CUTTING_LIST_SHEET = "Cutting List"
  CUTTING_SHEET_HEADER_ROW = 3
  # If these headers are missing, then we cannot proceed. Fatal error. All in lowercase for case insensitiveness of headers.
  CUTTING_SHEET_HEADERS_REQUIRED = [
    "article code as per boq",
    "article name",
    "part name",
    "finish length",
    "finish width",
    "finish thk",
    "qty",
    "edge 4",
    "cutting length",
    "cutting width",
    "part material",
    "laminate top",
    "laminate bottom",
    "edgeband qty"
  ]
  #Material Requirement sheet
  MATERIAL_LIST_SHEET = "Material Requirement"
  MATERIAL_LIST_HEADER_1_ROW = 3
  MATERIAL_LIST_HEADER_1_REQUIRED = ['material', 'total']  #lowercase for case insensitiveness
  # MATERIAL_LIST_HEADER_2_ROW = 17  #This needs to be found in the sheet, cannot be hardcoded.
  MATERIAL_LIST_HEADER_2_REQUIRED = ['laminate shade', 'qty. in meter']
  # Hardware and Accessories sheet
  HARDWARE_SHEET = 'Hardware and Accessories'
  HARDWARE_SHEET_HEADER_ROW = 2
  HARDWARE_SHEET_HEADERS_REQUIRED = ["code", "qty", "extra"]  #lowercase for case insensitiveness
  # Temporary - this should be in db finally
  # Don't comment or remove this as it is being used elsewhere currently - in script to populate material code to SLI group code mapping.
  MATERIAL_MAPPING = {
    "06mm thk BWP PLY" => "6mmwhitebwp",
    "16mm thk BWP PLY" => "18mmwhitebwp",
    "0.8mm Balancing White Laminate" => "balancinglaminate",
    "Acrylic Burro Glossy With16mm BWP PLY" => "shutter1sbwp-175",
    "1.3_Acrylic Burro Glossy" => "2mmedgebanding-304",
    "0.8_Frosty White" => "0.8mmedgebanding-34"
  }

  def initialize(quotation, options)
    @quotation = quotation
    @workbook = options[:workbook]
    @content = options[:content]
    # Use default workbook for testing
    # if @workbook.nil?
    #   @workbook = Roo::Spreadsheet.open Rails.root.join('lib', 'bom_sli_module', "Manual Sheet.xlsx").to_s
    #   @content = Content.create!(scope: IMPORT_TYPE, document: File.open(Rails.root.join('lib', 'bom_sli_module', "Manual Sheet.xlsx")))
    # end
    # First validate that all three excels have the required headers at the required sheets and rows.
    @errors = []
    unless set_material_list_2_header_row && validate_cutting_list_headers && validate_material_requirement_headers && validate_hardware_headers
      @fatal_error_present = true
      return
    end
    @current_sheet = @workbook.sheets.first
    @current_row = nil
    @cutting_sheet_headers = Hash.new
    @material_sheet_headers_1 = Hash.new
    @material_sheet_headers_2 = Hash.new
    @hardware_sheet_headers = Hash.new
    @material_requirement_total_hash = Hash.new
    @material_requirement_total_hash_2 = Hash.new
    @attribution_ratio_hash = Hash.new
    @attribution_ratio_hash_edgeband = Hash.new
    @hardware_list_quantity_hash = Hash.new

    @labels_in_sheet = read_labels_cutting_list.or(read_labels_hardware)
    # Check if a PO exists for SLIs for labels in this sheet. If so, fatal error and file will not be processed.
    if po_exists?
      error_msg = "These labels have imported SLIs against them with PO - #{labels_with_po.pluck(:label_name).join(',')}. This file cannot be processed until these labels are removed."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      @fatal_error_present = true
    end
  end

  def import_excel
    if @fatal_error_present
      @content.destroy!
      return @errors
    end
    clear_existing_slis
    map_line_items_with_content
    # Now import from MATERIAL_LIST_SHEET
    material_list_import_1
    material_list_import_2
    # Now import from CUTTING_LIST_SHEET
    cutting_list_import
    # byebug
    hardware_list_import
    # byebug
    return @errors
  rescue StandardError => e
    puts "++++++++++++++Sheet: #{@current_sheet} +++++++++++++ Row: #{@current_row}"
    raise e
  end

  def read_labels_cutting_list
    @current_sheet = CUTTING_LIST_SHEET
    @workbook.sheet(@current_sheet)
    set_cutting_list_headers
    label_names = []

    ((CUTTING_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      label_name = excel_no_tags(row_data[@cutting_sheet_headers["article code as per boq"]])  #required
      break if label_name.blank?
      label_names << label_name
    end

    @quotation.boq_labels.where(label_name: label_names.uniq)
  end

  def read_labels_hardware
    @current_sheet = HARDWARE_SHEET
    @workbook.sheet(@current_sheet)
    set_hardware_list_headers
    label_names = []

    ((HARDWARE_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      # now, for this code (ie this row), loop through columns with headers as the boq label and add SLIs against them.
      start_column = @hardware_sheet_headers["qty"] + 1
      end_column = @hardware_sheet_headers["extra"] - 1

      (start_column..end_column).each do |column|
        label_name = @hardware_sheet_headers.key(column)
        next unless label_name.present?
        label_names << label_name
      end
    end

    @quotation.boq_labels.where(label_name: label_names.uniq)
  end

  # For the labels found in this excel. Delete all SLIs of the type that could be imported from this type of import.
  # Also delete existing row data for these labels.
  def clear_existing_slis
    cutting_list_data = BomSliCuttingListDatum.where(import_type: IMPORT_TYPE).joins(:boq_label).where(boq_labels: {id: @labels_in_sheet})
    @quotation.job_elements.joins(:boq_labels).where(job_elements: { import_type: IMPORT_TYPE}, boq_labels: { id: @labels_in_sheet }).destroy_all
    cutting_list_data.destroy_all
    # Also delete hardware_extras SLIs which are not linked to any line item. Don't forget this!
    @quotation.job_elements.where(import_type: IMPORT_TYPE, imos_type: 'hardware_extras').destroy_all
  end

  # Check if a PO exists for SLIs for labels in this sheet. If so, fatal error and file will not be processed.
  def po_exists?
    @quotation.job_elements.where(import_type: IMPORT_TYPE).joins(:boq_labels, purchase_elements: :purchase_order).where(boq_labels: { id: @labels_in_sheet}).count > 0
    # ( @quotation.boqjobs.joins(:boq_labels, job_elements: { purchase_elements: :purchase_order }).where(boq_labels: { id: @labels_in_sheet}).distinct.count + 
    # @quotation.modular_jobs.joins(:boq_labels, job_elements: { purchase_elements: :purchase_order }).where(boq_labels: { id: @labels_in_sheet}).distinct.count + 
    # @quotation.custom_jobs.joins(:boq_labels, job_elements: { purchase_elements: :purchase_order }).where(boq_labels: { id: @labels_in_sheet}).distinct.count ).count > 0
  end

  # which labels have an SLI with PO.
  def labels_with_po
    label_ids = @quotation.job_elements.where(import_type: IMPORT_TYPE).joins(:boq_labels, purchase_elements: :purchase_order).
      where(boq_labels: { id: @labels_in_sheet}).distinct.
      map{ |job_element| job_element.boq_labels.pluck(:id) }
    @quotation.boq_labels.where(id: label_ids.flatten.uniq)
  end

  def map_line_items_with_content
    line_items = @labels_in_sheet.map(&:ownerable).uniq
    boms_for_which_mappings_deleted = []
    # byebug    
    line_items.each do |line_item|
      # clear older boms
      boms_for_which_mappings_deleted << line_item.boms.where(scope: IMPORT_TYPE)
      line_item.line_item_boms.joins(:content).where(contents: { scope: IMPORT_TYPE }).destroy_all
      line_item.line_item_boms.where(content: @content).first_or_create!
      line_item.update!(no_bom: false)
    end
    # Delete those BOM Content records which are not associated with any line item, from the above BOMs.
    boms_for_which_mappings_deleted.flatten.find_all{|bom| bom.line_item_boms.blank?}.map(&:destroy!)
    line_items.count
  end

  def cutting_list_import
    @current_sheet = CUTTING_LIST_SHEET
    @workbook.sheet(@current_sheet)
    all_row_array = []
    # First import the row data
    ((CUTTING_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      label_name = excel_no_tags(row_data[@cutting_sheet_headers["article code as per boq"]])  #required
      # If no label name found on this row, then assume that the table has ended.
      break if label_name.blank?
      boq_label = @quotation.boq_labels.find_by(label_name: label_name)
      # skip if no boq_label found
      if boq_label.blank?
        missing_label(CUTTING_LIST_SHEET, row, {label_name: label_name})
        next
      end
      line_item = boq_label.ownerable
      bom_sli_cutting_list_datum = boq_label.bom_sli_cutting_list_data.build(import_type: IMPORT_TYPE)
      bom_sli_cutting_list_datum.sheet = @current_sheet
      bom_sli_cutting_list_datum.row = row
      bom_sli_cutting_list_datum.sr_no = excel_no_tags(row_data[@cutting_sheet_headers["sr no"]]) if @cutting_sheet_headers["sr no"]
      bom_sli_cutting_list_datum.article_code = excel_no_tags(row_data[@cutting_sheet_headers["article code as per boq"]])  #required
      bom_sli_cutting_list_datum.article_name = excel_no_tags(row_data[@cutting_sheet_headers["article name"]])  #required
      bom_sli_cutting_list_datum.part_name = excel_no_tags(row_data[@cutting_sheet_headers["part name"]])  #required
      bom_sli_cutting_list_datum.mat_top_lam_bottom = excel_no_tags(row_data[@cutting_sheet_headers["mat top lam bottom"]]) if @cutting_sheet_headers["mat top lam bottom"]
      bom_sli_cutting_list_datum.finish_length = excel_no_tags(row_data[@cutting_sheet_headers["finish length"]])  #required
      bom_sli_cutting_list_datum.finish_width = excel_no_tags(row_data[@cutting_sheet_headers["finish width"]])  #required
      bom_sli_cutting_list_datum.finish_height = excel_no_tags(row_data[@cutting_sheet_headers["finish ht"]]) if @cutting_sheet_headers["finish ht"]
      bom_sli_cutting_list_datum.finish_thk = excel_no_tags(row_data[@cutting_sheet_headers["finish thk"]])  #required
      bom_sli_cutting_list_datum.qty = excel_no_tags(row_data[@cutting_sheet_headers["qty"]]).to_f  #required
      bom_sli_cutting_list_datum.part_code = excel_no_tags(row_data[@cutting_sheet_headers["part code"]]) if @cutting_sheet_headers["part code"]
      bom_sli_cutting_list_datum.barcode1 = excel_no_tags(row_data[@cutting_sheet_headers["barcode 1"]]) if @cutting_sheet_headers["barcode 1"]
      bom_sli_cutting_list_datum.barcode2 = excel_no_tags(row_data[@cutting_sheet_headers["barcode 2"]]) if @cutting_sheet_headers["barcode 2"]
      # For now, all edge banding columns will have same value, so add only 1 SLI.
      bom_sli_cutting_list_datum.edge1 = excel_no_tags(row_data[@cutting_sheet_headers["edge 1"]]) if @cutting_sheet_headers["edge 1"]
      bom_sli_cutting_list_datum.edge2 = excel_no_tags(row_data[@cutting_sheet_headers["edge 2"]]) if @cutting_sheet_headers["edge 2"]
      bom_sli_cutting_list_datum.edge3 = excel_no_tags(row_data[@cutting_sheet_headers["edge 3"]]) if @cutting_sheet_headers["edge 3"]
      bom_sli_cutting_list_datum.edge4 = excel_no_tags(row_data[@cutting_sheet_headers["edge 4"]])  #required
      bom_sli_cutting_list_datum.grain = excel_no_tags(row_data[@cutting_sheet_headers["grain"]]) if @cutting_sheet_headers["grain"]
      bom_sli_cutting_list_datum.cutting_length = excel_no_tags(row_data[@cutting_sheet_headers["cutting length"]])  #required
      bom_sli_cutting_list_datum.cutting_width = excel_no_tags(row_data[@cutting_sheet_headers["cutting width"]])  #required
      bom_sli_cutting_list_datum.cutting_thk = excel_no_tags(row_data[@cutting_sheet_headers["cutting thk"]]) if @cutting_sheet_headers["cutting thk"]
      bom_sli_cutting_list_datum.customer_name = excel_no_tags(row_data[@cutting_sheet_headers["customer name"]]) if @cutting_sheet_headers["customer name"]
      bom_sli_cutting_list_datum.part_material = excel_no_tags(row_data[@cutting_sheet_headers["part material"]])  #required
      bom_sli_cutting_list_datum.laminate_top = excel_no_tags(row_data[@cutting_sheet_headers["laminate top"]])  #required
      bom_sli_cutting_list_datum.laminate_bottom = excel_no_tags(row_data[@cutting_sheet_headers["laminate bottom"]])  #required
      bom_sli_cutting_list_datum.size = excel_no_tags(row_data[@cutting_sheet_headers["size"]]) if @cutting_sheet_headers["size"]
      bom_sli_cutting_list_datum.edgeband_qty = excel_no_tags(row_data[@cutting_sheet_headers["edgeband qty"]]).to_f  #required
      if bom_sli_cutting_list_datum.save
        all_row_array << bom_sli_cutting_list_datum
      else
        @errors << BomSliModule::ManualSheetError.new(bom_sli_cutting_list_datum.errors.full_messages, 'warning', {sheet_name: @current_sheet, row: @current_row, label_name: label_name}).message_hash
        next
      end
      # edge4_vp = add_sli_by_material(edge4)
      # part_material_vp = add_sli_by_material(part_material)
      # laminate_top_vp = add_sli_by_material(laminate_top)
      # laminate_bottom_vp = add_sli_by_material(laminate_bottom)
    end

    # Now calculate attribution ratio for each material
    material_qty_hash = Hash.new
    edgeband_qty_hash = Hash.new
    # all_row_data = BomSliCuttingListDatum.where(import_type: IMPORT_TYPE).joins(:boq_label).where(boq_labels: {id: @quotation.boq_labels})
    all_row_data = BomSliCuttingListDatum.where(id: all_row_array.map(&:id))
    all_row_data.pluck(:part_material, :laminate_top, :laminate_bottom).flatten.uniq.map do |material_code|
      material_qty_hash[material_code] = 0
    end
    all_row_data.pluck(:edge4).uniq.map do |material_code|
      edgeband_qty_hash[material_code] = 0
    end
    # Remove extraneous keys
    # material_qty_hash.delete_if{ |k,v| k.to_s.downcase.in?(["na", "n/a", "", "no edgeband"]) }
    # edgeband_qty_hash.delete_if{ |k,v| k.to_s.downcase.in?(["na", "n/a", "", "no edgeband"]) }    
    all_row_data.each do |bom_sli_cutting_list_datum|
      qty = bom_sli_cutting_list_datum.part_material_quantity
      material_qty_hash[bom_sli_cutting_list_datum.part_material] = material_qty_hash[bom_sli_cutting_list_datum.part_material] + qty
      material_qty_hash[bom_sli_cutting_list_datum.laminate_top] = material_qty_hash[bom_sli_cutting_list_datum.laminate_top] + qty
      material_qty_hash[bom_sli_cutting_list_datum.laminate_bottom] = material_qty_hash[bom_sli_cutting_list_datum.laminate_bottom] + qty
      edgeband_qty = bom_sli_cutting_list_datum.total_edgeband_qty
      edgeband_qty_hash[bom_sli_cutting_list_datum.edge4] = edgeband_qty_hash[bom_sli_cutting_list_datum.edge4] + edgeband_qty
    end
    # Actual calculation
    # non edge band
    # byebug
    material_qty_hash.keys.each do |material_code|
      cutting_sheet_qty = material_qty_hash[material_code]
      material_sheet_qty = @material_requirement_total_hash[material_code]
      if cutting_sheet_qty.to_f > 0 && material_sheet_qty.to_f > 0
        @attribution_ratio_hash[material_code] = material_sheet_qty/cutting_sheet_qty
        @errors << BomSliModule::ManualSheetError.new("For material code #{material_code}: Calculated quantity - #{cutting_sheet_qty}, Material sheet quantity: #{material_sheet_qty}. Attribution ratio is #{@attribution_ratio_hash[material_code]}.", 'notice').message_hash
      else
        @errors << BomSliModule::ManualSheetError.new("For material code #{material_code}, quantity in Cutting List or Material Sheet is 0. Using attribution ratio of 1.", 'warning').message_hash
        @attribution_ratio_hash[material_code] = 1.0
      end
    end
    # edge band
    edgeband_qty_hash.keys.each do |material_code|
      cutting_sheet_qty = edgeband_qty_hash[material_code]
      material_sheet_qty = @material_requirement_total_hash_2[material_code]
      if cutting_sheet_qty.to_f > 0 && material_sheet_qty.to_f > 0
        @attribution_ratio_hash_edgeband[material_code] = material_sheet_qty/cutting_sheet_qty
        @errors << BomSliModule::ManualSheetError.new("For edge-band material code #{material_code}: Calculated quantity - #{cutting_sheet_qty}, Material sheet quantity: #{material_sheet_qty}. Attribution ratio is #{@attribution_ratio_hash_edgeband[material_code]}.", 'notice').message_hash
      else
        @errors << BomSliModule::ManualSheetError.new("For edge-band material code #{material_code}, quantity in Cutting List or Material Sheet is 0. Using attribution ratio of 1.", 'warning').message_hash
        @attribution_ratio_hash_edgeband[material_code] = 1.0
      end
    end
    # Finally populate SLI
    all_row_data.each do |bom_sli_cutting_list_datum|
      add_cutting_list_slis(bom_sli_cutting_list_datum)
    end
  end

  def set_cutting_list_headers
    @workbook.row(CUTTING_SHEET_HEADER_ROW).each_with_index do |header,i|
      next if header.blank?
      @cutting_sheet_headers[header.downcase] = i
    end
  end

  # For non edge band
  def material_list_import_1
    @current_sheet = MATERIAL_LIST_SHEET
    @workbook.sheet(@current_sheet)
    set_material_list_headers_1
    ((MATERIAL_LIST_HEADER_1_ROW+2)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      material_code = excel_no_tags(row_data[@material_sheet_headers_1["material"]])
      total = excel_no_tags(row_data[@material_sheet_headers_1["total"]]).to_f
      @material_requirement_total_hash[material_code] = total
    end
  end

  def set_material_list_headers_1
    @workbook.row(MATERIAL_LIST_HEADER_1_ROW).each_with_index do |header,i|
      next if header.blank?
      @material_sheet_headers_1[header.downcase] = i
    end
  end

  # For edge band
  def material_list_import_2
    @current_sheet = MATERIAL_LIST_SHEET
    @workbook.sheet(@current_sheet)
    set_material_list_headers_2
    ((@material_list_2_header_row+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      material_code = excel_no_tags(row_data[@material_sheet_headers_2["laminate shade"]])
      total = excel_no_tags(row_data[@material_sheet_headers_2["qty. in meter"]]).to_f
      @material_requirement_total_hash_2[material_code] = total
    end
  end

  def set_material_list_headers_2
    @workbook.row(@material_list_2_header_row).each_with_index do |header,i|
      next if header.blank?
      @material_sheet_headers_2[header.downcase] = i
    end
  end

  def hardware_list_import
    @current_sheet = HARDWARE_SHEET
    @workbook.sheet(@current_sheet)
    ((HARDWARE_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      vendor_code = excel_no_tags(row_data[@hardware_sheet_headers["code"]])
      extra = excel_no_tags(row_data[@hardware_sheet_headers["extra"]]).to_f   #quantity of extra SLIs for this vendor code
      # now, for this code (ie this row), loop through columns with headers as the boq label and add SLIs against them.
      # But do this only if there are columns with labels as header!
      if ( @hardware_sheet_headers["extra"] - @hardware_sheet_headers["qty"] > 1 )
        start_column = @hardware_sheet_headers["qty"] + 1
        end_column = @hardware_sheet_headers["extra"] - 1
        (start_column..end_column).each do |column|
          # byebug if row == 16
          label_quantity = row_data[column].to_i  #hardware slis cannot be decimals
          label_name = @hardware_sheet_headers.key(column)
          next unless label_quantity > 0 && label_name.present?
          add_hardware_sli(label_name, vendor_code, label_quantity)
        end
      end
      # Extra column - these SLIs are added at BOQ level - nothing to do with label
      add_hardware_sli("extra", vendor_code, extra) if extra > 0
    end
  end

  def set_hardware_list_headers
    @workbook.row(HARDWARE_SHEET_HEADER_ROW).each_with_index do |header,i|
      @hardware_sheet_headers[header.downcase] = i unless header.blank?
    end
  end

  private
  # Check for the header row in the Material requirements sheet.
  def set_material_list_2_header_row
    @current_sheet = MATERIAL_LIST_SHEET
    @workbook.sheet @current_sheet
    (MATERIAL_LIST_HEADER_1_ROW+1..@workbook.last_row).each do |row|
      if @workbook.row(row).include?('Edgeband Requirement')
        @material_list_2_header_row = row.to_i + 1
      end
    end

    unless @material_list_2_header_row.present?
      error_msg = "No row with \'Edgeband Requirement\' found in the Material Requirement sheet."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      return false
    else
      return @material_list_2_header_row
    end
  end

  def validate_cutting_list_headers
    @workbook.sheet(CUTTING_LIST_SHEET)
    missing_headers = CUTTING_SHEET_HEADERS_REQUIRED - @workbook.row(CUTTING_SHEET_HEADER_ROW).map{|str| str.to_s.downcase}
    if missing_headers.empty?
      return true
    else
      error_msg = "These headers are missing in the Sheet: #{CUTTING_LIST_SHEET} - #{missing_headers.join(',')} on Row: #{CUTTING_SHEET_HEADER_ROW}."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      return false
    end
  end

  def validate_material_requirement_headers
    @workbook.sheet(MATERIAL_LIST_SHEET)
    missing_headers_1 = MATERIAL_LIST_HEADER_1_REQUIRED - @workbook.row(MATERIAL_LIST_HEADER_1_ROW).map{|str| str.to_s.downcase}
    missing_headers_2 = MATERIAL_LIST_HEADER_2_REQUIRED - @workbook.row(@material_list_2_header_row).map{|str| str.to_s.downcase}
    if missing_headers_1.empty? && missing_headers_2.empty?
      return true
    else
      if missing_headers_1.present?
        error_msg = "These headers are missing in the Sheet: #{MATERIAL_LIST_SHEET} - #{missing_headers_1.join(',')} on Row: #{MATERIAL_LIST_HEADER_1_ROW}."
        @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      end
      if missing_headers_2.present?
        error_msg = "These headers are missing in the Sheet: #{MATERIAL_LIST_SHEET} - #{missing_headers_2.join(',')} on Row: #{@material_list_2_header_row}."
        @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      end
      return false
    end
  end

  def validate_hardware_headers
    @workbook.sheet(HARDWARE_SHEET)
    missing_headers = HARDWARE_SHEET_HEADERS_REQUIRED - @workbook.row(HARDWARE_SHEET_HEADER_ROW).map{|str| str.to_s.downcase}
    if missing_headers.empty?
      return true
    else
      error_msg = "These headers are missing in the sheet #{HARDWARE_SHEET} - #{missing_headers.join(',')} on Row #{HARDWARE_SHEET_HEADER_ROW}."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      return false
    end
  end

  def missing_label(sheet, row, options={})
    @errors << BomSliModule::ManualSheetError.new("No line item with label #{options[:label_name]} on row #{row}. Row skipped.", "warning", {sheet_name: sheet, boq_label: options[:boq_label]}).message_hash
  end

  def add_cutting_list_slis(bom_sli_cutting_list_datum)
    # byebug if bom_sli_cutting_list_datum.row == 65
    qty = bom_sli_cutting_list_datum.part_material_quantity
    edgeband_qty = bom_sli_cutting_list_datum.total_edgeband_qty
    if qty > 0
      part_material_qty = qty * @attribution_ratio_hash[bom_sli_cutting_list_datum.part_material]
      laminate_top_qty = qty * @attribution_ratio_hash[bom_sli_cutting_list_datum.laminate_top]
      laminate_bottom_qty = qty * @attribution_ratio_hash[bom_sli_cutting_list_datum.laminate_bottom]
      add_sli_by_material(bom_sli_cutting_list_datum, bom_sli_cutting_list_datum.part_material, {quantity: part_material_qty, custom_suffix: "part_material", unit: 's_ft', attribution_ratio: @attribution_ratio_hash[bom_sli_cutting_list_datum.part_material]})
      add_sli_by_material(bom_sli_cutting_list_datum, bom_sli_cutting_list_datum.laminate_top, {quantity: laminate_top_qty, custom_suffix: "laminate_top", unit: 's_ft', attribution_ratio: @attribution_ratio_hash[bom_sli_cutting_list_datum.laminate_top]})
      add_sli_by_material(bom_sli_cutting_list_datum, bom_sli_cutting_list_datum.laminate_bottom, {quantity: laminate_bottom_qty, custom_suffix: "laminate_bottom", unit: 's_ft', attribution_ratio: @attribution_ratio_hash[bom_sli_cutting_list_datum.laminate_bottom]})
    end
    if edgeband_qty > 0
      edgeband_qty = edgeband_qty * @attribution_ratio_hash_edgeband[bom_sli_cutting_list_datum.edge4]
      add_sli_by_material(bom_sli_cutting_list_datum, bom_sli_cutting_list_datum.edge4, {quantity: edgeband_qty, custom_suffix: "edge4", unit: 'r_mt', attribution_ratio: @attribution_ratio_hash_edgeband[bom_sli_cutting_list_datum.edge4]})
    end
  end

  def add_sli_by_material(bom_sli_cutting_list_datum, material_code, options)
    return false if material_code.to_s.downcase.in?(["na", "n/a", "", "no edgeband"])
    boq_label = bom_sli_cutting_list_datum.boq_label
    line_item = boq_label.ownerable
    vendor_product = get_vendor_product_by_material(material_code)
    if vendor_product.present?
      # Master SLI found, so we will create a separate SLI.
      sli_name = vendor_product.sli_name
      job_element = @quotation.job_elements.build(
        element_name: sli_name,
        quantity: options[:quantity].round(3),
        vendor_product: vendor_product,
        unit: vendor_product.unit,
        rate: vendor_product.rate,
        ownerable: line_item
        )
    else
      # If no master SLI found, then create a custom SLI. If a custom SLI with the same name already exists for the given line
      # item, then add to its quantity
      sli_name ||= material_code
      job_element = @quotation.job_elements.where(element_name: sli_name, ownerable: line_item).first_or_initialize
      quantity = job_element.quantity.to_f + options[:quantity].round(3)
      job_element.quantity = quantity
      job_element.unit = options[:unit]
    end
    # only for new records.
    if job_element.new_record?
      job_element.assign_attributes(
        bom_sli_cutting_list_datum: bom_sli_cutting_list_datum,
        import_type: IMPORT_TYPE,
        imos_type: options[:custom_suffix],
        imos_sheet: @current_sheet,
        imos_row: @current_row
        )
    end
    # common to master and custom sli
    job_element.attribution_ratio = options[:attribution_ratio]
    job_element.populate_job_element_vendor
    job_element.label_job_elements.build(boq_label: boq_label)

    if job_element.save
      return true
    else
      @errors << BomSliModule::ManualSheetError.new("#{job_element.errors.full_messages}.", "warning", {sheet_name: bom_sli_cutting_list_datum.sheet, 
        row: bom_sli_cutting_list_datum.row, boq_label: boq_label}).message_hash
      return false
    end
  end

  # We do not save attribution ratio for hardware SLIs because they have no meaning here.
  def add_hardware_sli(label_name, vendor_code, quantity)
    boq_label = @quotation.boq_labels.find_by(label_name: label_name)
    line_item = boq_label&.ownerable
    # skip if no boq_label found. Special treatment for extra SLIs as they are to be added to BOQ level, not a line item.
    imos_type = 'hardware'
    if label_name == "extra"
      boq_label = nil
      imos_type = 'hardware_extras'
    elsif boq_label.blank?
      missing_label(HARDWARE_SHEET, "Row#{@current_row}", {label_name: label_name})
      return false
    end
    vendor_product = VendorProduct.new.master_sli_by_order(vendor_code)
    if vendor_product.present?
      # Master SLI found, so we will create a separate SLI.
      sli_name = vendor_product.sli_name
      job_element = @quotation.job_elements.build(
        element_name: sli_name, 
        quantity: quantity, 
        vendor_product: vendor_product,
        unit: vendor_product.unit,
        rate: vendor_product.rate,
        ownerable: line_item
        )
    else
      # If no master SLI found, then create a custom SLI. If a custom SLI with the same name already exists for the given line
      # item, then add to its quantity
      sli_name ||= vendor_code
      job_element = @quotation.job_elements.where(element_name: sli_name, ownerable: line_item).first_or_initialize
      job_element.quantity = job_element.quantity.to_f + quantity
      job_element.unit = 'nos'
    end
    # only for new records.
    if job_element.new_record?
      job_element.assign_attributes(
        import_type: IMPORT_TYPE,
        imos_type: imos_type,
        imos_sheet: @current_sheet,
        imos_row: @current_row
        )
    end
    job_element.populate_job_element_vendor
    job_element.label_job_elements.build(boq_label: boq_label) if boq_label.present?

    if job_element.save
      return true
    else
      @errors << BomSliModule::ManualSheetError.new("#{job_element.errors.full_messages}.", "warning", {sheet_name: @current_sheet, row: @current_row, boq_label: boq_label}).message_hash
      return false
    end
  end

  # use material_code to vendor_product mapping and use that to create an SLI.
  def get_vendor_product_by_material(material_code)
    BomSliCuttingListMapping.get_master_sli(material_code)
  end
end