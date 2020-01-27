require "#{Rails.root.join('app','serializers','cad_upload_serializer')}"

class Api::V1::CadUploadsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :set_project_and_quotations, except: :destroy
  before_action :set_cad_upload, only: [:show, :update, :destroy, :update_tags, :change_status]
  load_and_authorize_resource :cad_upload

  # GET /api/v1/cad_uploads
  def index
    @cad_uploads = @quotation.cad_uploads
    render json: @cad_uploads, each_serializer: CadUploadDetailedSerializer
  end

  # GET /api/v1/cad_uploads/1
  def show
    render json: @cad_upload, serializer: CadUploadDetailedSerializer
  end

  # POST /api/v1/cad_uploads
  def create
    unless @quotation.cad_upload_allowed?
      return render json: {message: "Cad files can be uploaded only for the BOQs which is recieved 10% payment"}, status: :unprocessable_entity
    end

    @cad_upload = @quotation.cad_uploads.new(cad_upload_params)
    @cad_upload.uploaded_by = current_user
    @cad_upload.upload_file_name = params[:cad_upload][:file_name] if params[:cad_upload][:file_name].present?

    if @cad_upload.save!
      render json: @cad_upload, status: :created, serializer: CadUploadDetailedSerializer
    else
      render json: {message: @cad_upload.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/cad_uploads/1
  def update
    if @cad_upload.update(cad_upload_params)
       @cad_upload.update(upload_file_name: params[:cad_upload][:file_name]) if params[:cad_upload][:file_name].present?
      render json: @cad_upload, serializer: CadUploadDetailedSerializer
    else
      render json: {message: @cad_upload.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/cad_uploads/1
  def destroy
    @cad_upload.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This file cannot be deleted as it is in use."}, status: 422
  end

  def update_tags
    allowed_class_names = ['Boqjob', "ModularJob", "ServiceJob", "ApplianceJob", "CustomJob",
      "ExtraJob"]

    if params[:tag_array].present?
      @cad_upload.cad_upload_jobs.destroy_all
      params[:tag_array].each do |tag_hash|
        unless allowed_class_names.include?(tag_hash[:uploadable_type])
          return render json: {message: "#{tag_hash[:uploadable_type]} is not an allowed type!"}, status: :unprocessable_entity
        end
        klass = tag_hash[:uploadable_type].constantize
        record = klass.find(tag_hash[:uploadable_id])
        association_name = klass.name.pluralize.underscore
        unless @cad_upload.public_send(association_name).include?(record)
          @cad_upload.public_send(association_name) << record
        end
      end
    end

    render json: @cad_upload, serializer: CadUploadDetailedSerializer
  end

  def change_status
    if @cad_upload.update!(status: params[:status], approval_comment: params[:approval_comment], status_changed_at: Time.zone.now, approved_by: current_user, upload_type: "furniture_drawings")
      @cad_upload.manage_cad_task if  @cad_upload.status == "approved"
      render json: @cad_upload, serializer: CadUploadDetailedSerializer
    else
      render json: {message: @cad_upload.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def change_category_seen_status
    unless current_user.has_any_role?(*Role::CATEGORY_ROLES)
      return render json: {message: "You are not authorized to perform this action"}, status: 403
    end

    if @quotation.present?
      @quotation.cad_uploads.update_all(seen_by_category: true)
      return render json: {message: "Updated"}, status: 200
    else
      return render json: {message: "Please select quotation."}, status: 403
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_project_and_quotations
    @quotation = Quotation.find params[:quotation_id]
    @project = @quotation.project
  end

  def set_cad_upload
    id = params[:cad_upload_id] || params[:id]
    @cad_upload = @quotation.cad_uploads.find(id)
  end

  # Only allow a trusted parameter "white list" through.
  def cad_upload_params
    params.require(:cad_upload).permit(:upload_name, :upload_type, :upload, :quotation_id,
      :status, :status_changed_at, :approval_comment, :approved_by_id, :uploaded_by_id)
  end
end
