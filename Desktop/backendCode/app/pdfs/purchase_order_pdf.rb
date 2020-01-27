class PurchaseOrderPdf < Prawn::Document
  def initialize(purchase_order, user=nil)
    super()
    set_fallback_font
    @purchase_order = purchase_order
    @project = purchase_order.project || @purchase_order.quotation.project
    @purchase_elements = @purchase_order.purchase_elements.joins(:unscoped_job_element_vendor).where(job_element_vendors: {added_for_partial_dispatch: false})
    @vendor = purchase_order.vendor
    @current_user = user
    set_other_elements
    generate_order
  end

  # this font enable acceptance of chineese character in pdf
  def set_fallback_font
    open_sans = "lib/prawn_fonts/OpenSans-Regular.ttf"
    kai = "lib/prawn_fonts/gkai00mp.ttf"
    font_families.update(
        "kai" => {
          :normal => { :file => kai, :font => "Kai" },
          :bold   => kai,
          :italic => kai,
          :bold_italic => kai
         },
        "open_sans" => {
          :normal => { :file => open_sans, :font => "OpenSans" },
          :bold   => open_sans,
          :italic => open_sans,
          :bold_italic => open_sans
        }   
      ) 
    self.fallback_fonts ['kai', 'open_sans']
  end

  def generate_order
       # title
     title = [["Purchase Order"]]
     table(title, :row_colors => ["39FF14"]) do
       style(row(0), width: 540, :align => :center, :size => 8)
     end


     #company details and purchase order details
      address = "<b>Singularity Furniture Private Limited</b> \n B501/502, Everest House, Suren Road, Gundavali \n Andheri East, Mumbai - 400093 \nTel- 080-33947433"
      billing_details = @purchase_order.billing_address.present? ? "<b>Billing Address:</b> \n #{@purchase_order.billing_address} \n Contact Person         : #{@purchase_order.billing_contact_person}\n Contact Number         : #{@purchase_order.billing_contact_number}" : address
    company_details = "<b>Purchase Order No. : #{@purchase_order.reference_no}</b> \n Date                         : #{Date.today} \n Contact Person         : #{@purchase_order.contact_person} \n BOQ Number            : #{@purchase_order.quotation&.reference_number}"

        table([[billing_details, company_details]], :cell_style => { :inline_format => true })do
       style(row(0), width: 540, :align => :left, :size => 7)
       column(0).width = 300
       column(1).width = 240
     end



     #vendor and shipping details
    vendor_details = "<b>To</b>, \n <b>Consigner Name : #{@vendor&.name}</b> \n Consigner Address      : #{[@vendor&.address, @vendor&.city].join(", ")} \n Email ID   : #{@vendor&.email} \n Contact Name: #{@vendor&.contact_person} - #{@vendor&.contact_number} \n PAN No:#{@vendor&.pan_no} \n GST No: #{@purchase_order&.vendor_gst.present? ? @purchase_order&.vendor_gst : @vendor&.gsts&.first}"
    shipping_details = "<b>Shipping Address:</b> \n #{@purchase_order.shipping_address} \n Contact Person         : #{@purchase_order.contact_person}\n Contact Number         : #{@purchase_order.contact_number} \n <b>Lead: #{@project.lead.id}</b>"

    shipping_details = shipping_details
      table([[vendor_details, shipping_details ]], :cell_style => { :inline_format => true })do
       style(row(0), width: 540, :align => :left, :size => 7)
       column(0).width = 300
       column(1).width = 240
     end

     #items heading
       item_details_heading = [ ["<b>Sr No.</b>", "<b>Item Description</b>", "<b>UOM</b>", "<b>Qty</b>", "<b>Rate</b>", "<b>SGST (%)</b>", "<b>CGST (%)</b>", "<b>IGST (%)</b>", "<b>Amount</b>", "<b>SGST Amt</b>", "<b>CGST Amt</b>", "<b>IGST Amt</b>"]]
       sn_no = 1

       # club ALL sli as per logic in clubbed view of PO release (originally in FjaPoLineItemsSerializer)
       @clubed_job_elements = @purchase_elements.includes(unscoped_job_element_vendor: :unscoped_job_element).group_by do |pe|
        jev = pe.unscoped_job_element_vendor
        je = jev.unscoped_job_element
        # [je.vendor_product_id, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
        [je.vendor_product_id, je.element_name.split("$clone$")[0], je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type]
       end
       @clubed_job_elements.each do |common_values, clubbed_slis|
          tax_type = common_values[6]
          tax_percent = common_values[5]
          vp = VendorProduct.find_by_id(common_values[0])
          sample_pe = clubbed_slis[0]
       	  quantity = clubbed_slis.map{|pe| pe.unscoped_job_element_vendor.unscoped_job_element.quantity}.sum.round(2)

       	  if tax_type == "cgst_sgst"
						tax_value = tax_percent/2
						cgst_percent = tax_value
						sgst_percent = tax_value
						igst_percent = "N/A"
            cgst_sgst_amount = clubbed_slis.map{|pe| pe.unscoped_job_element_vendor&.cost.to_f * pe.unscoped_job_element_vendor&.quantity.to_f * tax_value/100.0}.sum.round(2)
						# cgst_sgst_amount = ((job_element_vendor.cost * job_element_vendor.quantity) * tax_value) / 100 rescue 0
						# cgst_sgst_amount = cgst_sgst_amount.round(2)
						igst_amount = "N/A"
				  else
						cgst_percent = "N/A"
						sgst_percent = "N/A"
					  igst_percent = tax_percent.to_f
					  cgst_sgst_amount = "N/A"
            igst_amount = clubbed_slis.map{|pe| pe.unscoped_job_element_vendor&.cost.to_f * pe.unscoped_job_element_vendor&.quantity.to_f * igst_percent/100.0}.sum.round(2)
						# igst_amount = ((job_element_vendor.cost * job_element_vendor.quantity )* igst_percent) / 100 rescue 0
						# igst_amount = igst_amount.round(2)
				  end
				  amount = clubbed_slis.map{|pe| pe.unscoped_job_element_vendor.final_amount.to_f}.sum
          item_details_heading << [
            sn_no, 
            common_values[1]&.humanize,
            VendorProduct::UNITS.key(common_values[2]) || common_values[2].to_s.humanize,
            quantity, 
            sample_pe.unscoped_job_element_vendor&.cost.to_f.round(2), 
            sgst_percent, 
            cgst_percent,
            igst_percent, 
            amount.to_f.round(2), 
            cgst_sgst_amount.to_f.round(2), 
            cgst_sgst_amount.to_f.round(2), 
            igst_amount.to_f.round(2)
          ]

          sn_no = sn_no + 1
	     end
       table(item_details_heading, :cell_style => { :inline_format => true })do
       style(row(0..sn_no), width: 540, :align => :left, :size => 7)
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

       #total in words and sub total
     total_heading = [ [ "<b>Rupees in words:</b> #{@grand_total.to_words.capitalize} only", "<b>Sub Total</b>", "Rs.#{@subtotal_amount.round(2)}"]]

       table(total_heading, :cell_style => { :inline_format => true })do
       style(row(0), width: 540, :align => :left, :size => 7)
       column(0).width = 325
       column(1).width = 70
       column(2).width = 145
     end

     #round off and grand total area
     total_sub_heading = [ [{:content => "", :rowspan => 2}, "<b>Round off</b>", "Rs.#{@round_off_amount}"],
                           ["<b>Grand Total</b>", "Rs.#{@grand_total}"]
                          ]
       table(total_sub_heading, :cell_style => { :inline_format => true })do
       style(row(0), width: 540, :align => :left, :size => 7)
       style(row(1), width: 540, :align => :left, :size => 7)
       column(0).width = 325
       column(1).width = 70
       column(2).width = 145
     end


      #terms and conditions area
      description = "<b>Terms and Conditions</b><br>1) The Above Rates & Included Material with Labour. (Only Kitchen Wall Tiles, 3D Stone Design Tile & Quartz)."
      count = 2
      @purchase_order.milestones.each do |milestone|
          description = description+"<br>#{count}) #{milestone.percentage_amount}% #{milestone.description}, expected payment date: #{milestone&.estimate_date&.strftime('%d-%m-%Y')}"
          count += 1
      end
      description = description+"<br>#{count}) Bill Chalan Should be Mentioned The Relevant PO No. & Date."

      count += 1
      description = description+"<br>#{count}) Delivery Chalan Should be Signed by the Site Engineer/Site Supervisor."

      count += 1
      description = description+"<br>#{count}) Bill Should be Prepared in Favour of 'Singularity Furniture Private Limited'"

      t_and_c = [[ description ]]

     table(t_and_c, :cell_style => { :inline_format => true }) do
       style(row(0), width: 540, :align => :left, :size => 7)
     end

       # authorized and signature area
     signature_box = [[ "<b>Raised By:</b> #{@current_user&.name}                                                                                                                                                  <b>For Singularity Furniture Private Limited</b>
                        <br>
                        <br>
                  <b>Accounts Approval:</b>                                                                                                                                                                                    <b>Authorised Signatory</b>" ]]

     table(signature_box, :cell_style => { :inline_format => true }) do
       style(row(0), width: 540, :align => :left, :size => 7)
     end

     #footer
     table_footer = [["Subject to Mumbai Jurisdiction"]]

     table(table_footer) do
       style(row(0), width: 540, :align => :center, :size => 7)
     end
  end

  def set_other_elements
    @subtotal_amount = 0
    @purchase_elements.each do |purchase_element|
      job_element_vendor = purchase_element.unscoped_job_element_vendor
      @subtotal_amount += job_element_vendor.final_amount
    end
      @round_off_amount = @subtotal_amount.round
      @grand_total = @round_off_amount
  end
end
