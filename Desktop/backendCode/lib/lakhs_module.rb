module LakhsModule
  def add_ons_tables(folder_path)
    filepath = "#{folder_path}/Add Ons Tables.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    not_found = []

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      mli_name = workbook.row(row)[headers['master line item']]
      sli_group_code = workbook.row(row)[headers['sli group code']]
      sli_code = workbook.row(row)[headers['sli code']]
      vendor_code = workbook.row(row)[headers['vendor code']]
      sli_name = workbook.row(row)[headers['sub line item']]
      vendor_pan = workbook.row(row)[headers['pan of vendor']]
      measurement_unit = workbook.row(row)[headers['unit of measurement']]
      rate = workbook.row(row)[headers['vendor rate']]

      oem_dynamic = workbook.row(row)[headers['oem']]
      mrp_dynamic = workbook.row(row)[headers['mrp']]
      vendor_description_dynamic = workbook.row(row)[headers['vendor description']]
      addons_reference = workbook.row(row)[headers['arrivae add ons code']]

      mli = MasterLineItem.find_by_mli_name(mli_name)
      if mli.present?
        vendor = Vendor.find_by_pan_no vendor_pan
        vendor_product = mli.vendor_products.where(sli_code: sli_code, sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
        vendor_id: vendor.id).first_or_create
        #dynamic attributes
        oem_attr = mli.mli_attributes.where(attr_name: "oem").first
        vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create
        mrp_attr = mli.mli_attributes.where(attr_name: "mrp").first
        vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        vendor_description_attr = mli.mli_attributes.where(attr_name: "vendor_description").first
        vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        #reference column
        addon = Addon.find_by_code addons_reference
        if addon.present?
          addon_attr = mli.mli_attributes.where(attr_name: "arrivae_addon").first
          vendor_product.sli_dynamic_attributes.where(attr_value: addon.id, mli_attribute_id: addon_attr.id).first_or_create
        end
      else
        not_found.push sli_code
      end
    end
    puts "====404===="
    puts not_found
  end

  def mm08_edge_banding_tables(folder_path)
    filepath = "#{folder_path}/0.8mm Edge Banding Tables.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    not_found = []
    ActiveRecord::Base.transaction do
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        mli_name = workbook.row(row)[headers['master line item']]
        sli_group_code = workbook.row(row)[headers['sli group code']]
        sli_code = workbook.row(row)[headers['sli code']]
        vendor_code = workbook.row(row)[headers['vendor code']]
        sli_name = workbook.row(row)[headers['sub line item']]
        vendor_pan = workbook.row(row)[headers['pan of vendor']]
        measurement_unit = workbook.row(row)[headers['unit of measurement']]
        rate = workbook.row(row)[headers['vendor rate']]

        vendor_edge_bending_type_dynamic = workbook.row(row)[headers['vendor edge banding type']]
        size_dynamic = workbook.row(row)[headers['size']]
        vendor_edge_banding_name_dynamic = workbook.row(row)[headers['vendor edge banding name']]

        arrivae_edge_banding_code_reference = workbook.row(row)[headers['arrivae edge banding code']]

        mli = MasterLineItem.find_by_mli_name(mli_name)
        if mli.present?
          vendor = Vendor.find_by_pan_no vendor_pan
          vendor_product = mli.vendor_products.where(sli_code: sli_code, sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
          vendor_id: vendor.id).first_or_create!
          #dynamic attributes
          vendor_edge_bending_attr = mli.mli_attributes.where(attr_name: "vendor_edge_banding_type").first
          vendor_product.sli_dynamic_attributes.where(attr_value: vendor_edge_bending_type_dynamic, mli_attribute_id: vendor_edge_bending_attr.id).first_or_create

          size_attr = mli.mli_attributes.where(attr_name: "size").first
          vendor_product.sli_dynamic_attributes.where(attr_value: size_dynamic, mli_attribute_id: size_attr.id).first_or_create

          vendor_edge_banding_name_attr = mli.mli_attributes.where(attr_name: "vendor_edge_banding_name").first
          vendor_product.sli_dynamic_attributes.where(attr_value: vendor_edge_banding_name_dynamic, mli_attribute_id: vendor_edge_banding_name_attr.id).first_or_create

          #reference column
          if arrivae_edge_banding_code_reference.present?
            share_attr = mli.mli_attributes.where(attr_name: "matching_arrivae_edge_banding_shade").first
            vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_edge_banding_code_reference, mli_attribute_id: share_attr.id).first_or_create if share_attr.present?
          end
        else
          not_found.push sli_code
        end
      end
    end
    puts "====404===="
    puts not_found
  end

  def mm2_edge_banding_tables(folder_path)
    filepath = "#{folder_path}/2mm Edge Banding Tables.xlsx"
    workbook = Roo::Spreadsheet.open filepath

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    not_found = []
    ActiveRecord::Base.transaction do
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        mli_name = workbook.row(row)[headers['master line item']]
        sli_group_code = workbook.row(row)[headers['sli group code']]
        sli_code = workbook.row(row)[headers['sli code']]
        vendor_code = workbook.row(row)[headers['vendor code']]
        sli_name = workbook.row(row)[headers['sub line item']]
        vendor_pan = workbook.row(row)[headers['pan of vendor']]
        measurement_unit = workbook.row(row)[headers['unit of measurement']]
        rate = workbook.row(row)[headers['vendor rate']]

        vendor_edge_bending_type_dynamic = workbook.row(row)[headers['edge banding type']]
        size_dynamic = workbook.row(row)[headers['size']]
        vendor_edge_banding_name_dynamic = workbook.row(row)[headers['vendor edge banding name']]

        arrivae_edge_banding_code_reference = workbook.row(row)[headers['arrivae edge banding code']]

        mli = MasterLineItem.find_by_mli_name(mli_name)
        begin
          if mli.present?
            vendor = Vendor.find_by_pan_no vendor_pan
            vendor_product = mli.vendor_products.where(sli_code: sli_code, sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
            vendor_id: vendor.id).first_or_create!
            #dynamic attributes
            vendor_edge_bending_attr = mli.mli_attributes.where(attr_name: "vendor_edge_banding_type").first
            vendor_product.sli_dynamic_attributes.where(attr_value: vendor_edge_bending_type_dynamic, mli_attribute_id: vendor_edge_bending_attr.id).first_or_create

            size_attr = mli.mli_attributes.where(attr_name: "size").first
            vendor_product.sli_dynamic_attributes.where(attr_value: size_dynamic, mli_attribute_id: size_attr.id).first_or_create

            vendor_edge_banding_name_attr = mli.mli_attributes.where(attr_name: "vendor_edge_banding_name").first
            vendor_product.sli_dynamic_attributes.where(attr_value: vendor_edge_banding_name_dynamic, mli_attribute_id: vendor_edge_banding_name_attr.id).first_or_create

            #reference column
            if arrivae_edge_banding_code_reference.present?
              # shade = EdgeBandingShade.find_by_code(arrivae_edge_banding_code_reference)
              share_attr = mli.mli_attributes.where(attr_name: "matching_arrivae_edge_banding_shade").first
              vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_edge_banding_code_reference, mli_attribute_id: share_attr.id).first_or_create if share_attr.present?
            end
          else
            not_found.push sli_code
          end
        rescue StandardError => e
          not_found.push sli_code
        end
      end
    end
    puts "====404===="
    puts not_found
  end

  def mm4_glass_tables(folder_path)
    filename = "4mm Glass Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end

    end
    puts "====404===="
    puts not_found
  end

  def mm10_glass_tables(folder_path)
    filename = "10mm Glass Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def mm12_core_material_tables(folder_path)
    filename = "12mm Core Material Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_value = CoreMaterial.find_by_name(boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_value.id, mli_attribute_id: boq_material_attr.id).first_or_create
        end
      end
    end


    puts "====404===="
    puts not_found
  end

  def mm16_white_carcass_tables(folder_path)
    filename = "16mm White Carcass Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)
    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def mm18_core_material_tables(folder_path)
    filename = "18mm Core Material Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        boq_material_attr = @mli.mli_attributes.where(attr_name: "core_material").first
        boq_material_dynamic_value = CoreMaterial.find_by_name (boq_material_dynamic)
        @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_value.id, mli_attribute_id: boq_material_attr.id).first_or_create
      end
    end


    puts "====404===="
    puts not_found
  end

  def aluminium_frame_tables(folder_path)
    filename = "Aluminium Frame Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def back_panel_tables(folder_path)
    filename = "Back Panel Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)

      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        boq_material_dynamic = @workbook.row(row)[@headers['boq material']]
        if boq_material_dynamic.present?
          boq_material_attr = @mli.mli_attributes.where(attr_name: "core_material").first
          boq_material_dynamic_value = CoreMaterial.find_by_name (boq_material_dynamic)
          @vendor_product.sli_dynamic_attributes.where(attr_value: boq_material_dynamic_value.id, mli_attribute_id: boq_material_attr.id).first_or_create
        end
      end

    end
    puts "====404===="
    puts not_found
  end

  def balencing_laminate_tables(folder_path)
    filename = "Balancing Laminate Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        internal_finish_dynamic = @workbook.row(row)[@headers['internal finish']]
        if internal_finish_dynamic.present?
          internal_finish_attr = @mli.mli_attributes.where(attr_name: "internal_finish").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: internal_finish_dynamic, mli_attribute_id: internal_finish_attr.id).first_or_create
        end

        matching_edge_banding_dynamic = @workbook.row(row)[@headers['matching edge banding arrivae code']]
        if matching_edge_banding_dynamic.present?
          matching_edge_banding_attr = @mli.mli_attributes.where(attr_name: "matching_edge_banding_arrivae_code").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: matching_edge_banding_dynamic, mli_attribute_id: matching_edge_banding_attr.id).first_or_create
        end
      end
    end
    puts "====404===="
    puts not_found
  end

  def both_side_c_eb_tables(folder_path)
    filename = "Both Side C, EB.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def both_side_p_c_eb_g_d_tables(folder_path)
    filename = "Both Side P,C,EB,G,D.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def both_side_p_c_eb_tables(folder_path)
    filename = "Both Side P,C,EB.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def both_side_p_c_tables(folder_path)
    filename = "Both Side P,C.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def c_eb_g_d_tables(folder_path)
    filename = "C, EB, G, D.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def cutting_tables(folder_path)
    filename = "Cutting.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def concealed_handles_tables(folder_path)
    filename = "Concealed Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)

      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
        arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
        @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create

        type_of_handle_dynamic = @workbook.row(row)[@headers['type of handle']]
        types_of_handle_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_handle_dynamic, mli_attribute_id: types_of_handle_attr.id).first_or_create

        oem_dynamic = @workbook.row(row)[@headers['oem']]
        oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
      end

    end
    puts "====404===="
    puts not_found
  end

  def dry_fit_tables(folder_path)
    filename = "Dry Fit Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def finish_material(folder_path)
    filename = "Finish Materials.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      if @mli.present?
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

        matching_arrivae_edge_banding_code_dynamic = @workbook.row(row)[@headers['matching edge banding arrivae code']]
        if matching_arrivae_edge_banding_code_dynamic.present?
          matching_arrivae_edge_banding_code_attr = @mli.mli_attributes.where(attr_name: "matching_arrivae_edge_banding_code").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: matching_arrivae_edge_banding_code_dynamic, mli_attribute_id: matching_arrivae_edge_banding_code_attr.id).first_or_create
        end

        arrivae_shade_dynamic = @workbook.row(row)[@headers['arrivae shade code']]
        if arrivae_shade_dynamic.present?
          arrivae_shade_attr = @mli.mli_attributes.where(attr_name: "arrivae_shade").first
          arrivae_shade_dynamic_value = Shade.find_by_code(arrivae_shade_dynamic)
          if arrivae_shade_dynamic_value.present?
            @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_shade_dynamic_value.id, mli_attribute_id: arrivae_shade_attr.id).first_or_create
          end
        end
      else
        not_found.push @workbook.row(row)[@headers['sli code']]
      end


    end
    puts "====404===="
    puts not_found
  end

  def hardware_tables(folder_path)
    filename = "Hardware Tables.xlsx"
    not_found = []
    no_hardware_code = []
    brand_not_found = []
    werkbook(folder_path, filename)
    ActiveRecord::Base.transaction do
      ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
        common_attribute(row)
        unless @mli.present?
          not_found.push @workbook.row(row)[@headers['sli code']]
        else
          mrp_dynamic = @workbook.row(row)[@headers['mrp']]
          if mrp_dynamic.present?
            mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
            mrp_dyn_attr = @vendor_product.sli_dynamic_attributes.where(mli_attribute_id: mrp_attr.id).first_or_initialize
            mrp_dyn_attr.assign_attributes(attr_value: mrp_dynamic)
            mrp_dyn_attr.save!
          end

          vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
          if vendor_description_dynamic.present?
            vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
            vd_dyn_attr = @vendor_product.sli_dynamic_attributes.where(mli_attribute_id: vendor_description_attr.id).first_or_initialize
            vd_dyn_attr.assign_attributes(attr_value: vendor_description_dynamic)
            vd_dyn_attr.save!
          end

          hardware_code_dynamic = @workbook.row(row)[@headers['arrivae hardware code']]
          # if hardware_code_dynamic.blank?
          #   no_hardware_code << @vendor_product.sli_code
          #   @vendor_product.destroy!
          #   next
          # end
          brand_name = @workbook.row(row)[@headers['oem']]
          if brand_name.present?
            bn_dyn_attr = @mli.mli_attributes.where(attr_name: "oem").first
            bn_dyn_attr = @vendor_product.sli_dynamic_attributes.where(mli_attribute_id: vendor_description_attr.id).first_or_initialize
            bn_dyn_attr.assign_attributes(attr_value: brand_name)
            bn_dyn_attr.save!
          end
          oem = Brand.hardware_brands.find_by(name: brand_name)
          # if oem.blank?
          #   brand_not_found << brand_name
          #   @vendor_product.destroy!
          #   next
          # end
          if hardware_code_dynamic.present?
            hardware_code_attr = @mli.mli_attributes.where(attr_name: "hardware_code").first
            hardware_code_value = HardwareElement.find_by(code: hardware_code_dynamic, brand_id: oem.id, category: "kitchen")
            if hardware_code_value.blank?
              not_found << [hardware_code_dynamic, brand_name]
              @vendor_product.destroy!
              next
            end
            @vendor_product.sli_dynamic_attributes.where(attr_value: hardware_code_value.id, mli_attribute_id: hardware_code_attr.id).first_or_create
          end
        end
      end
    end
    puts "Hardware code blank:"
    pp no_hardware_code
    puts "Brand not found:"
    pp brand_not_found
    puts "No hardware with this combination of code and brand:"
    pp not_found
  end

  def insert_handles_tables(folder_path)
    filename = "Insert Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        oem_dynamic = @workbook.row(row)[@headers['oem']]
        oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create

        type_of_handle_dynamic = @workbook.row(row)[@headers['type of handle']]
        type_of_handle_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_handle_dynamic, mli_attribute_id: type_of_handle_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create

        handle_code_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        handle_code_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
        handle_code_value = Handle.find_by_code(handle_code_dynamic)
        @vendor_product.sli_dynamic_attributes.where(attr_value: handle_code_value.id, mli_attribute_id: handle_code_attr.id).first_or_create
      end

    end
    puts "====404===="
    puts not_found
  end

  def normal_handles_tables(folder_path)
    filename = "Normal Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        type_of_handle_dynamic = @workbook.row(row)[@headers['type of handle']]
        type_of_handle_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_handle_dynamic, mli_attribute_id: type_of_handle_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create

        handle_code_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        handle_code_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
        handle_code_value = Handle.find_by_code(handle_code_dynamic)
        @vendor_product.sli_dynamic_attributes.where(attr_value: handle_code_value.id, mli_attribute_id: handle_code_attr.id).first_or_create
      end

    end
    puts "====404===="
    puts not_found
  end

  def other_processing_tables(folder_path)
    filename = "Other Processing.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def packaging_tables_tables(folder_path)
    filename = "Packaging Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def profile_handles_tables(folder_path)
    filename = "Profile Handles.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        arrivae_handle_dynamic = @workbook.row(row)[@headers['arrivae handle code']]
        arrivae_handle_attr = @mli.mli_attributes.where(attr_name: "arrivae_handle").first
        arrivae_handle_dynamic_value = Handle.find_by_code(arrivae_handle_dynamic)
        @vendor_product.sli_dynamic_attributes.where(attr_value: arrivae_handle_dynamic_value.id, mli_attribute_id: arrivae_handle_attr.id).first_or_create

        type_of_handle_dynamic = @workbook.row(row)[@headers['type of handle']]
        types_of_handle_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_handle_dynamic, mli_attribute_id: types_of_handle_attr.id).first_or_create

        # oem_dynamic = @workbook.row(row)[@headers['oem']]
        # oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
        # @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
      end
    end
    puts "====404===="
    puts not_found
  end

  def routing_for_g_profile_tables(folder_path)
    filename = "Routing for G Profile.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def routing_for_shutters_tables(folder_path)
    filename = "Routing for Shutters.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      end
    end
    puts "====404===="
    puts not_found
  end

  def skirting_hardware_tables(folder_path)
    filename = "Skirting Hardware Tables.xlsx"
    not_found = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      common_attribute(row)
      unless @mli.present?
        not_found.push @workbook.row(row)[@headers['sli code']]
      else
        oem_dynamic = @workbook.row(row)[@headers['oem']]
        oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
        @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
      end
    end
    puts "====404===="
    puts not_found
  end

  def skirting_tables(folder_path)
    filename = "Skirting Tables.xlsx"
    not_found = []
    no_skirting_type = []
    no_skirting_height = []
    werkbook(folder_path, filename)
    ActiveRecord::Base.transaction do
      ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
        next unless common_attribute(row)   #returning false means that the vendor product was not saved.
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

          mrp_dynamic = @workbook.row(row)[@headers['mrp']]
          if mrp_dynamic.present?
            mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
            @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
          end

          skirting_type_dynamic = @workbook.row(row)[@headers['skirting type']]
          skirting_height_dynamic = @workbook.row(row)[@headers['skirting height']]
          if skirting_type_dynamic.blank?
            no_skirting_type << skirting_type_dynamic
            @vendor_product.destroy!
            next
          end
          if skirting_height_dynamic.blank?
            no_skirting_height << skirting_height_dynamic
            @vendor_product.destroy!
            next
          end
          if skirting_type_dynamic.present?
            skirting_type_attr = @mli.mli_attributes.where(attr_name: "skirting_config").first
            skirting_type_value = SkirtingConfig.find_by(skirting_type: skirting_type_dynamic, skirting_height: skirting_height_dynamic)
            if skirting_type_value.blank?
              not_found << [@vendor_product.sli_code, skirting_type_dynamic, skirting_height_dynamic]
              @vendor_product.destroy!
              next
            end
            sli_dynamic_attribute = @vendor_product.sli_dynamic_attributes.where(mli_attribute_id: skirting_type_attr.id).first_or_initialize
            sli_dynamic_attribute.assign_attributes(attr_value: skirting_type_value.id)
          end
        end
      end
    end
    puts "No vendors with these PANS:"
    puts @no_vendor
    puts "No skirting type:"
    pp no_skirting_type
    puts "No skirting height:"
    pp no_skirting_height
    puts "No skirtings found:"
    pp not_found
  end

  def special_handles_tables(folder_path)
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

        type_of_handle_dynamic = @workbook.row(row)[@headers['type of handle']]
        if type_of_handle_dynamic.present?
          types_of_handle_attr = @mli.mli_attributes.where(attr_name: "type_of_handle").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: type_of_handle_dynamic, mli_attribute_id: types_of_handle_attr.id).first_or_create
        end

        # oem_dynamic = @workbook.row(row)[@headers['oem']]
        # oem_attr = @mli.mli_attributes.where(attr_name: "oem").first
        # @vendor_product.sli_dynamic_attributes.where(attr_value: oem_dynamic, mli_attribute_id: oem_attr.id).first_or_create

        vendor_description_dynamic = @workbook.row(row)[@headers['vendor description']]
        if vendor_description_dynamic.present?
          vendor_description_attr = @mli.mli_attributes.where(attr_name: "vendor_description").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: vendor_description_dynamic, mli_attribute_id: vendor_description_attr.id).first_or_create
        end

        mrp_dynamic = @workbook.row(row)[@headers['mrp']]
        if mrp_dynamic
          mrp_attr = @mli.mli_attributes.where(attr_name: "mrp").first
          @vendor_product.sli_dynamic_attributes.where(attr_value: mrp_dynamic, mli_attribute_id: mrp_attr.id).first_or_create
        end
      end
    end
    puts "====404===="
    puts not_found
  end

  def gebi_laminates_script(folder_path)
    filename = "Gebi Laminates Issue.xlsx"
    not_found = []
    no_vendor = []
    werkbook(folder_path, filename)

    ((@workbook.first_row + 1)..@workbook.last_row).each do |row|
      sli_code = @workbook.row(row)[@headers['sli code']].downcase
      pan = @workbook.row(row)[@headers['new vendor pan']]
      vendor_product = VendorProduct.find_by sli_code: sli_code
      vendor = Vendor.find_by pan_no: pan
      if vendor_product.blank?
        not_found << sli_code
        next
      end
      if vendor.blank?
        no_vendor << pan
        next
      end
      vendor_product.update!(vendor: vendor)
    end

    puts "No vendors with these PANS:"
    pp no_vendor
    puts "No vendor products with these SLI codes (total: #{not_found.count}):"
    pp not_found
  end

  private

    def werkbook(folder_path, file_name)
      filepath = "#{folder_path}/#{file_name}"
      @workbook = Roo::Spreadsheet.open filepath
      @headers = Hash.new
      @workbook.row(1).each_with_index do |header,i|
        next if header.blank?
        @headers[header.downcase] = i
      end
    end

    #returning false means that the vendor product was not saved.
    def common_attribute(row)
      @no_vendor = []
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
        if vendor.blank?
          @no_vendor.push vendor_pan
          return false
        end
        @vendor_product = @mli.vendor_products.where(sli_code: sli_code).first_or_initialize
        @vendor_product.assign_attributes(sli_group_code: sli_group_code, sli_name: sli_name, unit: VendorProduct::UNITS[measurement_unit], rate: rate, vendor_code: vendor_code,
        vendor_id: vendor.id)
        @vendor_product.save!
      end

    end
end
