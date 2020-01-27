class ShangpinImportModule::ShangpinImport
  def initialize(quotation, space, workbook = nil, creek_workbook = nil)
    @quotation = quotation
    @space = space
    @workbook = workbook
    @creek_workbook = creek_workbook
    @current_sheet = @workbook.sheets.first
    @errors = []
  end

  # randomly populate shangpin_jobs so that frontend has an end-point to work with.
  def populate_dummy_jobs
    ShangpinJob.populate_dummy_jobs(@quotation, @space, num_jobs = 2)   
    @errors.push ShangpinImportModule::ShangpinImportError.new("cabinet", "No cabinet price found.", 14).message_hash
    @errors.push ShangpinImportModule::ShangpinImportError.new("door", "No door quantity found.", 20).message_hash
    @errors.push ShangpinImportModule::ShangpinImportError.new("accessory", "No accessory with the given code exists.", 31).message_hash

    @errors
  end

  def read_detailed_quote_excel
    all_job_types = ["1. Cabinet Components", "2. Accessories:", "3. Accessories of sliding door"]
    workbook = @workbook
    headers = Hash.new
    workbook.row(6).each_with_index do |header,i|
      headers[header.to_s.downcase] = i
    end
    
    job_type = ""
    total_value = 0
    
    ((workbook.first_row+6)..workbook.last_row).each do |row|
      total_value = workbook.row(row)[3] if workbook.row(row)[1].to_s.include? "Total amount"
      
      if workbook.row(row)[0].in?(all_job_types)
        if workbook.row(row)[0] == "1. Cabinet Components"
          job_type = "cabinet"
        elsif workbook.row(row)[0] == "2. Accessories:"
          job_type = "accessory"
        elsif  workbook.row(row)[0] == "3. Accessories of sliding door"
          job_type = "sliding_door"
        end  
      end

      data_json = {}

      begin
        if Float(workbook.row(row)[0])
          actual_size = workbook.row(row)[headers['actual size']].split("x")  if workbook.row(row)[headers['actual size']].present?
          specification = workbook.row(row)[headers['specification']].split("x")  if workbook.row(row)[headers['specification']].present?

          if job_type.present? && job_type == "cabinet"

            if actual_size.present?  
              cabinet_width = actual_size[0]
              cabinet_depth = actual_size[1] 
              cabinet_height = actual_size[2]
            else 
              cabinet_width = cabinet_depth = cabinet_height = 0
            end

            if specification.present?  
              job_spec_door = specification[0]
              job_spec_worktop = specification[1] 
              job_spec_leg = specification[2]
            else 
              job_spec_door = job_spec_worktop = job_spec_leg = 0
            end

            data_json = {cabinet_item: workbook.row(row)[headers['item']], cabinet_model_no: workbook.row(row)[headers['model no.']],
                         cabinet_specific_door: job_spec_door, cabinet_specific_worktop: job_spec_worktop, cabinet_specific_leg: job_spec_leg,
                          cabinet_color: workbook.row(row)[headers['color']], cabinet_price: workbook.row(row)[headers['unit price']], 
                          cabinet_quantity: workbook.row(row)[headers['quantity']], cabinet_amount: workbook.row(row)[headers['amount']],
                          cabinet_width: cabinet_width, cabinet_depth: cabinet_depth, cabinet_height: cabinet_height, job_type: "cabinet", space: @space, imported_file_type: "1DetailedQuoteForm"}
            
          elsif job_type.present? && job_type == "accessory"

            if actual_size.present?  
              accessory_width = actual_size[0]
              accessory_depth = actual_size[1] 
              accessory_height = actual_size[2]
            else 
              accessory_width = accessory_depth = accessory_height = 0
            end


            if specification.present?  
              job_spec_door = specification[0]
              job_spec_worktop = specification[1] 
              job_spec_leg = specification[2]
            else 
              job_spec_door = job_spec_worktop = job_spec_leg = 0
            end            

            data_json = {accessory_item: workbook.row(row)[headers['item']], accessory_model_no: workbook.row(row)[headers['model no.']],
                         job_spec_door: job_spec_door, job_spec_worktop: job_spec_worktop, job_spec_leg: job_spec_leg,                         
                          accessory_color: workbook.row(row)[headers['color']], accessory_price: workbook.row(row)[headers['unit price']], 
                          accessory_quantity: workbook.row(row)[headers['quantity']], accessory_amount: workbook.row(row)[headers['amount']],
                          accessory_width: accessory_width, accessory_depth: accessory_depth, accessory_height: accessory_height, job_type: "accessory", space: @space, imported_file_type: "1DetailedQuoteForm"}              

          elsif job_type.present? && job_type == "sliding_door"

            if actual_size.present?  
              door_width = actual_size[0]
              door_depth = actual_size[1] 
              door_height = actual_size[2]
            else 
              door_width = door_depth = door_height = 0
            end


            if specification.present?  
              job_spec_door = specification[0]
              job_spec_worktop = specification[1] 
              job_spec_leg = specification[2]
            else 
              job_spec_door = job_spec_worktop = job_spec_leg = 0
            end            

            data_json = {door_item: workbook.row(row)[headers['item']], door_model_no: workbook.row(row)[headers['model no.']],
                         job_spec_door: job_spec_door, job_spec_worktop: job_spec_worktop, job_spec_leg: job_spec_leg,              
                          door_color: workbook.row(row)[headers['color']], door_price: workbook.row(row)[headers['unit price']], 
                          door_quantity: workbook.row(row)[headers['quantity']], door_amount: workbook.row(row)[headers['amount']],
                          door_width: door_width, door_depth: door_depth, door_height: door_height, job_type: "sliding_door", space: @space, imported_file_type: "1DetailedQuoteForm"}              
          end
          if data_json.present?
            begin
              @quotation.shangpin_jobs.create!(data_json)
            rescue StandardError => e
              @errors.push ShangpinImportModule::ShangpinImportError.new(job_type, e, row).message_hash
            end
          end
        end
      rescue StandardError => e
      end
    end 
    @errors
  end

  def read_quote_excel
    all_job_types = ["Cabinet List", "Door List", "Accessory list"]
    index_arr = ["No.", "Cabinet No.", nil]
    workbook = @workbook
    creek_workbook = @creek_workbook
    headers = Hash.new
    job_type = ""
    total_value = 0
    image_array = []
    creek_workbook.sheets[0].with_images.rows.each do |row|
      image_array << row
    end  
    ((workbook.first_row+4)..workbook.last_row).each do |row|
      total_value = workbook.row(row)[3] if workbook.row(row)[1].to_s.include? "Total amount"
      if workbook.row(row)[0].in?(all_job_types)
        if workbook.row(row)[0] == "Cabinet List"
          job_type = "cabinet"
          headers = {}
          workbook.row(row+1).each_with_index do |header,i|
            headers[header.to_s.downcase] = i
          end
          next
        elsif workbook.row(row)[0] == "Door List"
          job_type = "door"
          headers = {}
          workbook.row(row+1).each_with_index do |header,i|
            headers[header.to_s.downcase] = i
          end         
          next
        elsif  workbook.row(row)[0] == "Accessory list"
          job_type = "accessory"
          headers = {}
          workbook.row(row+1).each_with_index do |header,i|
            headers[header.to_s.downcase] = i
          end
          next
        end  
      end
      image = image_array[row]["B#{row+1}"] if image_array[row].present?
      if image.present? && image.class.name == "Array" && image[0].class.name == "Pathname"
        temp = image.last.basename.to_s.split(".")[1]
        encoded_data = "data:image/#{temp};base64," + Base64.encode64(open(image.last) { |io| io.read }) if image.present?
      else
        encoded_data = nil
      end    
      data_json = {}
      if job_type.present? && job_type == "cabinet" && !workbook.row(row)[0].in?(index_arr)
        data_json = {space:  @space, cabinet_model_no: workbook.row(row)[headers['model no.']], cabinet_width:  workbook.row(row)[headers['overall size']],
          cabinet_depth:  workbook.row(row)[headers['overall size']+1], cabinet_height:  workbook.row(row)[headers['overall size']+2],
          cabinet_specific_door: workbook.row(row)[headers['specific size']], cabinet_specific_worktop: workbook.row(row)[headers['specific size']+1], cabinet_specific_leg: workbook.row(row)[headers['specific size']+2], cabinet_platform: workbook.row(row)[headers['platform']], 
          cabinet_material: workbook.row(row)[headers['material']], cabinet_door: workbook.row(row)[headers['door']],
          cabinet_handle: workbook.row(row)[headers['handle']], cabinet_price: workbook.row(row)[headers['unit price']], cabinet_quantity: workbook.row(row)[headers['quantity']], 
          cabinet_amount: workbook.row(row)[headers['amount']], job_type: "cabinet", imported_file_type: "1QuoteForm", image: encoded_data
        }
      elsif job_type.present? && job_type == "accessory" && !workbook.row(row)[0].in?(index_arr)
        data_json = {
         space: @space,  accessory_code: workbook.row(row)[headers['name/code']], accessory_width: workbook.row(row)[headers['width']],
         job_material: workbook.row(row)[headers['accessory description']], job_handle: workbook.row(row)[headers['handle']], 
         accessory_depth: workbook.row(row)[headers['depth']], accessory_height: workbook.row(row)[headers['height']], accessory_price: workbook.row(row)[headers['unit price']], 
         accessory_quantity: workbook.row(row)[headers['quantity']], accessory_amount: workbook.row(row)[headers['amount']], job_type: "accessory", imported_file_type: "1QuoteForm", image: encoded_data
        }
      elsif job_type.present? && job_type == "door" && !workbook.row(row)[0].in?(index_arr)
        data_json = { space:  @space, door_style_code: workbook.row(row)[headers['style code']],door_width: workbook.row(row)[headers['width']],
          job_material: workbook.row(row)[headers['门板材料']], job_handle: workbook.row(row)[headers['handle']],
          door_depth: workbook.row(row)[headers['depth']], door_height: workbook.row(row)[headers['height']], door_quantity: workbook.row(row)[headers['quantity']],
          door_price: workbook.row(row)[headers['price difference']], door_amount: workbook.row(row)[headers['amount']], job_type: "door", imported_file_type: "1QuoteForm", image: encoded_data
        }
      end
      if data_json.present?
        begin
          @quotation.shangpin_jobs.create!(data_json)
        rescue StandardError => e
          @errors.push ShangpinImportModule::ShangpinImportError.new(job_type, e, row).message_hash
        end
      end
    end 
    @errors
  end

  def read_door_quote_excel
    workbook = @workbook
    headers = Hash.new
    
    job_type = ""
    total_value = 0
    
    ((workbook.first_row)..workbook.last_row).each do |row|
      (0..workbook.row(row).length).each do |column|
        if workbook.row(row)[column] == "Total Price"
          total_amount = workbook.row(row)[column+1]
          begin
            @quotation.shangpin_jobs.create(door_price: total_amount, door_amount: total_amount,job_type: "sliding_door", space: @space,  imported_file_type: "1DoorQuoteForm")
          rescue StandardError => e
            @errors.push ShangpinImportModule::ShangpinImportError.new("sliding_door", e, row).message_hash
          end
          return @errors
        end
      end
    end
    @errors
  end

  def read_wardrobe_set_quote_excel
    workbook = @workbook
    headers = Hash.new
    
    job_type = ""
    total_value = 0
    wardrobe_price = nil
    door_price = nil
    ((workbook.first_row)..workbook.last_row).each do |row|
      (0..workbook.row(row).length).each do |column|
        if workbook.row(row)[column] == "Price of wardrobe"
          wardrobe_price = workbook.row(row)[column+4]
          begin
            @quotation.shangpin_jobs.create(wardrobe_price: wardrobe_price, wardrobe_amount: wardrobe_price,job_type: "wardrobe", space: @space, imported_file_type: "1WardrobeSetQuoteForm")
          rescue StandardError => e
            @errors.push ShangpinImportModule::ShangpinImportError.new("wardrobe", e, row).message_hash
          end
        elsif workbook.row(row)[column] == "Price of sliding doors"
          door_price = workbook.row(row)[column+4]
          begin
            @quotation.shangpin_jobs.create(door_price: door_price, door_amount: door_price,job_type: "sliding_door", space: @space,  imported_file_type: "1WardrobeSetQuoteForm")
          rescue StandardError => e
            @errors.push ShangpinImportModule::ShangpinImportError.new("sliding_door", e, row).message_hash
          end
        end
        if wardrobe_price.present? && door_price.present?
          return @errors
        end
      end
    end
    @errors
  end


end
