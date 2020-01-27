# Manual method import excel - for IMOS
# It differs from normal manual sheet import only slightly - hardware SLIs are not imported AND 
# some headers are slightly different.
class BomSliModule::ImosManualSheetImport
  include BomSliModule::CommonModule

  IMPORT_TYPE = 'imos_manual_sheet'  #saved in job_elements column :import_type
  # Cutting List sheet
  CUTTING_LIST_SHEET = "Cutting List"
  CUTTING_SHEET_HEADER_ROW = 1
  # If these headers are missing, then we cannot proceed. Fatal error.
  CUTTING_SHEET_HEADERS_REQUIRED = [
    "article code",
    "article name",
    "part name",
    "finished length",
    "finished width",
    "finished thickness",
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
  MATERIAL_LIST_HEADER_1_ROW = 16
  MATERIAL_LIST_HEADER_1_REQUIRED = ['material', 'total']
  # MATERIAL_LIST_HEADER_2_ROW = 26  #This needs to be found in the sheet, cannot be hardcoded.
  MATERIAL_LIST_HEADER_2_REQUIRED = ['laminate shade', 'qty. in meter']

  def initialize(quotation, options)
    @quotation = quotation
    @workbook = options[:workbook]
    @content = options[:content]
    # Use default workbook for testing
    # if @workbook.nil?
    #   @workbook = Roo::Spreadsheet.open Rails.root.join('lib', 'bom_sli_module', "IMOS Manual Sheet.xlsx").to_s
    #   @content = Content.create!(scope: IMPORT_TYPE, document: File.open(Rails.root.join('lib', 'bom_sli_module', "IMOS Manual Sheet.xlsx")))
    # end
    @errors = []
    # First validate that all three excels have the required headers at the required sheets and rows.
    unless set_material_list_2_header_row && validate_cutting_list_headers && validate_material_requirement_headers
      @fatal_error_present = true
      return
    end
    @current_sheet = @workbook.sheets.first
    @current_row = nil
    @cutting_sheet_headers = Hash.new
    @material_sheet_headers_1 = Hash.new
    @material_sheet_headers_2 = Hash.new
    # @hardware_sheet_headers = Hash.new
    @material_requirement_total_hash = Hash.new
    @material_requirement_total_hash_2 = Hash.new
    @attribution_ratio_hash = Hash.new
    @attribution_ratio_hash_edgeband = Hash.new
    # @hardware_list_quantity_hash = Hash.new

    @labels_in_sheet = read_labels_cutting_list
    if po_exists?
      error_msg = "These labels have imported SLIs against them with PO - #{labels_with_po.pluck(:label_name).join(',')}. This file cannot be processed until these labels are removed."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      @fatal_error_present = true
    end
  end

  def read_labels_cutting_list
    @current_sheet = CUTTING_LIST_SHEET
    @workbook.sheet(@current_sheet)
    set_cutting_list_headers
    label_names = []

    ((CUTTING_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      # byebug
      label_name = excel_no_tags(row_data[@cutting_sheet_headers["article code"]])  #required
      break if label_name.blank?
      label_names << label_name
    end

    @quotation.boq_labels.where(label_name: label_names.uniq)
  end

  # For the labels found in this excel. Delete all SLIs of the type that could be imported from this type of import.
  # Also delete existing row data for these labels.
  def clear_existing_slis
    cutting_list_data = BomSliCuttingListDatum.where(import_type: IMPORT_TYPE).joins(:boq_label).where(boq_labels: {id: @labels_in_sheet})
    @quotation.job_elements.joins(:boq_labels).where(job_elements: { import_type: IMPORT_TYPE}, boq_labels: { id: @labels_in_sheet }).destroy_all
    cutting_list_data.destroy_all
    # Also delete hardware_extras SLIs which are not linked to any line item. Don't forget this! Do this even though we don't 
    # actually import hardware data from IMOS Manual Sheet.
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
    boms_for_which_mappings_deleted.flatten.find_all{|bom| bom.line_item_boms.blank?}.map(&:destroy!)
    line_items.count
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
    # hardware_list_import
    # byebug
    return @errors
  rescue StandardError => e
    puts "++++++++++++++Sheet: #{@current_sheet} +++++++++++++ Row: #{@current_row}"
    raise e
  end

  def cutting_list_import
    @current_sheet = CUTTING_LIST_SHEET
    @workbook.sheet(@current_sheet)
    all_row_array = []
    # First import the row data
    ((CUTTING_SHEET_HEADER_ROW+1)..@workbook.last_row).each do |row|
      @current_row = row
      row_data = @workbook.row(row)
      label_name = excel_no_tags(row_data[@cutting_sheet_headers["article code"]])  #required
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
      bom_sli_cutting_list_datum.sr_no = excel_no_tags(row_data[@cutting_sheet_headers["s.no."]]) if @cutting_sheet_headers["s.no."]
      bom_sli_cutting_list_datum.article_code = excel_no_tags(row_data[@cutting_sheet_headers["article code"]])  #required
      bom_sli_cutting_list_datum.article_name = excel_no_tags(row_data[@cutting_sheet_headers["article name"]])  #required
      bom_sli_cutting_list_datum.part_name = excel_no_tags(row_data[@cutting_sheet_headers["part name"]])  #required
      bom_sli_cutting_list_datum.mat_top_lam_bottom = excel_no_tags(row_data[@cutting_sheet_headers["mat toplam botlam"]]) if @cutting_sheet_headers["mat toplam botlam"]
      bom_sli_cutting_list_datum.finish_length = excel_no_tags(row_data[@cutting_sheet_headers["finished length"]])  #required
      bom_sli_cutting_list_datum.finish_width = excel_no_tags(row_data[@cutting_sheet_headers["finished width"]])  #required
      # bom_sli_cutting_list_datum.finish_height = row_data[@cutting_sheet_headers["Finish Ht"]]  #Not present in IMOS excel.
      bom_sli_cutting_list_datum.finish_thk = excel_no_tags(row_data[@cutting_sheet_headers["finished thickness"]])  #required
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
      bom_sli_cutting_list_datum.cutting_thk = excel_no_tags(row_data[@cutting_sheet_headers["cutting thickness"]]) if @cutting_sheet_headers["cutting thickness"]
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
      # @cutting_list_quantity_hash[material_code] = @cutting_list_quantity_hash[material_code].to_f + quantity
      return true
    else
      @errors << BomSliModule::ManualSheetError.new("#{job_element.errors.full_messages}.", "warning", {sheet_name: bom_sli_cutting_list_datum.sheet, 
        row: bom_sli_cutting_list_datum.row, boq_label: boq_label}).message_hash
      return false
    end
  end

  # use material_code to vendor_product mapping and use that to create an SLI.
  def get_vendor_product_by_material(material_code)
    BomSliCuttingListMapping.get_master_sli(material_code)
  end
end