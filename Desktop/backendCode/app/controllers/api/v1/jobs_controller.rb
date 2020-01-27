class Api::V1::JobsController < Api::V1::ApiController
  before_action :set_job, only: [:show, :update, :destroy]

  # GET /boqjobs
  def index
    @boqjobs = Boqjob.all

    render json: @boqjobs
  end

  # GET /boqjobs/1
  def show
    render json: @boqjob
  end

  # POST /boqjobs
  def create
    @boqjob = Boqjob.new(job_params)

    if @boqjob.save
      render json: @boqjob, status: :created
    else
      render json: @boqjob.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /boqjobs/1
  def update
    if @boqjob.update(job_params)
      render json: @boqjob
    else
      render json: @boqjob.errors, status: :unprocessable_entity
    end
  end

  # DELETE /boqjobs/1
  def destroy
    @boqjob.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_job
      @boqjob = Boqjob.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def job_params
      params.require(:boqjob).permit(:rate, :quantity, :job_type, :name, :net_amount, :total_amount, :quotation_id, :status, :percent_discount, :unit)
    end
end
