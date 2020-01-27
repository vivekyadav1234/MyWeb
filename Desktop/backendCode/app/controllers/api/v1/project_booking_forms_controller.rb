class Api::V1::ProjectBookingFormsController < Api::V1::ApiController
  before_action :set_project_booking_form, only: [:show, :update, :destroy, :download_pdf]

  # GET /project_booking_forms
  def index
    @project_booking_forms = ProjectBookingForm.all

    render json: @project_booking_forms
  end

  # GET /project_booking_forms/1
  def show
    render json: @project_booking_form
  end

  # POST /project_booking_forms
  def create
    @project_booking_form = ProjectBookingForm.new(project_booking_form_params)

    if @project_booking_form.save
      render json: @project_booking_form, status: :created
    else
      render json: @project_booking_form.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /project_booking_forms/1
  def update
    if @project_booking_form.update(project_booking_form_params)
      render json: @project_booking_form
    else
      render json: @project_booking_form.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_booking_forms/1
  def destroy
    @project_booking_form.destroy
  end

  # GET /project_booking_forms/1/download_pdf
  def download_pdf
    project_booking_form_encoded_file = @project_booking_form.generate_pdf
    file_name = "#{@project_booking_form.project.user.name&.titleize}-Booking Form.pdf"
    render json: {project_booking_form_base_64: project_booking_form_encoded_file, file_name: file_name}
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_booking_form
      @project_booking_form = ProjectBookingForm.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def project_booking_form_params
      params.require(:project_booking_form).permit(:date, :lead_id, :project_id, :flat_no, :floor_no, :building_name, :location, :city, :pincode, :possession_by, :profession, :other_professional_details, :designation, :company, :professional_details, :annual_income, :landline, :primary_mobile, :secondary_mobile, :primary_email, :secondary_email, :current_address, :order_value, :order_date, :billing_address, :billing_name, :gst_number, :address_type)
    end
end
