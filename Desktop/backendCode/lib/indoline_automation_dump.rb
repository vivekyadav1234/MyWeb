# This module contains scripts that will dump the master SLI data into CSV files.
# im => lakhs_modular
module IndolineAutomationDump
  COMMON_ATTRIBUTES = ["id", "sli_group_code", "sli_code", "sli_name", "vendor_code", "unit", "rate", "vendor", 
    "created_at", "updated_at"]

  def run_all
    im_aluminium_profile_shutter()
    im_carcass()
    laminate_exposed_panels()
    im_drawer_back()
    im_drawer_bottom()
    im_glass_shelf()
    im_shelf()
    im_shutter_1s()
    im_shutter_2s()
    pvc_exposed_panels()
    im_carcass_1s("Carcass 1S Glossy")
    im_carcass_1s("Carcass 1S")
    im_carcass_2s("Carcass 2S Glossy")
    im_carcass_2s("Carcass 2S")
    im_carcass_2s("Prelam Carcass")
    mi_handles("Concealed Handles")
    mi_handles("Insert Handles")
    mi_handles("Normal Handles")
    mi_handles("Profile Handles")
    mi_handles("Special Handles")
    mi_common("Exposed Panels")
    
  end

  def mi_common(mli_name, filepath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "mi_common#{mli_name.downcase.underscore}_dump.csv"
    mli = MasterLineItem.indoline.find_by mli_name: mli_name
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
  
  def im_aluminium_profile_shutter(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "Aluminium_profile_shutter_dump.csv"

    dynamic_attributes = ["ai_v", "ai_h", "module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: "Aluminium Profile Shutter"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["ai_v", "ai_h"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def im_carcass(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_carcass_dump.csv"

    dynamic_attributes = ["sub_category", "module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: "Carcass"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["sub_category"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end


  def im_carcass_1s(mli_name, folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_#{mli_name.downcase.underscore}_dump.csv"

    dynamic_attributes = ["vendor_edge_banding_type", "size", "vendor_edge_banding_name", "drawer_bottom_width", "drawer_bottom_height", "drawer_bottom_quantity", "module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_edge_banding_type", "size", "vendor_edge_banding_name", "drawer_bottom_width", "drawer_bottom_height", "drawer_bottom_quantity"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def im_carcass_2s(mli_name, folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_#{mli_name.downcase.underscore}_dump.csv"

    dynamic_attributes = ["module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end 

  def mi_handles(mli_name, folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "mi_#{mli_name.downcase.underscore}_dump.csv"

    dynamic_attributes = ["vendor_description", "type_of_handle" ,"mrp", "oem", "arrivae_handle"]
    mli = MasterLineItem.indoline.find_by mli_name: mli_name
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "type_of_handle" ,"mrp", "oem"].each do |attr_name|
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

  def laminate_exposed_panels(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "laminate_exposed_panels_dump.csv"

    dynamic_attributes = ["vendor_material_code", "vendor_description", "oem", "matching_edge_banding_arrivae_code", "shutter_material", "arrivae_shade"]
    mli = MasterLineItem.indoline.find_by mli_name: "Laminate Exposed Panels"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_material_code", "vendor_description", "oem", "matching_edge_banding_arrivae_code"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        core_id = vendor_product.sli_dynamic_attr_value("shutter_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        id = vendor_product.sli_dynamic_attr_value("arrivae_shade")
        code = id.present? ? Shade.find(id).code : nil
        dynamic_attribute_values_array << code
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def im_drawer_back(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_drawer_back_dump.csv"

    dynamic_attributes = ["drawer_back_1_width", "drawer_back_1_height", "drawer_back_1_quantity", "drawer_back_2_width", "drawer_back_2_height", "drawer_back_2_quantity", "module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: "Drawer Back"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["drawer_back_1_width", "drawer_back_1_height", "drawer_back_1_quantity", "drawer_back_2_width", "drawer_back_2_height", "drawer_back_2_quantity"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end
    
    i
  end

  def im_drawer_bottom(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_drawer_bottom_dump.csv"

    dynamic_attributes = ["drawer_bottom_width", "drawer_bottom_height", "drawer_bottom_quantity","module", "core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: "Drawer Bottom"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["drawer_bottom_width", "drawer_bottom_height", "drawer_bottom_quantity"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end
    
    i
  end

  def im_glass_shelf(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_glass_shelf_dump.csv"

    dynamic_attributes = ["width", "depth", "height","number_of_shelves","shelf_dimensions", "module"]
    mli = MasterLineItem.indoline.find_by mli_name: "Glass Shelf"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["width", "depth", "height","number_of_shelves","shelf_dimensions"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end
    
    i
  end

  def im_shelf(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_shelf_dump.csv"

    dynamic_attributes = ["width", "depth", "height","number_of_shelves","shelf_dimensions", "module" ,"core_material"]
    mli = MasterLineItem.indoline.find_by mli_name: "Shelf"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["width", "depth", "height","number_of_shelves","shelf_dimensions"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("module")
        code = id.present? ? ProductModule.find(id).code : nil
        dynamic_attribute_values_array << code
        core_id = vendor_product.sli_dynamic_attr_value("core_material")
        core_name = id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end
    
    i
  end

  def im_shutter_1s(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_shutter_1s_dump.csv"

    dynamic_attributes = ["oem", "edge_banding_required" ,"vendor_description", "vendor_material_code", "matching_arrivae_edge_banding_code", "shutter_material", "arrivae_shade"]
    mli = MasterLineItem.indoline.find_by mli_name: "Shutter 1S"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["oem", "edge_banding_required" ,"vendor_description", "vendor_material_code", "matching_arrivae_edge_banding_code"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        core_id = vendor_product.sli_dynamic_attr_value("shutter_material")
        core_name = core_id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        id = vendor_product.sli_dynamic_attr_value("arrivae_shade")
        code = id.present? ? Shade.find(id).code : nil
        dynamic_attribute_values_array << code        

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end

  def im_shutter_2s(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "im_shutter_2s_dump.csv"

    dynamic_attributes = ["oem","vendor_description", "vendor_material_code", "matching_arrivae_edge_banding_code", "shutter_material", "arrivae_shade"]
    mli = MasterLineItem.indoline.find_by mli_name: "Shutter 2S"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["oem","vendor_description", "vendor_material_code", "matching_arrivae_edge_banding_code"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        core_id = vendor_product.sli_dynamic_attr_value("shutter_material")
        core_name = core_id.present? ? CoreMaterial.find(core_id).name : nil
        dynamic_attribute_values_array << core_name
        id = vendor_product.sli_dynamic_attr_value("arrivae_shade")
        code = id.present? ? Shade.find(id).code : nil
        dynamic_attribute_values_array << code        

        csv << (common_attribute_values_array + dynamic_attribute_values_array)
        i += 1
      end
    end

    i
  end


  def pvc_exposed_panels(folderpath = nil)
    folderpath ||= Rails.root.join("log")
    csvpath = folderpath + "pvc_exposed_panels_dump.csv"

    dynamic_attributes = ["vendor_description", "oem", "arrivae_shade"]
    mli = MasterLineItem.indoline.find_by mli_name: "PVC Exposed Panels"
    vendor_products = mli.vendor_products
    headers = COMMON_ATTRIBUTES + dynamic_attributes
    i = 0

    CSV.open(csvpath, "wb") do |csv|
      csv << headers

      # now loop through all vendor_products
      vendor_products.each do |vendor_product|
        common_attribute_values_array = common_attributes(vendor_product)
        dynamic_attribute_values_array = []
        ["vendor_description", "oem"].each do |attr_name|
          dynamic_attribute_values_array << vendor_product.sli_dynamic_attr_value(attr_name)
        end
        id = vendor_product.sli_dynamic_attr_value("arrivae_shade")
        code = id.present? ? Shade.find(id).code : nil
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
