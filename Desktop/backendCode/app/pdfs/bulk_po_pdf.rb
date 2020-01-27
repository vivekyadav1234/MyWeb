class BulkPoPdf < Prawn::Document
	def initialize(po, user)
		super()
		@po = po
		@user = user
		@vendor = @po.wip_slis&.first&.vendor
		@slis = @po.wip_slis.uniq
		@total = 0.0
		title
		po_details
		line_items
		total_table
		round_off_table
		terms_and_conditions
		signature_box
		footer
	end

	def title
		title = [["Purchase Order"]]
    table(title, :row_colors => ["39FF14"]) do
      style(row(0), width: 540, :align => :center, :size => 8)
    end
	end

	def po_details
		billing_address = "Billing Address: \n #{@po.billing_address} \n Contact Person: #{@po.billing_contact_person} \n Contact Name: #{@po.billing_contact_number}"
		shipping_address = "Shipping Address: \n #{@po.shipping_address} \n Contact Person: #{@po.shipping_contact_person} \n Contact Name: #{@po.shipping_contact_number}"
		po_created_details = "PO Number: #{@po.po_name} \n Date: #{@po.created_at.in_time_zone('Asia/Kolkata').strftime("%d-%m-%Y")} \n Contact Person: #{@po.shipping_contact_person}\n"
		vendor_details = "To, \n Consigner Name: #{@vendor&.name} \n Consigner Address: #{@vendor&.address} \n Email ID:  #{@vendor&.email} \n Contact Name: #{@vendor&.contact_person} \n PAN No: #{@vendor&.pan_no} \n GST No: #{@po.vendor_gst.present? ? @po.vendor_gst : @vendor&.gst_reg_no}"
		po_created_details = po_created_details + "\nLead ID: #{@po.lead_id}\n Lead Name: #{@po.lead&.name}" if @po.lead_id.present?
		table([[billing_address, po_created_details], [vendor_details, shipping_address]]) do
      (0..2).each do |r|
	      style(row(r), width: 540, font: "Helvetica", :style => :bold, :align => :left, :size => 8)
	    end
	    column(0).width = 300
	    column(1).width = 240
    end
	end

	def line_items
		header = ["Sr No", "Item Description", "UOM", "Qty", "Rate", "SGST (%)", "CGST (%)", "IGST (%)", "Amount", "SGST", "CGST", "IGST"]
		body_arr = [header]
		@slis.each_with_index do |sli, i|
			sli_name = sli.vendor_product.present? ? sli.vendor_product.sli_name : sli.name
			sli_uom =  sli.vendor_product.present? ? sli.vendor_product.unit.humanize : sli.unit.humanize
			sli_qty = sli.quantity
			sli_rate = sli.vendor_product.present? ? sli.vendor_product.rate : sli.rate
			sli_sgst = sli.tax_type == "cgst-sgst" ? (sli.tax.to_f/2).round(2) : "N/A"
			sli_cgst = sli.tax_type == "cgst-sgst" ? (sli.tax.to_f/2).round(2) : "N/A"
			sli_igst = sli.tax_type == "igst" ? sli.tax : "N/A"
      product_amount = sli_rate * sli_qty
			sgst_amount = sli.tax_type == "cgst-sgst" ? ((product_amount*(sli.tax.to_f/2)/100).round(2)) : "N/A"
			cgst_amount = sli.tax_type == "cgst-sgst" ? ((product_amount*(sli.tax.to_f/2)/100).round(2)) : "N/A"
			igst_amount = sli.tax_type == "igst" ? ((product_amount*(sli.tax.to_f)/100).round(2)) : "N/A"
			arr = [i+1, sli_name.encode('cp1252'), sli_uom, sli_qty, sli_rate, sli_sgst, sli_cgst, sli_igst, product_amount&.round(2), sgst_amount, cgst_amount, igst_amount]
      amount = (product_amount.to_f + cgst_amount.to_f + sgst_amount.to_f + igst_amount.to_f).round(2)
			@total += amount
			body_arr.push(arr)
		end
		count = @slis.count
		table(body_arr, :cell_style => { :inline_format => true })do
       style(row(0..count), width: 540, :align => :left, :size => 7)
       column(0).width = 30
       column(1).width = 155
       column(2).width = 35
       column(3).width = 35
       column(4).width = 35
       column(5).width = 35
       column(6).width = 35
       column(7).width = 35
       column(8).width = 40
       column(9).width = 35
       column(10).width = 35
       column(11).width = 35
    end
	end

	def total_table
		@round_off_total = @total.round
    total_heading = [ [ "Rupees in words: #{@round_off_total.to_words.capitalize} only", "Sub Total", "Rs.#{@total.round(2)}"]]
		table(total_heading) do
    	style(row(0), width: 540, :align => :center, :size => 8)
    	column(0).width = 325
      column(1).width = 70
      column(2).width = 145
    end
	end

	def round_off_table
		@round_off_total = @total.round
		sub_total_heading = [ [{:content => "", :rowspan => 2}, "Round off", "Rs.#{@round_off_total}"],
                           ["Grand Total", "Rs.#{@round_off_total}"]
                          ]
		table(sub_total_heading) do
    	style(row(0), width: 540, :align => :center, :size => 8)
    	style(row(1), width: 540, :align => :center, :size => 8)
    	column(0).width = 325
      column(1).width = 70
      column(2).width = 145
    end
	end

	def terms_and_conditions
		terms_and_condition = [["Terms and Conditions
			1) The Above Rates & Included Material with Labour. (Only Kitchen Wall Tiles, 3D Stone Design Tile & Quartz).
			2) Bill Chalan Should be Mentioned The Relevant PO No. & Date.
			3) Delivery Chalan Should be Signed by the Site Engineer/Site Supervisor.
			4) Bill Should be Prepared in Favour of 'Singularity Furniture Private Limited"]]

    table(terms_and_condition) do
      style(row(0), width: 540, :align => :left, :size => 7)
    end
	end

	def signature_box
		signature_box = [[ "Raised By: #{@user&.name}                                                                                                                                                  For Singularity Furniture Private Limited
                  	 \n \n Accounts Approval:                                                                                                                                                                                    Authorised Signatory" ]]

    table(signature_box, :cell_style => { :inline_format => true }) do
      style(row(0), width: 540, :align => :left, :size => 7)
    end
	end

	def footer
		table_footer = [["Subject to Mumbai Jurisdiction"]]
     table(table_footer) do
       style(row(0), width: 540, :align => :center, :size => 7)
     end
	end
end
