class Api::V1::ScopeOfWorksController < Api::V1::ApiController
  before_action :set_scope_of_work, only: [:show, :update, :destroy]

  # GET /scope_of_works
  def index
    @scope_of_works = ScopeOfWork.all

    render json: @scope_of_works
  end

  # GET /scope_of_works/1
  def show
    render json: @scope_of_work
  end

  # POST /scope_of_works
  def create
    @scope_of_work = ScopeOfWork.new(scope_of_work_params)

    if @scope_of_work.save
      @scope_of_work.project.change_status
      render json: @scope_of_work, status: :created
    else
      render json: @scope_of_work.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scope_of_works/1
  def update
    if @scope_of_work.update(scope_of_work_params)

     # params[:scope_of_work][:scope_spaces_attributes].each do |scope_spaces_attribute|
     #    scope_spaces_hash = scope_space_params(scope_spaces_attribute)
     #    @requirement_sheet = @scope_of_work.scope_spaces.create!(scope_spaces_hash) if scope_spaces_hash[:id] == ""
     #  end

      render json: @scope_of_work
    else
      render json: @scope_of_work.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scope_of_works/1
  def destroy
    @scope_of_work.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_scope_of_work
      @scope_of_work = ScopeOfWork.find(params[:id])
    end

   def scope_space_params(r_s_params)
      r_s_params.permit(:id, :space_name, :space_type, scope_qnas_attributes: [:id, :question, :arrivae_scope, :client_scope, :remark])
    end

    # Only allow a trusted parameter "white list" through.
    def scope_of_work_params
      params.require(:scope_of_work).permit(:project_id, :client_details, :date , scope_spaces_attributes: [:id, :space_name, :space_type, scope_qnas_attributes: [:id, :question, :arrivae_scope, :client_scope, :remark]])
    end
end
