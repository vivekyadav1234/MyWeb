# Lakhs Modular only
# this contains methods to populate SLIs for MKW line items
module PoAutomationMkwModuleLm
  # 16mm White Carcass
  def lm_white_carcass_16mm(modular_job)
    mli_name = "16mm White Carcass"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    if modular_job.addons.where(allowed_in_custom_unit: true).count > 0
      kitchen_carcass_types = ["Drawer Bottom", "Drawer Back"]
      quantity = kitchen_carcass_types.map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    else
      quantity = 0
    end
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  # 18mm White Carcass
  def lm_white_carcass_18mm(modular_job)
    mli_name = "18mm White Carcass"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    core_material = CoreMaterial.find_by_name(modular_job.core_material)
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'core_material'}, sli_dynamic_attributes: {attr_value: core_material.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with core material #{core_material.name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = calculate_quantity_by_exposed_surface(modular_job)
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #0.8mm White Laminates - Backing Laminate One Side
  #0.8mm White Laminates - Backing Laminate Other Side Side
  def lm_backing_laminate_one_side(modular_job)
    mli_name = "0.8mm Laminates"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = calculate_quantity_by_exposed_surface(modular_job)

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #0.8mm White Laminates for One Side Exposed Panels
  def lm_backing_laminate_one_side_2(modular_job)
    mli_name = "0.8mm Laminates"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    case modular_job.number_exposed_sites
    when 2
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", "Glass Shutter Panels"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    when 1
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    else  #this means that nil will follow the same logic as 0.
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left", "Side Panel Right"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    end

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #0.8mm Laminates for Back Panel on One Side
  #0.8mm Laminates for Back Panel on Other Side Side
  def lm_backing_laminate_back_panel_one_side(modular_job)
    mli_name = "0.8mm Laminates"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module

    quantity = ["Back Panel"].map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #18mm One Side Finished Panel
  # SLI finding logic similar to method :lm_populate_white_carcass_18mm
  # quantity calculation logic similar to 0.8mm White Laminates for One Side Exposed Panels ie method :lm_backing_laminate_one_side_2
  def lm_18mm_one_side_finished_panel(modular_job)
    mli_name = "18mm White Carcass"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    core_material = CoreMaterial.find_by_name(modular_job.core_material)
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'core_material'}, sli_dynamic_attributes: {attr_value: core_material.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with core material #{core_material.name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    case modular_job.number_exposed_sites
    when 2
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", "Glass Shutter Panels"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    when 1
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    else  #this means that nil will follow the same logic as 0.
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left", "Side Panel Right"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    end

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #Finish Material
  def lm_finish_material(modular_job)
    mli_name = "Finish Material"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    shade = Shade.find_by_code(modular_job.shutter_shade_code)
    vendor_products_eligible = master_line_item&.vendor_products&.joins(sli_dynamic_attributes: :mli_attribute)&.
      where(mli_attributes: {attr_name: 'arrivae_shade'}, sli_dynamic_attributes: {attr_value: shade.id})
    vendor_product_chosen = vendor_products_eligible&.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Shade code #{shade.code}.", modular_job).message_hash
      return
    end
    @finish_master_sli_id = vendor_product_chosen.id
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    case modular_job.number_exposed_sites
    when 2
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    when 1
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    else  #this means that nil will follow the same logic as 0.
      quantity = ["Shutter", "Drawer Facia", "Glass Shutter Panels Horizontal", "Glass Shutter Horizontal", 
        "Glass Shutter Panels Vertical", "Glass Shutter Vertical", 
        "Glass Shutter Panels", "Side Panel Left", "Side Panel Right"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    end

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #6mm White Back Panel
  def lm_6mm_white_back_panel(modular_job)
    mli_name = "6mm White Back Panel"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    core_material = CoreMaterial.find_by_name(modular_job.core_material)
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'core_material'}, sli_dynamic_attributes: {attr_value: core_material.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with core material #{core_material.name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    quantity = ["Back Panel"].map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum

    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #4mm Glass
  def lm_4mm_glass(modular_job)
    mli_name = "4mm Glass"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    quantity = ["Glass Shutter"].map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #10mm Glass
  def lm_10mm_glass(modular_job)
    mli_name = "10mm Glass"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item&.vendor_products
    vendor_product_chosen = vendor_products_eligible&.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    quantity = ["Glass Shelf"].map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #Aluminium Frame
  def lm_aluminium_frame(modular_job)
    mli_name = "Aluminium Frame"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name}.", modular_job).message_hash
      return
    end
    # calculate quantity
    quantity = modular_job.product_module.al_profile_size
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #Add Ons
  def lm_addons(modular_job)
    modular_job.job_addons.each do |job_addon|
      addon = job_addon.addon
      lm_add_single_addon(modular_job, addon, job_addon.quantity)
    end
  end

  #0.8mm Edge Banding
  #2mm Edge Banding
  # Edge Banding - both 0.8mm and 2mm
  # 1. For shutter elements, choose 2mm edge banding. For carcass elements, choose 0.8mm
  # 2. Quantity will be perimeter for each element.
  # 3. For shutter elements, use the matching edge banding code mapped against the finish master SLI.
  # 4. For other carcass elements, use the matching edge banding code mapped against the balanced laminate master SLI (currently there is only 1).
  def lm_edge_banding(modular_job)
    product_module = modular_job.product_module
    finish_master_sli = VendorProduct.find_by_id(@finish_master_sli_id)
    if finish_master_sli.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "Edge Banding SLI population skipped because no finish material SLI was found.", modular_job).message_hash
      return
    end
    finish_matching_edge_banding_shade = finish_master_sli.sli_dynamic_attributes.joins(:mli_attribute).
      where(mli_attributes: {attr_name: "matching_arrivae_edge_banding_shade"}).take.attr_value
    shutter_element_types = CarcassElementType.where(name: CarcassElementType::FINISH_PRICE_ENABLED)
    shutter_elements = product_module.module_carcass_elements.joins(carcass_element: :carcass_element_type).where(carcass_element_types: { id: shutter_element_types })
    other_elements = product_module.module_carcass_elements.joins(carcass_element: :carcass_element_type).where.not(carcass_element_types: { id: shutter_element_types })
    # Currently, there is only one, but in future, there will be multiple. Code will need to be changed then.
    balanced_laminate_matching_edge_banding_shade = "Arrivae-FrostyWhite-01"
    # for shutter elements
    shutter_elements.each do |module_carcass_element|
      mli_name = "2mm Edge Banding"
      master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
      vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
        where(mli_attributes: {attr_name: 'matching_arrivae_edge_banding_shade'}, sli_dynamic_attributes: {attr_value: finish_matching_edge_banding_shade})
      vendor_product_chosen = vendor_products_eligible.lowest_priced
      if vendor_product_chosen.blank?
        @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Matching Arrivae Edge Banding Shade Code #{finish_matching_edge_banding_shade} was found.", modular_job).message_hash
        return
      end
      carcass_element = module_carcass_element.carcass_element
      quantity = carcass_element.perimeter/304.8 * modular_job.quantity * module_carcass_element.quantity
      add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity) if quantity > 0
    end
    # for carcass elements
    other_elements.shutter_elements.each do |module_carcass_element|
      mli_name = "0.8mm Edge Banding"
      master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
      vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
        where(mli_attributes: {attr_name: 'matching_arrivae_edge_banding_shade'}, sli_dynamic_attributes: {attr_value: balanced_laminate_matching_edge_banding_shade})
      vendor_product_chosen = vendor_products_eligible.lowest_priced
      if vendor_product_chosen.blank?
        @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Matching Arrivae Edge Banding Shade Code #{balanced_laminate_matching_edge_banding_shade} was found.", modular_job).message_hash
        return
      end
      carcass_element = module_carcass_element.carcass_element
      quantity = carcass_element.perimeter/304.8 * modular_job.quantity * module_carcass_element.quantity
      add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity) if quantity > 0
    end
  end

  #Hardware
  def lm_hardware(modular_job)
    product_module = modular_job.product_module
    types_to_ignore = (ProductModule::HINGE_ELEMENT_TYPES + ProductModule::CHANNEL_ELEMENT_TYPES).uniq
    product_module.module_hardware_elements.joins(hardware_element: :hardware_type).where.not(hardware_types: {name: types_to_ignore}).each do |module_hardware_element|
      hardware_element = module_hardware_element.hardware_element
      quantity = module_hardware_element.quantity
      if hardware_element.hardware_type == "Telescopic Channel" && modular_job.addons.where(allowed_in_custom_unit: true).count > 0
        quantity = [0, module_hardware_element.quantity-1].max  #since cant be less than 0
      end
      lm_add_single_hardware_element(modular_job, hardware_element, quantity)
    end
  end

  #Skirting
  # applicable only for MK.
  def lm_skirting(modular_job)
    unless modular_job.category == 'kitchen' && modular_job.skirting_config_type.present? && modular_job.skirting_config_height.present?
      return
    else
      skirting_config = SkirtingConfig.find_by(skirting_type: modular_job.skirting_config_type, skirting_height: modular_job.skirting_config_height)
      if skirting_config.blank?
        @errors.push PoAutomation::Error.new("Skirting config not found", "No Skirting Config with type #{modular_job.skirting_config_type} and height #{modular_job.skirting_config_height} was found.", modular_job).message_hash
        return
      end
      mli_name = "Skirting"
      master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
      vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
        where(mli_attributes: {attr_name: 'skirting_config'}, sli_dynamic_attributes: {attr_value: skirting_config.id})
      vendor_product_chosen = vendor_products_eligible.lowest_priced
      if vendor_product_chosen.blank?
        @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Skirting Config type #{modular_job.skirting_config_type} and height #{modular_job.skirting_config_height} was found.", modular_job).message_hash
        return
      end
      # calculate quantity
      quantity = 0
      product_module = modular_job.product_module
      kitchen_category = product_module.module_type.kitchen_categories.first
      if kitchen_category == KitchenCategory.base_unit
        quantity = product_module.width/304.8   #to get in running ft
      end

      add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
    end
  end

  #Dry Fit
  # use all carcass elements' area
  def lm_dry_fit(modular_job)
    mli_name = "Dry Fit"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    quantity = CarcassElementType.get_all_panel_type_names.map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  #Packaging
  # logic same as for 'Dry Fit'
  def lm_packaging(modular_job)
    mli_name = "Packaging"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item&.vendor_products
    vendor_product_chosen = vendor_products_eligible&.lowest_priced
    # calculate quantity
    quantity = 0
    product_module = modular_job.product_module
    quantity = CarcassElementType.get_all_panel_type_names.map{ |carcass_element_type_name|
        product_module.calculate_area(carcass_element_type_name)
      }.sum
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  # All types of handles will be populated in this method. It will call necessary methods.
  #Normal Handles; Profile Handles; Concealed Handles; Insert Handles; Special Handles
  def lm_handles(modular_job)
    shutter_handle_code = modular_job.shutter_handle_code
    number_shutter_handles = modular_job.number_shutter_handles.to_i
    door_handle_code = modular_job.door_handle_code
    number_door_handles = modular_job.number_door_handles.to_i
    # shutter handles first
    type_array = ["Concealed Handles", "Insert Handles", "Normal Handles", "Profile Handles", "Special Handles"]
    type_array_array.each do |handle_mli_name|
      lm_add_handles_single(modular_job, handle_mli_name, shutter_handle_code, number_shutter_handles)
    end if number_shutter_handles > 0
    # Now drawer handles
    type_array_array.each do |handle_mli_name|
      lm_add_handles_single(modular_job, handle_mli_name, door_handle_code, number_door_handles)
    end if number_door_handles > 0
  end

  #Both Side P,C,EB,G,D
  # def lm_processing_p_c_eb_g_d(modular_job)
  #   mli_name = "Both Side P,C,EB,G,D"
  #   master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
  #   vendor_products_eligible = master_line_item.vendor_products
  #   vendor_product_chosen = vendor_products_eligible.lowest_priced
  #   # calculate quantity
  #   quantity = 0
  #   product_module = modular_job.product_module
  #   kitchen_exclusions = ["Shutter", "Fix Shelf", "Adjustable Shelf", "Adj Shelf", "Shutter", "Back Panel",
  #     "Drawer Bottom", "Drawer Back"]
  #   wardrobe_exclusions = ["Shutter", "Adj Shelf", "Fix Shelf", "Back Panel", "Drawer Bottom"]
  #   carcass_element_type_names = CarcassElementType.get_all_panel_type_names - kitchen_exclusions - wardrobe_exclusions
  #   quantity = carcass_element_type_names.map{ |carcass_element_type_name|
  #       product_module.calculate_area(carcass_element_type_name)
  #     }.sum
  #   add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  # end

  #Both Side P,C,EB
  # def lm_processing_p_c_eb(modular_job)
  #   mli_name = "Both Side P,C,EB"
  #   master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
  #   vendor_products_eligible = master_line_item.vendor_products
  #   vendor_product_chosen = vendor_products_eligible.lowest_priced
  #   # calculate quantity
  #   quantity = 0
  #   product_module = modular_job.product_module
  #   carcass_element_type_names = ["Shutter"]
  #   quantity = carcass_element_type_names.map{ |carcass_element_type_name|
  #       product_module.calculate_area(carcass_element_type_name)
  #     }.sum
  #   add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  # end

  #Both Side P,C
  # def lm_processing_p_c(modular_job)
  #   mli_name = "Both Side P,C"
  #   master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
  #   vendor_products_eligible = master_line_item.vendor_products
  #   vendor_product_chosen = vendor_products_eligible.lowest_priced
  #   # calculate quantity
  #   quantity = 0
  #   product_module = modular_job.product_module
  #   carcass_element_type_names = ["Back Panel"]
  #   quantity = carcass_element_type_names.map{ |carcass_element_type_name|
  #       product_module.calculate_area(carcass_element_type_name)
  #     }.sum
  #   add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  # end

  private
  # used by several methods above to calculate quantities.
  def calculate_quantity_by_exposed_surface(modular_job)
    quantity = 0
    product_module = modular_job.product_module
    case modular_job.number_exposed_sites
    when 2
      quantity = ["Top Panel", "Bottom Panel", "Additional Vertical Panel", "Additional blind Vertical Panel", "Blind",
        "Fix Shelf", "Adjustable Shelf", "Adj Shelf"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    when 1
      quantity = ["Side Panel Right", "Top Panel", "Bottom Panel", "Additional Vertical Panel", "Additional blind Vertical Panel", "Blind",
        "Fix Shelf", "Adjustable Shelf", "Adj Shelf"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    else  #this means that nil will follow the same logic as 0.
      quantity = ["Side Panel Left", "Side Panel Right", "Top Panel", "Bottom Panel", "Additional Vertical Panel", "Additional blind Vertical Panel", "Blind",
        "Fix Shelf", "Adjustable Shelf", "Adj Shelf"].map{ |carcass_element_type_name|
          product_module.calculate_area(carcass_element_type_name)
        }.sum
    end
    return quantity
  end

  def lm_add_single_hardware_element(modular_job, hardware_element, hardware_element_quantity)
    mli_name = "Hardware"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    hardware_with_brand = get_hardware_with_brand(modular_job, hardware_element)
    if hardware_with_brand.blank?

    end
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'hardware_code'}, sli_dynamic_attributes: {attr_value: hardware_with_brand.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Hardware code #{hardware_element.code} and brand #{modular_job.brand&.name}.", modular_job).message_hash
      return
    end

    quantity = hardware_element_quantity
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  def get_hardware_with_brand(modular_job, hardware_element)
    brand = modular_job.brand.present? ? modular_job.brand : Brand.default_brand
    hardware_code = hardware_element.code
    if hardware_element.code == "HINN0CR" && modular_job.hinge_type == "soft"
      hardware_code = "HINS0CR"
    end
    hardware_with_brand = HardwareElement.find_by(category: modular_job.category, code: hardware_code, brand: brand)
  end

  def lm_add_single_addon(modular_job, addon, addon_quantity)
    mli_name = "Add Ons"
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'arrivae_addon'}, sli_dynamic_attributes: {attr_value: addon.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    if vendor_product_chosen.blank?
      @errors.push PoAutomation::Error.new("Sli not found", "No SLI with Master Line Item #{mli_name} with Addon code #{addon.code}.", modular_job).message_hash
      return
    end

    quantity = addon_quantity
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end

  # add a single type of handle.
  def lm_add_handles_single(modular_job, handle_mli_name, handle_code, handle_quantity)
    vendor_product_chosen = VendorProduct.get_handle_vendor_product(mli_name, handle_code)

    # calculate quantity
    quantity = handle_quantity
    add_sli_to_modular_job(modular_job, vendor_product_chosen, quantity * modular_job.quantity) if quantity > 0
  end
end
