class Api::V1::CustomerProfilesController < Api::V1::ApiController
  before_action :set_project
  before_action :set_customer_profile, only: [:show, :update, :destroy]

  # GET /customer_profiles
  def index
    customer_profiles = @project.customer_profile

    render json: customer_profiles
  end

  # GET /customer_profiles/1
  def show
    render json: @project.customer_profile
  end

  # POST /customer_profiles
  def create
    customer_profile = CustomerProfile.new(customer_profile_params)

    if customer_profile.save
      customer_profile.update_column(:project_id, @project.id)
      render json: customer_profile, status: :created
    else
      render json: customer_profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /customer_profiles/1
  def update
    if @customer_profile.update(customer_profile_params)
      render json: @customer_profile
    else
      render json: @customer_profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /customer_profiles/1
  def destroy
    @customer_profile.destroy
  end
  
  def generate_xl
    CustomerReportJob.perform_later(current_user)
  end

  private

    def set_project
      @project = Project.find(params[:project_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_customer_profile
      @customer_profile = CustomerProfile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def customer_profile_params
      params.require(:customer_profile).permit(:id ,:name, :email, :contact_no, :dob, :address_line_1, :address_line_2, :city, :state, :pincode, :gender,
        :educational_background, :professional_background, :sector_employed, :income_per_annum, :family_status, :marital_status, :joint_family_status,
        :no_of_family_members, :co_decision_maker, :co_decision_maker_name, :co_decision_maker_email, :co_decision_maker_phone, :co_decision_maker_dob,
        :relation_with_decision_maker, :co_decision_maker_educational_background, :co_decision_maker_professional_background, :co_decision_maker_sector_employed,
        :co_decision_maker_income_per_annum, :movein_date, :purpose_of_house, :project_id)
    end
end
