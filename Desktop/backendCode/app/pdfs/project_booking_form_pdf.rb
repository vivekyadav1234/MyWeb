class ProjectBookingFormPdf < Prawn::Document
  require 'open-uri'
  def initialize(booking_form)
    super()
    
    build_form(booking_form)
  end

  def build_form(booking_form)
    font_families.update("arial-narrow" => {
                             :normal => Rails.root.join('public', 'fonts', 'arial-narrow.ttf').to_s,
                             :italic => Rails.root.join('public', 'fonts', 'arial-narrow-italic.ttf').to_s,
                             :bold => Rails.root.join('public', 'fonts', 'arial-narrow-bold.ttf').to_s,
                             :bold_italic => Rails.root.join('public', 'fonts', 'arial-narrow-bold-italic.ttf').to_s
    })
    indent -35 do
      images_array = ['1.jpg', '2.jpg', 'Arrivae_Welcome-1.png', 'Arrivae_Welcome-2.png', 'Arrivae_Welcome-3.png', 'Arrivae_Welcome-4.png', 
        'Arrivae_Welcome-5.png', 'Arrivae_Welcome-6.png', 'Arrivae_Welcome-7.png', 'Arrivae_Welcome-8.png', 'Arrivae_Welcome-9.png', 'Arrivae_Welcome-10.png',
       'Arrivae_Welcome-11.png']
      images_array.each_with_index do |image, index|
        filename = Rails.root.join('public', 'pdf_forms', 'booking_forms', image)
        
        # canvas do
        #   stroke_grid
        # end
        case index
          when 0
            image filename, :at => [0, 756], width: 610, height: 790
            text_box "#{booking_form.order_date.try{ |k| k.strftime("%d/%m/%Y")} }", size: 9, at: [85, 615] #order date
            text_box "#{booking_form.project.lead.name }", size: 9, at: [195, 597] #Project Name
            text_box "#{booking_form.order_value }", size: 9, at: [195, 557] #order value
            text_box "#{booking_form.flat_no }", size: 9, at: [85, 503] #Flat number
            text_box "#{booking_form.floor_no }", size: 9, at: [205, 503] #Floor number
            text_box "#{booking_form.building_name }", size: 9, at: [385, 503] #Building/Society Name
            text_box "#{booking_form.location }", size: 9, at: [95, 481] #Location
            text_box "#{booking_form.city }", size: 9, at: [300, 481] #City
            text_box "#{booking_form.pincode }", size: 9, at: [485, 488] #Pincode

            possession_x_cordinate = { less_than_90_days: 243, more_than_90_days: 353 }
            profession_x_cordinate = { salaried: 137, business: 209, other:  269}
            font Rails.root.join('public', 'fonts', 'arial-unicode-ms.ttf').to_s do
              text_box "\u2714", :at => [possession_x_cordinate[booking_form.possession_by.to_sym], 463], size: 8 if possession_x_cordinate[booking_form.possession_by&.to_sym].present?
              text_box "\u2714", :at => [profession_x_cordinate[booking_form.profession.to_sym], 440], size: 8  if profession_x_cordinate[booking_form.profession&.to_sym].present?
            end

            text_box "#{booking_form.designation }", size: 9, at: [137, 423] #Designation
            text_box "#{booking_form.company }", size: 9, at: [369, 423] #Company

            font Rails.root.join('public', 'fonts', 'arial-unicode-ms.ttf').to_s do
              case booking_form.professional_details
              when "it"
                text_box "\u2714", :at => [153, 397], size: 8
              when "ites/bpo"
                text_box "\u2714", :at => [227, 397], size: 8
              when "doctor"
                text_box "\u2714", :at => [286, 397], size: 8
              when "govt_services/psu"
                text_box "\u2714", :at => [396, 397], size: 8
              when "banking_and_finance"
                text_box "\u2714", :at => [125, 376], size: 8
              when "manufacturing/distribution"
                text_box "\u2714", :at => [258, 376], size: 8
              else
                text_box "#{booking_form.other_professional_details }", size: 9, at: [405, 374] #Other
              end
            end
            current_address = booking_form.current_address.try(:split,/\n/).try(:join, ", ")
            line_one = current_address.present? ? current_address[0,90] : " "
            line_two = current_address.present? ? current_address[91,110] : " "
            text_box "#{booking_form.landline }", size: 9, at: [95, 357] #Landline
            text_box "#{booking_form.primary_mobile }", size: 9, at: [290, 357] #Mobile1
            text_box "#{booking_form.secondary_mobile }", size: 9, at: [465, 357] #Mobile2
            text_box "#{booking_form.primary_email }", size: 9, at: [95, 340] #Email
            text_box "#{booking_form.secondary_email }", size: 9, at: [290, 340] #Email
            text_box "#{ line_one }", size: 9, at: [175, 287+35] #Address
            text_box "#{ line_two }", size: 9, at: [45, 267+35] #Address
            billing_address = booking_form.billing_address.try(:split,/\n/).try(:join, ", ")
            line_oneb = billing_address.present? ? billing_address[0,90] : " "
            line_twob = billing_address.present? ? billing_address[91,110] : " "
            text_box "#{ line_oneb }", size: 9, at: [120, 285] #Address
            text_box "#{ line_twob }", size: 9, at: [45, 265] #Address
            text_box "#{booking_form.gst_number}", size: 9, at:[100,243]
            text_box "#{booking_form.billing_name}", size: 9, at:[350,243]
            start_new_page if index != (images_array.length - 1)
          when 1
            image filename, :at => [0, 756], width: 610, height: 790
            start_new_page if index != (images_array.length - 1)
          when 2
            image filename, :at => [0, 756], width: 610, height: 790
            start_new_page( :layout => :landscape) if index != (images_array.length - 1)
          when 11
            image filename, :fit => [bounds.right, bounds.top]
            start_new_page( :layout => :portrait)  if index != (images_array.length - 1)
          when 12
            image filename, :at => [0, 756], width: 610, height: 790
          else
            image filename, :fit => [bounds.right, bounds.top]
            start_new_page( :layout => :landscape) if index != (images_array.length - 1)
          end
        
      end
    end
  end

end