class Api::V1::MediaPagesController < Api::V1::ApiController
  skip_before_action :authenticate_user!
  before_action :set_media_page, only: [:show, :update, :destroy]

  # GET /api/v1/media_pages
  def index
    @media_pages = MediaPage.all
    paginate json: @media_pages, per_page: 9
  end

  # GET /api/v1/media_pages/1
  def show
    render json: @media_page
  end

  # POST /api/v1/media_pages
  def create
    @media_page = MediaPage.new(media_page_params)
    url =  params[:media_page][:read_more_url].present? ? MetaInspector.new(params[:media_page][:read_more_url]).url : ""
    if @media_page.save
      @media_page.update(read_more_url: url)
      return render json: @media_page, status: :created
    else
      return render json: @media_page.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/media_pages/1
  def update
    if @media_page.update(media_page_params)
      url =  MetaInspector.new(params[:media_page][:read_more_url]).url
      @media_page.update(read_more_url: url)
      return render json: @media_page
    else
      return render json: @media_page.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/media_pages/1
  def destroy
    if @media_page.destroy
      render json: {message: "Deleted"}, status: 200
    else
      render json: {message: @media_page.errors.full_messages}, status: :unprocessable_entity
    end

  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_media_page
      @media_page = MediaPage.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def media_page_params
      params.require(:media_page).permit(:title, :read_more_url, :logo, :description)
    end
end
