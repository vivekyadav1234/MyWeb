class LeadSalesReportPdf < Prawn::Document

	def initialize(lead, life_cycle_data)
		super()
		@lead = lead
		@life_cycle_data = life_cycle_data
		header_table
		move_down 20
		data_section
	end

	def header_table
		image = Rails.root.join("public","Logoresized.png")
		image image, position: :center, :scale => 0.3
		move_down 10
		table([["Client Sales Life Cycle Report - #{@lead.name.titleize}"]])do
			position = :center
			column(0).width = 500
    	style(row(0).column(0), font: "Courier", :style => :bold, :align => :center, :size => 10, :padding => [5, 5, 5, 5])
	  end
	end

	def data_section
		report_summary = []
		@life_cycle_data.each_with_index do |(k,v),index|
			if index == 0
				report_summary << [k.to_s, "Value"]
			else
				report_summary << [k.to_s, " "]
			end
			v.each do |k1,v1|
				if ([:"10% Stage", :"10-40% Stage"].include? k) and (k1 == :"Discount Approved") and (v1.present?) and (v1 > 0)
					report_summary << [k1.to_s,"#{v1}%"]
				else
					report_summary << [k1.to_s,(v1 || "-")]
				end
			end
		end
		table(report_summary, position: :center, cell_style: {align: :center, size: 10, style: :bold})do
			style(row(0).style :align => :center, :size => 12, :style => :bold, border: :none)
			style(row(5).style :align => :center, :size => 12, :style => :bold, border: :none)
			style(row(8).style :align => :center, :size => 12, :style => :bold, border: :none)
			style(row(13).style :align => :center, :size => 12, :style => :bold, border: :none)
			style(row(16).style :align => :center, :size => 12, :style => :bold, border: :none)
			style(row(28).style :align => :center, :size => 12, :style => :bold, border: :none)
			column(0).width = 250
		  column(1).width = 270
		end
	end
end
