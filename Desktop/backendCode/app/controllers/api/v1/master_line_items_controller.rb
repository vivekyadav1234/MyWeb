class Api::V1::MasterLineItemsController < Api::V1::ApiController
    before_action :set_master_line_item, only: [:show]
    load_and_authorize_resource :master_line_item

    def procurement_types
      arr = MasterLineItem::MLI_TYPES.map do |mli_type|
        {
          name: mli_type.humanize, 
          value: mli_type
        }
      end

      render json: {procurement_types: arr}
    end

    def show
      render json: @master_line_item, serializer: MasterLineItemSerializer
    end

    def index
      if params[:mli_type] == 'indoline'
        @master_line_items = MasterLineItem.indoline
      elsif params[:mli_type] == 'lakhs_modular'
        @master_line_items = MasterLineItem.lakhs_modular
      elsif params[:mli_type] == 'loose_furniture'
        @master_line_items = MasterLineItem.loose_furniture
      else
        @master_line_items = MasterLineItem.all
      end

      if params[:no_pagination]
        render json: @master_line_items
      else
        paginate json: @master_line_items
      end
    end

    def index_new
      if params[:mli_type] == 'indoline'
        @master_line_items = MasterLineItem.indoline.select(:id, :mli_name)
      elsif params[:mli_type] == 'lakhs_modular'
        @master_line_items = MasterLineItem.lakhs_modular.select(:id, :mli_name)
      elsif params[:mli_type] == 'loose_furniture'
        @master_line_items = MasterLineItem.loose_furniture.select(:id, :mli_name)
      else
        @master_line_items = MasterLineItem.all.select(:id, :mli_name)
      end

      render json: @master_line_items.as_json, status: 200
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    def set_master_line_item
      @master_line_item = MasterLineItem.find(params[:id])
    end
  end
