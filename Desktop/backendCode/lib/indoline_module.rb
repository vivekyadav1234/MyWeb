module IndolineModule


  def aluminium_profile_shutter_sizes(folder_path)
    filename = "Aluminium Profile Shutter Sizes.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

        ai_h_dynamic = @workbook.row(row)[@headers['al h']]
        if ai_h_dynamic.present?
          ai_h_attr = @mli.mli_attributes.where(attr_name: "ai_h").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: ai_h_dynamic, mli_attribute_id: ai_h_attr).first_or_create
        end

        ai_v_dynamic = @workbook.row(row)[@headers['al v']]
        if ai_v_dynamic.present?
          ai_v_attr = @mli.mli_attributes.where(attr_name: "ai_v").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: ai_v_dynamic, mli_attribute_id: ai_v_attr).first_or_create
        end

      end
    end
  end

  def carcass_1S_glossy(folder_path)
    filename = "Carcass 1S Glossy.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found
  end

  def carcass_1S(folder_path)
    filename = "Carcass 1S Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found
  end

  def carcass_2S_glossy(folder_path)
    filename = "Carcass 2S Glossy.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found
  end

  def carcass_2S(folder_path)
    filename = "Carcass 2S Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found
  end

  def carcass(folder_path)
    filename = "Carcass Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

        sub_category_dynamic = @workbook.row(row)[@headers['arrivae subcategory']]
        if sub_category_dynamic.present?
          sub_category_attr = @mli.mli_attributes.where(attr_name: "sub_category").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: sub_category_dynamic, mli_attribute_id: sub_category_attr).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found
  end

  def concealed_handles(folder_path)
    filename = "Concealed Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        if arrivae_handle_dynamic.present?
          arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic.present?
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end

        oem_dynamic = @workbook.row(row)[@headers['oem']]
        if oem_dynamic.present?
          oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        type_of_hanlde_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_hanlde_dynamic.present?
          type_of_hanlde_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_hanlde_dynamic, mli_attribute_id: type_of_hanlde_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found

  end

  def drawer_back_tables(folder_path)
    filename = "Drawer Back Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        drawer_back_1_width_dynamic = @workbook.row(row)[@headers['drawer back 1 width']]
        if drawer_back_1_width_dynamic.present?
          drawer_back_1_width_attr = @mli.mli_attributes.where(attr_name: "drawer_back_1_width").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_1_width_dynamic, mli_attribute_id: drawer_back_1_width_attr.id).first_or_create
        end

        drawer_back_2_dynamic = @workbook.row(row)[@headers['drawer back 2 width']]
        if drawer_back_2_dynamic.present?
          drawer_back_2_attr = @mli.mli_attributes.where(attr_name: "drawer_back_2_width").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_2_dynamic, mli_attribute_id: drawer_back_2_attr.id).first_or_create
        end

        drawer_back_1_height_dynamic = @workbook.row(row)[@headers['drawer back 1 height']]
        if drawer_back_1_height_dynamic.present?
          drawer_back_1_height_attr = @mli.mli_attributes.where(attr_name: "drawer_back_1_height").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_1_height_dynamic, mli_attribute_id: drawer_back_1_height_attr.id).first_or_create
        end

        drawer_back_2_height_dynamic = @workbook.row(row)[@headers['drawer back 2 height']]
        if drawer_back_2_height_dynamic.present?
          drawer_back_2_height_attr = @mli.mli_attributes.where(attr_name: "drawer_back_2_height").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_2_height_dynamic, mli_attribute_id: drawer_back_2_height_attr.id).first_or_create
        end

        drawer_back_1_quantity_dynamic = @workbook.row(row)[@headers['drawer back 1 quantity']]
        if drawer_back_1_quantity_dynamic.present?
          drawer_back_1_quantity_attr = @mli.mli_attributes.where(attr_name: "drawer_back_1_quantity").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_1_quantity_dynamic, mli_attribute_id: drawer_back_1_quantity_attr.id).first_or_create
        end

        drawer_back_2_quantity_dynamic = @workbook.row(row)[@headers['drawer back 2 quantity']]
        if drawer_back_2_quantity_dynamic.present?
          drawer_back_2_quantity_attr = @mli.mli_attributes.where(attr_name: "drawer_back_2_quantity").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_back_2_quantity_dynamic, mli_attribute_id: drawer_back_2_quantity_attr.id).first_or_create
        end

        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

      end
    end

    puts "==================="
    puts not_found

  end

  def drawer_bottom_tables(folder_path)
    filename = "Drawer Bottom Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        drawer_bottom_width_dynamic = @workbook.row(row)[@headers['drawer bottom width']]
        if drawer_bottom_width_dynamic.present?
          drawer_bottom_width_attr = @mli.mli_attributes.where(attr_name: "drawer_bottom_width").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_bottom_width_dynamic, mli_attribute_id: drawer_bottom_width_attr.id).first_or_create
        end

        drawer_bottom_height_dynamic = @workbook.row(row)[@headers['drawer bottom height']]
        if drawer_bottom_height_dynamic.present?
          drawer_bottom_height_attr = @mli.mli_attributes.where(attr_name: "drawer_bottom_height").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_bottom_height_dynamic, mli_attribute_id: drawer_bottom_height_attr.id).first_or_create
        end

        drawer_bottom_quantity_dynamic = @workbook.row(row)[@headers['drawer bottom quantity']]
        if drawer_bottom_quantity_dynamic.present?
          drawer_bottom_quantity_attr = @mli.mli_attributes.where(attr_name: "drawer_bottom_quantity").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: drawer_bottom_quantity_dynamic, mli_attribute_id: drawer_bottom_quantity_attr.id).first_or_create
        end

        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

      end
    end

    puts "==================="
    puts not_found

  end

  def exposed_panels(folder_path)
    filename = "Exposed Panels.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end

    puts "==================="
    puts not_found

  end

  def glass_shelf_tables(folder_path)
    filename = "Glass Shelf Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        width_dynamic = @workbook.row(row)[@headers['w']]
        if width_dynamic.present?
          width_attr = @mli.mli_attributes.where(attr_name: "width").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: width_dynamic, mli_attribute_id: width_attr.id).first_or_create
        end

        height_dynamic = @workbook.row(row)[@headers['h']]
        if height_dynamic.present?
          height_attr = @mli.mli_attributes.where(attr_name: "height").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: height_dynamic, mli_attribute_id: height_attr.id).first_or_create
        end

        depth_dynamic = @workbook.row(row)[@headers['d']]
        if depth_dynamic.present?
          depth_attr = @mli.mli_attributes.where(attr_name: "depth").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: depth_dynamic, mli_attribute_id: depth_attr.id).first_or_create
        end

        shelf_dimension_dynamic = @workbook.row(row)[@headers['shelf dimensions']]
        if shelf_dimension_dynamic.present?
          shelf_dimension_attr = @mli.mli_attributes.where(attr_name: "shelf_dimensions").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: shelf_dimension_dynamic, mli_attribute_id: shelf_dimension_attr.id).first_or_create
        end

        no_of_shelves_dynamic = @workbook.row(row)[@headers['no of shelves']]
        if no_of_shelves_dynamic.present?
          no_of_shelves_attr = @mli.mli_attributes.where(attr_name: "number_of_shelves").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: no_of_shelves_dynamic, mli_attribute_id: no_of_shelves_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

      end
    end

    puts "==================="
    puts not_found

  end

  def insert_handles(folder_path)
    filename = "Insert Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        if arrivae_handle_dynamic.present?
          arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic.present?
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end

        oem_dynamic = @workbook.row(row)[@headers['oem']]
        if oem_dynamic.present?
          oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        type_of_hanlde_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_hanlde_dynamic.present?
          type_of_hanlde_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_hanlde_dynamic, mli_attribute_id: type_of_hanlde_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found

  end

  def laminate_exposed_panel(folder_path)
    filename = "Laminate Exposed Panels.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        oem_dynamic = @workbook.row(row)[@headers['oem']]
        if oem_dynamic.present?
          oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        vendor_material_code_dynamic = @workbook.row(row)[@headers['vendor material code']]
        if vendor_material_code_dynamic.present?
          vendor_material_code_attr = @mli.mli_attributes.where(attr_name: "vendor_material_code").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_material_code_dynamic, mli_attribute_id: vendor_material_code_attr.id).first_or_create
        end

        matching_arrivae_edge_banding_code_dynamic = @workbook.row(row)[@headers['matching edge banding arrivae code']]
        if matching_arrivae_edge_banding_code_dynamic.present?
          matching_arrivae_edge_banding_code_attr = @mli.mli_attributes.where(attr_name: "matching_edge_banding_arrivae_code").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: matching_arrivae_edge_banding_code_dynamic, mli_attribute_id: matching_arrivae_edge_banding_code_attr.id).first_or_create
        end

        shutter_materials_dynamic = @workbook.row(row)[@headers['shutter material']]
        if shutter_materials_dynamic.present?
          shutter_materials_attr = @mli.mli_attributes.where(attr_name: "shutter_materials").first
          shutter_materials_dynamic_value = CoreMaterial.find_by_name(shutter_materials_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: shutter_materials_dynamic_value.id, mli_attribute_id: shutter_materials_attr.id).first_or_create
        end

        shade_dynamic = @workbook.row(row)[@headers['arrivae shade code']]
        if shade_dynamic.present?
          shade_attr = @mli.mli_attributes.where(attr_name: "arrivae_shade").first
          shade_dynamic_value = Shade.find_by_code(shade_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: shade_dynamic_value.id, mli_attribute_id: shade_attr.id).first_or_create
        end


      end
    end

    puts "==================="
    puts not_found

  end

  def normal_handles(folder_path)
    filename = "Normal Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        if arrivae_handle_dynamic.present?
          arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic.present?
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        type_of_hanlde_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_hanlde_dynamic.present?
          type_of_hanlde_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_hanlde_dynamic, mli_attribute_id: type_of_hanlde_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found

  end

  def prelam_carcass(folder_path)
    filename = "Prelam Carcass.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_dynamic_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_dynamic_value.id, mli_attribute_id: boq_material_dynamic_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

      end
    end

    puts "==================="
    puts not_found
  end

  def profile_handles(folder_path)
    filename = "Profile Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        if arrivae_handle_dynamic.present?
          arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic.present?
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        type_of_hanlde_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_hanlde_dynamic.present?
          type_of_hanlde_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_hanlde_dynamic, mli_attribute_id: type_of_hanlde_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found

  end

  def pvc_exposed_panel(folder_path)
    filename = "PVC Exposed Panels.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        oem_dynamic = @workbook.row(row)[@headers['oem']]
        if oem_dynamic.present?
          oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        shade_dynamic = @workbook.row(row)[@headers['arrivae shade code']]
        if shade_dynamic.present?
          shade_attr = @mli.mli_attributes.where(attr_name: "arrivae_shade").first
          shade_dynamic_value = Shade.find_by_code(shade_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: shade_dynamic_value.id, mli_attribute_id: shade_attr.id).first_or_create
        end


      end
    end

    puts "==================="
    puts not_found

  end

  def shelf_tables(folder_path)
    filename = "Shelf Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        width_dynamic = @workbook.row(row)[@headers['w']]
        if width_dynamic.present?
          width_attr = @mli.mli_attributes.where(attr_name: "width").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: width_dynamic, mli_attribute_id: width_attr.id).first_or_create
        end

        height_dynamic = @workbook.row(row)[@headers['h']]
        if height_dynamic.present?
          height_attr = @mli.mli_attributes.where(attr_name: "height").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: height_dynamic, mli_attribute_id: height_attr.id).first_or_create
        end

        depth_dynamic = @workbook.row(row)[@headers['d']]
        if depth_dynamic.present?
          depth_attr = @mli.mli_attributes.where(attr_name: "depth").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: depth_dynamic, mli_attribute_id: depth_attr.id).first_or_create
        end

        shelf_dimension_dynamic = @workbook.row(row)[@headers['shelf dimensions']]
        if shelf_dimension_dynamic.present?
          shelf_dimension_attr = @mli.mli_attributes.where(attr_name: "shelf_dimensions").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: shelf_dimension_dynamic, mli_attribute_id: shelf_dimension_attr.id).first_or_create
        end

        no_of_shelves_dynamic = @workbook.row(row)[@headers['no of shelves']]
        if no_of_shelves_dynamic.present?
          no_of_shelves_attr = @mli.mli_attributes.where(attr_name: "number_of_shelves").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: no_of_shelves_dynamic, mli_attribute_id: no_of_shelves_attr.id).first_or_create
        end

        module_code_dynamic = @workbook.row(row)[@headers['arrivae module code']]
        if module_code_dynamic.present?
          module_code_attr = @mli.mli_attributes.where(attr_name: "module").first
          module_code_dynamic_value = ProductModule.find_by_code(module_code_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: module_code_dynamic_value.id, mli_attribute_id: module_code_attr.id).first_or_create
        end

        core_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if core_material_dynamic.present?
          core_material_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          core_material_dynamic_value = CoreMaterial.find_by_name(core_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: core_material_dynamic_value.id, mli_attribute_id: core_material_attr.id).first_or_create
        end

      end
    end

    puts "==================="
    puts not_found

  end

  def shutter_material_1s(folder_path)
    filename = "Shutters Material - 1S.xlsx"
    not_found = []
    werkbook(folder_path, filename)
    ActiveRecord::Base.transaction do
      ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
        begin
          common_attribute(row)
          unless @mli.present?
            not_found.push @workbook.row(row)[@headers['sli code']]
          else

            matching_arrivae_edge_banding_code_dynamic = @workbook.row(row)[@headers['matching edge banding arrivae code']]
            if matching_arrivae_edge_banding_code_dynamic.present?
              matching_arrivae_edge_banding_code_attr = @mli.mli_attributes.where(attr_name: "matching_arrivae_edge_banding_code").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: matching_arrivae_edge_banding_code_dynamic, mli_attribute_id: matching_arrivae_edge_banding_code_attr.id).first_or_create
            end


            edge_banding_dynamic = @workbook.row(row)[@headers['is edge banding required?']]
            if edge_banding_dynamic.present?
              edge_banding_attr = @mli.mli_attributes.where(attr_name: "edge_banding_required").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: edge_banding_dynamic, mli_attribute_id: edge_banding_attr.id).first_or_create
            end

            oem_dynamic = @workbook.row(row)[@headers['oem']]
            if oem_dynamic.present?
              oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
            end

            vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
            if vendor_description_dynamic.present?
              vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
            end

            vendor_material_code_dynamic = @workbook.row(row)[@headers['vendor material code']]
            if vendor_material_code_dynamic.present?
              vendor_material_code_attr = @mli.mli_attributes.where(attr_name: "vendor_material_code").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_material_code_dynamic, mli_attribute_id: vendor_material_code_attr.id).first_or_create
            end

            shutter_materials_dynamic = @workbook.row(row)[@headers['shutter material']]
            if shutter_materials_dynamic.present?
              shutter_materials_attr = @mli.mli_attributes.where(attr_name: "shutter_material").first
              shutter_materials_dynamic_value = CoreMaterial.find_by_name(shutter_materials_dynamic)
              @vendor_product.sli_dynamic_attributes.where(attr_value: shutter_materials_dynamic_value.id, mli_attribute_id: shutter_materials_attr.id).first_or_create
            end

            shade_dynamic = @workbook.row(row)[@headers['arrivae shade code']]
            if shade_dynamic.present?
              shade_attr = @mli.mli_attributes.where(attr_name: "arrivae_shade").first
              shade_dynamic_value = Shade.find_by_code(shade_dynamic)
              @vendor_product.sli_dynamic_attributes.where(attr_value: shade_dynamic_value.id, mli_attribute_id: shade_attr.id).first_or_create
            end
          end
        rescue StandardError => e
          not_found.push @workbook.row(row)[@headers['sli code']]
        end
      end
    end
    puts "==================="
    puts not_found

  end

  def shutter_material_2s(folder_path)
    filename = "Shutters Material - 1S.xlsx"
    not_found = []
    werkbook(folder_path, filename)
    ActiveRecord::Base.transaction do
      ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
        begin
          common_attribute(row)
          unless @mli.present?
            not_found.push @workbook.row(row)[@headers['sli code']]
          else

            matching_arrivae_edge_banding_code_dynamic = @workbook.row(row)[@headers['matching edge banding arrivae code']]
            if matching_arrivae_edge_banding_code_dynamic.present?
              matching_arrivae_edge_banding_code_attr = @mli.mli_attributes.where(attr_name: "matching_arrivae_edge_banding_code").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: matching_arrivae_edge_banding_code_dynamic, mli_attribute_id: matching_arrivae_edge_banding_code_attr.id).first_or_create
            end


            edge_banding_dynamic = @workbook.row(row)[@headers['is edge banding required?']]
            if edge_banding_dynamic.present?
              edge_banding_attr = @mli.mli_attributes.where(attr_name: "edge_banding_required").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: edge_banding_dynamic, mli_attribute_id: edge_banding_attr.id).first_or_create
            end

            oem_dynamic = @workbook.row(row)[@headers['oem']]
            if oem_dynamic.present?
              oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
            end

            vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
            if vendor_description_dynamic.present?
              vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
            end

            vendor_material_code_dynamic = @workbook.row(row)[@headers['vendor material code']]
            if vendor_material_code_dynamic.present?
              vendor_material_code_attr = @mli.mli_attributes.where(attr_name: "vendor_material_code").first
              @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_material_code_dynamic, mli_attribute_id: vendor_material_code_attr.id).first_or_create
            end

            shutter_materials_dynamic = @workbook.row(row)[@headers['shutter material']]
            if shutter_materials_dynamic.present?
              shutter_materials_attr = @mli.mli_attributes.where(attr_name: "shutter_material").first
              shutter_materials_dynamic_value = CoreMaterial.find_by_name(shutter_materials_dynamic)
              @vendor_product.sli_dynamic_attributes.where(attr_value: shutter_materials_dynamic_value.id, mli_attribute_id: shutter_materials_attr.id).first_or_create
            end

            shade_dynamic = @workbook.row(row)[@headers['arrivae shade code']]
            if shade_dynamic.present?
              shade_attr = @mli.mli_attributes.where(attr_name: "arrivae_shade").first
              shade_dynamic_value = Shade.find_by_code(shade_dynamic)
              @vendor_product.sli_dynamic_attributes.where(attr_value: shade_dynamic_value.id, mli_attribute_id: shade_attr.id).first_or_create
            end
          end
        rescue StandardError => e
          not_found.push @workbook.row(row)[@headers['sli code']]
        end
      end
    end
    puts "==================="
    puts not_found

  end

  def special_handles(folder_path)
    filename = "Special Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        if arrivae_handle_dynamic.present?
          arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic.present?
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        type_of_hanlde_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_hanlde_dynamic.present?
          type_of_hanlde_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_hanlde_dynamic, mli_attribute_id: type_of_hanlde_attr.id).first_or_create
        end
      end
    end

    puts "==================="
    puts not_found

  end

  private

    def werkbook(folder_path, file_name)
      filepath = "#{folder_path}/#{file_name}"
      @workbook = Roo::Spreadsheet.open filepath
      @headers = Hash.new
      @workbook.row(1).each_with_index do |header,i|
        if header.present?
          @headers[header.downcase] = i
        end
      end
    end


    def common_attribute(row)

      mli_name = @workbook.row(row)[@headers['master line item']]
      sli_group_code = @workbook.row(row)[@headers['sli group code']]
      sli_code = @workbook.row(row)[@headers['sli code']]
      vendor_code = @workbook.row(row)[@headers['vendor code']]
      sli_name = @workbook.row(row)[@headers['sub line item']]
      vendor_pan = @workbook.row(row)[@headers['pan of vendor']]
      measurement_unit = @workbook.row(row)[@headers['unit of measurement']]
      rate = @workbook.row(row)[@headers['vendor rate']]
      @mli = MasterLineItem.find_by_mli_name(mli_name)

      if @mli.present?
        vendor = Vendor.find_by_pan_no vendor_pan
        @vendor_product = @mli.vendor_products.where(sli_code: sli_code, sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
        vendor_id: vendor.id).first_or_create!
      end

    end
end
