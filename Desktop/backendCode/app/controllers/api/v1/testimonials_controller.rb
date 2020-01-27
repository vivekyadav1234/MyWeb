require "#{Rails.root.join('app','serializers','testimonial_serializer')}"

class Api::V1::TestimonialsController < Api::V1::ApiController
  before_action :authenticate_user!, except: [:index]
  before_action :set_testimonial, only: [:show, :update, :destroy]

  # GET /api/v1/testimonials
  def index
  	@testimonials = Testimonial.all
  	render json: @testimonials
  end

  # GET /api/v1/testimonials/1
  def show
  	render json: @testimonials
  end

  # POST /api/v1/testimonials
  def create
    if current_user.has_role?(:admin)
    	@testimonials = Testimonial.new(testimonial_params)
      @testimonials.user_id = current_user.id
      # @testimonials.video = params[:video] if params[:video]
      # @testimonials.thumbnail = params[:thumbnail] if params[:thumbnail]

      if @testimonials.save!
        render json: @testimonials, status: :created
      else
        render json: {message: @testimonials.errors}, status: :unprocessable_entity
      end
    else
      render json: { message: "This user is not a Admin!" }, status: :unauthorized
    end 	
  end

  # POST/PATCH /api/v1/testimonials/1
  def update
    if current_user.has_role?(:admin)
      if @testimonials.update(testimonial_params)
         # @testimonials.update(video: params[:video]) if params[:video]
         # @testimonials.update(thumbnail: params[:thumbnail]) if params[:thumbnail]

        render json: @testimonials
      else
        render json: @testimonials.errors, status: :unprocessable_entity
      end 
    else
      render json: { message: "This user is not a Admin!" }, status: :unauthorized
    end	
  end

  # DELETE /api/v1/testimonials/1
  def destroy
    if current_user.has_role?(:admin)
      @testimonials.destroy 
    else
      render json: { message: "This user is not a Admin!" }, status: :unauthorized
    end 	
  end

  def get_featured_testimonials
    @testimonials = Testimonial.where(feature: true)
  	render json: @testimonials
  end

  private

   # Only allow a trusted parameter "white list" through.
    def testimonial_params
      params.require(:testimonial).permit(:name, :profession, :testimonial, :video, :thumbnail, :feature, :video_url)
    end

    def set_testimonial
      @testimonials = Testimonial.find(params[:id])    	
    end

end