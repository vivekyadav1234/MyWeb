class Api::V1::FloorplansController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: :upload_sms_floorplan
  before_action :set_floorplan, only: [:show, :update, :destroy]
  before_action :set_project, only: [:index, :create, :send_upload_sms, :upload_sms_floorplan]
  load_and_authorize_resource :project, except: :upload_sms_floorplan
  load_and_authorize_resource :floorplan, :through => :project, except: :upload_sms_floorplan
  # GET /api/v1/floorplans
  def index
    @floorplans = @project.floorplans
    render json: @floorplans, user: current_user, include: ["designs"]
  end

  # GET /api/v1/floorplans/1
  def show
    render json: @floorplan, user: current_user, include: ["designs"]
  end

  # POST /api/v1/floorplans
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class FloorplanSerializer
  def create
    @floorplan = @project.floorplans.new(floorplan_params)
    @floorplan.attachment_file_file_name = params[:floorplan][:file_name] if params[:floorplan][:file_name].present?
    #
    # if params[:attachment_file].present?
    #
    #   image = Paperclip.io_adapters.for(params[:attachment_file]['result'])
    #   image.original_filename = params[:attachment_name]
    #   @floorplan.attachment_file = image
    # end

    if @floorplan.save
      render json: @floorplan, user: current_user, status: :created, location: v1_project_floorplan_url(@floorplan.project.id, @floorplan)
    else
      render json: {message: @floorplan.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/floorplans/1
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class FloorplanSerializer
  def update
    if @floorplan.update(floorplan_params)
      # if params[:attachment_file].present?
      #
      #   image = Paperclip.io_adapters.for(params[:attachment_file]['result'])
      #   image.original_filename = params[:attachment_name]
      #   @floorplan.attachment_file = image
      #
      #   if @floorplan.save
      #     pp "WOW, It's done"
      #   else
      #     pp @floorplan.errors.messages
      #   end
      # end
      render json: @floorplan, user: current_user
    else
      render json: @floorplan.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/floorplans/1
  def destroy
    if @floorplan.project_handovers.present?
      render json: {message: "file is in handover state"}, status: :unprocessable_entity
    else
      @floorplan.destroy
    end  
  end


  def send_upload_sms
    client = @project.user
    client_no =  Rails.env == "production" ? client.contact : "9066227802"
    client_no = params[:contact_no].present? ? params[:contact_no] : client.contact
    client_name = client.name
    if client_no.present?
      link = Rails.env == "production" ? "https://delta.arrivae.com/lead/app-sms-floorplan?id=#{@project.id}&name=#{client_name}" : Rails.env == "qa" ? "https://arrivae-qa-product.firebaseapp.com/lead/app-sms-floorplan?id=#{@project.id}&name=#{client_name}" : "http://localhost:4200/lead/app-sms-floorplan?id=#{@project.id}&name=#{client_name}"

      SmsModule.send_sms("Please click on the link to upload floorplan #{link} ", client_no)
      return render json: {message: "SMS Sent to #{client_name}"}, status: 200
    else
      return render json: {message: "Contact No. not present for the client "}, status: 204
    end
  end


  def upload_sms_floorplan
    floorplan = @project.floorplans.new(name: "Uploaded by Customer", details: "SMS Upload", attachment_file: params[:floorplan][:attachment_file] )
    floorplan.attachment_file_file_name = params[:floorplan][:file_name] if params[:floorplan][:file_name].present?
    if floorplan.save
      render json: {message: "Floorplan Created"}, status: 200
    else
      render json: {message: "File could not be uploaded. Please try again or contact your designer."}, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_floorplan
      @floorplan = Project.find(params[:project_id]).floorplans.find(params[:id])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    # Only allow a trusted parameter "white list" through.
    def floorplan_params
      params.require(:floorplan).permit(:name, :details, :attachment_file, :project_id)
    end
end
