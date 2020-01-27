require "#{Rails.root.join('app', 'serializers', 'training_material_serializer')}"

class Api::V1::TrainingMaterialsController < ApplicationController
  before_action :set_training_material, only: [:show, :update, :destroy, :upload_content]

  # GET /training_materials
  def index
    @training_materials = params[:category_id].present? ? TrainingMaterial.where(training_material_id: params[:category_id]) : TrainingMaterial.where(training_material_id: nil)

    render json: @training_materials
  end

  # GET /training_materials/1
  def show
    render json: @training_material
  end

  # POST /training_materials
  def create
    @training_material = TrainingMaterial.new(training_material_params)

    if @training_material.save
      @training_material.update(created_by: current_user.id)
      render json: @training_material, status: :created
    else
      render json: @training_material.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /training_materials/1
  def update
    if @training_material.update(training_material_params)
      render json: @training_material
    else
      render json: @training_material.errors, status: :unprocessable_entity
    end
  end

  # DELETE /training_materials/1
  def destroy
    @training_material.destroy
  end

  def upload_content
    if params[:files].present?
      params[:files].each do |file|
        # if File.extname(file[:file_name]) == '.pdf'
        #   filepath = Rails.root.join("tmp").join("#{rand(3)}_temp.pdf")
        #   File.open(filepath, "wb") do |f|
        #     f.write(Base64.decode64(file[:attachment].split(',')[1]))
        #     f.close
        #   end 
        #   begin
            # reader = PDF::Reader.new(filepath.to_s)
            @training_material.contents.create(document: file[:attachment], scope: "training_material", document_file_name: file[:file_name])
          # rescue StandardError => e
          # end
          # if e.present?
          #   render json: {message: "Uploaded file is corrupted. Please upload a new file."},  status: 400
          # else
          #   render json: {message: "Training Material Uploaded"},  status: 200
          # end
        # else
          # @training_material.contents.create(document: file[:attachment], scope: "training_material", document_file_name: file[:file_name])
          render json: {message: "Training Material Uploaded"},  status: 200
        # end
      end
    else
      render json: {message: "Please Select at least one file"},  status: 204
    end
  end

  def fetch_traning_material
    training_materials = TrainingMaterial.where(training_material_id: nil)
    render json: training_materials, each_serializer: TrainingMaterialDetziledSerializer
  end

  def delete_content
    if params[:content_id].present?
      @content = Content.find params[:content_id]
      @content.destroy
      render json: {message: "Content Deleted"},  status: 200
    else
      render json: {message: "Please send content id"},  status: 204
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_training_material
      @training_material = TrainingMaterial.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def training_material_params
      params.require(:training_material).permit("id", "category_name", "created_by", "training_material_id")
    end
end
