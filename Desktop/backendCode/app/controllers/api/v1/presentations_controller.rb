require "#{Rails.root.join('app','serializers','presentation_serializer')}"

class Api::V1::PresentationsController < ApplicationController
  before_action :set_presentation, only: [:show, :update, :destroy, :get_products_of_ppt, :update_products_of_ppt]
  before_action :set_project, only: [:index, :create]
  # load_and_authorize_resource :project
  # load_and_authorize_resource :presentation, :through => :project

  # GET /api/v1/presentations
  def index
    @presentations = @project.presentations
    render json: @presentations, each_serializer: PresentationIndexSerializer
  end

  # GET /api/v1/presentations/1
  def show
    render json: @presentation
  end

  # POST /api/v1/presentations
  # @response_class PresentationSerializer
  def create
    # @presentation = @project.presentations.new(presentation_params)
    if params[:title].present?
      title = params[:title]
    else
      title = "Presentation - "+(Presentation.last.id+1).to_s
    end
    if params[:presentation].present?
      @presentation = @project.presentations.new(
        :title => title, 
        :ppt_file_name => "",
        :designer_id => current_user.id)
    end

    if @presentation.save!
      params[:products].each do |product|
        @product = PresentationsProduct.find_or_create_by(presentation_id: @presentation.id,product_id: product[:product_id], space: product[:space])
        @product.quantity = product[:quantity]
        @product.save!
      end if params[:products].present?
      indexing = 1
      params[:presentation].each do |slideKey,slideValue|
        @presentation.slides.create!(:title => slideKey, :serial => indexing, :data => slideValue)
        indexing = indexing+1
      end
      render json: @presentation, status: :created
    else
      render json: {message: @presentation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update
    if params[:title].present?
      title = params[:title]
    else
      title = "Presentation - "+(Presentation.last.id+1).to_s
    end
    if @presentation.update(presentation_params)
      if params[:products].present?
        params[:products].each do |product|
          @product = @presentation.presentations_products.find_or_create_by(product_id: product[:product_id], space: product[:space])
          @product.quantity = product[:quantity]
          @product.save!
        end
      end
      
      if params[:products_for_delete]
        products_for_delete = params[:products_for_delete]
        PresentationsProduct.where(id: products_for_delete).destroy_all if products_for_delete.present?
      end

      indexing=1
      params[:presentation].each do |slideKey,slideValue|
        slide = @presentation.slides.find_by_title(slideKey)
        if slide.present?
          slide.update(:serial => indexing, :data => slideValue)
          indexing = indexing+1
        else
          @presentation.slides.create!(:title => slideKey, :serial => indexing, :data => slideValue)
          indexing = indexing+1
        end
        
      end
      @presentation.update(:title => title)
      render json: @presentation
    else
      render json: @presentation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/presentations/1
  def destroy
    if @presentation.destroy
      render json: {message: "Presentation successfully deleted."}, status: :ok
    else
      render json: {message: "Unable to delete - #{@presentation.errors.full_messages}"}, status: :unprocessable_entity
    end
  end

  def get_products_of_ppt
    @products = @presentation.presentations_products
    @products = @products.includes(:product) if @products.present?
    render json: @products, each_serializer: PptProductsSerializer
  end

  def update_products_of_ppt
    products_present = []
    if params[:products]
      params[:products].each do |product|
        @product = @presentation.presentations_products.find_or_create_by(product_id: product[:product_id], space: product[:space])
        @product.quantity = product[:quantity]
        @product.save!
        products_present.push(@product.id)
      end
    end
   
    if params[:products_for_delete]
      products_for_delete = params[:products_for_delete]
      PresentationsProduct.where(id: products_for_delete).destroy_all if products_for_delete.present?
    end

    @products = @presentation.presentations_products
    @products = @products.includes(:product) if @products.present?
    render json: @products, each_serializer: PptProductsSerializer
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_presentation
      @presentation = Project.find(params[:project_id]).presentations.find(params[:id])
    end

    def set_project
      @project = Project.find(params[:project_id])
      # @project = Project.first
    end

    # Only allow a trusted parameter "white list" through.
    def presentation_params
      params.require(:presentation).permit(:title, :ppt, :project_id, :designer_id, 
        slides_attributes: [:title, :serial, :data, :_destroy])
    end
end
