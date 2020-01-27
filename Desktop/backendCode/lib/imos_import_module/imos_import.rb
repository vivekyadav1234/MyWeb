###################################
# Arunoday 5-Jun-2019: As per discussions with Abhishek, we will be modifiying this functionality. From this import (SF Parts List Article),
# we will only import the hardware. The carcass import code is to be commented.
###################################
# Global import of excel generated by the IMOS software.
class ImosImportModule::ImosImport
  IMPORT_TYPE = 'imos'
  HARDWARE_IDENTIFIER_STRING = "Purchased Part"
  #Labels will be in this row/column. Multiple labels can be comma separated.
  # Sample value - "MK-78 \n#: 1"
  LABEL_ROW = 10
  LABEL_COLUMN = 0

  include ImosImportModule::CarcassSheetImportModule
  include ImosImportModule::HardwareSheetImportModule

  def initialize(quotation, options)
    @quotation = quotation
    @workbook = options[:workbook]
    @content = options[:content]
    # Use default workbook for testing
    if @workbook.nil?
      @workbook = Roo::Spreadsheet.open Rails.root.join('lib', 'bom_sli_module', "SF_Parts_List_Article.xlsx").to_s
      @content = Content.create!(scope: IMPORT_TYPE, document: File.open(Rails.root.join('lib', 'bom_sli_module', "SF_Parts_List_Article.xlsx")))
    end
    @current_sheet = @workbook.sheets.first
    @errors = []

    # First validate that all three excels have the required headers at the required sheets and rows.
    return unless validate_imos_sheet
    @labels_in_sheet = read_labels_hardware
    # Check if a PO exists for SLIs for labels in this sheet. If so, fatal error and file will not be processed.
    if po_exists?
      error_msg = "These labels have imported SLIs against them with PO - #{labels_with_po.pluck(:label_name).join(',')}. This file cannot be processed until these labels are removed."
      @errors << BomSliModule::ManualSheetError.new(error_msg, 'fatal').message_hash
      @fatal_error_present = true
    end
  end

  def import_excel
    return @errors if @fatal_error_present
    clear_existing_slis
    map_line_items_with_content
    # now import from the excel
    @workbook.sheets.each do |sheet_name|
      @workbook.sheet(sheet_name)
      @current_sheet = sheet_name
      if sheet_unreadable?
        @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "Corrupted or empty sheet. Skipping sheet: #{@current_sheet}.", nil).message_hash
        next
      end
      next unless hardware_sheet?
      str = @workbook.row(LABEL_ROW)[LABEL_COLUMN]
      arr = str.partition("\n#:")
      label_names = arr.first.split(',').map{ |split_str| split_str.strip }
      quantity = arr.last.strip.to_f
      label_names.each do |label_name|
        # modular_job = @quotation.modular_jobs.joins(:product_module).where(product_modules: { code: code }).distinct.take
        # modular_job = get_modular_job(code, quantity)
        boq_label = @quotation.boq_labels.find_by(label_name: label_name)
        if boq_label.blank?
          @errors.push ImosImportModule::ImosImportError.new(@current_sheet, "No line item with label - #{label_name}. Skipping sheet: #{@current_sheet}.", nil).message_hash
          next
        end
        if hardware_sheet?
          hardware_sheet_import(boq_label, quantity)
        else
          # carcass_sheet_import(modular_job, quantity)   #commented because - see comment at top of the class.
        end
      end
    end

    return @errors
  end

  def read_labels_hardware
    label_names = []

    @workbook.sheets.each do |sheet_name|
      @workbook.sheet(sheet_name)
      @current_sheet = sheet_name
      # skip if sheet is not a hardware sheet or if it can't be read.
      next if sheet_unreadable? || !hardware_sheet?
      str = @workbook.row(LABEL_ROW)[LABEL_COLUMN]
      arr = str.partition("\n#:")
      label_names << arr.first.split(',').map{ |split_str| split_str.strip }
    end

    @quotation.boq_labels.where(label_name: label_names.flatten.uniq)
  end

  # For the labels found in this excel. Delete all SLIs of the type that could be imported from this type of import.
  # Also delete existing row data for these labels, if they exist.
  def clear_existing_slis
    @quotation.job_elements.joins(:boq_labels).where(job_elements: { import_type: IMPORT_TYPE}, boq_labels: { id: @labels_in_sheet }).destroy_all
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

  # Temp method - needed only to make development easier.Remove when no longer needed.
  def get_workbook
    @workbook
  end

  # Add an SLI to for a given modular job using a given Vendor Product.
  def add_sli(line_item, vendor_product, quantity, options = {})
    job_element = @quotation.job_elements.build(
      element_name: vendor_product.sli_name, 
      quantity: quantity.round(3), 
      unit: vendor_product.unit,  
      rate: vendor_product.rate, 
      ownerable: line_item, 
      vendor_product: vendor_product, 
      import_type: 'imos', 
      imos_type: options[:imos_type], 
      imos_sheet: options[:imos_sheet], 
      imos_row: options[:imos_row],  
      barcode: options[:barcode]
      )

    job_element
  end

  private
  # Is this excel sheet actually an IMOS sheet?
  def validate_imos_sheet
    if @workbook.row(1).include?("Manufacturing Report") && ( @workbook.row(12).include?("Barcode") || hardware_sheet? )
      return true
    else
      @content.destroy!
      error_msg = "Based on the first sheet, this doesn't seem to be an IMOS parts list excel. Fatal error, execution halted."
      @errors << ImosImportModule::ImosImportError.new(@current_sheet, error_msg).message_hash
      @fatal_error_present = true
      return false
    end
  end

  # Is the current sheet in the @workbook for carcass or hardware data.
  def hardware_sheet?
    @workbook.row(9).include?(HARDWARE_IDENTIFIER_STRING)
  end

  # the sheet is either corrupted or empty - skip it.
  def sheet_unreadable?
    begin
      return @workbook.row(1).blank?
    rescue
      return true
    end
  end
end
