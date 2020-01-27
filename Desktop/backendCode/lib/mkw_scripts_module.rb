# This module will contain scripts to be executed to accommodate changes to the DB for MKW.
module MkwScriptsModule
  include MkwModspaceScriptsModule

  def run_all(folder_path=nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'prodwardrobe')}"
    populate_modular_sections
    populate_core_materials(folder_path)
    populate_brands(folder_path)
    populate_shutter_finishes(folder_path)
    populate_shades(folder_path)
    populate_edge_banding_shades(folder_path)
    populate_matching_edge_banding_shades(folder_path)
    populate_material_finish_mapping(folder_path)
    populate_combined_doors(folder_path)
    populate_module_types(folder_path, 'wardrobe')
    populate_handles(folder_path, 'wardrobe')
    populate_hardware_types(folder_path)
    populate_addons(folder_path, 'wardrobe')
    populate_hardware_element_types(folder_path, 'wardrobe')
    populate_carcass_element_types(folder_path, 'wardrobe')
    populate_hardware_elements(folder_path, 'wardrobe')
    populate_carcass_elements(folder_path, 'wardrobe')
    populate_modules(folder_path, 'wardrobe')
    populate_modules_hardware_elements(folder_path, 'wardrobe')
    populate_module_addon_mapping(folder_path, 'wardrobe')
    populate_type_module_mapping(folder_path, 'wardrobe')
    populate_module_handle_details(folder_path, 'wardrobe')
  end

  def run_all_kitchen(folder_path=nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'prodkitchen')}"
    populate_skirting_configs(folder_path)
    populate_kitchen_category(folder_path)
    populate_module_types(folder_path, 'kitchen')
    populate_category_module_type_mapping(folder_path)
    populate_handles(folder_path, 'kitchen')
    populate_hardware_types(folder_path)  #some extra entries are there
    populate_hardware_element_types(folder_path, 'kitchen')
    populate_carcass_element_types(folder_path, 'kitchen')
    populate_hardware_elements(folder_path, 'kitchen')
    populate_carcass_elements(folder_path, 'kitchen')
    populate_modules(folder_path, 'kitchen')
    populate_modules_hardware_elements(folder_path, 'kitchen')
    populate_type_module_mapping(folder_path, 'kitchen')
    populate_module_handle_details(folder_path, 'kitchen')
    populate_gola_profile_details(folder_path)
    populate_no_of_kitchen_module(folder_path)
    populate_kitchen_mandatory_addons(folder_path)
    add_special_handles
    # populate_module_special_handles(folder_path)  #No longer needed after March sales engine change.
    # populate_civil_kitchen_data  #Not needed as this data already exists in DB after running the script the first time.
    populate_appliance_categories
    populate_appliances(folder_path)
    populate_appliance_images(folder_path)
    populate_module_price_reduction(folder_path)
  end

  def run_all_services(folder_path = nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'services')}"
    populate_service_categories(folder_path)
    populate_service_subcategories(folder_path)
    populate_activities(folder_path)
    populate_activity_data(folder_path)
  end

  def run_all_kitchen_new(folder_path = nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'prodkitchen')}"
    populate_kitchen_addons(folder_path)
    populate_kitchen_addon_combinations(folder_path)
    mark_addons_as_extras(folder_path)
    populate_kitchen_module_addon_mapping(folder_path)
    populate_kitchen_mandatory_addons(folder_path)
    populate_optional_addons_for_addons(folder_path)
  end

  def populate_wardrobe_images(folder_path=nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'prodwardrobe')}"
    populate_module_images(folder_path, 'wardrobe')
    populate_handle_images(folder_path, 'wardrobe')
    populate_addon_images(folder_path, 'wardrobe')
    populate_shade_images(folder_path)  #this is common
  end

  def populate_kitchen_images(folder_path=nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'prodkitchen')}"
    populate_module_images(folder_path, 'kitchen')
    populate_handle_images(folder_path, 'kitchen')
    populate_addon_images(folder_path, 'kitchen')
  end

  def populate_modular_sections
    Section.where(name: "Modular Kitchen").first_or_create
    Section.where(name: "Modular Wardrobe").first_or_create
  end

  def populate_aluminium_types(data_hash, category)
    key_name = category.to_sym
    CarcassElementType.where(category: category).update(aluminium: false) if data_hash.keys.include?(key_name)

    data_hash[key_name].each do |name|
      CarcassElementType.where(category: category).find_by(name: name).update!(aluminium: true)
    end
  end

  def populate_glass_types(data_hash, category)
    key_name = category.to_sym
    CarcassElementType.where(category: category).update(glass: false) if data_hash.keys.include?(key_name)

    data_hash[key_name].each do |name|
      CarcassElementType.where(category: category).find_by(name: name).update!(glass: true)
    end
  end

  # populate appliance category and its subcategories
  def populate_appliance_categories
    kitchen_category = KitchenCategory.where(name: "Appliances").first_or_create!
    ["Chimney", "Hob", "Refrigerator", "Microwave Oven", "Oven with Microwave", "Dishwasher", "Built In Hob", 
      "Hob Top", "Built-In MWO", "Built-In Oven", "Cooking Range", "Cooktop", "Water Purifier", 
      "Hobs with Double Ring Italian Burners", "Cooker Hoods", "Deep Fryer", "Grill", 
      "Extractor Hood", "Warming Drawer"].each do |name|
      kitchen_category.allowed_module_types.where(name: name, category: 'kitchen').first_or_create!
    end
    kitchen_category.allowed_module_types.count
  end

  def populate_appliances(folder_path)
    filepath = "#{folder_path}/Appliances.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    no_module_type = []
    processed_codes = []
    duplicate_codes = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      name = workbook.row(row)[headers['name']]
      code = workbook.row(row)[headers['unique sku code']]
      duplicate_codes << code if processed_codes.include?(code)
      processed_codes << code
      appliance_category_name = workbook.row(row)[headers['type of appliance']]
      module_type = ModuleType.kitchen.find_by(name: appliance_category_name)
      if module_type.blank?
        no_module_type << appliance_category_name
        next
      end

      make = workbook.row(row)[headers['make']] 
      vendor_sku = workbook.row(row)[headers['vendor sku code']]
      specifications = workbook.row(row)[headers['spec']]
      warranty = workbook.row(row)[headers['warranty']] 
      price = workbook.row(row)[headers['rate']]
      mrp = workbook.row(row)[headers['mrp']]
      
      kitchen_appliance = module_type.kitchen_appliances.where(code: code).first_or_initialize
      kitchen_appliance.assign_attributes(
          name: name, 
          code: code, 
          make: make, 
          vendor_sku: vendor_sku, 
          specifications: specifications, 
          warranty: warranty, 
          price: price, 
          mrp: mrp
        )
      kitchen_appliance.save!
    end

    puts "No Module Type:"
    pp no_module_type
    puts "Duplicate codes:"
    pp duplicate_codes
    puts "Total: #{duplicate_codes.count}"
    puts "Codes from excel not having any appliance:"
    pp processed_codes.uniq - KitchenAppliance.pluck(:code)
    KitchenAppliance.count
  end

  def populate_appliance_images(folder_path)
    dirpath = "#{folder_path}/Appliance Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_kitchen_appliance = []

    file_names.each do |filename|
      # get kitchen_appliance code - replace '-' by '/'
      extension = filename.split(".").last
      code = filename.chomp(".#{extension.to_s}")
      kitchen_appliances = KitchenAppliance.where(code: code)
      if kitchen_appliances.blank?
        no_kitchen_appliance << code
        next
      end
      kitchen_appliances.each do |kitchen_appliance|
        image_file = File.new("#{dirpath}/#{filename}", "r")
        kitchen_appliance.update!(appliance_image: image_file)
      end
    end

    puts no_kitchen_appliance
    KitchenAppliance.all.find_all{|e| e.appliance_image.blank?}.pluck(:code)
  end

  def populate_core_materials(folder_path)
    filepath = "#{folder_path}/Core Material.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['core material']]

      core_material = CoreMaterial.where(name: name).first_or_create

      # now populate the prices for each thickness for this core material
      ((workbook.first_column + 1)..workbook.last_column).each do |column|
        thickness = workbook.row(1)[column-1].to_s
        price = workbook.row(row)[column-1].to_f
        puts "col-#{column}, thk-#{thickness}, pri-#{price}"
        core_material_price = core_material.core_material_prices.where(category: category, thickness: thickness).first_or_initialize
        core_material_price.assign_attributes(price: price)
        core_material_price.save
      end
    end

    CoreMaterial.count
    CoreMaterialPrice.count
  end

  def populate_brands(folder_path)
    filepath = "#{folder_path}/Brand.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['brand']]
      hardware = workbook.row(row)[headers['hardware']]&.downcase == "yes" ? true : false
      addon = workbook.row(row)[headers['addons']]&.downcase == "yes" ? true : false

      brand = Brand.where(name: name).first_or_initialize
      brand.assign_attributes(hardware: hardware, addon: addon)
      brand.save
    end

    Brand.count
  end

  def populate_shutter_finishes(folder_path)
    filepath = "#{folder_path}/Shutter Finish.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['shutter finish']]
      rate = workbook.row(row)[headers['rate']]

      shutter_finish = ShutterFinish.where(name: name).first_or_initialize
      shutter_finish.assign_attributes(price: rate)
      shutter_finish.save
    end

    ShutterFinish.count
  end

  # also map to shutter finishes
  def populate_shades(folder_path)
    filepath = "#{folder_path}/Shades.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    headers.each do |k,v|
      shutter_finish = ShutterFinish.where(name: k).take
      next unless shutter_finish.present?  #next if this finish is not in db

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        puts "+++++++++#{row}, #{headers[k]}+++++++++++"
        # Get the column data using the column heading.

        code = workbook.row(row)[headers[k]]
        next if code.blank?   #skip if code blank
        shade = Shade.where(code: code).first_or_initialize
        shade.assign_attributes(arrivae_select: true)
        shade.save!
        shutter_finish.shades << shade unless shutter_finish.shades.include?(shade)
      end
    end

    Shade.count
  end

  def populate_material_finish_mapping(folder_path)
    filepath = "#{folder_path}/Shutter Material to Shutter Finish Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    headers.each do |k,v|
      core_material = CoreMaterial.where(name: k).take
      next unless core_material.present?  #next if this material is not in db

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        puts "+++++++++#{row}, #{headers[k]}+++++++++++"
        # Get the column data using the column heading.

        name = workbook.row(row)[headers[k]]
        next if name.blank?   #skip if finish name blank
        shutter_finish = ShutterFinish.where(name: name).take
        core_material.add_finish(shutter_finish)
      end
    end

    ShutterMaterialFinish.count
  end

  def populate_skirting_configs(folder_path)
    filepath = "#{folder_path}/Skirting Config.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      skirting_type = workbook.row(row)[headers['skirting type']]
      skirting_height = workbook.row(row)[headers['skirting height']]
      price = workbook.row(row)[headers['price']]

      skirting_config = SkirtingConfig.where(skirting_type: skirting_type, skirting_height: skirting_height).first_or_initialize
      skirting_config.assign_attributes(price: price)
      skirting_config.save
    end

    SkirtingConfig.count
  end

  def populate_combined_doors(folder_path)
    filepath = "#{folder_path}/Rates for Sliding Wardrobes.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[headers['name']]
      price = workbook.row(row)[headers['price']]

      combined_door = CombinedDoor.where(name: name).first_or_initialize
      combined_door.assign_attributes(price: price)
      combined_door.save
    end

    CombinedDoor.count
  end

  def populate_module_types(folder_path, category)
    filepath = "#{folder_path}/Module Types.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[0]&.strip

      module_type = ModuleType.where(name: name, category: category).first_or_create
      puts "#{module_type.errors.full_messages}" unless module_type.valid?
    end

    ModuleType.count
  end

  def populate_handles(folder_path, category)
    filepath = "#{folder_path}/Handle.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      code = workbook.row(row)[headers['unique code']]
      handle_type = workbook.row(row)[headers['type']]
      # As requested by Abhishek during Sales Engine Changes, price = MRP and handle factor = 1
      # price = workbook.row(row)[headers['price']]
      mrp = workbook.row(row)[headers['mrp']]
      price = mrp
      spec = workbook.row(row)[headers['handle spec']]
      vendor_sku = workbook.row(row)[headers['vendor sku code']]
      make = workbook.row(row)[headers['oem']]
      unit = workbook.row(row)[headers['uom']]

      handle = Handle.where(code: code, category: category).first_or_initialize
      handle.assign_attributes(
        handle_type: handle_type, 
        price: price, 
        category: category, 
        mrp: mrp, 
        spec: spec, 
        vendor_sku: vendor_sku, 
        make: make, 
        unit: unit
        )
      handle.save
    end

    Handle.where(category: category).count
  end

  def populate_hardware_types(folder_path)
    filepath = "#{folder_path}/Hardware Types.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row+1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[0]

      hardware_type = HardwareType.where(name: name).first_or_create
    end

    HardwareType.count
  end

  def populate_addons(folder_path, category)
    filepath = "#{folder_path}/AddOns.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      code = workbook.row(row)[headers['unique code']]
      name = workbook.row(row)[headers['description']]
      specifications = workbook.row(row)[headers['specification']]
      price = workbook.row(row)[headers['mrp']]
      vendor_sku = workbook.row(row)[headers['vendor sku code']]
      brand_name = workbook.row(row)[headers['make']]
      brand = Brand.addon_brands.find_by(name: brand_name)

      addon = Addon.where(code: code, category: category).first_or_initialize
      addon.assign_attributes(name: name, specifications: specifications, price: price,
        brand: brand, category: category)
      addon.save
    end

    Addon.where(category: category).count
  end

  def populate_hardware_element_types(folder_path, category)
    filepath = "#{folder_path}/Hardware Element Types.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row+1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[0]
      next if name.blank?

      hardware_element_type = HardwareElementType.where(name: name, category: category).first_or_create
    end

    HardwareElementType.where(category: category).count
  end

  def populate_carcass_element_types(folder_path, category)
    filepath = "#{folder_path}/Carcass Element Types.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    (workbook.first_row+1..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[0]
      next if name.blank?

      carcass_element_type = CarcassElementType.where(name: name, category: category).first_or_create
    end

    CarcassElementType.where(category: category).count
  end

  def populate_kitchen_category(folder_path)
    filepath = "#{folder_path}/Category.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      name = workbook.row(row)[0]&.strip
      next if name.blank?

      kitchen_category = KitchenCategory.where(name: name).first_or_create
    end

    KitchenCategory.count
  end

  def populate_hardware_elements(folder_path, category)
    filepath = "#{folder_path}/Hardware Elements.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    errors = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # byebug if row==2
      # Get the column data using the column heading.
      code = workbook.row(row)[headers['code']]
      hardware_type = HardwareType.find_by_name workbook.row(row)[headers['type of hardware']]
      hardware_element_type = HardwareElementType.send(category).find_by_name workbook.row(row)[headers['element']]
      unit = workbook.row(row)[headers['unit of measurement']]
      price = workbook.row(row)[headers['mrp']]
      brand_name = workbook.row(row)[headers['options']]
      brand = Brand.hardware_brands.find_by(name: brand_name)

      hardware_element = HardwareElement.where(code: code, category: category, brand: brand).first_or_initialize
      hardware_element.assign_attributes(unit: unit.to_s.downcase, price: price, hardware_type: hardware_type, 
        hardware_element_type: hardware_element_type, brand: brand, category: category)
      if hardware_element.valid?
        hardware_element.save!
      else
         errors << "Row - #{row}; Code - #{code}; #{hardware_element.errors.full_messages}"
      end
    end

    pp errors
    HardwareElement.count
  end

  def populate_carcass_elements(folder_path, category)
    filepath = "#{folder_path}/Carcass Elements.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      header_name = header.to_s
      next if header.blank?
      headers[header.downcase] = i
    end

    code_array = []
    duplicates = []
    errors = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      code = workbook.row(row)[headers['code']]
      if code_array.include?(code)
        duplicates << code
      else
        code_array << code
      end
      width = workbook.row(row)[headers['carcass w']]
      depth = workbook.row(row)[headers['carcass d']]
      height = workbook.row(row)[headers['carcass h']]
      length = workbook.row(row)[headers['l']]
      breadth = workbook.row(row)[headers['b']]
      thickness = workbook.row(row)[headers['thk']]
      edge_band_thickness = workbook.row(row)[headers['edge band thickness 4seb']]
      area_sqft = workbook.row(row)[headers['sq ft']]
      carcass_element_type_name = workbook.row(row)[headers['type']]
      carcass_element_type = CarcassElementType.find_by(name: carcass_element_type_name, category: category)

      carcass_element = CarcassElement.where(code: code, category: category).first_or_initialize
      carcass_element.assign_attributes(
        code: code, 
        width: width, 
        depth: depth,
        height: height,
        length: length,
        breadth: breadth,
        thickness: thickness,
        edge_band_thickness: edge_band_thickness,
        area_sqft: area_sqft,
        carcass_element_type: carcass_element_type, 
        category: category
        )
      if carcass_element.valid?
        carcass_element.save!
      else
        errors << "Row - #{row}; Code - #{code}; #{carcass_element.errors.full_messages}"
      end
    end

    puts "Duplicates:"
    puts duplicates
    puts "Errors:"
    pp errors
    CarcassElement.count
  end

  def populate_module_addon_mapping(folder_path, category)
    no_module = []
    no_addon = []

    filepath = "#{folder_path}/Module to Possible Add On Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    headers.each do |k,v|
      product_module = ProductModule.find_by(code: k.gsub("_", "-"), category: category)
      unless product_module.present?  #next if this material is not in db
        no_module << k.gsub("_", "-")
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        puts "+++++++++#{row}, #{headers[k]}+++++++++++"
        # Get the column data using the column heading.

        code = workbook.row(row)[headers[k]]
        next if code.blank?   #skip if addon code blank
        addon = Addon.where(code: code, category: category).take
        unless addon.present?
          no_addon << code
          next
        end
        product_module.product_module_addons.where(addon: addon).first_or_create
        # product_module.add_allowed_addon(addon)
      end
    end

    puts "No modules with these codes:"
    pp no_module
    puts "No addons with these codes:"
    pp no_addon

    ProductModuleAddon.count
  end

  def populate_category_module_type_mapping(folder_path)
    filepath = "#{folder_path}/Category to Sub Category Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header&.strip] = i
    end

    no_category = []
    no_subcategory = []

    headers.each do |k,v|
      kitchen_category = KitchenCategory.where(name: k).take
      unless kitchen_category.present?  #next if this material is not in db
        no_category << k
        next
      end
      kitchen_category.allowed_module_types = []

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        puts "+++++++++#{row}, #{headers[k]}+++++++++++"
        # Get the column data using the column heading.

        name = workbook.row(row)[headers[k]]&.strip
        module_type = ModuleType.kitchen.where(name: name).take
        if name.blank? || module_type.blank?  #skip if module_type code blank
          no_subcategory << name if name.present?
          next
        end
        kitchen_category.category_module_types.where(module_type: module_type).first_or_create!
      end
    end

    puts no_category
    puts no_subcategory

    CategoryModuleType.count
  end

  def populate_type_module_mapping(folder_path, category)
    filepath = "#{folder_path}/Sub Category to Module Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header] = i
    end

    no_module = []

    headers.each do |k,v|
      module_type = ModuleType.where(name: k, category: category).take
      next unless module_type.present?  #next if this material is not in db

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        puts "+++++++++#{row}, #{headers[k]}+++++++++++"
        # Get the column data using the column heading.

        code = workbook.row(row)[headers[k]]
        product_module = ProductModule.where(code: code, category: category).take
        next if code.blank? || product_module.blank?  #skip if product_module code blank
        product_module.update!(module_type: module_type)
      end
    end

    ModuleType.where(category: category).map{|t| t.product_modules.count}.sum
  end

  def populate_modules(folder_path, category)
    duplicates = []
    code_array = []

    filepath = "#{folder_path}/Module Dimensions.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end
    puts headers

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['module code']]
      if code_array.include?(code)
        duplicates << code
      else
        code_array << code
      end
      product_module = ProductModule.where(code: code, category: category).first_or_initialize
      product_module.width = workbook.row(row)[headers['w']]
      product_module.depth = workbook.row(row)[headers['d']]
      product_module.height = workbook.row(row)[headers['h']]
      product_module.category = category
      product_module.save!
    end

    #import carcass elements
    filepath = "#{folder_path}/Carcass Elements Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ModuleCarcassElement.joins(:carcass_element).where(carcass_elements: { category: category }).destroy_all
    carcass_element_errors = []

    # ((workbook.first_row + 1)..workbook.last_row).each do |row|
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['module code']]
      product_module = ProductModule.where(code: code, category: category).first_or_initialize

      (2..78).each do |i|
        errors = []
        next unless i%2==0
        c_code = workbook.row(row)[i]
        quantity = workbook.row(row)[i+1].to_i
        next unless c_code.present?
        errors << "quantity not present or is 0 for code '#{c_code}'." unless quantity > 0
        carcass_element = CarcassElement.find_by(code: c_code, category: category)
        #could not find carcass element with this code - skip
        errors << "No carcass element with code '#{c_code}' found." if carcass_element.blank?
        if errors.present?
          carcass_element_errors << {
            module_code: code,
            errors: errors
          }
          next
        end
        module_carcass_element = product_module.module_carcass_elements.where(carcass_element: carcass_element).take
        if module_carcass_element.blank?
          module_carcass_element = product_module.module_carcass_elements.build(carcass_element: carcass_element, quantity: quantity)
        else
          module_carcass_element.assign_attributes(quantity: quantity)
        end
        module_carcass_element.save!
      end
    end

    puts 'Duplicates:'
    pp duplicates
    puts 'Carcass Element mapping errors:'
    pp carcass_element_errors
    ProductModule.where(category: category).count
  end

  # populate only hardware element mapping of modules
  def populate_modules_hardware_elements(folder_path, category)
    filepath = "#{folder_path}/Hardware Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    ModuleHardwareElement.joins(:hardware_element).where(hardware_elements: { category: category }).destroy_all

    # import hardware elements
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['module code']]
      product_module = ProductModule.where(code: code, category: category).first_or_initialize

      (6..36).each do |i|
        next unless i%2==0
        h_code = workbook.row(row)[i]
        quantity = workbook.row(row)[i+1]
        # byebug if row == 2 && h_code.present?
        next unless h_code.present? && quantity.present?
        hardware_element = HardwareElement.find_by(code: h_code, category: category)
        module_hardware_element = product_module.module_hardware_elements.where(hardware_element: hardware_element).take
        if module_hardware_element.blank?
          module_hardware_element = product_module.module_hardware_elements.build(hardware_element: hardware_element, quantity: quantity)       
        else
          module_hardware_element.assign_attributes(quantity: quantity)
        end

        module_hardware_element.save!
      end
    end

    HardwareElement.kitchen.count
  end

  def populate_module_handle_details(folder_path, category)
    filepath = "#{folder_path}/Module to Handle Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    no_module = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['module code']]
      number_door_handles = workbook.row(row)[headers['drawer handles']].to_i
      number_shutter_handles = workbook.row(row)[headers['shutter handles']].to_i
      # 17 Sept, Arunoday: removed first_or_initialize. Module must exist beforehand.
      product_module = ProductModule.find_by(code: code, category: category)
      unless product_module.present?
        no_module << code
        next
      end

      product_module.assign_attributes(number_door_handles: number_door_handles, number_shutter_handles: number_shutter_handles)
      product_module.save!
    end

    puts "No modules with these codes:"
    pp no_module
    ProductModule.where(category: category, number_shutter_handles: nil, number_door_handles: nil).count
  end

  def populate_kitchen_addons(folder_path)
    no_brand = []
    filenames = ["Mandatory"]

    filenames.each do |filename|
      filepath = "#{folder_path}/#{filename}.xlsx"
      workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header.to_s.downcase] = i
      end

      duplicates = []
      code_array = []

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        code = workbook.row(row)[headers['sku code']]&.strip
        if code_array.include?(code)
          duplicates << code
        else
          code_array << code
        end
        brand_name = workbook.row(row)[headers['make']]
        brand = Brand.addon_brands.find_by(name: brand_name)
        no_brand << brand_name if brand.blank?
        vendor_sku = workbook.row(row)[headers['vendor sku code']]
        name = workbook.row(row)[headers['description']]
        specifications = workbook.row(row)[headers['spec']]
        price = workbook.row(row)[headers['price']]
        mrp = workbook.row(row)[headers['mrp']]
        addon = Addon.where(category: 'kitchen', code: code).first_or_initialize
        addon.assign_attributes(brand: brand, vendor_sku: vendor_sku, name: name, specifications: specifications, 
          price: price, mrp: mrp)

        # Commenting the tag import code as no such data in excel.
        # add tags
        # tag_array = workbook.row(row)[headers['economy / standard / premium']].to_s.split("/")
        # addon.tags = []
        # tag_array.each do |tag_name|
        #   puts "row #{row}: #{tag_array}, #{tag_name}"
        #   addon_tag = Tag.where(name: Tag.format_name(tag_name)).first_or_create
        #   addon.save!
        #   addon.tags << addon_tag
        # end

        addon.save!
      end

      puts "Duplicate addon codes in excel #{filename}:"
      puts duplicates
    end

    Addon.kitchen.count
  end

  def populate_kitchen_addon_combinations(folder_path)
    filepath = "#{folder_path}/Combinations.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    duplicates = []
    code_array = []
    invalid_code = []
    addon_not_present = []

    (workbook.first_row..workbook.last_row).each do |row|
      code = workbook.row(row)[0]&.strip
      unless code.include?('+') || code.include?('*')
        invalid_code << code
        next
      end
      if code_array.include?(code)
        duplicates << code
        next
      else
        code_array << code
      end

      # First split by "+"
      str_array = code.split('+').map{|s| s.strip}
      addon_array = []
      str_array.each do |code_str|
        code_array = code_str.partition('*')
        addon_code = code_array.first.strip   #don't overwrite the code variable from earlier!
        quantity = code_array.last.strip.to_i
        quantity = 1 if quantity == 0
        addon_array << {
          code: addon_code,
          quantity: quantity
        } if addon_code.present?
      end

      # As of 10-09-2019, all combinations are to available as extras.
      addon_combination.extra = true
      addon_combination = AddonCombination.where(code: code).first_or_create!
      addon_combination.assign_attributes(combo_name: "Addon Combination")
      addon_combination.addons = []
      addon_array.each do |hsh|
        addon = Addon.kitchen.find_by_code(hsh[:code])
        if addon.blank?
          addon_not_present << "Row-#{row}-#{hsh[:code]}"
          next
        end
        addon_combination.addon_combination_mappings.create!(addon: addon, quantity: hsh[:quantity])
      end
    end

    puts "Following combinations are duplicated:"
    puts duplicates
    puts "Following combination codes are invalid:"
    puts invalid_code
    puts "Addons with following codes were not found:"
    puts addon_not_present

    AddonCombination.count
  end

  def populate_no_of_kitchen_module(folder_path)
    filepath = "#{folder_path}/Module to Mandatory Add Ons.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    new_module = []
    (workbook.first_row+1..workbook.last_row).each do |row|
      mod = ProductModule.find_by_code(workbook.row(row)[0])
      if mod.present?
        mod.number_kitchen_addons = workbook.row(row)[1]
        mod.save!
      else
        new_module.push workbook.row(row)[0]
      end
    end
    new_module
  end

  def populate_gola_profile_details(folder_path)
    filepath = "#{folder_path}/Gola Profile - L & C Sections.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    no_module = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['module code']]
      c_section_length = workbook.row(row)[headers['c section length']].to_i
      l_section_length = workbook.row(row)[headers['l section length']].to_i
      c_section_number = workbook.row(row)[headers['c section number']].to_i
      l_section_number = workbook.row(row)[headers['l section number']].to_i
      product_module = ProductModule.kitchen.where(code: code).first_or_initialize
      next unless product_module.present?

      product_module.assign_attributes(c_section_length: c_section_length, l_section_length: l_section_length, 
        c_section_number: c_section_number, l_section_number: l_section_number)
      product_module.save!
    end

    puts no_module
    ProductModule.kitchen.count
  end

  def populate_module_images(folder_path, category)
    dirpath = "#{folder_path}/Module Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_module = []

    file_names.each do |filename|
      code = filename.partition(".")[0]
      product_module = ProductModule.where(category: category).find_by_code(code)
      if product_module.blank?
        no_module << code
        next
      end
      product_module.update!(module_image: File.new("#{dirpath}/#{filename}", "r"))
    end

    puts no_module
    ProductModule.where(category: category).find_all{|e| e.module_image.blank?}.pluck(:code)
  end

  def populate_handle_images(folder_path, category)
    dirpath = "#{folder_path}/Handle Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_handle = []

    file_names.each do |filename|
      code = filename.partition(".")[0]
      handle = Handle.where(category: category).find_by_code(code)
      if handle.blank?
        no_handle << code
        next
      end
      handle.update!(handle_image: File.new("#{dirpath}/#{filename}", "r"))
    end

    puts no_handle
    Handle.where(category: category).find_all{|e| e.handle_image.blank?}.pluck(:code)
  end

  def populate_addon_images(folder_path, category)
    dirpath = "#{folder_path}/Addon Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_addon = []

    file_names.each_with_index do |filename, i|
      # byebug if i==0
      code = filename.partition(".")[0]
      addons = Addon.where(category: category, code: code)
      if addons.blank?
        no_addon << code
        next
      end
      addons.each do |addon|
        image_file = File.new("#{dirpath}/#{filename}", "r")
        addon.update!(addon_image: image_file)
      end
    end

    puts no_addon
    Addon.where(category: category).find_all{|e| e.addon_image.blank?}.pluck(:code)
  end

  def populate_shade_images(folder_path)
    dirpath = "#{folder_path}/Shade Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_shade = []

    file_names.each do |filename|
      code = filename.partition(".")[0]
      shade = Shade.find_by_code(code)
      if shade.blank?
        no_shade << code
        next
      end
      shade.update!(shade_image: File.new("#{dirpath}/#{filename}", "r"))
    end

    puts no_shade
    Shade.all.find_all{|e| e.shade_image.blank?}.pluck(:code)
  end

  # from folder with images - code will be same as file name
  # if already exists, then update the image
  def populate_edge_banding_shades(folder_path)
    dirpath = "#{folder_path}/Edge Banding Shade Images"
    file_names = Dir.new(dirpath).entries - [".", ".."]

    no_shade = []

    file_names.each do |filename|
      code = filename.partition(".")[0]
      edge_banding_shade = EdgeBandingShade.where(code: code).first_or_initialize
      if edge_banding_shade.blank?
        no_shade << code
        next
      end
      edge_banding_shade.update!(shade_image: File.new("#{dirpath}/#{filename}", "r"))
    end

    puts no_shade

    EdgeBandingShade.count
  end

  def populate_matching_edge_banding_shades(folder_path)
    filepath = "#{folder_path}/Matching Edge Banding.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    no_shades = []
    no_edge_banding_shades = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      shade_code = workbook.row(row)[headers['shade']]
      edge_banding_shade_code = workbook.row(row)[headers['matching edge banding']]
      
      shade = Shade.find_by(code: shade_code)
      no_shades << shade_code if shade.blank?
      edge_banding_shade = EdgeBandingShade.find_by(code: edge_banding_shade_code)
      no_edge_banding_shades << edge_banding_shade_code if edge_banding_shade.blank?
      next unless shade.present? && edge_banding_shade.present?

      shade.update!(edge_banding_shade: edge_banding_shade)
    end

    puts "No shades found:"
    pp no_shades
    puts "No edge banding shades found:"
    pp no_edge_banding_shades

    EdgeBandingShade.count
  end

  def populate_service_categories(folder_path)
    filepath = "#{folder_path}/Categories.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      name = workbook.row(row)[headers['categories']]
      
      service_category = ServiceCategory.where(name: name).first_or_create!
    end

    ServiceCategory.count
  end

  def populate_service_subcategories(folder_path)
    filepath = "#{folder_path}/Category to Sub Category Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s] = i
    end

    headers.each do |k,v|
      service_category = ServiceCategory.find_by(name: k)
      next if service_category.blank?

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        name = workbook.row(row)[headers[k]]
        next if name.blank?
        
        # puts "#{v}, row##{row}"
        service_subcategory = service_category.service_subcategories.where(name: name).first_or_create!
      end
    end

    ServiceSubcategory.count
  end

  def populate_activities(folder_path)
    filepath = "#{folder_path}/Rates.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      subcategory_name = workbook.row(row)[headers['sub category']]
      service_subcategory = ServiceSubcategory.find_by(name: subcategory_name)
      service_category = service_subcategory.service_category
      name = workbook.row(row)[headers['service']]
      code = workbook.row(row)[headers['unique code']]

      service_activity = ServiceActivity.where(code: code).first_or_initialize
      service_activity.assign_attributes(name: name, service_category: service_category, service_subcategory: service_subcategory)
      service_activity.save!
    end

    ServiceActivity.count
  end

  def populate_activity_data(folder_path)
    # filepath = "#{folder_path}/Rates.xlsx"
    filepath = "#{folder_path}/Rates.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    no_service = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|   
      name = workbook.row(row)[headers['service']]
      code = workbook.row(row)[headers['unique code']]
      service_activity = ServiceActivity.find_by_code code
      if service_activity.blank?
        no_service << code
      end

      unit = workbook.row(row)[headers['uom']]
      base_rate_string = workbook.row(row)[headers['base price']]
      base_price = ["","na","n.a.", "n.a"].include?(base_rate_string.to_s&.downcase) ? nil : base_rate_string.to_f
      installation_price = workbook.row(row)[headers['installation price']]
      description = workbook.row(row)[headers['description']]
      
      service_activity.assign_attributes(unit: unit, default_base_price: base_price, installation_price: installation_price, 
        description: description)
      service_activity.save!
    end

    puts "No service with name:"
    pp no_service
    ServiceActivity.count
  end

  def add_special_handles
    arr = ["G Section Handle", "Gola Profile", "J Section Handle", "Top Insert Handle"]

    arr.each do |handle_code|
      handle = Handle.kitchen.where(code: handle_code).first_or_initialize
      handle.assign_attributes(handle_type: 'both', price: 0)
      handle.save!
    end
  end

  # def populate_module_special_handles(folder_path)
  #   filepath = "#{folder_path}/Modules with Compulsory G Section Handles.xlsx"
  #   workbook = Roo::Spreadsheet.open filepath

  #   no_modules = []

  #   headers = Hash.new
  #   workbook.row(1).each_with_index do |header,i|
  #     headers[header.downcase] = i
  #   end

  #   ((workbook.first_row + 1)..workbook.last_row).each do |row|
  #     module_code = workbook.row(row)[headers['module code']]
  #     special_handles_column = workbook.row(row)[headers['g section handles']]
  #     special_handles_only = special_handles_column&.downcase == "yes" ? true : false
      
  #     product_module = ProductModule.find_by(code: module_code)
  #     if product_module.blank?
  #       no_modules << module_code
  #       next
  #     end

  #     product_module.update!(special_handles_only: special_handles_only)
  #   end

  #   pp "No module found with these codes: "
  #   pp no_modules
  #   ProductModule.where(special_handles_only: true).count
  # end

  # custom shelf unit sub-category and module for seamless flow
  def populate_civil_kitchen_data
    # ensure module type
    base_unit = KitchenCategory.base_unit
    module_type = ModuleType.kitchen.where(name: ModuleType::CUSTOM_SHELF_UNIT_NAME).first_or_create!
    if !base_unit.allowed_module_types.include?(module_type)
      base_unit.allowed_module_types << module_type
    end

    # ensure module
      product_module = ProductModule.where(code: ProductModule::CUSTOM_SHELF_UNIT_CODE, category: 'kitchen', module_type: module_type).first_or_create!
      product_module.update!(width: 0, depth: 0, height: 0)
  end

  def mark_addons_as_extras(folder_path)
    filepath = "#{folder_path}/Non Mandatory Kitchen Extras.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    no_addons = []
    
    (workbook.first_row..workbook.last_row).each do |row|
      code = workbook.row(row)[0]
      addon = Addon.find_by_code code
      if addon.present?
        addon.update! extra: true
      else
        no_addons << code
      end
    end

    puts "No addons with these codes:"
    pp no_addons
    Addon.kitchen.extra.count
  end

  # This is just a helper method for kitchen addon mapping
  def get_combination(str)
    if str.blank?
      nil
    elsif str.include?('+') || str.include?('*')
      AddonCombination.find_by(code: str)
    else
      Addon.kitchen.find_by(code: str)
    end
  end

  # optional addon mapping to modules for kitchen
  def populate_kitchen_module_addon_mapping(folder_path)
    ProductModuleAddon.joins(:product_module).where(product_modules: {category: 'kitchen'}).destroy_all
    category = 'kitchen'
    filenames = [ 
                  "Optional for Blind Options",
                  "Optional for Cylinder Options",
                  "Optional for L Corner Unit Options",
                  "Optional Module Sink Options"
                ]
    no_modules = []
    no_addons = []

    filenames.each do |filename|
      filepath = "#{folder_path}/#{filename}.xlsx"
      workbook = Roo::Spreadsheet.open filepath

      headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        headers[header] = i
      end

      headers.each do |k,v|
        code = k.gsub("_", "-")&.strip
        product_module = ProductModule.find_by(code: code, category: category)
        unless product_module.present?  #next if this material is not in db
          no_modules << k.gsub("_", "-")
          next
        end

        ((workbook.first_row + 1)..workbook.last_row).each do |row|
          puts "+++++++++#{filename}, #{row}, #{headers[k]}+++++++++++"
          # Get the column data using the column heading.
          # byebug if row==5 && headers[k]==0
          addon_code = workbook.row(row)[headers[k]]&.strip
          # addon = Addon.find_by(addon_code: addon_code, category: category)
          addon = get_combination(addon_code)
          #skip if addon addon_code blank
          if addon.blank?
            no_addons << addon_code if addon_code.present?
            next
          end
          # product_module.product_module_addons.where(addon: addon).first_or_create
          if addon.class.to_s == 'Addon'
            product_module.product_module_addons.where(addon: addon).first_or_create!
          elsif addon.class.to_s == 'AddonCombination'
            product_module.product_module_addons.where(addon_combination: addon).first_or_create!
          else
            no_addons << addon_code if addon_code.present?
          end
        end
      end
    end

    puts "No modules found with these codes:"
    pp no_modules
    puts "No addons or addon combinations found with these codes"
    pp no_addons
    ProductModuleAddon.joins(:product_module).where(product_modules: {category: 'kitchen'}).count
  end

  def populate_kitchen_mandatory_addons(folder_path)
    filepath = "#{folder_path}/Kitchen Mandatory Add Ons.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    module_not_present = []
    addon_not_present = []
    KitchenAddonSlot.destroy_all
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    # loop through rows
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[3]
      product_module = ProductModule.kitchen.find_by_code(code)
      if product_module.blank?
        module_not_present << code
        next
      end
      # loop through columns
      (4..17).each do |i|
        slot_name = workbook.row(1)[i]
        puts "++++++++++++++Row-#{row}---Column-#{i}+++++++++++++++"
        next if slot_name.blank?
        kitchen_addon_slot = product_module.kitchen_addon_slots.where(slot_name: slot_name).first_or_create!
        addon_code = workbook.row(row)[i]&.strip
        # addon = Addon.kitchen.find_by_code addon_code
        # byebug if row==3
        addon = get_combination(addon_code)
        if addon.blank?
          addon_not_present << addon_code if addon_code.present?
          next
        end
        if addon.class.to_s == 'Addon'
          kitchen_addon_slot.kitchen_module_addon_mappings.where(addon: addon).first_or_create!
        elsif addon.class.to_s == 'AddonCombination'
          kitchen_addon_slot.kitchen_module_addon_mappings.where(addon_combination: addon).first_or_create!
        else
          addon_not_present << addon_code if addon_code.present?
        end
      end

      # delete any slots which don't have any addons
      product_module.kitchen_addon_slots.find_all{|slot| slot.kitchen_module_addon_mappings.count <= 0}.map(&:destroy)
    end

    puts "No modules with these codes:"
    pp module_not_present
    puts "No addons with these codes:"
    pp addon_not_present

    KitchenModuleAddonMapping.count
  end

  def populate_optional_addons_for_addons(folder_path)
    filepath = "#{folder_path}/Mandatory to Non Mandatory Add Ons Mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    module_not_present = []
    addon_not_present = []
    slot_not_present = []
    no_mapping = []
    AddonsForAddonsMapping.destroy_all

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end

    # loop through rows
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # module
      code = workbook.row(row)[headers['module code']]
      product_module = ProductModule.kitchen.find_by_code(code)
      if product_module.blank?
        module_not_present << code
        next
      end
      # slot
      slot_name = workbook.row(row)[headers['slot']]
      next if slot_name.blank?
      kitchen_addon_slot = product_module.kitchen_addon_slots.find_by(slot_name: slot_name)
      if kitchen_addon_slot.blank?
        slot_not_present << {
          product_module_code: code, 
          slot_name: slot_name
        }
        next
      end
      # byebug if row==2
      # Find the compulsory addon or add_combination.
      compulsory_addon_code = workbook.row(row)[headers['mandatory add on']]&.strip
      next if compulsory_addon_code.blank?
      if compulsory_addon_code.include?('+') || compulsory_addon_code.include?('*')
        compulsory_addon = kitchen_addon_slot.addon_combinations.find_by(code: compulsory_addon_code)
      else
        compulsory_addon = kitchen_addon_slot.addons.find_by(code: compulsory_addon_code)
      end
      if compulsory_addon.blank?
        # Check if any addon with this code exists.
        if Addon.where(code: compulsory_addon_code).exists?
          # if exists, then show that no such mapping for that module for that slot exists
          no_mapping << {
            product_module_code: code, 
            slot_name: slot_name, 
            compulsory_addon_code: compulsory_addon_code
          }
        else
          # Other show that no such addon or combination exists at all!
          addon_not_present << compulsory_addon_code
        end
        # go to the next row no matter the reason
        next
      end

      kitchen_module_addon_mapping = kitchen_addon_slot.kitchen_module_addon_mappings.where("addon_id=? OR addon_combination_id=?", compulsory_addon.id, compulsory_addon.id).take
      # We should probably never reach here as the previos conditions should handle it. Leaving it here for now.
      if kitchen_module_addon_mapping.blank?
        no_mapping << {
          product_module_code: code, 
          slot_name: slot_name, 
          compulsory_addon_code: compulsory_addon_code
        }
        next
      end

      # loop through columns
      (6..20).each do |i|
        addon_code = workbook.row(row)[i]&.strip
        # byebug if row==2 && addon_code.present?
        addon = get_combination(addon_code)
        if addon.blank?
          addon_not_present << addon_code if addon_code.present?
          next
        end
        if addon.class.to_s == 'Addon'
          addons_for_addons_mapping = kitchen_module_addon_mapping.addons_for_addons_mappings.where(addon: addon).first_or_create!
        elsif addon.class.to_s == 'AddonCombination'
          addons_for_addons_mapping = kitchen_module_addon_mapping.addons_for_addons_mappings.where(addon_combination: addon).first_or_create!
        else
          addon_not_present << addon_code if addon_code.present?
        end
      end
    end

    puts "No modules with these codes:"
    pp module_not_present
    puts "No slots with these details:"
    pp slot_not_present    
    puts "No addons with these codes:"
    pp addon_not_present
    puts "No mapping found:"
    pp no_mapping

    AddonsForAddonsMapping.count
  end

  def populate_module_price_reduction(folder_path)
    filepath = "#{folder_path}/Price Reduction 18 percent.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    no_module = []
    (workbook.first_row..workbook.last_row).each do |row|
      product_module = ProductModule.kitchen.find_by_code(workbook.row(row)[0])
      if product_module.present?
        product_module.percent_18_reduction = true
        product_module.save!
      else
        no_module.push workbook.row(row)[0]
      end
    end
    puts no_module
    ProductModule.kitchen.where(percent_18_reduction: true).count
  end

  def populate_addons_allowed_in_custom_unit(folder_path)
    filepath = "#{folder_path}/List of all Add Ons where Channels need to be removed.xlsx"
    workbook = Roo::Spreadsheet.open filepath
    no_addon = []
    (workbook.first_row+1..workbook.last_row).each do |row|
      addon = Addon.kitchen.find_by_code(workbook.row(row)[0])
      if addon.present?
        addon.allowed_in_custom_unit = true
        addon.save!
      else
        no_addon.push workbook.row(row)[0]
      end
    end
    puts no_addon
    Addon.kitchen.where(allowed_in_custom_unit: true).count
  end

  def populate_module_al_profile_sizes(folder_path)
    filepath = "#{folder_path}/Al Profile Sizes.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    no_modules = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      module_code = workbook.row(row)[headers['code']]
      length = workbook.row(row)[headers["length of al profile (r mt)"]].to_f
      
      product_module = ProductModule.find_by(code: module_code)
      if product_module.blank?
        no_modules << module_code
        next
      end

      product_module.update!(al_profile_size: length)
    end

    pp "No module found with these codes: "
    pp no_modules
    ProductModule.where("al_profile_size > ?", 0).count
  end

  # For both MK and MW.
  # populate the module types and modules that are to be used for Unfinished panel and Finished panel.
  def populate_finished_unfinished_panels
    # MK
    addon_category = KitchenCategory.addon_category
    mk_unfinished_subcategory = addon_category.allowed_module_types.where(category: 'kitchen', name: 'Unfinished Panel').first_or_create!
    mk_unfinished_subcategory.product_modules.where(category: 'kitchen', code: 'AR-CORMAT').first_or_create!
    mk_finished_subcategory = addon_category.allowed_module_types.where(category: 'kitchen', name: 'Finished Panel').first_or_create!
    mk_finished_subcategory.product_modules.where(category: 'kitchen', code: 'AR-FINMAT').first_or_create!

    # MW
    mw_unfinished_subcategory = ModuleType.where(category: 'wardrobe', name: 'Unfinished Panel').first_or_create!
    mw_unfinished_subcategory.product_modules.where(category: 'wardrobe', code: 'AR-CORMAT').first_or_create!
    mw_finished_subcategory = ModuleType.where(category: 'wardrobe', name: 'Finished Panel').first_or_create!
    mw_finished_subcategory.product_modules.where(category: 'wardrobe', code: 'AR-FINMAT').first_or_create!
  end

  # 'Expired Services' service_category for services that will exist in DB but not available in
  # any new/edited BOQ.
  def add_expired_service_category
    expired_service_category = ServiceCategory.where(name: ServiceCategory::EXPIRED_LEADS).first_or_create
    expired_service_subcategory = expired_service_category.service_subcategories.where(name: ServiceCategory::EXPIRED_LEADS).first_or_initialize
    expired_service_category.update!(hidden: true)
    expired_service_subcategory.save! if expired_service_subcategory.new_record?
  end

  # Move all currently existing services which have service_jobs into the hidden "Expired Services" category.
  # Then delete all remaining activities, subcategories and categories.
  def move_services_to_expired
    expired_service_category = ServiceCategory.unscoped.find_by(name: ServiceCategory::EXPIRED_LEADS)
    expired_service_subcategory = expired_service_category.service_subcategories.find_by(name: ServiceCategory::EXPIRED_LEADS)

    services_with_jobs = ServiceActivity.joins(:service_jobs).distinct
    services_with_jobs.each do |service_activity|
      service_activity.service_subcategory = expired_service_subcategory
      service_activity.service_category = expired_service_category
      service_activity.save!
    end

    services_without_jobs = ServiceActivity.where.not(id: services_with_jobs)
    services_without_jobs.destroy_all
    ServiceSubcategory.where.not(id: expired_service_subcategory).destroy_all
    ServiceCategory.destroy_all
  end
end
