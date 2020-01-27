class Api::V1::ProjectDetailsController < Api::V1::ApiController
  skip_before_action :authenticate_user!
  before_action :set_project_detail, only: [:show, :update]
  # load_and_authorize_resource

  # GET /project_details
  # def index
  #   @project_details = ProjectDetail.all

  #   render json: @project_details
  # end

  # GET /project_details/1
  def show
    render json: @project_detail
  end

  # POST /project_details
  # def create
  #   @project_detail = ProjectDetail.new(project_detail_params)

  #   if @project_detail.save
  #     render json: @project_detail, status: :created
  #   else
  #     render json: @project_detail.errors, status: :unprocessable_entity
  #   end
  # end

  # PATCH/PUT /project_details/1
  def update

    # puts "sunny sharma"
    # puts project_detail_params.to_json
    # puts "hello"
    if @project_detail.update!(project_detail_params)
      render json: @project_detail
    else
      render json: @project_detail.errors, status: :unprocessable_entity
    end
  end

  def global_project_details
    render json: ProjectDetail::PROJECT_DETAIL_INFO, status: :ok
  end

  # DELETE /project_details/1
  # def destroy
  #   @project_detail.destroy
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_detail
      @project = Project.find params[:id]
      @project_detail = @project&.project_detail
      # puts "#{@project.inspect}"
      # puts "#{@project_detail.inspect}"
    end

    # Only allow a trusted parameter "white list" through.
    def project_detail_params
      params.require(:project_detail).permit(:customer_name, :mobile_number, :alternate_mobile, :email, :city, :property_usage,
        :property_age, :property_type, :number_of_rooms, :project_name, :project_address, :flat_no,
        :area_of_flat, :possession_status, :possession_date, :use_type, :requirement, :budget,
        :floor_plan_link, :preferred_time_call_designer, :preferred_time_site_visit, :occupation_of_customer,
        :occupation_of_spouse, :members_in_family, :tentative_date_moving, :project_type,
        :kitchen => [:platform, :type_of_kitchen, :shape_of_kitchen,
          :preferred_material, :preferred_finish, :preferred_finish_material, :more_used_by, :other_requirments,:furniture => [], :services => [], :appliances => [], :apliances_ii => []
          ],
          :master_bedroom => [:preferred_material, :type_of_wardrobe, :preferred_finish, :preferred_finish_material, :other_requirments, :furniture => [], :type_of_bed => [], :services => []],
         :kids_bedroom => [:type_of_wardrobe, :preferred_material, :preferred_finish, :preferred_finish_material, :other_requirments, :furniture => [], :type_of_bed => [], :services => []],
         :parent_bedroom => [:type_of_wardrobe, :preferred_material, :preferred_finish, :preferred_finish_material, :other_requirments, :furniture => [], :type_of_bed => [], :services => []],
         :guest_bedroom => [:type_of_wardrobe, :preferred_material, :preferred_finish, :preferred_finish_material, :other_requirments, :furniture => [], :type_of_bed => [], :services =>[]],
         :living_room => [:preferred_material, :preferred_finish, :preferred_finish_material, :other_requirments, :furniture => [], :services => []],
         :pooja_room => [:furniture => [], :services => []],
         :foyer => [:furniture => [], :services => []],
        :scope_of_work => [],

        )
    end
end
