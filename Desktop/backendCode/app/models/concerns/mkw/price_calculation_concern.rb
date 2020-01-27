# For ProductModule model.
module Mkw::PriceCalculationConcern
  extend ActiveSupport::Concern

  # IMPORTANT - Any time a change in logic is made for the sale price calculation (ie this method), same must reflect in :set_costs
  # just return the value - NEVER make any changes inside this method or any methods it calls!!!
  def calculate_price(options)
    return modspace_price(options) if options[:price_factor_hash]["has_modspace_pricing"]
    return unfinished_panel_price(options) if unfinished_panel?
    return finished_panel_price(options) if finished_panel?

    shutter_element_types = CarcassElementType.where(name: CarcassElementType::FINISH_PRICE_ENABLED, category: category)
    shutter_elements_ids = carcass_elements.where(carcass_element_type: shutter_element_types).pluck(:id)

    carcass_elements_to_ignore_ids = carcass_elements.none
    hardware_elements_to_ignore_ids = ( get_hinge_elements.pluck(:id) + get_channel_elements.pluck(:id) ).uniq

    if options[:civil_kitchen]
      carcass_elements_to_ignore_ids = carcass_elements.joins(:carcass_element_type).where(carcass_element_types: { name: CarcassElementType::SKIP_PRICE_CUSTOM_SHELF }).pluck(:id).uniq
      hardware_elements_to_ignore_ids = hardware_elements.joins(:hardware_element_type).where(hardware_element_types: { name: HardwareElementType::SKIP_PRICE_CUSTOM_SHELF }).pluck(:id).uniq
    end

    core_material_cost = ( module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]}) * mapping.quantity
      }.sum + 
      module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:shutter_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]}) * mapping.quantity
      }.sum ) * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"]

    finish_cost = 0
    finish_factor = CarcassElement.finish_factor(category, options[:price_factor_hash]) * CarcassElement.movement_factor(category, options[:price_factor_hash], options[:shutter_shade_code])
    shutter_finish_price = get_shutter_finish_price(options[:shutter_finish], category)
    # finish cost for shutter elements
    finish_cost += module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.shutter_finish_cost(shutter_finish_price) * mapping.quantity
      }.sum * finish_factor
    # finish cost for exposed elements. Take one element and multiply its area * finish_rate * number_exposed_sites
    exposed_element_types = CarcassElementType.where(name: ["Side Panel Left", "Side Panel Right"], category: category)
    exposed_element_to_consider = carcass_elements.where(carcass_element_type: exposed_element_types).first
    if exposed_element_to_consider.present?
      finish_cost += exposed_element_to_consider.exposed_side_finish_cost(shutter_finish_price, options[:number_exposed_sites]) * finish_factor
    end
    # extra finish cost for "I" type modules only (wardrobe only)
    if (category == "wardrobe" && module_type&.name == "I") || (category == "kitchen")
      drawer_facia_element_type = CarcassElementType.find_by(name: "Drawer Facia", category: category)
      drawer_facia_elements_ids = carcass_elements.where(carcass_element_type: drawer_facia_element_type).pluck(:id)
      finish_cost += module_carcass_elements.where(carcass_element_id: drawer_facia_elements_ids).map{|mapping| 
          carcass_element = mapping.carcass_element
          carcass_element.shutter_finish_cost(shutter_finish_price) * mapping.quantity
        }.sum * finish_factor
    end

    hardware_cost = module_hardware_elements.where.not(hardware_element_id: hardware_elements_to_ignore_ids).map{ |mapping|
      hardware_element = mapping.hardware_element
      hardware_element.get_price(category) * mapping.quantity
    }.sum * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]

    # edge_band_cost = module_carcass_elements.where.not(carcass_element_id: carcass_elements_to_ignore_ids).map{|mapping| 
    #     carcass_element = mapping.carcass_element
    #     carcass_element.edge_band_cost * mapping.quantity
    #   }.sum * options[:price_factor_hash]["sale_cost_factor"][category]["edge_banding"]
    edge_band_cost = 0

    addon_cost = calculate_addon_cost(options[:addons], options)   #note that the factor here will be different for different addons
    handle_cost = options[:price_factor_hash]["sale_cost_factor"][category]["handles"] * calculate_handle_cost(options.slice(:door_handle_code, :shutter_handle_code))

    # hinge and channel cost (separated from other hardware elements because of complications)
    total_hinge_cost = calculate_hinge_costs(options[:hinge_type]) * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]
    total_channel_cost = calculate_channel_costs(options[:hinge_type]) * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]

    # these costs in case of modular kitchen only (also not in civil kitchen)
    skirting_cost = options[:civil_kitchen] ? 0 : options[:price_factor_hash]["sale_cost_factor"]["kitchen"]["skirting"] * calculate_skirting_cost(options[:skirting_config_type], options[:skirting_config_height])

    # these fixed costs are for civil kitchen only
    civil_kitchen_fixed_cost = options[:civil_kitchen] ? CivilKitchenParameter.fixed_cost : 0

    # Don't delete following 3 lines as they are needed for testing.
    # Carcass area
    # module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map{|mapping| mapping.carcass_element.area_sqft*mapping.quantity}.sum
    # Carcass shutter area
    # module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| mapping.carcass_element.area_sqft*mapping.quantity}.sum
    # Hardware elements list with price and qty
    # m.module_hardware_elements.map{|mapping| he=mapping.hardware_element; puts "#{he.code}-quantity:#{mapping.quantity}-mrp:(#{he.price})"}

    # byebug
    total_price = core_material_cost.to_f + finish_cost.to_f + hardware_cost.to_f + edge_band_cost.to_f +
      addon_cost.to_f + handle_cost.to_f + total_hinge_cost.to_f + total_channel_cost.to_f + 
      skirting_cost.to_f
  end

  # We will set the modular_job_cost values here. It must follow the calculate_cost logic as much as possible!!!
  # Name is misleading. We are just calculating, not setting any values.
  def set_costs(options)
    return set_modspace_costs(options) if options[:price_factor_hash]["has_modspace_pricing"]
    return set_unfinished_panel_costs(options) if unfinished_panel?
    return set_finished_panel_costs(options) if finished_panel?

    shutter_element_types = CarcassElementType.where(name: CarcassElementType::FINISH_PRICE_ENABLED, category: category)
    shutter_elements_ids = carcass_elements.where(carcass_element_type: shutter_element_types).pluck(:id)

    carcass_elements_to_ignore_ids = carcass_elements.none
    hardware_elements_to_ignore_ids = ( get_hinge_elements.pluck(:id) + get_channel_elements.pluck(:id) ).uniq

    if options[:civil_kitchen]
      carcass_elements_to_ignore_ids = carcass_elements.joins(:carcass_element_type).where(carcass_element_types: { name: CarcassElementType::SKIP_PRICE_CUSTOM_SHELF }).pluck(:id).uniq
      hardware_elements_to_ignore_ids = hardware_elements.joins(:hardware_element_type).where(hardware_element_types: { name: HardwareElementType::SKIP_PRICE_CUSTOM_SHELF }).pluck(:id).uniq
    end

    # Minor changes here as we want core and shutter material quantity separately.
    core_quantity = ( module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen], area_only: true}) * mapping.quantity
      }.sum

    shutter_quantity = module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:shutter_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen], area_only: true}) * mapping.quantity
      }.sum )

    core_cost = ( module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]}) * mapping.quantity
      }.sum * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"]

    shutter_cost = module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.core_material_cost(options[:shutter_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]}) * mapping.quantity
      }.sum ) * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"]

    core_material_cost = core_cost + shutter_cost

    # No differences here.
    finish_cost = 0
    finish_factor = CarcassElement.finish_factor(category, options[:price_factor_hash]) * CarcassElement.movement_factor(category, options[:price_factor_hash], options[:shutter_shade_code])
    shutter_finish_price = get_shutter_finish_price(options[:shutter_finish], category)
    # finish cost for shutter elements
    finish_cost += module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| 
        carcass_element = mapping.carcass_element
        carcass_element.shutter_finish_cost(shutter_finish_price) * mapping.quantity
      }.sum * finish_factor
    # finish cost for exposed elements. Take one element and multiply its area * finish_rate * number_exposed_sites
    exposed_element_types = CarcassElementType.where(name: ["Side Panel Left", "Side Panel Right"], category: category)
    exposed_element_to_consider = carcass_elements.where(carcass_element_type: exposed_element_types).first
    if exposed_element_to_consider.present?
      finish_cost += exposed_element_to_consider.exposed_side_finish_cost(shutter_finish_price, options[:number_exposed_sites]) * finish_factor
    end
    # extra finish cost for "I" type modules only (wardrobe only)
    if (category == "wardrobe" && module_type&.name == "I") || (category == "kitchen")
      drawer_facia_element_type = CarcassElementType.find_by(name: "Drawer Facia", category: category)
      drawer_facia_elements_ids = carcass_elements.where(carcass_element_type: drawer_facia_element_type).pluck(:id)
      finish_cost += module_carcass_elements.where(carcass_element_id: drawer_facia_elements_ids).map{|mapping| 
          carcass_element = mapping.carcass_element
          carcass_element.shutter_finish_cost(shutter_finish_price) * mapping.quantity
        }.sum * finish_factor
    end

    hardware_cost = module_hardware_elements.where.not(hardware_element_id: hardware_elements_to_ignore_ids).map{ |mapping|
      hardware_element = mapping.hardware_element
      hardware_element.get_price(category) * mapping.quantity
    }.sum * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]

    # edge_band_cost = module_carcass_elements.where.not(carcass_element_id: carcass_elements_to_ignore_ids).map{|mapping| 
    #     carcass_element = mapping.carcass_element
    #     carcass_element.edge_band_cost * mapping.quantity
    #   }.sum * options[:price_factor_hash]["sale_cost_factor"][category]["edge_banding"]
    edge_band_cost = 0

    addon_cost = calculate_addon_cost(options[:addons], options)   #note that the factor here will be different for different addons
    handle_cost = options[:price_factor_hash]["sale_cost_factor"][category]["handles"] * calculate_handle_cost(options.slice(:door_handle_code, :shutter_handle_code))

    # hinge and channel cost (separated from other hardware elements because of complications)
    total_hinge_cost = calculate_hinge_costs(options[:hinge_type]) * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]
    total_channel_cost = calculate_channel_costs(options[:hinge_type]) * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]
    # This is extra for cost calculation only
    soft_close_hinge_extra_cost = soft_hinge_extra_costs(options[:hinge_type]) * options[:price_factor_hash]["sale_cost_factor"][category]["hardware_elements"]

    # these costs in case of modular kitchen only (also not in civil kitchen)
    skirting_cost = options[:civil_kitchen] ? 0 : options[:price_factor_hash]["sale_cost_factor"]["kitchen"]["skirting"] * calculate_skirting_cost(options[:skirting_config_type], options[:skirting_config_height])

    # these fixed costs are for civil kitchen only
    civil_kitchen_fixed_cost = options[:civil_kitchen] ? CivilKitchenParameter.fixed_cost : 0

    # Don't delete following 3 lines as they are needed for testing.
    # Carcass area
    # module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map{|mapping| mapping.carcass_element.area_sqft*mapping.quantity}.sum
    # Carcass shutter area
    # module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map{|mapping| mapping.carcass_element.area_sqft*mapping.quantity}.sum
    # Hardware elements list with price and qty
    # m.module_hardware_elements.map{|mapping| he=mapping.hardware_element; puts "#{he.code}-quantity:#{mapping.quantity}-mrp:(#{he.price})"}

    # Now update the modular_job_cost data
    modular_job_cost = options[:modular_job_cost]
    modular_job_cost.update(
      core_quantity: core_quantity.to_f,
      shutter_quantity: shutter_quantity.to_f,
      carcass_cost: core_material_cost.to_f,
      finish_cost: finish_cost.to_f,
      hardware_cost: hardware_cost.to_f + total_hinge_cost.to_f + total_channel_cost.to_f,
      addon_cost: addon_cost.to_f,
      handle_cost: handle_cost.to_f,
      skirting_cost: skirting_cost.to_f,
      soft_close_hinge_cost: soft_close_hinge_extra_cost.to_f
      )

    # byebug
    total_price = core_material_cost.to_f + finish_cost.to_f + hardware_cost.to_f + edge_band_cost.to_f +
      addon_cost.to_f + handle_cost.to_f + total_hinge_cost.to_f + total_channel_cost.to_f + 
      skirting_cost.to_f
  end

  def unfinished_panel_price(options)
    l = options[:length].to_f/304.8
    b = options[:breadth].to_f/304.8
    core_material_price = CoreMaterial.core_material_price(options[:core_material], category, options[:thickness])
    unfinished_price = l * b * core_material_price * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"]
  end

  def set_unfinished_panel_costs(options)
    l = options[:length].to_f/304.8
    b = options[:breadth].to_f/304.8
    core_material_price = CoreMaterial.core_material_price(options[:core_material], category, options[:thickness])
    unfinished_price = l * b * core_material_price * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"]
    # Now update the modular_job_cost data
    modular_job_cost = options[:modular_job_cost]
    modular_job_cost.update(
      core_quantity: l * b,
      carcass_cost: unfinished_price
      )
    unfinished_price
  end

  def finished_panel_price(options)
    l = options[:length]/304.8
    b = options[:breadth]/304.8
    shutter_material_price = CoreMaterial.core_material_price(options[:shutter_material], category, options[:thickness])
    shutter_finish_price = get_shutter_finish_price(options[:shutter_finish], category)
    finish_factor = CarcassElement.finish_factor(category, options[:price_factor_hash]) * CarcassElement.movement_factor(category, options[:price_factor_hash], options[:shutter_shade_code])

    l * b * ( shutter_material_price * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"] + 
      shutter_finish_price *  finish_factor)
  end

  def set_finished_panel_costs(options)
    l = options[:length]/304.8
    b = options[:breadth]/304.8
    shutter_material_price = CoreMaterial.core_material_price(options[:shutter_material], category, options[:thickness])
    shutter_finish_price = get_shutter_finish_price(options[:shutter_finish], category)
    finish_factor = CarcassElement.finish_factor(category, options[:price_factor_hash]) * CarcassElement.movement_factor(category, options[:price_factor_hash], options[:shutter_shade_code])

    # Now update the modular_job_cost data
    modular_job_cost = options[:modular_job_cost]
    modular_job_cost.update(
      shutter_quantity: l * b,
      carcass_cost: l * b * shutter_material_price * options[:price_factor_hash]["sale_cost_factor"][category]["carcass_elements"],
      finish_cost: l * b * shutter_finish_price *  finish_factor
      )
    modular_job_cost.carcass_cost + modular_job_cost.finish_cost
  end

  # For Modspace pricing.
  def modspace_price(options)
    #cabinet cost from the mapping
    cm_email = options[:price_factor_hash]['cm_email']
    cm_key = cm_email&.strip&.partition('@')&.first
    cm_key = 'default' if cm_key.blank?
    cabinet_factor = options[:price_factor_hash]['sale_cost_factor'][category]['modspace_cabinet_factor'][cm_key]
    # check if finished or unfinished panel and call method if that is the case.
    if finished_panel? || unfinished_panel?
      return modspace_unfinished_panel_price(options, cabinet_factor)
    end
    core_material = CoreMaterial.find_by name: options[:core_material]
    shutter_material = CoreMaterial.find_by name: options[:shutter_material]
    shutter_finish = ShutterFinish.find_by name: options[:shutter_finish]
    core_shutter_mapping = CoreShutterMapping.find_by(core_material: core_material, shutter_material: shutter_material)
    modspace_cabinet_price = modspace_cabinet_prices.find_by(core_shutter_mapping: core_shutter_mapping, shutter_finish: shutter_finish)
    cabinet_cost = modspace_cabinet_price&.price.to_f * cabinet_factor

    # finish cost for exposed elements. Take one element and multiply its area * finish_rate for 1 or 2 sided as appropriate
    # rest finish cost is included in cabinet cost.
    finish_cost = 0.0
    #get from data saved in MKW_GLOBAL_DATA_MODSPACE
    case options[:number_exposed_sites].to_i
    when 1
      finish_rate = MKW_GLOBAL_DATA_MODSPACE["finish_prices_1_side"][category][options[:shutter_finish]].to_f
    when 2
      finish_rate = MKW_GLOBAL_DATA_MODSPACE["finish_prices_2_side"][category][options[:shutter_finish]].to_f
    else
      finish_rate = 0.0
    end
    exposed_element_types = CarcassElementType.where(name: ["Side Panel Left", "Side Panel Right"], category: category)
    exposed_elements_to_consider = carcass_elements.where(carcass_element_type: exposed_element_types)
    if exposed_elements_to_consider.present?
      finish_cost += exposed_elements_to_consider.sum(:area_sqft) * finish_rate
    end
    finish_cost *= cabinet_factor

    addon_cost = calculate_addon_cost(options[:addons], options)   #note that the factor here will be different for different addons
    handle_cost = options[:price_factor_hash]["sale_cost_factor"][category]["handles"] * calculate_handle_cost(options.slice(:door_handle_code, :shutter_handle_code))

    puts "+++++++++++++++++Cabinet cost: #{cabinet_cost}++++++++++++++++++"
    puts "+++++++++++++++++Finish cost: #{finish_cost}++++++++++++++++++++++++++++++"
    puts "+++++++++++++++++Addon cost: #{addon_cost}++++++++++++++++++++++++++++++"
    puts "+++++++++++++++++Handle cost: #{handle_cost}++++++++++++++++++++++++++++++"

    total_price = cabinet_cost.to_f + finish_cost.to_f + addon_cost.to_f + handle_cost.to_f
  end

  # This method is used to calculate the unfinished and finished panel price for Modspace CMs.
  def modspace_unfinished_panel_price(options, cabinet_factor)
    l = options[:length].to_f/304.8
    b = options[:breadth].to_f/304.8
    if unfinished_panel?
      per_unit_rate = MKW_GLOBAL_DATA_MODSPACE["unfinished_panel_cost"][category]
    elsif finished_panel?
      per_unit_rate = MKW_GLOBAL_DATA_MODSPACE["finished_panel_cost"][category]
    else
      raise "This method must be called only for finished or unfinished panels."
    end

    l * b * per_unit_rate * cabinet_factor
  end

  # for finished and unfinished panels
  def set_modspace_panel_cost(options)
    l = options[:length].to_f/304.8
    b = options[:breadth].to_f/304.8
    cabinet_factor = 1.0  #since we are calculating cost
    calculated_cost = modspace_unfinished_panel_price(options, cabinet_factor)
    # Now update the modular_job_cost data
    modular_job_cost = options[:modular_job_cost]
    if unfinished_panel?
      modular_job_cost.update(
        core_quantity: l * b,
        carcass_cost: calculated_cost
        )
    elsif finished_panel?
      # Ratio of cost of finish to the total cost (total = shutter material + finish cost)
      finish_ratio = ( MKW_GLOBAL_DATA_MODSPACE["finished_panel_cost"][category]/MKW_GLOBAL_DATA_MODSPACE["unfinished_panel_cost"][category] ) - 1.0
      finish_ratio = [0.0, finish_ratio].max  #cannot be less than 0
      material_ratio = 1.0 - finish_ratio
      modular_job_cost.update(
        shutter_quantity: l * b,
        carcass_cost: calculated_cost * material_ratio,
        finish_cost: calculated_cost * finish_ratio
        )
    else
      raise "This method must be called only for finished or unfinished panels."
    end

    calculated_cost
  end

  # Calculate costs for modspace CMs - this is different from normal because of the completely different way we calculate
  # prices for Modspace CMs.
  # IMPORTANT - we take all factors as 1.0 irrespective of what is passed in options, except for handles and addons.
  def set_modspace_costs(options)
    #cabinet cost from the mapping
    cm_email = options[:price_factor_hash]['cm_email']
    cm_key = cm_email&.strip&.partition('@')&.first
    cm_key = 'default' if cm_key.blank?
    cabinet_factor = 1.0  #since we are looking for costs, therefore no margin
    # check if finished or unfinished panel and call method if that is the case.
    if finished_panel? || unfinished_panel?
      return set_modspace_panel_cost(options)
    end
    core_material = CoreMaterial.find_by name: options[:core_material]
    shutter_material = CoreMaterial.find_by name: options[:shutter_material]
    shutter_finish = ShutterFinish.find_by name: options[:shutter_finish]
    core_shutter_mapping = CoreShutterMapping.find_by(core_material: core_material, shutter_material: shutter_material)
    modspace_cabinet_price = modspace_cabinet_prices.find_by(core_shutter_mapping: core_shutter_mapping, shutter_finish: shutter_finish)
    cabinet_cost = modspace_cabinet_price&.price.to_f * cabinet_factor

    # finish cost for exposed elements. Take one element and multiply its area * finish_rate for 1 or 2 sided as appropriate
    # rest finish cost is included in cabinet cost.
    finish_cost = 0.0
    #get from excel data saved in MKW_GLOBAL_DATA_MODSPACE
    case options[:number_exposed_sites].to_i
    when 1
      finish_rate = MKW_GLOBAL_DATA_MODSPACE["finish_prices_1_side"][category][options[:shutter_finish]].to_f
    when 2
      finish_rate = MKW_GLOBAL_DATA_MODSPACE["finish_prices_2_side"][category][options[:shutter_finish]].to_f
    else
      finish_rate = 0.0
    end
    exposed_element_types = CarcassElementType.where(name: ["Side Panel Left", "Side Panel Right"], category: category)
    exposed_elements_to_consider = carcass_elements.where(carcass_element_type: exposed_element_types)
    if exposed_elements_to_consider.present?
      finish_cost += exposed_elements_to_consider.sum(:area_sqft) * finish_rate
    end
    finish_cost *= cabinet_factor

    addon_cost = calculate_addon_cost(options[:addons], options)  #note that the factor here will be different for different addons
    handle_cost = options[:price_factor_hash]["sale_cost_factor"][category]["handles"] * calculate_handle_cost(options.slice(:door_handle_code, :shutter_handle_code))

    puts "+++++++++++++++++Cabinet cost: #{cabinet_cost}++++++++++++++++++"
    puts "+++++++++++++++++Finish cost: #{finish_cost}++++++++++++++++++++++++++++++"
    puts "+++++++++++++++++Addon cost: #{addon_cost}++++++++++++++++++++++++++++++"
    puts "+++++++++++++++++Handle cost: #{handle_cost}++++++++++++++++++++++++++++++"

    modular_job_cost = options[:modular_job_cost]
    modular_job_cost.update(
      cabinet_cost: cabinet_cost,
      finish_cost: finish_cost,
      addon_cost: addon_cost,
      handle_cost: handle_cost
      )

    total_price = cabinet_cost.to_f + finish_cost.to_f + addon_cost.to_f + handle_cost.to_f
  end

  def get_shutter_finish_price(shutter_finish_code, category)
    if category == "kitchen"
      ShutterFinish.find_by_name(shutter_finish_code).price
    else
      ShutterFinish.find_by_name(shutter_finish_code).wardrobe_price
    end
  end

  # note that the global_brand_id is actually for hardware - it is used here only as a fallback.
  #note that the factor here will be different for different addons
  def calculate_addon_cost(addons_array, options)
    sum = 0
    addon_factor = options[:price_factor_hash]["sale_cost_factor"][category]["addons"]["default"]
    if addons_array.present?
      addons_array.map do |hash|
        # for combination of addons
        if hash[:combination]
          addon_combination = AddonCombination.find_by(id: hash[:id])
          addon_combination.addons.each do |addon|
            # commenting this because all addon factors are set to 1.00 currently, so this just leads to extra time/computation calculation.
            # sum += addon.tag_factor(options[:price_factor_hash]) * addon.mrp * hash[:quantity].to_i if addon.mrp.present?
            sum += addon_factor * addon.mrp * hash[:quantity].to_i if addon.mrp.present?
          end
        else
          addon = Addon.where(category: category).find_by(id: hash[:id])
          sum += addon_factor * addon.mrp * hash[:quantity].to_i if addon.present? && addon.mrp.present?
        end
      end
    end
    sum
  end

  def calculate_handle_cost(options)
    cost = 0
    door_handle_code = options[:door_handle_code]
    shutter_handle_code = options[:shutter_handle_code]

    # For some handles, the price calculation is the exact same as G section handle.
    if door_handle_code == "G Section Handle" || Handle.calculate_as_g_section?(door_handle_code, category)
      door_handle_factor = number_door_handles.to_i
      shutter_handle_factor = number_shutter_handles.to_i == 0 ? 0 : 1
      total_factor = door_handle_factor + shutter_handle_factor
      cost += MKW_GLOBAL_DATA["g_section_price"].to_f * width/304.8 * total_factor
    elsif door_handle_code == "J Section Handle"
      door_handle_factor = number_door_handles.to_i
      shutter_handle_factor = number_shutter_handles.to_i == 0 ? 0 : 1
      total_factor = door_handle_factor + shutter_handle_factor
      cost += MKW_GLOBAL_DATA["j_section_price"].to_f * width/304.8 * total_factor
    elsif door_handle_code == "Gola Profile"
      c_section_rate = MKW_GLOBAL_DATA["gola_profile_prices"]["c_section"].to_f
      l_section_rate = MKW_GLOBAL_DATA["gola_profile_prices"]["l_section"].to_f
      c_section_cost = c_section_rate * c_section_length/304.8 * c_section_number
      l_section_cost = l_section_rate * l_section_length/304.8 * l_section_number
      cost += c_section_cost + l_section_cost
    elsif door_handle_code == "Top Insert Handle"
      handle_cost = MKW_GLOBAL_DATA["top_insert_handle_prices"][width].to_f
      cost += (number_door_handles.to_i + number_shutter_handles.to_i) * handle_cost
    else
      if category == "wardrobe"
        if door_handle_code.present? && Handle.find_by(category: category, code: door_handle_code).present? && number_door_handles.to_i > 0
          cost += Handle.find_by(category: category, code: door_handle_code).mrp * number_door_handles.to_i
        end
        if shutter_handle_code.present? && Handle.find_by(category: category, code: shutter_handle_code).present? && number_shutter_handles.to_i > 0
          cost += Handle.find_by(category: category, code: shutter_handle_code).mrp * number_shutter_handles.to_i
        end
      elsif category == "kitchen"
        if door_handle_code.present? && Handle.find_by(category: category, code: door_handle_code).present? && (number_shutter_handles.to_i + number_door_handles.to_i) > 0
          cost += Handle.find_by(category: category, code: door_handle_code).mrp * (number_shutter_handles.to_i + number_door_handles.to_i)
        end
      end
    end
    cost
  end

  # calculate the overall cost of all hinge elements, including whether normal/soft-close
  def calculate_hinge_costs(hinge_type)
    hinge_elements = get_hinge_elements
    extra_price = 0
    return 0 if hinge_elements.blank?
    # due to soft-close hinge
    extra_price = MKW_GLOBAL_DATA["soft_close_hinge_prices"][category] if hinge_type=="soft"
    return module_hardware_elements.where(hardware_element_id: hinge_elements.pluck(:id)).map{ |mapping|
          hardware_element = mapping.hardware_element
          (hardware_element.get_price(category) + extra_price) * mapping.quantity
        }.sum
  end

  # Get the extra cost due to soft hinge chosen.
  def soft_hinge_extra_costs(hinge_type)
    if hinge_type == 'soft'
      extra_price = MKW_GLOBAL_DATA["soft_close_hinge_prices"][category] if hinge_type=="soft"
      return module_hardware_elements.where(hardware_element_id: get_hinge_elements.pluck(:id)).map{ |mapping|
            extra_price * mapping.quantity
          }.sum      
    else
      return 0
    end
  end

  # calculate the overall cost of all channel elements, including whether normal/soft-close
  # reduction based on certain addons has been removed as part of the sales engine changes.
  def calculate_channel_costs(channel_type)
    channel_elements = get_channel_elements
    return 0 if channel_elements.blank?
    channel_element = channel_elements.first
    channel_element_price = channel_element.get_price(category)
    # due to soft-close hinge
    actual_price = channel_element_price
    actual_count = channel_element_count
    # the cost
    actual_price * actual_count
  end

  # for kitchen modules, sum up the widths of all the base carcass elements, and then multiply
  # by the skirting price, which is per running feet. 1 feet = 304.8 mm.
  def calculate_skirting_cost(skirting_type, skirting_height)
    sum = 0
    # byebug
    if has_skirting?
      skirting_config = SkirtingConfig.find_by(skirting_type: skirting_type, skirting_height: skirting_height)
      rate = skirting_config&.price.to_f
      sum = width.to_f/304.8 * rate
    end
    sum
  end

  # This is mainly for testing purposes
  # qty can be area or length or nos
  def carcass_qty_by_type(options={})
    hsh = Hash.new
    shutter_element_types = CarcassElementType.where(name: CarcassElementType::FINISH_PRICE_ENABLED, category: category)
    shutter_elements_ids = carcass_elements.where(carcass_element_type: shutter_element_types).pluck(:id)
    glass_elements = carcass_elements.where(carcass_element_type: CarcassElementType.where(glass: true))
    aluminium_elements = carcass_elements.where(carcass_element_type: CarcassElementType.where(aluminium: true))
  
    if options[:civil_kitchen]
      carcass_elements_to_ignore_ids = carcass_elements.joins(:carcass_element_type).where(carcass_element_types: { name: CarcassElementType::SKIP_PRICE_CUSTOM_SHELF }).pluck(:id).uniq
    end

    hsh[:non_shutter_carcass] = module_carcass_elements.where.not(carcass_element_id: [shutter_elements_ids, carcass_elements_to_ignore_ids].flatten.uniq).map do |mapping| 
      carcass_element = mapping.carcass_element
      [carcass_element.carcass_element_type.name, carcass_element.code, mapping.quantity, carcass_element.area_sqft, carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]})]
    end

    hsh[:shutter_carcass] = module_carcass_elements.where(carcass_element_id: shutter_elements_ids).map do |mapping| 
      carcass_element = mapping.carcass_element
      [carcass_element.carcass_element_type.name, carcass_element.code, mapping.quantity, carcass_element.area_sqft, carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]})]
    end

    hsh[:glass_4mm] = module_carcass_elements.joins(:carcass_element).where(carcass_elements: {id: glass_elements, thickness: 4.0}).map do |mapping| 
      carcass_element = mapping.carcass_element
      [carcass_element.carcass_element_type.name, carcass_element.code, mapping.quantity, carcass_element.area_sqft, carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]})]
    end

    hsh[:glass_10mm] = module_carcass_elements.joins(:carcass_element).where(carcass_elements: {id: glass_elements, thickness: 10.0}).map do |mapping| 
      carcass_element = mapping.carcass_element
      [carcass_element.carcass_element_type.name, carcass_element.code, mapping.quantity, carcass_element.area_sqft, carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]})]
    end

    hsh[:aluminium] = module_carcass_elements.where(carcass_element: aluminium_elements).map do |mapping| 
      carcass_element = mapping.carcass_element
      [carcass_element.carcass_element_type.name, carcass_element.code, mapping.quantity, carcass_element.area_sqft, carcass_element.core_material_cost(options[:core_material], category, {product_module: self, civil_kitchen: options[:civil_kitchen]})]
    end

    hsh
  end

  # This method is used in PO Automation - DO NOT change it for any other functionality. Create a new method if needed.
  # eg if provided with 'Side Panel Left', for a module, sum up the all the areas of all carcass elements
  # of that type.
  def calculate_area(carcass_element_type_name)
    module_carcass_elements.joins(carcass_element: :carcass_element_type).where(carcass_element_types: {name: carcass_element_type_name}).distinct.map{ |mapping|
      carcass_element = mapping.carcass_element
      carcass_element.area_sqft * mapping.quantity
    }.sum
  end
end