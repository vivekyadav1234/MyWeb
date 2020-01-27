class Api::V1::ProjectBookingFormFilesController < Api::V1::ApiController
  
  # POST /api/v1/project_booking_form_files
  def create
    @booking_form = ProjectBookingForm.find(params[:project_booking_form_id])
    @booking_file = @booking_form.project_booking_form_files.new()
    @booking_file.attachment_file = params[:attachment_file] if params[:attachment_file].present?
    @booking_file.attachment_file_file_name = params[:file_name] if params[:file_name].present?
    if @booking_file.save
      render json: @booking_file, status: :created
    else
      render json: {message: @booking_file.errors}, status: :unprocessable_entity
    end
  end


  # DELETE /api/v1/project_booking_form_files/1
  def destroy
    @booking_file = ProjectBookingForm.find(params[:project_booking_form_id]).project_booking_form_files.find(params[:id])
    if @booking_file.present?
      @booking_file.destroy   
      render json: {message: 'File deleted'}, status: :ok
    else
      render json: {message: 'File with ids not present'}, status: :unprocessable_entity
    end
  end


  private

    # Only allow a trusted parameter "white list" through.
    def project_booking_form_file_params
      params.require(:project_booking_form_file).permit(:project_booking_form, :attachment_file)
    end
end
