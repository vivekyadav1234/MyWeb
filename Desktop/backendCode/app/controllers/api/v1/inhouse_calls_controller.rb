class Api::V1::InhouseCallsController < Api::V1::ApiController
  require "#{Rails.root.join('app','serializers','inhouse_call_serializer')}"
  before_action :set_inhouse_call, only: [:show, :update, :destroy]
  load_and_authorize_resource except: [:create]

  # GET /inhouse_calls
  def index
    @inhouse_calls = current_user.inhouse_calls.where(:contact_type => "call")

    render json: @inhouse_calls
  end

  # GET /inhouse_calls/1
  def show
    render json: @inhouse_call
  end

  # POST /inhouse_calls
  def create
    @user = User.find(params[:inhouse_call][:user_id])
    @inhouse_call = @user.inhouse_calls.new(inhouse_call_params)
    if params[:lead_id].present?
      @inhouse_call.lead_id = params[:lead_id]
      to_type = "Lead"
      to_user = Lead.find(params[:lead_id])
      to = to_user.contact
    elsif params[:client_id].present?
      to_type = "User"
      to_user = User.find(params[:client_id])
      to = to_user.contact
    elsif params[:contact_no].present?
      to = params[:contact_no]
      lead = Lead.find_by_contact params[:contact_no]
      if lead.present?
        to_user = lead
      elsif
        to_user = User.find_by_contact(params[:contact_no])
      else
        to_user = AlternateContact.where(contact: to).first&.ownerable
      end
    end

    if @user.contact.present? && to.present?
      if @user.call_type.present? && @user.call_type == "plivo"
        response = @inhouse_call.plivo_call(@user.contact, to)
      else
        response = @inhouse_call.init_call(@user.contact,to)
      end
    else
      response = {"code" => "000", "body" => "Contact number not present"}
    end

    @inhouse_call.call_response = response
    @inhouse_call.call_from = @user.contact
    @inhouse_call.call_to_id = to_user.id if to_user.present?
    @inhouse_call.call_to_type = to_type
    @inhouse_call.call_to = to
    @inhouse_call.call_for = "Requirement Gathering"
    @inhouse_call.lead_id= to_user.id if to_user.present?
    if @inhouse_call.save
      render json: @inhouse_call, status: :created
    else
      render json: @inhouse_call.errors, status: :unprocessable_entity
    end
  end

  def send_sms
    @inhouse_call = current_user.inhouse_calls.new(inhouse_call_params)
    if params[:lead_id].present?
      to_type = "Lead"
      to_user = Lead.find(params[:lead_id])
    elsif params[:client_id].present?
      to_type = "User"
      to_user = User.find(params[:client_id])
    end
    to = to_user.contact
    body = params[:sms_body]


    if current_user.contact.present? && to.present? && body.present?
      response = @inhouse_call.send_sms(current_user.contact, to, body)
    else
      response = {"code" => "000", "body" => "Contact number or body not present"}
    end
    @inhouse_call.call_response = response
    @inhouse_call.contact_type = "sms"
    if @inhouse_call.save
      render json: @inhouse_call, status: :created
    else
      render json: @inhouse_call.errors, status: :unprocessable_entity
    end

  end

  def sms_list
    @inhouse_sms = current_user.inhouse_calls.where(:contact_type => "sms")
    render json: @inhouse_sms, each_serializer: ::SmsSerializer
  end

  # PATCH/PUT /inhouse_calls/1
  def update
    if @inhouse_call.update(inhouse_call_params)
      render json: @inhouse_call
    else
      render json: @inhouse_call.errors, status: :unprocessable_entity
    end
  end

  # DELETE /inhouse_calls/1
  def destroy
    @inhouse_call.destroy
  end

  def call_excel_report
    CallReportDownloadJob.perform_later(current_user)
    render json: {message: "The Call report you requested is being created. It will be emailed to you once complete.!"}, status: 200
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_inhouse_call
      @inhouse_call = InhouseCall.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def inhouse_call_params
      params.require(:inhouse_call).permit(:call_from, :user_id, :call_to, :call_for, :call_response, :call_type, :lead_id)
    end
end
