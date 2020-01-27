class CatalogPdf < Prawn::Document
	require 'open-uri'
	def initialize()
		super(page_size: [719.53, 400.64])
		@image = Rails.root.join("public","Logoresized.png")
		@products = Product.all
		front_page	
		@products.find_each do |product|
			start_new_page
			product_page(product)	
		end
	end

	def front_page
		  move_down 110
		  image @image, position: :center, :scale => 0.3
		  move_down 5
		  # fill_color "a5a5a5"
		  font("Helvetica") do
		 		text "Catalog Range", align: :center, size: 25, color: "a5a5a5" 
		  end
	end

	def product_page(product)
		#for images

		begin
			product_image =  product.product_image.url == "/images/original/missing.png" ? Rails.root.join("public","nothing_to_show.png") :  open("https:#{product.product_image.url}")
		rescue OpenURI::HTTPError => error
			product_image = Rails.root.join("public","No_Image_Available.png")
		end 

		bounding_box([0, 320], :width => 310, :height => 320) do
			bounding_box([5, 310], :width => 300, :height => 310) do
			  text "#{product.name}", align: :center, size: 15, color: "000000", font: ""
			  move_down 20

				image product_image, position: :center, :fit => [300, 150] if product_image.present?
			  move_down 10
			  font "/Library/Fonts/Arial Unicode.ttf"
			  text "Rs.#{product.sale_price}", align: :center, size: 15, color: "000000", font: ""
			end
		end

		#for Descriptions
		bounding_box([315, 320], :width => 310, :height => 320) do
		 	bounding_box([5, 310], :width => 300, :height => 310) do
			  text "SKU Code: #{product.unique_sku}", align: :center, size: 15, color: "000000", font: ""
			  move_down 50
			  text "•Color: #{product.color}", size: 9, color: "a5a5a5"
			  text "•Configuration: #{product.product_config}", size: 9, color: "a5a5a5"
			  text "•Measurement Unit: #{product.measurement_unit}", size: 9, color: "a5a5a5"
			  text "•Lead Time: #{product.lead_time}", size: 9, color: "a5a5a5"
			  text "•Finish: #{product.finish}", size: 9, color: "a5a5a5"
			  text "•Dimension Remark: #{product.dimension_remark}", size: 9, color: "a5a5a5"
			  text "•Dimension(mm): #{product.width}x#{product.length}x#{product.height}", size: 9, color: "a5a5a5"
			  text "•Material: #{product.material}", size: 9, color: "a5a5a5"
			  text "•Remarks: #{product.remark}", size: 9, color: "a5a5a5"
			  text "•Warranty: #{product.warranty}", size: 9, color: "a5a5a5"
			end
		end
		
	end
end