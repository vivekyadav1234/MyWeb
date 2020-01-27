namespace :lead do
  task import_lead_times: :environment do
    folder_path = "#{Rails.root.join('app', 'data', 'delivery_timelines')}"
    loose_furniture_path = folder_path + "/Loose Furniture.xlsx"
    cabinet_path = folder_path + "/Cabinets.xlsx"
    finish_path = folder_path + "/Finish.xlsx"
    shade_path = folder_path + "/Shades.xlsx"
    skirting_path = folder_path + "/Skirting.xlsx"
    addon_path = folder_path + "/Add Ons.xlsx"
    core_material_path = folder_path + "/Core Material.xlsx"
    handle_path = folder_path + "/Handles.xlsx"
    appliance_path = folder_path + "/Appliances.xlsx"
    import_loose_furniture_lead_time(loose_furniture_path)
    import_cabinet_lead_time(cabinet_path)
    import_shutter_finish_lead_time(finish_path)
    import_shades_lead_time(shade_path)
    import_skirting_lead_time(skirting_path)
    import_addon_lead_time(addon_path)
    import_core_material_lead_time(core_material_path)
    import_handle_lead_time(handle_path)
    import_kitchen_appliance_time(appliance_path)
  end
end

def import_loose_furniture_lead_time(file_path)
  workbook = Roo::Spreadsheet.open file_path
  headers = Hash.new
  workbook.row(1).each_with_index do |header,i|
    headers[header.downcase] = i
  end
  not_found_skus = []
  total_count = 0
  print "Running for loose furniture.."
  ((workbook.first_row + 1)..workbook.last_row).each do |row|
    sku = workbook.row(row)[headers["sku"]]
    lead_time = workbook.row(row)[headers["lead time"]]
    product = Product.find_by(unique_sku: sku)
    total_count += 1
    if product.present? and product.update(lead_time: lead_time)
    else
      not_found_skus << sku
      print "."
    end
  end
  puts "*"*90
  puts "Not found skus are: #{not_found_skus}"
  puts "*"*90
  puts "Not found: #{not_found_skus.count} in #{total_count}"
  puts "*"*90
end

def import_cabinet_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for cabinet.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      product_module = ProductModule.find_by(code: code)
      total_count += 1
      if product_module.present? and product_module.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_shutter_finish_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for finish.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      shutter_finish = ShutterFinish.find_by(name: code)
      total_count += 1
      if shutter_finish.present? and shutter_finish.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_shades_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for shade.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      shade = Shade.find_by(code: code)
      total_count += 1
      if shade.present? and shade.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_skirting_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for skirting.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      height = workbook.row(row)[headers["height"]]
      skirting = SkirtingConfig.find_by(skirting_type: code, skirting_height: height)
      total_count += 1
      if skirting.present? and skirting.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_addon_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for addon.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      addon = Addon.find_by(code: code)
      total_count += 1
      if addon.present? and addon.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end
  
  def import_core_material_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for core material.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      core_material = CoreMaterial.find_by(name: code)
      total_count += 1
      if core_material.present? and core_material.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_handle_lead_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for handle.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      handle = Handle.find_by(code: code)
      total_count += 1
      if handle.present? and handle.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  def import_kitchen_appliance_time(file_path)
    workbook = Roo::Spreadsheet.open file_path
    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end
    not_found_codes = []
    total_count = 0
    print "Running for kitchen appliance.."
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers["code"]]
      lead_time = workbook.row(row)[headers["lead time"]]
      kitchen_appliance = KitchenAppliance.find_by(name: code)
      total_count += 1
      if kitchen_appliance.present? and kitchen_appliance.update(lead_time: lead_time)
      else
        not_found_codes << code
        print "."
      end
    end
    puts "*"*90
    puts "Not found codes are: #{not_found_codes}"
    puts "*"*90
    puts "Not found: #{not_found_codes.count} in #{total_count}"
    puts "*"*90
  end

  