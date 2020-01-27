# This module contains scripts that will dump the master SLI data into CSV files.
# lm => lakhs_modular
module PoLakhsAutomationDumpModule
  COMMON_ATTRIBUTES = ["id", "sli_group_code", "sli_code", "sli_name", "vendor_code", "unit", "rate", "vendor", 
    "created_at", "updated_at"]

  def run_all

    edge_banding("0.8mm Edge Banding")
    edge_banding("2mm Edge Banding")
    common_mli("4mm Glass")
    common_mli("10mm Glass")
    common_mli("Aluminium Frame")
    common_mli("Other Processing")
    common_mli("Packaging")
    common_mli("Routing for G Profile")
    common_mli("Routing for Shutters")
    common_mli("Dry Fit")
    common_mli("Both Side C, EB")
    common_mli("Both Side P,C,EB,G,D")
    common_mli("Both Side P,C,EB")
    common_mli("Both Side P,C")
    common_mli("C, EB, G, D")
    common_mli("Cutting")
    white_carcass("18mm White Carcass")
    white_carcass("12mm White Carcass")
    lm_addons("Add Ons")
    white_carcass("6mm White Back Panel")
    ml_laminates()
    lm_hardware()
    lm_skirting_hardware()
    mli_skirting()
    lm_handles("Concealed Handles")
    lm_handles("Insert Handles")
    lm_handles("Normal Handles")
    lm_handles("Profile Handles")
    lm_handles("Special Handles")
    lm_handles("Normal Handles")
    ml_finish_material()


  end

  # Hardware
  def lm_hardware(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "lm_hardware_dump.csv"

    dynamic_attributes = ["vendor_description", "mrp", "oem", "hardware_code"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "Hardware"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "mrp", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        hardware_element_id = vendor_product.sli_dynamic_attr_value("hardware_code")
        code = hardware_element_id.present? ? HardwareElement.find(hardware_element_id).code : nil
        dynamic_attribute_values_array << code

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def mli_skirting(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "mli_skirting_dump.csv"

    dynamic_attributes = ["vendor_description", "mrp", "oem", "skirting_config"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "Skirting"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "mrp", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        skirting_id = vendor_product.sli_dynamic_attr_value("skirting_config")
        skirting_type = skirting_id.present? ? SkirtingConfig.find(skirting_id).skirting_type : nil
        dynamic_attribute_values_array << skirting_type

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  # Add Ons
  def lm_addons(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "lm_addons_dump.csv"

    dynamic_attributes = ["vendor_description", "mrp", "oem", "arrivae_addon"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "Add Ons"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "mrp", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        addon_id = vendor_product.sli_dynamic_attr_value("arrivae_addon")
        code = addon_id.present? ? Addon.find(addon_id).code : nil
        dynamic_attribute_values_array << code

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  # Skirting Hardware
  def lm_skirting_hardware(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "lm_skirting_hardware_dump.csv"

    dynamic_attributes = ["vendor_description", "mrp", "oem"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "Skirting Hardware"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "mrp", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  # Handles - all
  def lm_handles(mli_name, folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "lm_#{mli_name.downcase.underscore}_dump.csv"

    dynamic_attributes = ["vendor_description", "mrp", "oem", "arrivae_handle"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "mrp", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        handle_id = vendor_product.sli_dynamic_attr_value("arrivae_handle")
        code = handle_id.present? ? Handle.find(handle_id).code : nil
        dynamic_attribute_values_array << code

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end
  
  #0.8mm Edge Banding , 2mm Edge Banding
  def edge_banding(mli_name, filepath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "edge_banding#{mli_name.downcase.underscore}_dump.csv"

    dynamic_attributes = ["vendor_edge_banding_type", "size", "vendor_edge_banding_name", "matching_arrivae_edge_banding_shade"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        dynamic_attributes.each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def common_mli(mli_name, filepath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "common_mli#{mli_name.downcase.underscore}_dump.csv"
    mli = MasterLineItem.lakhs_modular.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        csv << common_attribute_values_array
        i += 1
      end
    end

    i
  end

  #6mm White Back Panel, 12mm White Carcass, 18mm White Carcass
  def white_carcass(mli_name, folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "Carcass_#{mli_name.downcase.underscore}_dump.csv"
    dynamic_attribute = ["core_material"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attribute
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        core_material_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = core_material_id.present? ? CoreMaterial.find(core_material_id).name : nil
        dynamic_attribute_values_array << core_name
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def ml_laminates(filepath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "ml_laminates_dump.csv"

    dynamic_attributes = ["internal_finish", "matching_edge_banding_arrivae_code"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "0.8mm Laminates"
    vendor_products = mli.vendor_products
    puts "="*90
    puts vendor_products
    puts "="*90

    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        dynamic_attributes.each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def ml_finish_material(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "ml_finish_material_dump.csv"

    dynamic_attributes = ["vendor_description", "matching_arrivae_edge_banding_code", "oem", "arrivae_shade"]
    mli = MasterLineItem.lakhs_modular.find_by mli_name: "Finish Material"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "matching_arrivae_edge_banding_code", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        shade_id = vendor_product.sli_dynamic_attr_value("arrivae_shade")
        code = shade_id.present? ? Shade.find(shade_id).code : nil
        dynamic_attribute_values_array << code

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end


  private
  def common_attributes(vendor_product)
    h = Hash.new
    COMMON_ATTRIBUTES.each do |attr_name|
      h[attr_name] = vendor_product.public_send(attr_name)
    end

    # overwrite this
    h["vendor"] = vendor_product.vendor.name
    COMMON_ATTRIBUTES.map{ |attr_name| h[attr_name]}
  end
end
