class PaymentReceiptPdf < Prawn::Document
  def initialize(payment, info)
    super()
    @payment = payment
    @info = info
    arrivae_address
    amount_summary
    footer
  end


  def arrivae_address
    arrivae_address = "SINGULARITY FURNITURE PRIVATE LIMITED (MAHARASHTRA) \n OFFICE NO. 501 AND 502, 5TH FLOOR \n EVEREST HOUSE, 6 SUREN ROAD,ANDHERI EAST, \n MUMBAI SUBURBAN,MAHARASHTRA – 400 093 \n  State Name : Maharashtra, Code : 27 \n CIN: U67190MH2007PTC172485 \n E-Mail : finance@arrivae.com \n\n Receipt \n\n 
    No: #{@payment.id}                                                                                                                                                Date: #{@info[:date].strftime("%d-%m-%Y")}\n\n 
    Through: HDFC BANK - 3169 CURRENT A/C                                                                                                       .       \n"
    table([[arrivae_address]]) do
        style(row(0), width: 540, font: "Helvetica", :style => :bold, :align => :center, :size => 10)
    end
  end

  def amount_summary
    name_header = "Particular"
    amount_header = "Amount"
    user_name = "Account: \n                     #{@info[:customer_name]} \n\n\n\n\n\n\n\n\n\n\n\n Bank Transaction Details: \n\n #{@payment.mode_of_payment}          #{@info[:transaction_number]}          #{@info[:date].strftime("%d-%m-%Y")}         #{@info[:amount]} \n\n Amount (in words) : \n INR #{MoneyModule.to_words(@info[:amount]).titleize} Only"
    amount = @info[:amount]
    total = "Final Amount"
    table([[name_header, amount_header], [user_name, amount], [total, amount]]) do
      (0..2).each do |r|
        style(row(r), width: 540, font: "Helvetica", :style => :bold, :align => :left, :size => 10)
      end      
      column(0).width = 400
      column(1).width = 140
    end    
  end

  def footer
    signature = "\n\n\n\n.                                                                                                                                                            Authorised Signatory\n\n\n\n   Prepared by                                                                      Checked by                                                      Verified by\n\n\n"
    table([[signature]]) do 
      style(row(0), width: 540, font: "Helvetica", :style => :bold, :align => :left, :size => 10)      
    end
  end

end
