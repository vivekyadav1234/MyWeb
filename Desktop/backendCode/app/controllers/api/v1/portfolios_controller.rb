class Api::V1::PortfoliosController < Api::V1::ApiController
  skip_before_action :authenticate_user!
  before_action :set_portfolio, only: [:show, :update, :destroy]

  # GET /portfolios
  def index

    @portfolios = Portfolio.all.segment_filter(params[:segment]).space_filter(params[:space]).lifestage_filter(params[:lifestage]).element_filter(params[:element]).theme_filter(params[:theme]).order("created_at DESC")

    render json: @portfolios
  end

  # GET /portfolios/1
  def show
    render json: @portfolio
  end

  # POST /portfolios
  # @body_parameter [string] space
  # @body_parameter [string] theme
  # @body_parameter [string] price_cents
  # @body_parameter [string] segment
  # @body_parameter [string] element
  # @body_parameter [string] lifestage
  # @response_class PortfolioSerializer
  def create
    # @portfolio = Portfolio.new(portfolio_params)
    #
    # if @portfolio.save
    #   render json: @portfolio, status: :created
    # else
    #   render json: @portfolio.errors, status: :unprocessable_entity
    # end
    begin
      @portfolio = portfolio_params.map {|portfolio_param| Portfolio.create(portfolio_param)}
      render json: @portfolio, status: :created
    rescue => error
      render json: {message: error.message.sub('Validation failed: ', '') }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /portfolios/1
  # @body_parameter [string] space
  # @body_parameter [string] theme
  # @body_parameter [string] price_cents
  # @body_parameter [string] segment
  # @body_parameter [string] element
  # @body_parameter [string] lifestage
  # @response_class PortfolioSerializer
  def update
    @portfolio.assign_attributes(update_params)
    @portfolio.portfolio_data = params[:portfolio][:portfolio_data] if params[:portfolio][:portfolio_data]
    if @portfolio.save
      render json: @portfolio
    else
      render json: {message: @portfolio.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /portfolios/1
  def destroy
    @portfolio.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_portfolio
      @portfolio = Portfolio.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def portfolio_params
      params.require(:portfolio).map do |p|
        ActionController::Parameters.new(p).permit(
          :space, :theme, :price_cents, :segment, :attachment_file, :element, :lifestage, :description, :user_story_title, :portfolio_data
        )
      end
    end

    def update_params
      params.require(:portfolio).permit(:space, :theme, :price_cents, :segment, :attachment_file, :element, :lifestage, :description, :user_story_title, :portfolio_data)
    end
end
