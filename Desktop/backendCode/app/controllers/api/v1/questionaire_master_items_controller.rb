class Api::V1::QuestionaireMasterItemsController < Api::V1::ApiController
  
  # list of questionaire master items
  def index
  	@questionaire_master_items = QuestionaireMasterItem.all.order("name ASC")
  	render json: @questionaire_master_items, each_serializer: QuestionaireMasterItemSerializer
  end
end
