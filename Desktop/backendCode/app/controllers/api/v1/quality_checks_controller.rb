class Api::V1::QualityChecksController < Api::V1::ApiController
  before_action :set_quality_check, only: [:show, :update, :destroy]

  # GET /quality_checks
  def index
    @quality_checks = QualityCheck.all

    render json: @quality_checks
  end

  # GET /quality_checks/1
  def show
    render json: @quality_check
  end

  # POST /quality_checks
  def create
    @quality_check = QualityCheck.new(quality_check_params)

    if @quality_check.save
      render json: @quality_check, status: :created, location: @quality_check
    else
      render json: @quality_check.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /quality_checks/1
  def update
    if @quality_check.update(quality_check_params)
      render json: @quality_check
    else
      render json: @quality_check.errors, status: :unprocessable_entity
    end
  end

  # DELETE /quality_checks/1
  def destroy
    @quality_check.destroy
  end

  def job_element_qc_date
    if params[:job_element_id].present?
      je = JobElement.unscope(where: :added_for_partial_dispatch).find(params[:job_element_id])
      render json: je.quality_checks, status: 200
    else
      render json: {message: "Please select SLI first"}, status: 422
    end
  end

  def update_job_element_qc_date
    if params[:job_element_ids].present?
      ### TODO: read clubbed_ids data from param for this jeid
      ### format for clubbed_ids:
      ### clubbed_ids: {"_jeid1_": clubbed_ids_array1[],"_jeid2_": clubbed_ids_array2[],"_jeid3_": clubbed_ids_array3[]}
      params[:job_element_ids].each do |job_element_id|
        @je = JobElement.unscope(where: :added_for_partial_dispatch).find(job_element_id)
        project = @je.quotation.project
        status = params[:status].present? ? params[:status] : je.quality_checks.present? ? "rescheduled" : "scheduled"
        qc_date = params[:qc_date].present? ? params[:qc_date] : ""
        @qc = @je.quality_checks.new(qc_status: status, qc_date: qc_date, created_by: current_user.id,remarks: params[:remarks])
        #byebug
        if params[:clubbed_job_elements_ids].present?
          if params[:clubbed_job_elements_ids]["#{job_element_id}"].present?
            @clubbed_ids = params[:clubbed_job_elements_ids]["#{job_element_id}"]
            params[:clubbed_job_elements_ids]["#{job_element_id}"].each do |clubbed_je|
              cje = JobElement.unscope(where: :added_for_partial_dispatch).find(clubbed_je)
              cproject = cje.quotation.project
              cstatus = params[:status].present? ? params[:status] : cje.quality_checks.present? ? "rescheduled" : "scheduled"
              cqc_date = params[:qc_date].present? ? params[:qc_date] : ""
              cqc = cje.quality_checks.new(qc_status: cstatus, qc_date: cqc_date, created_by: current_user.id,remarks: params[:remarks])
              cqc.save!
            end
          else
            @clubbed_ids = []
          end
        end
        if @qc.save!
          UserNotifierMailer.qc_schedule(@qc, project, @clubbed_ids).deliver
          if params[:files].present?
            params[:files].each do |file|
              @qc.contents.create!(document: file[:attachment], scope: "quality_check", document_file_name: file[:file_name])
            end
          end
        else
          return render json: {message: @je.quality_checks.errors.full_messages}, status: 422
        end
      end

      return render json: {message: "QC Update"}, status: 200
    else
      return render json: {message: "Please select SLI first"}, status: 422
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_quality_check
    @quality_check = QualityCheck.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def quality_check_params
    params.require(:quality_check).permit("id", "job_element_id", "qc_status", "qc_date", "created_by", "remarks")
  end
end
