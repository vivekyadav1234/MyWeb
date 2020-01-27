class Api::V1::VersionsController < Api::V1::ApiController
  
  def history
    if params[:item_type].present?
      item = params[:item_type].capitalize
      @versions = PaperTrail::Version.where(item_type: item).order('created_at DESC')
      render json: @versions
    else
      render json: {message: "Params missing"}, status: :unprocessable_entity
    end
  end

  def undo
    @item_version = PaperTrail::Version.find_by_id(params[:id])
    begin
      if @item_version.reify
        @item_version.reify.save
      else
        # For undoing the create action
        @item_version.item.destroy
      end
      render json: {message: "Undid that"}
    rescue
      render json: {message: "Failed undoing the action"}
    end
  end
end
