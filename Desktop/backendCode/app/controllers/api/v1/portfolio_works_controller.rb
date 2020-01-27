class Api::V1::PortfolioWorksController < Api::V1::ApiController
  skip_before_action :authenticate_user!
  before_action :set_portfolio_work, only: [:show, :update, :destroy]
  before_action :set_user, only: [:create, :index]
  # load_and_authorize_resource :portfolio_work
  
  # GET /api/v1/portfolio_works
  def index
    portfolio_ids = []
    if current_user&.has_role?(:admin) || current_user&.has_role?(:design_head)
      @portfolio_works = PortfolioWork.order(user_id: :desc)
    else
      @portfolio_works = @user.portfolio_works
    end
    render json: @portfolio_works
  end

  # GET /api/v1/portfolio_works/1
  def show
    render json: @portfolio_work
  end

  # POST /api/v1/portfolio_works
  # @body_parameter [string] name
  # @body_parameter [string] description
  # @body_parameter [string] url
  # @response_class PortfolioWorkSerializer
  def create
    @portfolio_work = @user.portfolio_works.build(portfolio_work_params)
    # @portfolio_work = PortfolioWork.new(portfolio_work_params)
    # @portfolio_work.user = @user
    if @user.save
      render json: @portfolio_work, status: :created
    else
      render json: {message: @portfolio_work.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/portfolio_works/1
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class PortfolioWorkSerializer
  def update
    if @portfolio_work.update(portfolio_work_params)
      render json: @portfolio_work
    else
      render json: @portfolio_work.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/portfolio_works/1
  def destroy
    @portfolio_work.destroy
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_portfolio_work
      @portfolio_work = PortfolioWork.find(params[:id])
    end

    def set_user
      @user = User.find(params[:user_id])
    end

    # Only allow a trusted parameter "white list" through.
    def portfolio_work_params
      # params.require(:portfolio_work).permit(:name, :description, :url,:attachment_file, 
      #   :user_id)

      params.permit(portfolio_work: [:name, :description, :url,:attachment_file]).require(:portfolio_work)
    end
end
