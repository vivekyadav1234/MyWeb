module LooseFurnitureSliModule
  FOLDER_PATH = Rails.root.join('app', 'data', 'Loose Furniture.xlsx')

  def loose_furniture
    filepath = FOLDER_PATH
    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    duplicate_sli_codes = []
    mli = MasterLineItem.find_by mli_name: "Loose Furniture"

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      sli_group_code = workbook.row(row)[headers['sli group code']]
      sli_code = workbook.row(row)[headers['sli code']]
      vendor_code = workbook.row(row)[headers['vendor code']]
      sli_name = workbook.row(row)[headers['sub line item']]
      vendor_pan = workbook.row(row)[headers['vendor pan']]
      measurement_unit = workbook.row(row)[headers['unit of measurement']]
      rate = workbook.row(row)[headers['vendor rate']]

      unique_sku_dynamic = workbook.row(row)[headers['unique sku code']]

      vendor = Vendor.find_by_pan_no vendor_pan
      vendor_product = mli.vendor_products.where(sli_code: sli_code).first_or_initialize
      duplicate_sli_codes << sli_code unless vendor_product.new_record?
      vendor_product.assign_attributes(sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
      vendor_id: vendor.id)
      vendor_product.save!
      #dynamic attributes
      unique_sku_attr = mli.mli_attributes.where(attr_name: "unique_sku").first
      unique_sku_dynamic_attr = vendor_product.sli_dynamic_attributes.where(mli_attribute_id: unique_sku_attr.id).first_or_create
      unique_sku_dynamic_attr.update!(attr_value: unique_sku_dynamic)
    end
    puts "Duplicate SLI codes:"
    puts duplicate_sli_codes
    mli.reload
    mli.vendor_products.count
  end

  private
  # def werkbook(filepath)
  #   @workbook = Roo::Spreadsheet.open filepath
  #   @headers = Hash.new
  #   @workbook.row(1).each_with_index do |header,i|
  #     next if header.blank?
  #     @headers[header.downcase] = i
  #   end
  # end

  #returning false means that the vendor product was not saved.
  # def common_attribute(row)
  #   @no_vendor = []
  #   mli_name = @workbook.row(row)[@headers['master line item']]
  #   sli_group_code = @workbook.row(row)[@headers['sli group code']]
  #   sli_code = @workbook.row(row)[@headers['sli code']]
  #   vendor_code = @workbook.row(row)[@headers['vendor code']]
  #   sli_name = @workbook.row(row)[@headers['sub line item']]
  #   vendor_pan = @workbook.row(row)[@headers['pan of vendor']]
  #   measurement_unit = @workbook.row(row)[@headers['unit of measurement']]
  #   rate = @workbook.row(row)[@headers['vendor rate']]
  #   @mli = MasterLineItem.find_by_mli_name(mli_name)

  #   if @mli.present?
  #     vendor = Vendor.find_by_pan_no vendor_pan
  #     if vendor.blank?
  #       @no_vendor.push vendor_pan
  #       return false
  #     end
  #     @vendor_product = @mli.vendor_products.where(sli_code: sli_code).first_or_initialize
  #     @vendor_product.assign_attributes(sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
  #     vendor_id: vendor.id)
  #     @vendor_product.save!
  #   end
  # end
end