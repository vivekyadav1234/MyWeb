class Api::V1::ProductionDrawingsController < Api::V1::ApiController
	load_and_authorize_resource :production_drawing
	before_action :set_production_drawing, only: [:destroy]

	# Create Production Drawings 
	# Basically it builds relationship between line items and uploaded files.
	def create
		if params[:production_drawings].present? || params[:production_drawings_to_delete].present?
			
			ProductionDrawing.where(id: params[:production_drawings_to_delete]).each do |production_drawing|
				production_drawing.destroy
			end if params[:production_drawings_to_delete].present?

			duplicate_message = ""
			params[:production_drawings].each do |production_drawing|
				begin
					@custom_elements = ProductionDrawing.create!(permited_params(production_drawing))
				rescue StandardError => e
					duplicate_message = ". Duplicates are neglected"
				end
			end if params[:production_drawings].present?
			render json: {message: "Production Drawings are created successfully#{duplicate_message}"}, status: 200
		else
			render json: {message: "Please provide proper parameters"}, status: 400
		end
	end

	# You can delete multiple production drawing and you can add extra drawings.
	# def update_production_drawings
	# 	if params[:production_drawings].present? || params[:production_drawings_to_delete].present?
			
	# 		ProductionDrawing.where(id: params[:production_drawings_to_delete]).each do |production_drawing|
	# 			production_drawing.destroy
	# 		end if params[:production_drawings_to_delete].present?

	# 		duplicate_message = ""
	# 		params[:production_drawings].each do |production_drawing|
	# 			begin
	# 				@custom_elements = ProductionDrawing.create!(permited_params(production_drawing))
	# 			rescue StandardError => e
	# 				duplicate_message = ". Duplicates are neglected"
	# 			end
	# 		end if params[:production_drawings].present?
	# 		render json: {message: "Production Drawings are created successfully#{duplicate_message}"}, status: 200
	# 	else
	# 		render json: {message: "Please provide proper parameters"}, status: 400
	# 	end
	# end

	# To destroy production drawings.
	def destroy
		if @production_drawing.destroy
			render json: {message: "Successfully Deleted"}, status: 200
		else
			render json: {message: "Something went wrong"}, status: 400
		end
	end

	# You will get all tags which are of type line item split.
	def get_spit_tags
		tags = Tag.where(tag_type: "line_item_split").select(:id, :name)
		render json: {tags: tags}, status: 200
	end

	# you can add or remove splits through this. 
	def add_or_remove_splits
		if params[:splits_for_line_item].present? || params[:line_items_to_remove_splits]
			params[:splits_for_line_item].each do |line_item|
				item = line_item[:line_item_type].classify.constantize.find(line_item[:line_item_id])
				item.update(tag_id: line_item[:tag_id])
			end if params[:splits_for_line_item].present?

			params[:line_items_to_remove_splits].each do |line_item|
				item = line_item[:line_item_type].classify.constantize.find(line_item[:line_item_id])
				item.update(tag_id: nil)
			end if params[:line_items_to_remove_splits].present?

			render json: {message: "Success"}, status: 200
		else
			render json: {message: "Please provide proper parameters"}, status: 400
		end
	end

	
	private

		def set_production_drawing
			@production_drawing = ProductionDrawing.find(params[:id])
		end

		def project_handover_params
			params.require(:production_drawing).permit(:project_handover_id, :line_item_id, :line_item_type)
		end

		def permited_params(params)
			params.permit(:project_handover_id, :line_item_id, :line_item_type)
		end
end