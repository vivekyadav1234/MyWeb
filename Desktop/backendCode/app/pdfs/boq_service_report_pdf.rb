class BoqServiceReportPdf < Prawn::Document
	def initialize(quotation, project)
		super()
		@quotation = quotation
		@project = quotation.project
		@lead = @project&.lead
		@designer = @project&.assigned_designer
		@service_totle = 0
		header_table
		move_down 10
		project_designer_details
		move_down 10
		@spaces = get_spaces.uniq
		spaces_table
		move_down 10
		total_table
		start_new_page
		termes_and_conditions
		move_down 10
		warranties
		@srNo = 0
	end

	def header_table

		address = "AZB Services LLP\n B501/502, Everest House, Suren Road, Gundavali \n Andheri East, Mumbai - 400093 \n022-39612435"
		inner_table = [["Date", Date.today],["Lead ID", @lead&.id],["BOQ Number", @quotation&.reference_number]]
		table([[{ content: "Service", colspan: 2 }], [address,inner_table]])do
     style(row(1).column(0).style :align => :center, :size => 10)
     style(row(0).column(0), font: "Courier", :style => :bold, :align => :center, :size => 20, :padding => [20, 10, 10, 20])
     # column(0).width = 160
	   # column(1).width = 160
	  end
	end

	def project_designer_details
		project_address = "#{@project&.name} \n#{@lead&.note_records.last&.location&.humanize.to_s}"
		table([["Name", @lead&.name, "Designer Name", @designer&.name&.humanize], ["Project Name and Address", project_address, "Designer Email", 'wecare@arrivae.com']])do
			(0..2).each do |r|
	      # row(r).height = 1
	      style(row(r), font: "Helvetica", :style => :bold, :align => :left, :size => 10)
	    end
	    column(0).width = 160
	    column(1).width = 160
	    column(2).width = 100
	    column(3).width = 120
		end
	end

	def get_spaces
		@quotation.spaces+@quotation.spaces_kitchen+@quotation.spaces_loose+@quotation.spaces_services+@quotation.spaces_custom
	end

	def spaces_table
		@spaces.each do |space|
			font("Helvetica") do
		    table_arrays = jobs_array_for_spaces(space)
		    font_size(10) {text "Space:- #{space}", :styles => [:bold]} if table_arrays.present?
		    move_down 10 if table_arrays.present?
		    if table_arrays.present?
		      table(table_arrays)do
		      	column(0).width = 50
				    column(1).width = 80
				    column(2).width = 120
				    column(3).width = 230
				    column(4).width = 60
				    style(row(0).style font: "Helvetica", :align => :center, :size => 10, :style => :bold)
				    (1..(table_arrays.size - 1)).each do |r|
				      style(row(r), font: "Helvetica", :style => :bold, :align => :left, :size => 8)
				    end
		      end
		    end
		    move_down 10
		  end
		end
	end

	def total_table
    @net_amount = @service_totle
    @service_totle -= (@service_totle * @quotation.discount_value_to_use)/100 if @quotation&.discount_value_to_use.present?
    discount_value = @quotation.discount_value_to_use
    management_fee = @quotation.service_pm_fee.round(2)
    total_amount = @service_totle + management_fee
    data_array = []
    data_array << ["Net Amount","#{@net_amount.to_f.round(2)}"]
    data_array << ["Discount Applied","#{discount_value} %"] if (discount_value > 0)
    data_array << ["Project Management Fee", "#{management_fee}"]
    data_array << ["Total",total_amount.round(2)]
		table(data_array, :position => 250)do
			style(row(0).style font: "Helvetica", :align => :center, :size => 10, :style => :bold)
			style(row(1).style font: "Helvetica", :align => :center, :size => 10, :style => :bold)
			style(row(2).style font: "Helvetica", :align => :center, :size => 10, :style => :bold)
			column(0).width = 200
		  column(1).width = 90
		end
	end

	def jobs_array_for_spaces(space)
		@srNo = 1
		space_table_head = ["Sr. No.", "Product", "Name", "Description", "Quantity"]
		service = service_for_space(space)
		final_array = []
		if service.present?
			final_array.push(space_table_head)
			service.map {|s| final_array.push(s)}
			return final_array
		else
			return nil
		end
	end


	def service_for_space(space)
		service_jobs = @quotation.service_jobs.where(space: space)

		serviceArray = []
		if service_jobs.present?
			service_jobs.each do |service_job|
			@service_totle += service_job&.amount.to_f
    		description = "Activity: #{service_job.service_activity&.name}"
				serviceArray.push([@srNo,"Service", service_job.service_activity&.service_subcategory&.name, description, service_job.quantity])
				@srNo += 1
			end
			serviceArray
		else
			nil
		end
	end

	def termes_and_conditions
	 	font("Helvetica") do
		  font_size(10) {text "Terms and Conditions", :styles => [:bold]}
		end
	 	move_down 10
	 	font("Helvetica") do
		  font_size(8) {text  "1) Prices are subject to the specifications mentioned above. Changes in specifications mentioned above shall be charged extra. Prices are inclusive of all taxes, landed at site. Any government levies, is payable extra at actual.
				2) Mathadi charge as per actual
				3) Payment Terms: 10% Booking, 40% on Final Design Submission and 50% PDC along with Final Design Submission
				4) Payment Mode: NEFT / RTGS / Cheque
				5) Bank Account Details:
				   Account Name: SINGULARITY FURNITURE PRIVATE LIMITED
				   Account Number: 02912000003169
				   IFSC Code: HDFC0000291
				   Bank and Branch: HDFC Bank, Nariman Point Branch

				6) Offer Validity: 30 Days
				7) Order once booked can not be taken back under any circumstances. Advance Amount will not be refunded
				8) Safe Storage at Site is client's responsibility
				9) Disputes subject to Mumbai Jurisdiction
				10) Any extra work shall be charged extra
				11) Force Majeure Clause Applies
				12) The seller shall have general lien over on goods for payments due to seller from the buyer on account of this or any other PAN Number: AAECP3450G
				    GST Number: 27AAECP3450G1ZJ"}
		end
	end

	def warranties
	#  	font("Helvetica") do
	# 	  font_size(10) {text "Warranties", :styles => [:bold]}
	# 	end
	#  	move_down 10
	#  	font("Helvetica") do
	#   font_size(8) {text  "For BWP Ply Carcass and Shutters, we offer 10 Year Warranty against Manufacturing Defect For BWR Play Carcass and Shutters, we offer 5 Year Warranty against Manufacturing Defect For MDF Carcass and Shutters, we offer 3 Year Warranty against Manufacturing Defect
	# 					   				Warranty claims will not be entertained for the following
	# 										1) Commercial use of the Products
	# 										2) The product is installed, modified, repaired, maintained or disassembled by a party not authorized by Arrivae
	# 										3) Physical damage caused during installation of appliances or usage
	# 										4) Damage caused by water seepage, rusting due to weather and termite infection at site
	# 										5) Any malfunction resulting from exposure to dirt, sand, water, dropping, fire and/or shock
	# 										6) Direct heat effects on wooden components
	# 										7) Reckless usage and natural wear & tear
	# 										8) Damage caused by accidents
	# 										9) Warpage (bending) of shutters
	# 										10) Any malfunction resulting from inadequate safekeeping, storage at high temperatures or humidity
	# 										11) Color variations in cabinets are a natural occurrence due to species, age, character of cabinets and exposure to sunlight. For this reasons, new and/or
	# 												replacement cabinets may not match as displayed in samples or catalog. Such variation and changes are not considered defects
	# 										12) Any act of God, any natural occurrence, or any other act or circumstance beyond Arrivae’s control
	# 										13) Physical abuse, misuse, exposure to excessive heat, exposure to excessive moisture, exposure to excessive weight placed in, on, surrounding or attached to product, the use of solvents, abrasives, unsuitable cleaning agents or corrosives, improper maintenance, , scratches, scuffs, burns, stains, wipe marks on darker color or glossy or smoother surfaces etc
	# 										14) Incorrect cabinet / shutter / hardware / accessory / appliance installation
	# 										15) General fading and discoloration (exposure to direct sunlight should be avoided)
	# 										16) The product being used in applications that are not recommended by Arrivae
	# 										17) Incorrect or unsuitable structural, building, electrical, plumbing, gas, plastering, flooring, tiling and appliance installation or failure to comply with Indian and
	# 												local building and industry codes and standards and appliance manufacturer’s specifications, applicable to the environment in which Arrivae’s products are assembled and installed

	# 										Other Notes

	# 										1. Arrivae reserves right to replace or repair any damage product after inspection of damaged product
	# 										2. This warranty is not transferable
	# 										3. Warranty does not cover damages caused due to acts of God & Force majeure
	# 										4. Subject to Mumbai Jurisdiction

	# 										Do’s and Don’ts

	# 										Do’s

	# 										1. Read and understand mechanisms and limitation of hardware, appliances, lighting you are using inside the Kitchen / Wardrobe / Other Modular Furniture
	# 										2. Use the basket and hardware as per the guideline
	# 										3. Close the doors and drawers properly after using
	# 										4. In case of any leakage inside or around the Kitchen / Wardrobe / Other Modular Furniture, call skilled / professional personnel for repair
	# 										5. Always keep the sink area clean
	# 										6. Always keep the surface clean below the cabinet
	# 										7. In case of any oil stains, use soft cloth with mild detergent and lukewarm water
	# 										8. Immediately clean the shutter or basket if any food or spice falls on it to avoid strain
	# 										9. In case of any unusual movement / noise of drawer and shutter, please contact the respective franchise for inspection


	# 										Don’ts
	# 										1. Don’t clean the Kitchen / Wardrobe / Other Modular Furniture with the direct water or jet
	# 										2. Don’t use any chemical and acidic material for cleaning the Modular Furniture
	# 										3. Avoid direct collision between sharp object and shutter
	# 										4. Don’t lean or hang on open doors or drawers fronts
	# 										5. Don’t overload the cabinet and drawers exceeding the prescribed weight carrying capacity for each cabinet or drawers
	# 										6. Avoid direct heat"}
	# 	end
	end
end
