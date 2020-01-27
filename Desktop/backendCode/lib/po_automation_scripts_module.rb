# This module will contain scripts to be executed to accommodate changes to the DB for MKW.
module PoAutomationScriptsModule
  def run_all(folder_path=nil)
    populate_indoline_mli
    populate_lakhs_modular_mli
    populate_loose_furniture_mli
    populate_imos_mapping
  end

  def populate_indoline_mli
    h = YAML::load_file Rails.root.join('app', 'data', 'indoline_mli_attributes.yml')
    h['master_line_items'].each do |mli_hash|
      master_line_item = MasterLineItem.indoline.where(mli_name: mli_hash['name']).first_or_create!
      mli_hash['attributes'].each do |attr_hash|
        mli_attribute = master_line_item.mli_attributes.where(attr_name: attr_hash['attr_name']).first_or_initialize
        mli_attribute.attr_type = attr_hash['attr_type'] if attr_hash['attr_type'].present?
        mli_attribute.attr_data_type = attr_hash['attr_data_type']
        mli_attribute.reference_table_name = attr_hash['reference_table_name'] if attr_hash['reference_table_name'].present?
        mli_attribute.required = attr_hash['required'] if attr_hash['required']
        mli_attribute.save!
      end
    end

    MasterLineItem.indoline.count
  end

  def populate_lakhs_modular_mli
    h = YAML::load_file Rails.root.join('app', 'data', 'lakhs_modular_mli_attributes.yml')
    h['master_line_items'].each do |mli_hash|
      master_line_item = MasterLineItem.lakhs_modular.where(mli_name: mli_hash['name']).first_or_create!
      mli_hash['attributes'].each do |attr_hash|
        mli_attribute = master_line_item.mli_attributes.where(attr_name: attr_hash['attr_name']).first_or_initialize
        mli_attribute.attr_type = attr_hash['attr_type'] if attr_hash['attr_type'].present?
        mli_attribute.attr_data_type = attr_hash['attr_data_type']
        mli_attribute.reference_table_name = attr_hash['reference_table_name'] if attr_hash['reference_table_name'].present?
        mli_attribute.required = attr_hash['required'] if attr_hash['required']
        mli_attribute.save!
      end
    end

    MasterLineItem.lakhs_modular.count
  end

  def populate_loose_furniture_mli
    h = YAML::load_file Rails.root.join('app', 'data', 'loose_furniture_mli_attributes.yml')
    h['master_line_items'].each do |mli_hash|
      master_line_item = MasterLineItem.loose_furniture.where(mli_name: mli_hash['name']).first_or_create!
      mli_hash['attributes'].each do |attr_hash|
        mli_attribute = master_line_item.mli_attributes.where(attr_name: attr_hash['attr_name']).first_or_initialize
        mli_attribute.attr_type = attr_hash['attr_type'] if attr_hash['attr_type'].present?
        mli_attribute.attr_data_type = attr_hash['attr_data_type']
        mli_attribute.reference_table_name = attr_hash['reference_table_name'] if attr_hash['reference_table_name'].present?
        mli_attribute.required = attr_hash['required'] if attr_hash['required']
        mli_attribute.save!
      end
    end

    MasterLineItem.loose_furniture.count
  end

  # ["core", "finish", "edge_banding"]
  def populate_imos_mapping
    filepath = Rails.root.join('app','data','IMOS Mapping.xlsx')
    workbook = Roo::Spreadsheet.open filepath.to_s

    no_sli_group_code = []

    # core materials
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      imos_code = workbook.row(row)[headers['core material']]
      sli_group_code = workbook.row(row)[headers['sli group code']]
      mapping_type = "core"
      if VendorProduct.where(sli_group_code: sli_group_code).blank?
        no_sli_group_code << sli_group_code
        next
      end
      imos_mapping = ImosMapping.where(mapping_type: mapping_type, imos_code: imos_code).first_or_initialize
      imos_mapping.assign_attributes(sli_group_code: sli_group_code)
      imos_mapping.save!
    end

    # finish
    workbook.sheet("Finishes")
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      imos_code = workbook.row(row)[headers['finish']]
      sli_group_code = workbook.row(row)[headers['sli group code']]
      mapping_type = "finish"
      if VendorProduct.where(sli_group_code: sli_group_code).blank?
        no_sli_group_code << sli_group_code
        next
      end
      imos_mapping = ImosMapping.where(mapping_type: mapping_type, imos_code: imos_code).first_or_initialize
      imos_mapping.assign_attributes(sli_group_code: sli_group_code)
      imos_mapping.save!
    end

    # edge_banding
    workbook.sheet("Edge Banding")
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      imos_code = workbook.row(row)[headers['edge banding']]
      sli_group_code = workbook.row(row)[headers['sli group code']]
      mapping_type = "edge_banding"
      if VendorProduct.where(sli_group_code: sli_group_code).blank?
        no_sli_group_code << sli_group_code
        next
      end
      imos_mapping = ImosMapping.where(mapping_type: mapping_type, imos_code: imos_code).first_or_initialize
      imos_mapping.assign_attributes(sli_group_code: sli_group_code)
      imos_mapping.save!
    end

    puts "Following SLI Group Codes are not present in the database and hence were skipped:"
    pp no_sli_group_code
    no_sli_group_code
  end

  # For now, just use the hardcoded data to populate. Import from excel when provided.
  def populate_bom_sli_cutting_list_mappings
    no_sli_group_code = []

    BomSliModule::ManualSheetImport::MATERIAL_MAPPING.each do |k, v|
      program_code = k
      sli_group_code = v
      if VendorProduct.where(sli_group_code: sli_group_code).blank?
        no_sli_group_code << sli_group_code
        next
      end
      bom_sli_cutting_list_mapping = BomSliCuttingListMapping.where(program_code: program_code).first_or_initialize
      bom_sli_cutting_list_mapping.assign_attributes(sli_group_code: sli_group_code)
      bom_sli_cutting_list_mapping.save!
    end

    puts "Following SLI Group Codes are not present in the database and hence were skipped:"
    pp no_sli_group_code
    no_sli_group_code
  end
end
