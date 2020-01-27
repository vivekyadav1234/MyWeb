class PaymentInvoicePdf < Prawn::Document
  def initialize(payment_invoice, info)
    super()
    @payment_invoice = payment_invoice
    @info = info.present? ? info : {}
    title
    header_table
    buyer_detail
    shipping_detail
    invoice_labels
    amount_in_word
    tax_details
    tax_amount_in_word
    company_bank_detail
    declaration
  end

  def title
    image = Rails.root.join("public","ArrivaeLogo.png")    
    table([[{:image => image, :width => 195, :image_height => 40,:image_width => 155, :padding => [10,10,10,20]}, "Tax Invoice"]])do
      style(row(0).column(0).style :align => :left, :size => 10)
      style(row(0).column(1), font: "Courier", :style => :bold, :align => :center, :size => 30, :padding => [20, 10, 10, 20])
      column(0).width = 200
      column(1).width = 340
    end
  end

  def header_table
    invoice = "Invoice No:\n #{@payment_invoice.invoice_number}"
    date = "Date: \n #{Time.now.strftime("%d-%m-%Y")}"
    del_note = "Delivery Note: \n "
    mode_of = " Mode/Terms of Payment: \n"
    sup_info = "Supplier's Ref:\n\n "
    other_ref = " Other Reference(s):\n\n "
    address = "Singularity Furniture Private Limited \n 501 and 502, 5th Floor, Everest House, \n 6 Suren Road, Near W.E.H. Metro Station, \n Andheri (East), Mumbai 400 093 \n GSTIN/UIN: 27AAECP3450G1ZJ \n State Name : Maharashtra, Code : 27 \n CIN: U67190MH2007PTC172485"
    table([[address, [[{:content => invoice, :size => 10, width: 123}, {:content => date, :size => 10, width: 217}], [{:content => del_note, :size => 10}, {:content => mode_of, :size => 10}],[{:content => sup_info, :size => 10}, {:content => other_ref, :size => 10}]]]]) do
      style(row(0), font: "Helvetica", :style => :bold, :align => :left, :size => 10)
      column(0).width = 200
    end
  end

  def buyer_detail
    date = "Date: \n #{Time.now.strftime("%d-%m-%Y")}"
    buyer_no = "Buyer's Order No:      \n "
    buy_date = "Date:              \n #{@payment_invoice.updated_at.strftime("%d-%m-%Y")}"
    pos = "Place of Supply:      \n #{@info[:arrivae_billing_address].to_s}"
    dispatch = "Despatched through:      \n #{@info[:arrivae_dispatch_address].to_s}"
    destination = "Destination:              \n #{@info[:customer_shipping_address].to_s}" 
    buyer = "Buyer: \n #{@info[:customer_billing_name].to_s}\n #{@info[:customer_billing_address].to_s} \n GSTIN/UIN: \n #{@info[:customer_gst].to_s} \n State Name : \n"
    table([[buyer, [[{:content => buyer_no, :size => 10, width: 123}, {:content => buy_date, :size => 10, width: 217}], [{:content => pos, :size => 8, :colspan => 2}], [{:content => dispatch, :size => 8, :colspan => 2}], [{:content => destination, :size => 8, :colspan => 2}]]]]) do
      style(row(0), font: "Helvetica", :style => :bold, :align => :left, :size => 10)
      column(0).width = 200
    end 
  end

  def shipping_detail
    bill = "Bill of Lading/LR-RR No: \n"
    vehicle = "Motor Vehicle No:             \n"
    shipping_data = "Shipping Address:- \n #{@info[:customer_shipping_name].to_s} \n\n\n\n"
    table([[shipping_data, [[{:content => vehicle, :size => 10, width: 123}, {:content => bill, :size => 10, width: 217}], [{:content => "Terms of Delivery: \n\n", :size => 10, :colspan => 2}]]]]) do
      style(row(0), font: "Helvetica", :style => :bold, :align => :left, :size => 10)
      column(0).width = 200
    end 
  end

  def invoice_labels
    header = ["Sr No.", "Description of Goods", "HSN/SAC", "Quantity", "Unit Price", "per", "Disc. %", "Amount"] 
    body_arr = [header]
    @payment_invoice.child_invoices.each_with_index do |child_invoice, i|
      label = child_invoice.label
      hsn_code = child_invoice.hsn_code
      unit_price = child_invoice.amount
      amount = child_invoice.amount
      arr = [i+1, label, hsn_code,  1, unit_price.round(2), "", "" , amount.round(2)]
      body_arr.push(arr)
    end
    cgst_amount = @payment_invoice.amount.to_f * 0.09
    body_arr.push(["", "CGST","", "", 9, "%", "", cgst_amount.round(2)])
    sgst_amount = @payment_invoice.amount.to_f * 0.09
    body_arr.push(["", "SGST","", "", 9, "%", "", cgst_amount.round(2)])
    total_amount = @payment_invoice.amount.to_f + cgst_amount + sgst_amount
    body_arr.push(["", "Total", "", "", "", "", "", total_amount.round(2)])
    count = @payment_invoice.child_invoices.count
    table(body_arr, :cell_style => { :inline_format => true })do
       style(row(0..count), width: 540, :align => :left, :size => 10)
       column(0).width = 30
       column(1).width = 120
       column(2).width = 80
       column(3).width = 30
       column(4).width = 100
       column(5).width = 30
       column(6).width = 50
       column(7).width = 100
    end
  end

  def amount_in_word
    amount_charge = "Amount Chargeable (in words): \n#{MoneyModule.to_words(@payment_invoice.amount.to_f*1.18).humanize}"
    table([[amount_charge]]) do 
      style(row(0),  width: 540, font: "Helvetica", :style => :bold, :align => :left, :size => 10)
    end

  end

  def tax_details
    header = ["HSN/SAC", "Taxable Value", "CGST", "SGST", "Total Tax Amount"] 
    body_arr = [header]
    @payment_invoice.child_invoices.each_with_index do |child_invoice, i|
      hsn_code = child_invoice.hsn_code
      amount = child_invoice.amount
      cgst_amount = amount.to_f * 0.09
      arr = [hsn_code,  amount.round(2), cgst_amount.round(2).to_s + "(9%)", cgst_amount.round(2).to_s + "(9%)", (cgst_amount*2).round(2)]
      body_arr.push(arr)
    end
    body_arr.push(["Total", @payment_invoice.amount.round(2), "", "", (@payment_invoice.amount* 0.18).round(2)])
    count = @payment_invoice.child_invoices.count
    table(body_arr, :cell_style => { :inline_format => true }) do
      style(row(0..count), width: 540, :align => :left, :size => 10)
      column(0).width = 110
      column(1).width = 110
      column(2).width = 110
      column(3).width = 110
      column(4).width = 100
    end
  end

  def tax_amount_in_word
    amount_charge = "Tax Amount (in words): \n #{MoneyModule.to_words(@payment_invoice.amount.to_f * 0.18).humanize}"
    table([[amount_charge]]) do 
      style(row(0), width: 540, font: "Helvetica", :style => :bold, :align => :left, :size => 10)
    end
  end

  def company_bank_detail
    message =   "Whether tax is payable on reverse charge basis : NO                 Company's Bank Details 
    .                                                                                                    Bank Name : Hdfc Bank - 3169
    .                                                                                                    A/c No. : 02912000003169
    .                                                                                                    Branch & IFS Code : Nariman Point & HDFC0000291"
    table([[message]]) do 
      style(row(0),  font: "Helvetica", :style => :bold, :align => :left, :size => 10)
    end
  end
  
  def declaration
    message = "Company's PAN :    AAECP3450G                                                                          for Singularity Furniture Private Limited \n
    Declaration:  \n
    We declare that this invoice shows the actual price of the goods \n described and that all particulars are true and correct.                                                                        Authorised Signatory"
    table([[message]]) do 
      style(row(0), width: 540,  font: "Helvetica", :style => :bold, :align => :left, :size => 10)      
    end
  end 
end

