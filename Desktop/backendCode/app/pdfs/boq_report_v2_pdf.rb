class BoqReportV2Pdf < Prawn::Document
  require 'open-uri'
  def initialize(quotation, project, download_type)
    ### Remove :page_size => [900, 1200] | Use default for A4  595.28 x 841.89
    super(
      :page_size => [595, 842],:page_layout => :portrait,
      background: "#{Rails.root}/app/data/pdf_templates/default.png"
    )
    ### Create first template ###
    image "#{Rails.root}/app/data/pdf_templates/intro.png",
    :at => [-35, 806], width: 595, height: 842

    set_fallback_font
    @srNo = 0
    @summarySrNo = 1
    @annexure_loose_images = []
    @annexure_wardrobe_images = []
    @annexure_kitchen_images = []
    @annexure_extra_images = []
    @download_type = download_type
    @quotation = quotation
    @project = quotation.project
    @lead = @project&.lead
    @designer = @project&.assigned_designer
    @cm = @lead&.assigned_cm
    @service_totle = 0
    @spaces = get_spaces.uniq
    # Fill the first page
    render_basic_info
    all_report_details = fetch_pdf_details
    # header_table(all_report_details[:summary_sheet_pdf])
    # move_down 10
    # project_designer_details
    # move_down 10
    # @spaces = get_spaces.uniq

    # if download_type.include?("summary")
    #   # summary_table(all_report_details[:summary_sheet_pdf])
    #   # start_new_page
    #   # termes_and_conditions
    #   # move_down 10
    #   #warranties
    #   # delivery_period
    # end

    if download_type.include?("boq")
      # start_new_page
      boq_table(all_report_details[:boq_pdf])
      # move_down 10
      # total_table
    end

    if download_type.include?("annexure") && (@annexure_loose_images.present? ||
      @annexure_wardrobe_images.present? || @annexure_kitchen_images.present? ||
      @annexure_extra_images.present?)
      # start_new_page
      annexure_images_table
    end

    # spaces_table
    # if !download_type.include?("summary")
    #   # start_new_page
    #   termes_and_conditions
    #   move_down 10
    #   #warranties
    # end
    move_down 10
    header_table(all_report_details[:summary_sheet_pdf])
    termes_and_conditions
    move_down 10
    string = "#{@quotation&.reference_number} | Page <page> of <total>"
    # Green page numbers 1 to 7
    options = { :at => [bounds.left + 40, -92],
     :width => 250,
     :size => 8,
     :align => :left,
     :page_filter => (2..100),
     color: "9C9C9C",
     :start_count_at => 2}
    number_pages string, options
  end


  # this font enable acceptance of chineese character in pdf
  def set_fallback_font
    open_sans = "lib/prawn_fonts/OpenSans-Regular.ttf"
    kai = "lib/prawn_fonts/gkai00mp.ttf"
    roboto_black = "lib/prawn_fonts/Roboto/Roboto-Black.ttf"
    roboto_thin = "lib/prawn_fonts/Roboto/Roboto-Thin.ttf"
    roboto_italic = "lib/prawn_fonts/Roboto/Roboto-Italic.ttf"
    roboto_bold = "lib/prawn_fonts/Roboto/Roboto-Bold.ttf"
    roboto = "lib/prawn_fonts/Roboto/Roboto-Regular.ttf"
    font_families.update(
      "Roboto" => {
        :normal => { :file => roboto, :font => "Roboto" },
        :bold   => roboto_bold,
        :bolder   => roboto_black,
        :italic => roboto_italic,
        :bold_italic => roboto_italic
      },
      "Roboto Bold" => {
        :normal => { :file => roboto_bold, :font => "Roboto Bold" },
        :bold   => roboto_bold,
        :bolder   => roboto_black,
        :italic => roboto_italic,
        :bold_italic => roboto_italic
      },
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
    self.fallback_fonts ['Roboto','Roboto Bold','kai', 'open_sans']
  end

  def render_basic_info
    # 842
    # move_down 85
    # font_size(28) {text "#{@lead&.name}", :styles => [:bold], font: "Roboto" }
    formatted_text_box [{:text => "This is a Design",
        styles: [:normal],
        font: "Roboto",
        :size => 18,
        color: "000000",
        :align => :left
      }],
      :at => [40, 715],
      :width => 300,
      :align => :left

    fill_color "8F0020"
    formatted_text_box [{:text => "made by #{@lead&.name.squish.split(' ')[0]}",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 30,
        color: "8F0020",
        :align => :left
      }],
      :at => [40, 680],
      :width => 500,
      :size => 30,
      color: "8F0020",
      :align => :left

    formatted_text_box [{:text => "Quotation",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 12,
        color: "8F0020",
        :align => :left
      }],
      :at => [40, 620],
      :width => 300,
      :align => :left
    # Height 595/2 Row 1
    # move_down 145

    formatted_text_box [{:text => "BOQ #",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :left
      }],
      :at => [50, 518],
      :width => 100,
      # :size => 8,
      # color: "949494",
      :align => :left

    fill_color "000000"
    text_box "#{@quotation&.reference_number}",
      :at => [50, 505],
      :width => 100,
      :size => 12,
      :align => :left

    formatted_text_box [{:text => "CUSTOMER NAME",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :left
      }],
      :at => [225, 518],
      :width => 100,
      # :size => 8,
      # color: "949494",
      :align => :left

    text_box "#{@lead&.name}",
      :at => [225, 505],
      :width => 200,
      :size => 12,
      :align => :left

    formatted_text_box [{:text => "LEAD ID",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :right
      }],
      :at => [410, 518],
      :width => 95,
      # :size => 8,
      # color: "949494",
      :align => :right

    text_box "#{@lead&.id}",
      :at => [410, 505],
      :width => 95,
      :size => 12,
      :align => :right
    # font_size(9) {text "#{@quotation&.reference_number}", :styles => [:bold], font: "Roboto" }

    # Row 2
    # move_down 40
    formatted_text_box [{:text => "DESIGNER",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :left
      }],
      :at => [50, 465],
      :width => 100,
      # :size => 8,
      # color: "949494",
      :align => :left

    text_box "#{@designer&.name&.humanize}",
      :at => [50, 452],
      :width => 150,
      :size => 12,
      :align => :left

    formatted_text_box [{:text => "ADDRESS",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :left
      }],
      :at => [225, 465],
      :width => 100,
      # :size => 8,
      # color: "949494",
      :align => :left

    text_box "#{@project&.name} \n#{@lead&.note_records.last&.location&.humanize.to_s}",
      :at => [225, 452],
      :width => 200,
      :size => 12,
      :align => :left

    formatted_text_box [{:text => "CONTACT",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :right
      }],
      :at => [410, 465],
      :width => 95,
      # :size => 8,
      # color: "949494",
      :align => :right

    text_box "wecare@arrivae.com",
      :at => [410, 452],
      :width => 95,
      :size => 9,
      :align => :right
    # font_size(9) {text "#{@quotation&.reference_number}", :styles => [:bold], font: "Roboto" }

    # Row 3
    formatted_text_box [{:text => "C.M.",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :left
      }],
      :at => [50, 415],
      :width => 150,
      # :size => 8,
      # color: "949494",
      :align => :left

    text_box "#{@cm&.name&.humanize}",
      :at => [50, 402],
      :width => 150,
      :size => 12,
      :align => :left

    formatted_text_box [{:text => "DATE",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 8,
        color: "949494",
        :align => :right
      }],
      :at => [410, 405],
      :width => 95,
      # :size => 8,
      # color: "949494",
      :align => :right

    text_box "#{ @quotation&.created_at.strftime("%d-%m-%Y")}",
      :at => [410, 392],
      :width => 95,
      :size => 12,
      :align => :right

    # ARRIVAE ADDRESS
    formatted_text_box [{:text => "#{arrivae_address}",
        styles: [:normal],
        font: "Roboto",
        :size => 15,
        color: "949494"
      }],
      :at => [180, 77],
      :width => 390,
      # :size => 8,
      # color: "949494",
      :align => :left

    # text @quotation&.reference_number
  end

  def arrivae_address
    "B 501/502, Everest House, Suren Road, Gundavali,
    Andheri East, Mumbai, Maharashtra 400093
    022-48900151"
  end

  def header_table(all_report_details)
    start_new_page(
      # :template => "#{Rails.root}/app/data/pdf_templates/template.pdf",
      # :template_page => 2,
      top_margin: 130, bottom_margin: 0, left_margin: 0, right_margin: 0
    )
    image "#{Rails.root}/app/data/pdf_templates/summary.png",
    :at => [0, 842], width: 595, height: 842
    summary_table(all_report_details)

  end

  def project_designer_details
    project_address =  "#{@project&.name} \n#{@lead&.note_records.last&.location&.humanize.to_s}"
    table([["Name", @lead&.name, "Designer Name", @designer&.name&.humanize], ["Project Name and Address", project_address, "Designer Email", 'wecare@arrivae.com']])do
      (0..2).each do |r|
        # row(r).height = 1
        style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 10)
      end
      # column(0).width = 225
      # column(1).width = 225
      # column(2).width = 165
      # column(3).width = 195
    end
  end

  def get_spaces
    @quotation.spaces+@quotation.spaces_kitchen+@quotation.spaces_loose+@quotation.spaces_services+@quotation.spaces_custom+@quotation.spaces_custom_furniture
  end

  def fetch_pdf_details
    pdf_delails = {}

    pdf_delails[:summary_sheet_pdf] = [["NO", "SPACE", "ITEMS", "AMOUNTS"]]
    pdf_delails[:boq_pdf] = []
    @spaces.each do |space|
      font("Roboto") do
        table_arrays = jobs_array_for_spaces(space)
        format_summary_sheet(pdf_delails[:summary_sheet_pdf],table_arrays[:summary_final_prices], space) if table_arrays.present?
        pdf_delails[:boq_pdf].push({space: space, table_array: table_arrays[:boq_final_table]}) if table_arrays[:boq_final_table].present?  if table_arrays.present?
        # pdf_delails[:summary_sheet_pdf].push(
        # pdf_delails[:summary_sheet_pdf].push({space: space, table_array: table_arrays[:summary_final_prices]}) if table_arrays[:summary_final_prices].present?
      end
    end
    pdf_delails
  end

  def format_summary_sheet(summery_sheet,summary_final_prices, space)
    summary_final_prices.each do |summary_final_price|
      summery_sheet.push([@summarySrNo, space, summary_final_price[:section_name], summary_final_price[:section_price].round(2)])
      @summarySrNo += 1
    end
  end

  def summary_table(summary_table_details)
    @net_amount = @quotation&.net_amount #- @service_totle
    # discount_value = (@quotation.discount_status == "no_discount" && @quotation.parent_quotation.present?) ? @quotation.parent_quotation.discount_value.to_f : @quotation.discount_value.to_f
    discount_value = @quotation.discount_value_to_use
    summary_total_table = []
    management_fee = @quotation.total_pm_fee.round(2)
    total_amount = @quotation.total_amount
    summary_table_details.push([
      @summarySrNo,"",
      "Countertop \n #{@quotation.boq_global_configs.find_by(
      category: 'kitchen')&.countertop&.humanize}",
      "Rs #{@quotation.countertop_cost.round(2)}"]) if @quotation.countertop_cost.present? && @quotation.countertop_cost > 0.0

    summary_total_table.push(["Net Amount","Rs #{@net_amount.to_f.round(2)} "])
    summary_total_table.push(["Discount Applied","#{discount_value.round(2)} %"]) if discount_value > 0
    summary_total_table.push(["Project Management Fee","Rs #{management_fee}"])
    summary_total_table.push(["Total","Rs #{total_amount.round(2)}"])
    table(summary_table_details,:width => 595, :position => :center,
      :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
      position = :center
      column(0).width = 100
      column(-1).width = 110
      column(0).align = :center
      column(1..2).align = :left
      column(3).align = :center
      # column(1..3).width = 235
      style(row(0).style font: "Roboto Bold", :size => 8,
      :text_color => '949494',
      :padding => [0, 0, 12, 0])
      (1..(summary_table_details.size - 1)).each do |r|
        style(row(r), font: "Roboto", :style => :bold, :size => 8,
        :padding => [12, 0, 12, 0])
      end

    end
    move_down 10

    table(summary_total_table, :position => :right,
      :width => 218,
      :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
      style(row(0).style font: "Roboto Bold",
      :padding => [0, 0, 12, 0], :size => 8, :style => :bold)
      style(row(1).style font: "Roboto",
        :size => 8, :style => :bold)
      style(row(2).style font: "Roboto",
        :size => 8, :style => :bold)
      style(row(-1).style font: "Roboto Bold",
        :size => 8, :style => :bold)
      column(0).align = :left
      column(1).align = :right
      column(1).padding_right = 37
    end
  end

  def boq_table(boq_table_details)
    # move_down 10
    # font_size(15) {text "Quotation", :styles => [:bold], font: "Roboto" }
    # move_down 10

    boq_table_details.each_with_index do |space_table,index|
      img = "#{Rails.root}/app/data/pdf_templates/#{(index % 5) + 1}.png"
      start_new_page(
        :background => img,
        top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0
      )
      image img, :at => [0, 692], width: 595, height: 842

      fill_color "FFFFFF"
      text_box "#{space_table[:space].upcase}",
        :at => [10, 669],
        :width => 160,
        height: 40,
        size: 16,
        :overflow => :shrink_to_fit,
        :align => :right
      fill_color "000000"

      # font_size(10) {text "#{space_table[:space]}", :styles => [:bold]}
      begin
        table(space_table[:table_array],:width => 595, :position => :center,
          :cell_style => {:padding => [14, 0, 14, 0],:align => :center,
          border_color: "CCCCCC",
          borders: [:bottom]}) do
          # style(row(0).style font: "Roboto Bold", :text_color => '949494',  :size => 8, :padding => [5, 0, 5, 0])
          column(0).width = 50
          column(1).width = 80
          column(2).width = 120
          column(1..3).align = :left
          # column(3).width = 240
          # column(3).align = :left
          column(3).padding_left = 5
          column(3).padding_right = 5
          column(4).width = 80
          column(5).width = 80
          style(row(0).style font: "Roboto Bold", :text_color => '949494', :size => 8,
            :style => :bold, :padding => [0, 0, 12, 0])
          (1..(space_table[:table_array].size - 1)).each do |r|
            style(row(r), font: "Roboto",
            :size => 8
          )
          end
        end
      rescue StandardError => e
        # Dealing with chinese characters of custom furniture job which hasn't be handle by fallback fonts
        table_array = space_table[:table_array]
        table_array.each do |tb|
          tb[2] = tb[2].split(" ")[0]
        end
        table(table_array,:width => 595, :position => :center,
          :cell_style => {:padding => [14, 0, 14, 0],
          borders: [:bottom]}) do

          # style(row(0).style font: "Roboto Bold", :text_color => '949494', :size => 8, :padding => [5, 0, 5, 0])
          column(0).width = 50
          column(1).width = 80
          column(2).width = 120
          column(1..3).align = :left
          # column(3).width = 240
          # column(3).align = :left
          column(3).padding_left = 5
          column(3).padding_right = 5
          column(4).width = 80
          column(5).width = 80
          style(row(0).style font: "Roboto Bold", :text_color => '949494', :size => 8,
          :style => :bold, :padding => [0, 0, 12, 0])
          (1..(space_table[:table_array].size - 1)).each do |r|
           style(row(r), font: "Roboto",
            :size => 8
          )
          end
        end
      end
      move_down 10
    end
  end

  def annexure_images_table
    # move_down 10
    # font_size(15) {text "Annexure", :styles => [:bold], font: "Roboto" }
    # move_down 15
    rect_drawn = false
    start_new_page(
      top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0
    )
    fill_color "FFFFFF"
    text_box "ANNEXURE",
      :at => [10, 669],
      :width => 130,
      height: 40,
      size: 16,
      :overflow => :shrink_to_fit,
      :align => :right

    if @annexure_loose_images.present?
      y = cursor
      fill_color "E5E5E4"
      fill_rectangle [-50, y], 700, 50
      fill_color "000000"
      move_down 20
      # font_size(12) {text "Loose Furniture", :styles => [:bold], font: "Roboto" }
      text_box "Loose Furniture",
        :at => [50, y-30 ],
        :width => 350,
        height: 50,
        size: 12,
        :overflow => :shrink_to_fit,
        :align => :left
      move_down 20
      font_size 8

      loose_size = @annexure_loose_images.size
      table(@annexure_loose_images,:width => 590, :position => :center,
        :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
          column(0).width = 180
          column(1).width = 410
          column(1).valign = :center
          column(1).left_padding = 20
          column(1).right_padding = 20
          (0..(loose_size.size - 1)).each do |r|
            style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 8)
          end
      end
      move_down 15
      rect_drawn = true
    end

    if @annexure_wardrobe_images.present?
      if rect_drawn == true
        start_new_page(
          top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0
        )
        fill_color "FFFFFF"
        text_box "ANNEXURE",
          :at => [10, 669],
          :width => 130,
          height: 40,
          size: 16,
          :overflow => :shrink_to_fit,
          :align => :right
      end
      rect_drawn = true
      y = cursor
      fill_color "E5E5E4"
      fill_rectangle [-50, y], 700, 50
      fill_color "000000"
      move_down 20
      # font_size(12) {text "Wardrobe Addons", :styles => [:bold], font: "Roboto" }
      text_box "Wardrobe Addons",
        :at => [50, y-30 ],
        :width => 350,
        height: 50,
        size: 12,
        :overflow => :shrink_to_fit,
        :align => :left
      move_down 20
      font_size 8
      loose_size = @annexure_wardrobe_images.size
      table(@annexure_wardrobe_images,:width => 590, :position => :center,
        :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
          column(0).width = 180
          column(1).width = 410
          column(1).valign = :center
          column(1).left_padding = 20
          column(1).right_padding = 20
          (0..(loose_size.size - 1)).each do |r|
            style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 8)
          end
      end
      move_down 15
    end


    if @annexure_kitchen_images.present?
      if rect_drawn == true
        start_new_page(
          top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0
        )
        fill_color "FFFFFF"
        text_box "ANNEXURE",
          :at => [10, 669],
          :width => 130,
          height: 40,
          size: 16,
          :overflow => :shrink_to_fit,
          :align => :right
      end
      rect_drawn = true
      y = cursor
      fill_color "E5E5E4"
      fill_rectangle [-50, y], 700, 50
      fill_color "000000"
      move_down 20
      # font_size(12) {text "Kitchen Addons", :styles => [:bold], font: "Roboto" }
      text_box "Kitchen Addons",
        :at => [50, y-30 ],
        :width => 350,
        height: 50,
        size: 12,
        :overflow => :shrink_to_fit,
        :align => :left
      move_down 20
      font_size 8
      loose_size = @annexure_loose_images.size
      table(@annexure_kitchen_images,:width => 590, :position => :center,
        :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
          column(0).width = 180
          column(1).width = 410
          column(1).valign = :center
          column(1).left_padding = 20
          column(1).right_padding = 20
          (0..(loose_size.size - 1)).each do |r|
            style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 8)
          end
      end
      move_down 15
    end

    if @annexure_extra_images.present?
      if rect_drawn == true
        start_new_page(
          top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0
        )
        fill_color "FFFFFF"
        text_box "ANNEXURE",
          :at => [10, 669],
          :width => 130,
          height: 40,
          size: 16,
          :overflow => :shrink_to_fit,
          :align => :right
      end
      rect_drawn = true
      y = cursor
      fill_color "E5E5E4"
      fill_rectangle [-50, y], 700, 50
      fill_color "000000"
      move_down 20
      # font_size(12) {text "Extra Addons", :styles => [:bold], font: "Roboto" }
      text_box "Extra Addons",
        :at => [50, y-30 ],
        :width => 350,
        height: 50,
        size: 12,
        :overflow => :shrink_to_fit,
        :align => :left
      move_down 20
      font_size 8
      loose_size = @annexure_extra_images.size
      table(@annexure_extra_images,:width => 590, :position => :center,
        :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
          column(0).width = 180
          column(1).width = 410
          column(1).valign = :center
          column(1).left_padding = 20
          column(1).right_padding = 20
          (0..(loose_size.size - 1)).each do |r|
            style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 8)
          end
      end
      move_down 15
    end
  end

  def spaces_table
    @spaces.each do |space|
      font("Roboto") do
        table_arrays = jobs_array_for_spaces(space)
        font_size(10) {text "Space:- #{space}", :styles => [:bold]} if table_arrays.present?
        move_down 10  if table_arrays.present?
        if table_arrays.present?
          table(table_arrays,:width => 595, :position => :center,
            :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
            style(row(0).style font: "Roboto Bold", :text_color => '949494', :align => :center,
            :size => 8, :padding => [5, 0, 5, 0])
            column(0).width = 50
            column(1).width = 80
            column(2).width = 120
            # column(3).width = 230
            column(4).width = 60
            style(row(0).style font: "Roboto Bold", :text_color => '949494',
            :align => :center, :size => 8, :style => :bold)
            (1..(table_arrays.size - 1)).each do |r|
              style(row(r), font: "Roboto", :style => :bold, :align => :left, :size => 8)
            end
          end
        end
        move_down 10
      end
    end
  end

  def total_table
    # @net_amount = @quotation&.net_amount - @service_totle
    # #@service_totle -= (@service_totle * @quotation.discount_value)/100 if @quotation&.discount_value.present?
    # data_array = []
    # discount_value = (@quotation.discount_status == "no_discount" && @quotation.parent_quotation.present?) ? @quotation.parent_quotation.discount_value.to_f : @quotation.discount_value.to_f
    # data_array << ["Net Amount","#{@net_amount.to_f.round(2)} "]
    # data_array << ["Discount Applied","#{discount_value} %"] if (discount_value > 0)
    # total_amount = @net_amount - (@net_amount * discount_value/100 )
    # data_array << ["Total",total_amount.round(2)]
    # table(data_array,:width => 595, :position => :center,
    #   :cell_style => {:padding => [14, 0, 14, 0],:border_color=> "CCCCCC", borders: [:bottom]})do
    #   style(row(0).style font: "Roboto Bold", :text_color => '949494', :align => :center, :size => 10, :style => :bold)
    #   style(row(1).style font: "Roboto", :align => :center, :size => 10, :style => :bold)
    #   style(row(2).style font: "Roboto", :align => :center, :size => 10, :style => :bold)
    #   # column(0).width = 240
    #   column(1).width = 80
    # end
  end

  def jobs_array_for_spaces(space)
    @srNo = 1
    space_table_head = [
      "NO", "PRODUCT", "NAME",
      "DESCRIPTION",
      # "BOQ LABEL",
      "QUANTITY",
      "AMOUNT"
    ]
    @kitchen_type = ""
    boq_global_config = @quotation.boq_global_configs.find_by(category: 'kitchen')
    if boq_global_config&.civil_kitchen
      @kitchen_type = "Civil Kitchen"
    else
      @kitchen_type = "Modular Kitchen"
    end

    wardrobe = wardrobe_for_space(space)
    wardrobe_e = kitchen_extra_job(space, 'wardrobe')
    kitchen_w = kitchen_modulor_job(space, @kitchen_type)
    kitchen_e = kitchen_extra_job(space, 'kitchen')
    kitchen_a = kitchen_appliance_job(space)
    furniture = lose_furnitures_for_space(space)
    custom = custom_for_spaces(space)
    spaces_custom_furniture = spaces_custom_furniture_for_space(space)
    service = service_for_space(space)
    final_array = []
    summary_array = []
    if spaces_custom_furniture.present? || furniture.present? ||
      wardrobe.present? || kitchen_w.present? || kitchen_e.present? ||
      kitchen_a.present? || custom.present? || service.present?
      final_array.push(space_table_head)

      if wardrobe.present?
        wardrobe[:space_section_table].map {|w| final_array.push(w)}
        summary_array.push({section_name: "Wardrobe", section_price: wardrobe[:space_section_price]})
      end

      if wardrobe_e.present?
        wardrobe_e[:space_section_table].map {|we| final_array.push(we)}
        summary_array.push({section_name: "Wardrobe Extra", section_price: wardrobe_e[:space_section_price]})
      end

      if kitchen_w.present?
        kitchen_w[:space_section_table].map {|kw| final_array.push(kw)}
        summary_array.push({section_name: @kitchen_type, section_price: kitchen_w[:space_section_price]})
      end

      if kitchen_e.present?
        kitchen_e[:space_section_table].map {|ke| final_array.push(ke)}
        summary_array.push({section_name: "Kitchen Extra", section_price: kitchen_e[:space_section_price]})
      end

      if kitchen_a.present?
        kitchen_a[:space_section_table].map {|ka| final_array.push(ka)}
        summary_array.push({section_name: "Appliance", section_price: kitchen_a[:space_section_price]})
      end

      if furniture.present?
        furniture[:space_section_table].map {|f| final_array.push(f)}
        summary_array.push({section_name: "Furniture", section_price: furniture[:space_section_price]})
      end

      if spaces_custom_furniture.present?
        spaces_custom_furniture[:space_section_table].map {|f| final_array.push(f)}
        summary_array.push({section_name: "Custom Furniture", section_price: spaces_custom_furniture[:space_section_price]})
      end

      if custom.present?
        custom[:space_section_table].map {|c| final_array.push(c)}
        custom_element_name_list = custom[:space_section_table].map {|c| c[2]}.join("\/n")
        summary_array.push({section_name: "Custom Elements:\n#{custom_element_name_list}", section_price: custom[:space_section_price]})
      end

      if service.present?
        service[:space_section_table].map {|s| final_array.push(s)}
        service_element_name_list = service[:space_section_table].map {|c| c[2]}.join("\/n")
        summary_array.push({section_name: "Services", section_price: service[:space_section_price]})
      end
      return {boq_final_table: final_array, summary_final_prices:  summary_array}
    else
      return nil
    end
  end

  def spaces_custom_furniture_for_space(space)
    spaces_custom_furnitures = @quotation.shangpin_jobs.where(space: space)
    spaces_custom_furniture_array = []
    spaces_custom_furniture_price = 0
    if spaces_custom_furnitures.present?
      spaces_custom_furnitures.each do |spaces_custom_furniture|
        job = spaces_custom_furniture.job_type
        price_factor = spaces_custom_furniture.effective_factor
        if job == 'cabinet'
          spaces_custom_furniture_price += spaces_custom_furniture.amount * price_factor
          custom_furniture_name = "#{job.capitalize} \n Item: #{spaces_custom_furniture&.cabinet_item} \n Model No: #{spaces_custom_furniture&.cabinet_model_no}"
          description = "color: #{spaces_custom_furniture.cabinet_color}  \n Actual Size (wdh)(mm) : #{spaces_custom_furniture.cabinet_width}X#{spaces_custom_furniture.cabinet_depth}X#{spaces_custom_furniture.cabinet_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.cabinet_specific_door}"+
          " X #{spaces_custom_furniture.cabinet_specific_worktop}"+
          " X #{spaces_custom_furniture.cabinet_specific_leg}"+
          " \n Cabinate Door: #{spaces_custom_furniture.cabinet_door}"
          spaces_custom_furniture_array.push([
            @srNo,"Custom Furniture", custom_furniture_name,
            description,
            # spaces_custom_furniture.boq_labels.pluck("label_name").join(", "),
            spaces_custom_furniture.cabinet_quantity,
            "Rs #{spaces_custom_furniture.amount.round(2)}"
          ])
          @srNo += 1
        elsif job == 'door'
          spaces_custom_furniture_price += spaces_custom_furniture.amount * price_factor
          item = spaces_custom_furniture&.door_item ? spaces_custom_furniture&.door_item : spaces_custom_furniture.door_style_code
          custom_furniture_name = "#{job.capitalize} \n Item: #{item} \n Model No: #{spaces_custom_furniture&.door_model_no} \n "
          description = "Actual Size (wdh)(mm) : #{spaces_custom_furniture.door_width}X#{spaces_custom_furniture.door_depth}X#{spaces_custom_furniture.door_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}" +
          " X #{spaces_custom_furniture.job_spec_leg}" +
          " \n Handle: #{spaces_custom_furniture&.job_handle}" +
          " \n Material: " +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          spaces_custom_furniture_array.push([
            @srNo, "Custom Furniture",custom_furniture_name,
            description,
            # spaces_custom_furniture.boq_labels.pluck("label_name").join(", "),
            spaces_custom_furniture.door_quantity,
            "Rs #{spaces_custom_furniture.amount.round(2)}"
          ])
          @srNo += 1
        elsif job == 'accessory'
          spaces_custom_furniture_price += spaces_custom_furniture.amount * price_factor
          item = spaces_custom_furniture&.accessory_item ? spaces_custom_furniture&.accessory_item : spaces_custom_furniture.accessory_code
          custom_furniture_name = "#{job.capitalize} \n Item: #{item}  \n Model No: #{spaces_custom_furniture&.accessory_model_no}"
          description = "color: #{spaces_custom_furniture.accessory_color} \n Actual Size (wdh) : #{spaces_custom_furniture.accessory_width}X#{spaces_custom_furniture.accessory_depth}X#{spaces_custom_furniture.accessory_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}"+
          " X #{spaces_custom_furniture.job_spec_leg}"+
          " \n Handle: #{spaces_custom_furniture&.job_handle}"+
          " \n Material: #{spaces_custom_furniture&.job_material}" +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          spaces_custom_furniture_array.push([
            @srNo,"Custom Furniture", custom_furniture_name,description,
            # spaces_custom_furniture.boq_labels.pluck("label_name").join(", "),
            spaces_custom_furniture.accessory_quantity,
            "Rs #{spaces_custom_furniture.amount.round(2)}"
          ])
          @srNo += 1
        elsif job == 'sliding_door'
          spaces_custom_furniture_price += spaces_custom_furniture.amount * price_factor
          item = spaces_custom_furniture&.door_item ? spaces_custom_furniture&.door_item : spaces_custom_furniture.door_style_code
          custom_furniture_name = "Sliding Door \n Item: #{item} \n Model No: #{spaces_custom_furniture&.door_model_no} \n "
          description = "color: #{spaces_custom_furniture.door_color} \n Actual Size (wdh)(mm) : #{spaces_custom_furniture.door_width}X#{spaces_custom_furniture.door_depth}X#{spaces_custom_furniture.door_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}"+
          " X #{spaces_custom_furniture.job_spec_leg}"+
          " \n Handle: #{spaces_custom_furniture&.job_handle}"+
          " \n Material: #{spaces_custom_furniture&.job_material}" +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          spaces_custom_furniture_array.push([
            @srNo,"Custom Furniture",
            custom_furniture_name ,description,
            # spaces_custom_furniture.boq_labels.pluck("label_name").join(", "),
            spaces_custom_furniture.door_quantity,
            "Rs #{spaces_custom_furniture.amount.round(2)}"
          ])
          @srNo += 1
        elsif job == 'wardrobe'
          spaces_custom_furniture_price += spaces_custom_furniture.amount * price_factor
          spaces_custom_furniture_array.push([
            @srNo,"Custom Furniture",
            job.capitalize,"",
            # spaces_custom_furniture.boq_labels.pluck("label_name").join(", "),
            "",
            "Rs #{spaces_custom_furniture.amount.round(2)}"
          ])
          @srNo += 1
        else
          nil
        end
      end
      {space_section_table: spaces_custom_furniture_array, space_section_price: spaces_custom_furniture_price}
    else
      nil
    end
  end

  def lose_furnitures_for_space(space)
    loose_furnitures = @quotation.boqjobs.where(space: space)
    looseArray = []
    loosePrice = 0

    if loose_furnitures.present?
      loose_furnitures.each do |loose_furniture|
        product = loose_furniture.product
        description = "Dimention: #{product&.length}X#{product&.width}X#{product&.height} \n Material: #{product&.material} \n Finish: #{product&.finish}\n Color: #{product&.color}\n Fabric: #{loose_furniture&.product_variant&.name}"
        looseArray.push([
          @srNo,"Furniture", loose_furniture.name, description,
          # loose_furniture.boq_labels.pluck("label_name").join(", "),
          loose_furniture.quantity,
          "Rs #{loose_furniture.amount.round(2)}"
        ])
        loosePrice += loose_furniture.amount
        @srNo += 1
        # image =""
        if @download_type.include?("annexure")
          begin
          image = (product.product_image.url == "/images/original/missing.png") ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{product.product_image.url}"), image_height: 100, image_width: 100, position: :center}
          if product.product_image_content_type == "image/png"
            image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
          end
          rescue OpenURI::HTTPError => error
            image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
          rescue Prawn::Errors::UnsupportedImageType => error #for image_type : jpg
            image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
          end
          image_description = description+"\n Unique Code: #{product.unique_sku} \n Quantity: #{loose_furniture.quantity}"
          @annexure_loose_images.push([ image, image_description])
        end
        # [{:image => image_path}
      end
      {space_section_table: looseArray, space_section_price: loosePrice}

    else
      nil
    end
  end

  def wardrobe_for_space(space)
    wardrobe_jobs = @quotation.modular_jobs.where(space: space, category: "wardrobe")

    wardrobeArray = []
    wardrobePrice = 0

    if wardrobe_jobs.present?
      wardrobe_jobs.each do |wardrobe_job|
        if !wardrobe_job.combined_module_id.present? || wardrobe_job.combined
          if wardrobe_job.combined
            wardrobe_name = "#{wardrobe_job&.combined_door&.name}"
            description = "Sliding Door: #{wardrobe_job&.combined_door&.name}\n"
            wardrobeArray.push([
              @srNo,"Module Type- Combined", wardrobe_name, description,
              # wardrobe_job.boq_labels.pluck("label_name").join(", "),
              wardrobe_job.quantity,
              "Rs #{wardrobe_job.amount.round(2)}"
            ])
            wardrobe_job.modular_jobs.each do |combined_module|
              wardrobe_name = "Module Type: #{combined_module&.product_module&.module_type&.name.to_s}\n Module :#{combined_module&.product_module&.code.to_s}\n"
              if combined_module&.length.present?
                wardrobe_name += "Dimension: #{combined_module&.length}X#{combined_module&.breadth}X#{combined_module&.thickness}"
              else
                wardrobe_name += "Dimension: #{combined_module&.product_module&.width}X#{combined_module&.product_module&.depth}X#{combined_module&.product_module&.height}mm \n\n"
              end
              description = "Core Material: #{combined_module&.core_material.to_s}\n Shutter Material: #{combined_module&.shutter_material.to_s}\n Shutter Finish: #{combined_module&.shutter_finish.to_s}\n Shutter Shade Code: #{combined_module&.shutter_shade_code.to_s}\n\n"

              wardrobeArray.push([
                "","", wardrobe_name, description,
                # wardrobe_job.boq_labels.pluck("label_name").join(", "),
                wardrobe_job.quantity,
                ""
              ])
              if combined_module&.addons.present?
                addons = "Addons \n"
                combined_module&.addons.each do |addon|
                  job_addon = addon.job_addons.find_by(modular_job: combined_module)
                  addon_name = "\n Addons \n #{addon.name}"
                  description = "Code: #{addon.code} \n Specifications: #{addon&.specifications} \n Vendor SKU: #{addon&.vendor_sku}\n"
                  quantity = job_addon&.quantity
                  if @download_type.include?("annexure")
                    begin
                    image = addon.addon_image.url == "/images/original/missing.png" ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{addon.addon_image.url}"), image_height: 100, image_width: 100, position: :center}
                    if addon.addon_image_content_type == "image/png"
                      image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                    end
                    rescue OpenURI::HTTPError => error
                      image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                    rescue Prawn::Errors::UnsupportedImageType => error
                      image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                    end

                    image_description = description+"\n Specifications: #{addon.specifications} \n Make: #{addon&.brand&.name}"
                    @annexure_wardrobe_images.push([ image, image_description])
                  end
                  wardrobeArray.push([
                    "","", addon_name, description,
                    # wardrobe_job.boq_labels.pluck("label_name").join(", "),
                    job_addon&.quantity,
                    ""
                  ])
                end
                # description += addons
              end
            end
          else
            if wardrobe_job&.length.present?
              dimension = "#{wardrobe_job&.length}X#{wardrobe_job&.breadth}X#{wardrobe_job&.thickness}"
            else
              dimension = "#{wardrobe_job&.product_module&.width}X#{wardrobe_job&.product_module&.depth}X#{wardrobe_job&.product_module&.height}"
            end
            wardrobe_name = "Module Type: #{wardrobe_job&.product_module&.module_type&.name.to_s}  Module :#{wardrobe_job&.product_module&.code.to_s} \n Dimension: #{dimension}mm \n"
            description = "Core Material: #{wardrobe_job&.core_material.to_s}  Shutter Material: #{wardrobe_job&.shutter_material.to_s}  Shutter Finish: #{wardrobe_job&.shutter_finish.to_s}  Shutter Shade Code: #{wardrobe_job&.shutter_shade_code.to_s}, Number Exposed Sites: #{wardrobe_job&.number_exposed_sites}"

            wardrobeArray.push([
              @srNo,"Wardrobe", wardrobe_name, description,
              # wardrobe_job.boq_labels.pluck("label_name").join(", "),
              wardrobe_job.quantity,
              "Rs #{wardrobe_job.amount.round(2)}"
            ])
            if wardrobe_job&.addons.present?
              addons = "Addons \n"
              wardrobe_job&.addons.each do |addon|
                job_addon = addon.job_addons.find_by(modular_job: wardrobe_job)
                addons = "Code: #{addon.code} \n Specifications: #{addon.specifications} \n Vendor SKU: #{addon.vendor_sku}\n"
                if @download_type.include?("annexure")
                  begin
                  image = addon&.addon_image&.url == "/images/original/missing.png" ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{addon.addon_image.url}"), image_height: 100, image_width: 100, position: :center}
                  if addon.addon_image_content_type == "image/png"
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  end
                  rescue OpenURI::HTTPError => error
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  rescue Prawn::Errors::UnsupportedImageType => error
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  end

                  image_description = addons+"\n Specifications: #{addon.specifications} \n Make: #{addon&.brand&.name}"
                  @annexure_wardrobe_images.push([ image, image_description])
                end
                wardrobeArray.push([
                  "","", addon.name, addons,
                  # wardrobe_job.boq_labels.pluck("label_name").join(", "),
                  job_addon&.quantity,
                  ""
                ])

              end
              # description += addons
            end
          end
          # wardrobeArray.push([
          #   @srNo,"Wardrobe", wardrobe_name, description,
          #   # wardrobe_job.boq_labels.pluck("label_name").join(", "),
          #   wardrobe_job.quantity,
          #   "Rs #{wardrobe_job.amount}"
          # ])
          wardrobePrice +=  wardrobe_job.amount
          @srNo += 1
        end
      end
      {space_section_table: wardrobeArray, space_section_price: wardrobePrice}
    else
      nil
    end
  end

  def kitchen_modulor_job(space, kitchen_type)
    kitchen_jobs = @quotation.modular_jobs.where(space: space, category: "kitchen")

    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
			kitchen_jobs.each do |kitchen_job|
	      if kitchen_job&.length.present?
	        dimension = "#{kitchen_job&.length}X#{kitchen_job&.breadth}X#{kitchen_job&.thickness}"
	      else
	        dimension = "#{kitchen_job&.product_module&.width}X#{kitchen_job&.product_module&.depth}X#{kitchen_job&.product_module&.height}"
	      end
	      wardrobe_name = "Module Type: "+kitchen_job&.product_module&.module_type&.name.to_s+"  Module :"+kitchen_job&.product_module&.code.to_s + "\n Dimension: #{dimension}mm \n"
	      description = "Core Material: #{kitchen_job&.core_material.to_s}  Shutter Material: #{kitchen_job&.shutter_material.to_s}  Shutter Finish: "+kitchen_job&.shutter_finish.to_s+"  Shutter Shade Code: #{kitchen_job&.shutter_shade_code.to_s}  Number Exposed Sites: #{kitchen_job&.number_exposed_sites}"
        kitchenArray.push([
          @srNo,kitchen_type, wardrobe_name, description,
          # wardrobe_job.boq_labels.pluck("label_name").join(", "),
          kitchen_job.quantity,
          "Rs #{kitchen_job.amount.round(2)}"
        ])

        # description += "\n Addons \n"
        kitchen_job.job_addons.each do |job_addon|
            if job_addon.combination?
              job_addon.addon_combination.addons&.each do |addon|
                wardrobe_name = "Addons \n Name: #{addon&.name}"
                addons = "Slot: #{job_addon.slot} \n Code: #{addon&.code} \n Specifications: #{addon&.specifications} \n Vendor SKU: #{addon&.vendor_sku}\n"
                if @download_type.include?("annexure")
                  begin
                  image = ([ "/images/original/missing.png", nil].include? addon&.addon_image&.url) ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{addon.addon_image.url}"), image_height: 100, image_width: 100, position: :center}
                  if addon.addon_image_content_type == "image/png"
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  end
                  rescue OpenURI::HTTPError => error
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  rescue Prawn::Errors::UnsupportedImageType => error
                    image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                  end
                  image_description = addons + "\n Specifications: #{addon&.specifications} \n Make: #{addon&.brand&.name}"
                  @annexure_kitchen_images.push([ image, image_description])
                end
                # description = addons
                kitchenArray.push([
                  "","", wardrobe_name, addons,
                  # wardrobe_job.boq_labels.pluck("label_name").join(", "),
                  job_addon&.quantity,
                  ""
                ])
              end

            else
              addons = "Slot: #{job_addon.slot}\n Code: #{job_addon.addon&.code} \n Specifications: #{job_addon.addon&.specifications} \n Vendor SKU: #{job_addon.addon&.vendor_sku}\n "
              if @download_type.include?("annexure")
                begin
                image = ([ "/images/original/missing.png", nil].include? job_addon.addon&.addon_image&.url) ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{job_addon.addon.addon_image.url}"), image_height: 100, image_width: 100, position: :center}
                if job_addon.addon.addon_image_content_type == "image/png"
                  image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                end
                rescue OpenURI::HTTPError => error
                  image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                rescue Prawn::Errors::UnsupportedImageType => error
                  image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
                end
                image_description = addons+"\n Specifications: #{job_addon&.addon&.specifications} \n Make: #{job_addon&.addon&.brand&.name}"
                @annexure_kitchen_images.push([ image, image_description])
              end
              # description += addons
              kitchenArray.push([
                "","", "Addons \n Name: #{job_addon.addon&.name}", addons,
                # wardrobe_job.boq_labels.pluck("label_name").join(", "),
                job_addon&.quantity,
                ""
              ])
            end
        end
        # kitchenArray.push([
        #   @srNo, kitchen_type, wardrobe_name, description,
        #   # kitchen_job.boq_labels.pluck("label_name").join(", "),
        #   kitchen_job.quantity,
        #   "Rs #{kitchen_job.amount}"
        # ])
        kitchenPrice += kitchen_job.amount
        @srNo += 1
      end
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def kitchen_extra_job(space, category)
    kitchen_jobs = @quotation.extra_jobs.where(category: category).where(space: space)
    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
      kitchen_jobs.each do |kitchen_job|
        description = "Addons\n"
        addon_array = []
        if kitchen_job.addon.present?
          addon_array <<  {addon: kitchen_job.addon, quantity: kitchen_job.quantity}
        elsif kitchen_job.addon_combination.present?
          addon_array = kitchen_job.addon_combination.addon_combination_mappings.map do |mapping|
            {
              addon: mapping.addon,
              quantity: mapping.quantity * kitchen_job.quantity
            }
          end
        end
        kitchenArray.push([
          @srNo,"#{category.humanize}" + " Extra",
          kitchen_job&.name, description,
          # kitchen_job.boq_labels.pluck("label_name").join(", "),
          kitchen_job.quantity,
          "Rs #{kitchen_job.amount.round(2)}"
        ])
        addon_array.each do |addon_hash|
          addon = addon_hash[:addon]
          addon_info = "Code: #{addon.code} \n Specifications: #{addon&.specifications} \n Vendor SKU: #{addon&.vendor_sku}\n"
          if @download_type.include?("annexure")
            begin
              image = ([ "/images/original/missing.png", nil].include? addon.addon_image&.url) ? {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center} : {image: open("https:#{addon.addon_image.url}"), image_height: 100, image_width: 100, position: :center}
            rescue OpenURI::HTTPError => error
              image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
            rescue Prawn::Errors::UnsupportedImageType => error
              image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
            rescue StandardError => error
              image = {image: "#{Rails.root}/public/No_Image_Available.png", image_height: 100, image_width: 100, position: :center}
            end
            image_description = addon_info +"\n Specifications: #{addon&.specifications} \n Make: #{addon.brand&.name}"
            @annexure_extra_images.push([ image, image_description])
          end
          kitchenArray.push([
            "","#{category.humanize}" + " Extra",
            "Addons \n  Name: #{addon.name}",
            addon_info,
            # kitchen_job.boq_labels.pluck("label_name").join(", "),
            addon_hash[:quantity],
            ""
          ])
          # description += addon_info
        end if addon_array.present?
        # kitchenArray.push([
        #   @srNo,"#{category.humanize}" + " Extra",
        #   kitchen_job&.name, description,
        #   # kitchen_job.boq_labels.pluck("label_name").join(", "),
        #   kitchen_job.quantity,
        #   "Rs #{kitchen_job.amount}"
        # ])
        kitchenPrice += kitchen_job.amount
        @srNo += 1
      end
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def kitchen_appliance_job(space)
    kitchen_jobs = @quotation.appliance_jobs.where(space: space)

    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
      kitchen_jobs.each do |kitchen_job|
        @kitchen_appliance = kitchen_job.kitchen_appliance
        description = "Description: #{@kitchen_appliance.code} \n Vendor SKU: #{@kitchen_appliance.vendor_sku} \n Make: #{@kitchen_appliance.make} \n Specifications: #{@kitchen_appliance.specifications}"
        kitchenArray.push([
          @srNo,"Appliance", kitchen_job&.name, description,
          # kitchen_job.boq_labels.pluck("label_name").join(", "),
          kitchen_job.quantity,
          "Rs #{kitchen_job.amount.round(2)}"
        ])
        kitchenPrice += kitchen_job.amount
        @srNo += 1
      end
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def custom_for_spaces(space)
    custom_jobs = @quotation.custom_jobs.where(space: space)

    customArray = []
    customPrice = 0
    if custom_jobs.present?
      custom_jobs.each do |custom_job|
        customArray.push([
          @srNo,"Custom", custom_job&.custom_element&.name,
          "Dimension: #{custom_job&.custom_element&.dimension}\n Core Material: #{custom_job&.custom_element&.core_material}\n Finish: #{custom_job&.custom_element&.shutter_finish}",
          # custom_job.boq_labels.pluck("label_name").join(", "),
          custom_job.quantity,
          "Rs #{custom_job.amount.round(2)}"
        ])
        customPrice += custom_job.amount
        @srNo += 1
      end
      {space_section_table: customArray, space_section_price: customPrice}

    else
      nil
    end
  end

  def service_for_space(space)
    service_jobs = @quotation.service_jobs.where(space: space)

    serviceArray = []
    spaces_service_cost = 0
    if service_jobs.present?
      service_jobs.each do |service_job|
        spaces_service_cost += service_job.amount
        @service_totle += service_job&.amount.to_f
        description = "Activity: #{service_job.service_activity&.name}"
        serviceArray.push([@srNo,"Service", service_job&.name, description, service_job.quantity, "Rs #{service_job.amount.round(2)}"])
        @srNo += 1
      end
      {space_section_table: serviceArray, space_section_price: spaces_service_cost}
    else
      nil
    end
  end

  def termes_and_conditions
    start_new_page(top_margin: 130, bottom_margin: 150, left_margin: 0, right_margin: 0)
    image "#{Rails.root}/app/data/pdf_templates/t_and_c_blank.png",
    :at => [0, 692], width: 595, height: 842

    formatted_text_box [{:text => "Terms and Conditions",
        styles: [:bold],
        font: "Roboto Bold",
        :size => 9,
        color: "949494",
        :align => :left
      }],
      :at => [73, 558],
      :width => 150,
      :align => :left

    text_box "#{tnc_text}",
      :at => [73, 500],
      :width => 509,
      height: 400,
      size: 8,
      :overflow => :shrink_to_fit,
      :align => :left

    text_box "#{tnc_serial_number}",
      :at => [42, 500],
      :width => 509,
      height: 400,
      size: 8,
      :overflow => :shrink_to_fit,
      :align => :left

    delivery_period
    # start_new_page(top_margin: 130, bottom_margin: 150)
    # image "#{Rails.root}/app/data/pdf_templates/t_and_c_2.jpg",
    # :at => [0, 692], width: 595, height: 842
  end

  def tnc_text
    "Prices are subject to the specifications mentioned above. Changes in specifications mentioned above shall be charged extra.
             Prices are inclusive of all taxes, landed at site. Any government levies, is payable extra at actual.

     Mathadi charge as per actual

     Payment Terms: 10% Booking, 40% on Final Design Submission and 50% PDC along with Final Design Submission

     Payment Mode: NEFT / RTGS / Cheque

     Bank Account Details:
     Account Name: SINGULARITY FURNITURE PRIVATE LIMITED
     Account Number: 02912000003169
     IFSC Code: HDFC0000291
     Bank and Branch: HDFC Bank, Nariman Point Branch

     Offer Validity: 30 Days

     Order once booked can not be taken back under any circumstances. Advance Amount will not be refunded

     Safe Storage at Site is client's responsibility

     Disputes subject to Mumbai Jurisdiction

     Any extra work shall be charged extra

     Force Majeure Clause Applies

     The seller shall have general lien over on goods for payments due to seller from the buyer on account of this or any other
     PAN Number: AAECP3450G
     GST Number: 27AAECP3450G1ZJ"
  end

  def tnc_serial_number
    "1


     2

     3

     4

     5





     6

     7

     8

     9

     10

     11

     12"
  end

  def delivery_period
    # font("Roboto") do
    #   font_size(10) {text "delivery_period_text", :styles => [:bold]}
    # end
    text_box "#{13}",
      :at => [43, 210],
      # :width => 150,
      height: 40,
      size: 8,
      :overflow => :shrink_to_fit,
      :align => :left

    text_box "#{delivery_period_text}",
      :at => [73, 210],
      # :width => 150,
      height: 40,
      size: 8,
      :overflow => :shrink_to_fit,
      :align => :left

    draw_text "Customer Signature", :at => [417,100], :size => 8, :styles => [:bold], position: :center
    draw_text "- "*20, :at => [400,110], :size => 10, :styles => [:bold], position: :center
  end

  def delivery_period_text
    @quotation.delivery_tnc.to_s
  end

  def warranties
  #   font("Roboto") do
  #     font_size(10) {text "Warranties", :styles => [:bold]}
  #   end
  #   move_down 10
  #   font("Roboto") do
  #   font_size(8) {text  "For BWP Ply Carcass and Shutters, we offer 10 Year Warranty against Manufacturing Defect For BWR Play Carcass and Shutters, we offer 5 Year Warranty against Manufacturing Defect For MDF Carcass and Shutters, we offer 3 Year Warranty against Manufacturing Defect
  #                     Warranty claims will not be entertained for the following
  #                     1) Commercial use of the Products
  #                     2) The product is installed, modified, repaired, maintained or disassembled by a party not authorized by Arrivae
  #                     3) Physical damage caused during installation of appliances or usage
  #                     4) Damage caused by water seepage, rusting due to weather and termite infection at site
  #                     5) Any malfunction resulting from exposure to dirt, sand, water, dropping, fire and/or shock
  #                     6) Direct heat effects on wooden components
  #                     7) Reckless usage and natural wear & tear
  #                     8) Damage caused by accidents
  #                     9) Warpage (bending) of shutters
  #                     10) Any malfunction resulting from inadequate safekeeping, storage at high temperatures or humidity
  #                     11) Color variations in cabinets are a natural occurrence due to species, age, character of cabinets and exposure to sunlight. For this reasons, new and/or replacement cabinets may not match as displayed in samples or catalog. Such variation and changes are not considered defects
  #                     12) Any act of God, any natural occurrence, or any other act or circumstance beyond Arrivae’s control
  #                     13) Physical abuse, misuse, exposure to excessive heat, exposure to excessive moisture, exposure to excessive weight placed in, on, surrounding or attached to product, the use of solvents, abrasives, unsuitable cleaning agents or corrosives, improper maintenance, , scratches, scuffs, burns, stains, wipe marks on darker color or glossy or smoother surfaces etc
  #                     14) Incorrect cabinet / shutter / hardware / accessory / appliance installation
  #                     15) General fading and discoloration (exposure to direct sunlight should be avoided)
  #                     16) The product being used in applications that are not recommended by Arrivae
  #                     17) Incorrect or unsuitable structural, building, electrical, plumbing, gas, plastering, flooring, tiling and appliance installation or failure to comply with Indian and
  #                         local building and industry codes and standards and appliance manufacturer’s specifications, applicable to the environment in which Arrivae’s products are assembled and installed

  #                     Other Notes

  #                     1. Arrivae reserves right to replace or repair any damage product after inspection of damaged product
  #                     2. This warranty is not transferable
  #                     3. Warranty does not cover damages caused due to acts of God & Force majeure
  #                     4. Subject to Mumbai Jurisdiction

  #                     Do’s and Don’ts

  #                     Do’s

  #                     1. Read and understand mechanisms and limitation of hardware, appliances, lighting you are using inside the Kitchen / Wardrobe / Other Modular Furniture
  #                     2. Use the basket and hardware as per the guideline
  #                     3. Close the doors and drawers properly after using
  #                     4. In case of any leakage inside or around the Kitchen / Wardrobe / Other Modular Furniture, call skilled / professional personnel for repair
  #                     5. Always keep the sink area clean
  #                     6. Always keep the surface clean below the cabinet
  #                     7. In case of any oil stains, use soft cloth with mild detergent and lukewarm water
  #                     8. Immediately clean the shutter or basket if any food or spice falls on it to avoid strain
  #                     9. In case of any unusual movement / noise of drawer and shutter, please contact the respective franchise for inspection


  #                     Don’ts
  #                     1. Don’t clean the Kitchen / Wardrobe / Other Modular Furniture with the direct water or jet
  #                     2. Don’t use any chemical and acidic material for cleaning the Modular Furniture
  #                     3. Avoid direct collision between sharp object and shutter
  #                     4. Don’t lean or hang on open doors or drawers fronts
  #                     5. Don’t overload the cabinet and drawers exceeding the prescribed weight carrying capacity for each cabinet or drawers
  #                     6. Avoid direct heat"}
  #   end
  end
end
