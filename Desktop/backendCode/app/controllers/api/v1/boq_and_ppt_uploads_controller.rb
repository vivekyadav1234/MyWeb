class Api::V1::BoqAndPptUploadsController < Api::V1::ApiController
  before_action :set_boq_and_ppt_upload, only: [:show, :update, :destroy, :share_with_customer]
  before_action :set_project, except: [:show]
  load_and_authorize_resource :boq_and_ppt_upload

  # GET /boq_and_ppt_uploads
  def index
    @boq_and_ppt_uploads = @project.boq_and_ppt_uploads.all
    render json: @boq_and_ppt_uploads
  end

  def get_ppts
    @boq_and_ppt_uploads = @project.boq_and_ppt_uploads.where(upload_type: "ppt")
    render json: @boq_and_ppt_uploads
  end

  def get_boqs
    @boq_and_ppt_uploads = @project.boq_and_ppt_uploads.where(upload_type: "boq")
    render json: @boq_and_ppt_uploads
  end

  def sample_ppt_file
    output = {}
    begin
      file_name = 'DELTA MAX PPT PRESENTATION - FINAL.pptx'
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(file_name)
      url = obj.presigned_url("get", expires_in: 600)

      output[:sample_ppt_file] = url
      output[:sample_ppt_name] = "sample ppt"

      render json: output, status: 200
    rescue StandardError => e
      render json: {message: "Something went Wrong"}, status: 400
    end
  end

  def get_shared_ppts_and_boqs
    @boq_and_ppt_uploads = @project.boq_and_ppt_uploads.where(shared_with_customer: true)
    render json: @boq_and_ppt_uploads
  end

  def get_shared_boqs
    @boq_and_ppt_uploads = @project.boq_and_ppt_uploads.where(upload_type: "boq", shared_with_customer: true)
    render json: @boq_and_ppt_uploads
  end

  # GET /boq_and_ppt_uploads/1
  def show
    render json: @boq_and_ppt_upload
  end

  # POST /boq_and_ppt_uploads
  def create
    @boq_and_ppt_upload = @project.boq_and_ppt_uploads.new(boq_and_ppt_upload_params)
    @boq_and_ppt_upload.upload_file_name = params[:boq_and_ppt_upload][:file_name]
    if @boq_and_ppt_upload.save!
      emails = User.with_any_role(*Role::CATEGORY_ROLES).pluck(:email)
      if Rails.env.production?
        emails << "abhishek@arrivae.com"
        emails << "atul@arrivae.com"
        emails << "category@arrivae.com"
      end
      UserNotifierMailer.temp_boq_or_ppt_created(emails,@boq_and_ppt_upload).deliver_later!
      render json: @boq_and_ppt_upload, status: :created
    else
      render json: @boq_and_ppt_upload.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /boq_and_ppt_uploads/1
  def update
    if @boq_and_ppt_upload.update(boq_and_ppt_upload_params)
      render json: @boq_and_ppt_upload
    else
      render json: @boq_and_ppt_upload.errors, status: :unprocessable_entity
    end
  end

  # DELETE /boq_and_ppt_uploads/1
  def destroy
    if @boq_and_ppt_upload.project_handovers.present?
      render json: {message: "file is in handover state"}, status: :unprocessable_entity
    else
      @boq_and_ppt_upload.destroy
    end
  end

  def share_with_customer
    if @boq_and_ppt_upload.update(shared_with_customer: true)
      UserNotifierMailer.temp_boq_shared_mail(@boq_and_ppt_upload).deliver_later!
      render json: @boq_and_ppt_upload
    else
      render json: @boq_and_ppt_upload.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_boq_and_ppt_upload
      @boq_and_ppt_upload = BoqAndPptUpload.find(params[:id])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    # Only allow a trusted parameter "white list" through.
    def boq_and_ppt_upload_params
      params.require(:boq_and_ppt_upload).permit(:upload, :upload_type, :name)
    end
end
