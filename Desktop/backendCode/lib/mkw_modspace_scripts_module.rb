# This module will contain scripts to be executed to accommodate changes to the DB for MKW (Modspace only).
module MkwModspaceScriptsModule
  def run_all_modspace(folder_path = nil)
    folder_path ||= "#{Rails.root.join('app', 'data', 'modspace')}"
    populate_modspace_materials(folder_path)  #Modspace
    populate_modspace_finishes(folder_path)  #Modspace
    populate_core_shutter_mapping_modspace(folder_path)  #Modspace
    populate_material_finish_mapping_modspace(folder_path)  #Modspace
    populate_modspace_addons(folder_path, {category: 'kitchen', extra: true})  #Modspace
    populate_modspace_addons(folder_path, {category: 'wardrobe', extra: true})  #Modspace
    populate_modspace_modules(folder_path, 'kitchen')  #Modspace
    populate_modspace_handles(folder_path, 'kitchen')  #Modspace
    populate_module_handle_details(folder_path, 'kitchen')  #Modspace
    populate_modspace_cabinet_pricing("#{folder_path}/Modspace cabinets wardrobe.xlsx", 'wardrobe')  #Modspace
    populate_modspace_cabinet_pricing("#{folder_path}/Modspace cabinets kitchen.xlsx", 'kitchen')  #Modspace
    #Now images
    populate_module_images(folder_path, 'kitchen')  #Modspace
    populate_handle_images(folder_path, 'kitchen')  #Modspace
  end

  # Modspace - populate core materials available for Modspace ONLY.
  def populate_modspace_materials(folder_path)
    material_names = ['Prelam Particle', 'Prelam MDF']
    material_names.each do |material_name|
      core_material = CoreMaterial.where(name: material_name).first_or_initialize
      core_material.modspace_visible = true
      core_material.hidden = true if core_material.new_record?  #IMPORTANT - we want it hidden from normal MKW BOQs only if we are adding it now - don't hide existing materials!!!
      core_material.save!
    end
    CoreMaterial.modspace_visible.count
  end

  # Modspace - populate core materials and shutter_finishes available for Modspace.
  def populate_modspace_finishes(folder_path)
    ShutterFinish.all.update modspace_visible: false
    finish_names = ['Matt Laminate','HGL Laminate','MR+ Laminate','PU Gloss','Acrylic Plain','Acrylic Mattlic','UV','Lacqured Plain',
      'Membrene Matt','Membrene Gloss', 'Prelam Particle']
    finish_names.each do |finish_name|
      shutter_finish = ShutterFinish.where(name: finish_name).first_or_initialize
      #IMPORTANT - we want it hidden from normal MKW BOQs only if we are adding it now - don't hide existing materials!!!
      # Similar logic for prices.
      if shutter_finish.new_record?
        shutter_finish.hidden = true
        shutter_finish.price = 0
        shutter_finish.wardrobe_price = 0
      end
      shutter_finish.modspace_visible = true
      shutter_finish.save!
    end

    ShutterFinish.modspace_visible.count
  end

  #Modspace - core material to allowed shutter material mapping
  def populate_core_shutter_mapping_modspace(folder_path)
    filepath = "#{folder_path}/Modspace core shutter material mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.strip] = i
    end

    no_such_material = []
    # The first row ie headers contain the core material that are to be available for Modspace.
    # First, mark all core materials as hidden for modspace, then mark those in the header as visible.
    CoreMaterial.all.update modspace_visible: false, modspace_shutter: false

    headers.each do |k,v|
      core_material = CoreMaterial.where(name: k).take
      unless core_material.present?  #next if this material is not in db
        no_such_material << k
        next
      end

      core_material.update! modspace_visible: true
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        name = workbook.row(row)[headers[k]].to_s.strip
        next if name.blank?   #skip if material name blank
        shutter_material = CoreMaterial.where(name: name).take
        unless shutter_material.present?  #next if this material is not in db
          no_such_material << name
          next
        end
        shutter_material.update modspace_shutter: true
        mapping = core_material.shutter_material_mappings.where(shutter_material: shutter_material).first_or_create
      end
    end

    puts "No such core/shutter material found:"
    pp no_such_material.uniq
    CoreShutterMapping.count
  end

  #Modspace - core material to allowed shutter material mapping
  def populate_material_finish_mapping_modspace(folder_path)
    filepath = "#{folder_path}/Modspace shutter material finish mapping.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    # The first row ie headers contain the shutter material for modspace, below them are the allowed finishes for that material
    # for Modspace.
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.strip] = i
    end

    no_such_material = []
    no_such_finish = []

    headers.each do |k,v|
      core_material = CoreMaterial.where(name: k).take
      unless core_material.present?  #next if this material is not in db
        no_such_material << k
        next
      end

      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        # Get the column data using the column heading.
        name = workbook.row(row)[headers[k]].to_s.strip
        next if name.blank?   #skip if finish name blank
        shutter_finish = ShutterFinish.where(name: name).take
        unless shutter_finish.present?  #next if this finish is not in db
          no_such_finish << name
          next
        end
        mapping = core_material.modspace_shutter_material_finishes.where(shutter_finish: shutter_finish).first_or_create
      end
    end

    puts "No such shutter material found:"
    pp no_such_material.uniq
    puts "No such shutter finish found:"
    pp no_such_finish
    ShutterMaterialFinish.where(mapping_type: 'modspace').count
  end

  # Modspace - For a module, based on the core material, shutter material and finish chosen, the price is determined.
  def populate_modspace_cabinet_pricing(filepath, category)
    workbook = Roo::Spreadsheet.open filepath

    no_such_material = []
    no_such_finish = []
    no_such_module = []
    no_material_mapping = []
    no_finish_mapping = []
    pricing_not_saved = []

    headers = Hash.new
    last_column_index = workbook.row(1).count - 1
    core_material_row = 1
    shutter_material_row = 2
    finish_row = 3
    price_start_row = 5

    #ignore first column for obvious reasons - it contains module codes
    (1..last_column_index).each do |i|
      skip_column_flag = false
      core_material = CoreMaterial.where(name: workbook.row(core_material_row)[i].to_s.strip).take
      shutter_material = CoreMaterial.where(name: workbook.row(shutter_material_row)[i].to_s.strip).take
      shutter_finish = ShutterFinish.where(name: workbook.row(finish_row)[i].to_s.strip).take

      #next if any of these not in db
      unless core_material.present? && shutter_material.present? && shutter_finish.present?
        no_such_material << workbook.row(core_material_row)[i].to_s.strip unless core_material.present?
        no_such_material << workbook.row(shutter_material_row)[i].to_s.strip unless shutter_material.present?
        no_such_finish << workbook.row(finish_row)[i].to_s.strip unless shutter_finish.present?
        skip_column_flag = true
        if skip_column_flag
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          puts "Skipping column #{i} due to missing material or finish."
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        end
      end

      # Now check for material mapping
      core_shutter_mapping = CoreShutterMapping.find_by(core_material: core_material, shutter_material: shutter_material)
      if core_material.present? && shutter_material.present?
        unless core_shutter_mapping.present?
          no_material_mapping << "#{core_material.name} - #{shutter_material.name}"
          skip_column_flag = true
        end
        if skip_column_flag
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          puts "Skipping column #{i} due to missing core material - shutter material mapping."
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        end
      end

      # Now check for material finish mapping
      shutter_material_finish = ShutterMaterialFinish.find_by(core_material: shutter_material, shutter_finish: shutter_finish)
      if shutter_material.present? && shutter_finish.present?
        unless shutter_material_finish.present?
          no_finish_mapping << "#{shutter_material.name} - #{shutter_finish.name}"
          skip_column_flag = true
        end
        if skip_column_flag
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
          puts "Skipping column #{i} due to missing material-finish mapping."
          puts "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        end
      end

      next if skip_column_flag

      # all checks done and passed - now actually import the prices
      # (price_start_row..workbook.last_row).each do |row|
      (price_start_row..workbook.last_row).each do |row|
        code = workbook.row(row)[0].to_s.strip
        product_module = ProductModule.where(category: category).find_by(code: code)
        if product_module.blank?
          no_such_module << code unless code.blank?
          next
        end
        price = workbook.row(row)[i].to_f
        modspace_cabinet_price = product_module.modspace_cabinet_prices.where(core_shutter_mapping: core_shutter_mapping, shutter_finish: shutter_finish).first_or_initialize
        modspace_cabinet_price.price = price
        unless modspace_cabinet_price.save
          pricing_not_saved << {"Col-#{i+1}, Row-#{row}" => modspace_cabinet_price.errors.full_messages}
        end
      end
    end

    puts "No such core/shutter material found:"
    pp no_such_material.uniq
    puts "No such finish found:"
    pp no_such_finish.uniq
    puts "No such module found:"
    pp no_such_module.uniq
    puts "No such core to shutter material mapping found:"
    pp no_material_mapping.uniq
    puts "No such shutter material to finish mapping found:"
    pp no_finish_mapping.uniq
    puts "Following mappings not saved"
    pp pricing_not_saved.uniq
    ModspaceCabinetPrice.count
  end

  # similar to :populate_modules, but different as needed.
  def populate_modspace_modules(folder_path, category)
    duplicates = []
    code_array = []
    no_category = []
    no_module_type = []
    no_category_module_type_mapping = []

    filepath = "#{folder_path}/Modspace Modules.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end
    puts headers

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      kitchen_category = KitchenCategory.find_by(name: workbook.row(row)[headers['category']].to_s.strip)
      if kitchen_category.blank?
        no_category << workbook.row(row)[headers['category']].to_s.strip
        next
      end
      module_type = ModuleType.find_by(category: category, name: workbook.row(row)[headers['sub category']].to_s.strip)
      if module_type.blank?
        no_module_type << workbook.row(row)[headers['sub category']].to_s.strip
        next
      end
      unless kitchen_category.allowed_module_types.include?(module_type)
        no_category_module_type_mapping << {
          category: kitchen_category.name,
          module_type: module_type.name
        }
      end
      code = workbook.row(row)[headers['module code']]      
      if code_array.include?(code)
        duplicates << code
      else
        code_array << code
      end
      product_module = ProductModule.where(code: code, category: category).first_or_initialize
      product_module.width = workbook.row(row)[headers['w (mm)']]
      product_module.depth = workbook.row(row)[headers['d (mm)']]
      product_module.height = workbook.row(row)[headers['h (mm)']]
      product_module.category = category
      product_module.module_type = module_type
      product_module.modspace = true
      product_module.save!
    end

    puts 'Duplicates:'
    pp duplicates
    puts 'No category:'
    pp no_category
    puts 'No sub category:'
    pp no_module_type
    puts 'No such category to sub category mapping:'
    pp no_category_module_type_mapping
    ProductModule.modspace.where(category: category).count
  end

  # Import addons for modspace
  # Options:
  # extra: true means that the addons are to be marked as an extra (ie can be added directly in space, but not in customization).
  def populate_modspace_addons(folder_path, options={})
    if options[:category] == 'kitchen'
      filepath = "#{folder_path}/Kitchen Extras.xlsx"
    elsif options[:category] == 'wardrobe'
      filepath = "#{folder_path}/Wardrobe Extras.xlsx"
    end
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase.strip] = i
    end

    category = options[:category]
    brand = Brand.where(addon: true, name: 'Modspace').first_or_create!

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # byebug if row==45
      # Get the column data using the column heading.
      code = workbook.row(row)[headers['sku code']]
      name = workbook.row(row)[headers['description']]
      specifications = workbook.row(row)[headers['make']].to_s + "-" + workbook.row(row)[headers['size']].to_s
      price = workbook.row(row)[headers['price']]
      mrp = workbook.row(row)[headers['mrp']]
      # vendor_sku = workbook.row(row)[headers['vendor sku code']]

      addon = Addon.where(code: code, category: category).first_or_initialize
      addon.assign_attributes(name: name, specifications: specifications, price: price, mrp: mrp, 
        brand: brand)
      addon.modspace = true
      addon.extra = options[:extra]
      addon.save
    end

    Addon.modspace.where(category: category).count
  end

  # very similar to :populate_handles method, with some differences as needed.
  def populate_modspace_handles(folder_path, category)
    filepath = "#{folder_path}/Modspace Handles.xlsx"
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
      handle.modspace = true
      handle.save
    end

    Handle.where(category: category).count
  end
end
