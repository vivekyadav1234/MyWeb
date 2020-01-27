class Api::V1::CustomElementsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :custom_element, only: [:show, :update, :destroy, :add_custom_element_price, :add_custom_element_space]
  before_action :set_project, only: [:create, :index, :update, :destroy, :custom_elements_for_category, :priced_custom_elements, :change_category_seen_status]
  before_action :check_category_role, only: [:add_custom_element_price, :add_custom_element_space]
  before_action :check_category_or_cm_role, only: [:update, :destroy]

  load_and_authorize_resource :custom_element

  # GET /api/v1/custom_elements
  def index
    pending_ce = @project.custom_elements.where(status: "pending").order(created_at: :desc).pluck(:id)
    other_ce = @project.custom_elements.where.not(id: pending_ce).order(created_at: :desc).pluck(:id)
    ids = []
    ids.push pending_ce.uniq
    ids.push other_ce.uniq
    ids = ids.flatten.uniq
    @custom_elements = @project.custom_elements.where_with_order(:id, ids)
    render json: @custom_elements
  end

  def custom_elements_for_category
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      @custom_elements = @project.custom_elements
      render json: @custom_elements , status: 200
    else
      raise CanCan::AccessDenied
    end
  end

  def priced_custom_elements
    unless ( current_user.has_any_role?(:business_head) ) || 
      ( current_user.has_role?(:designer) && @project.assigned_designer == current_user ) || 
      ( current_user.has_role?(:community_manager) && @project.lead.assigned_cm == current_user ) || 
      ( current_user.has_role?(:city_gm) && current_user.cms.include?(@project.lead.assigned_cm) ) || 
      ( current_user.has_role?(:design_manager) && current_user.dm_cms.include?(@project.lead.assigned_cm) )
      raise CanCan::AccessDenied
    end
    @custom_elements = @project.custom_elements.where(status: "approved").where.not(price: nil)
    render json: @custom_elements , status: 200
  end

  # GET /api/v1/custom_elements/1
  def show
    render json: @custom_element
  end

  # POST /api/v1/custom_elements
  def create
    ce_by_segments = {}
    CATEGORY_SEGMENTS.map{|segment| ce_by_segments[segment] = []}
    params[:custom_elements].each do |element_params|
      @custom_element = @project.custom_elements.new(custom_permit(element_params))
      @custom_element.photo_file_name = element_params[:file_name] if element_params[:file_name].present? # && element_params[:file_name].split(".")[1] == "dwg"
      @custom_element.save!
      if @custom_element.present?
        ce_by_segments[@custom_element.category_split] << @custom_element.id
      end
    end
    # Change in email logic - we want to send emails for all custom elements only to appropriate category
    # as per their segment
    ce_by_segments.keys.each do |segment|
      custom_element_ids = ce_by_segments[segment]
      role_name = SEGMENT_ROLE_MAPPING.key(segment)
      emails = User.with_role(role_name).pluck(:email)
      UserNotifierMailer.notification_of_new_custom_elements(emails, @project, custom_element_ids, {segment: segment}).deliver_later
    end

    rescue => error
      render json: {message: error.message.sub('Validation failed: ', '') }, status: :unprocessable_entity
  end

  def add_custom_element_price
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      if @custom_element.update!(price: params[:price],category_remark: params[:category_remark], status: params[:status], timeline: params[:timeline])
        @custom_element.manage_esitmation_task
        emails = []
         emails << @custom_element.project.assigned_designer&.email
         if Rails.env.production?
           emails << "category@arrivae.com"
           emails << "abhishek@arrivae.com"
           emails << User.with_role(SEGMENT_ROLE_MAPPING.key(@custom_element.category_split)).pluck(:email)
         end
         # ['a', 'b', []].flatten gives ['a', 'b']
         UserNotifierMailer.category_remark_add_to_custom_elements(emails.flatten, @custom_element, current_user).deliver_now!
        render json: @custom_element, status: 200
      else
        render json: {message: @custom_element.errors}, status: :unprocessable_entity
      end
    else
      raise CanCan::AccessDenied
    end
  end

  def add_custom_element_space
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      @custom_element.update!(category_split: params[:category_split])
      emails = User.with_role(SEGMENT_ROLE_MAPPING.key(@custom_element.category_split)).pluck(:email)
      UserNotifierMailer.notification_of_updated_custom_elements(emails, @custom_element).deliver_now!
      render json: @custom_element, status: 200
    else
      raise CanCan::AccessDenied
    end
  end

  #PATCH/PUT /api/v1/custom_elements/1
  def update
    if @custom_element.update!(update_params)
      @custom_element.photo_file_name = params[:custom_element][:file_name] if params[:custom_element][:file_name].present?
      @custom_element.save! if params[:custom_element][:file_name].present?
      emails = User.with_role(SEGMENT_ROLE_MAPPING.key(@custom_element.category_split)).pluck(:email)
      UserNotifierMailer.notification_of_updated_custom_elements(emails, @custom_element).deliver_now!
      render json: @custom_element
    else
      render json: @custom_element.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/custom_elements/1
  def destroy
    @custom_element.destroy
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This element cannot be deleted as it is in use."}, status: 422
  end

  def change_category_seen_status
    raise CanCan::AccessDenied unless current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)

    if @project.present?
      @project.custom_elements.update(seen_by_category: true)
      return render json: {message: "Updated"}, status: 200
    else
      return render json: {message: "Please select project"}, status: 403
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def custom_element
    @custom_element = CustomElement.find(params[:id])
  end

  def set_project
    @project = Project.find params[:project_id]
  end

  def check_category_role
    split = @custom_element.category_split
    if current_user.has_any_role?(:category_head, SEGMENT_ROLE_MAPPING.key(split))
      return true
    else
      raise CanCan::AccessDenied
    end
  end

  # check for category or designer/cm role
  def check_cm_role
    if ( current_user.has_role?(:designer) && @project.assigned_designer == current_user ) || 
      ( current_user.has_role?(:community_manager) && @project.lead&.assigned_cm == current_user) || 
      ( current_user.has_any_role?(:category_head, SEGMENT_ROLE_MAPPING.key(split)) )
      return true
    else
      raise CanCan::AccessDenied
    end
  end

  # This method incorporates :check_category_role plus the check for designer/cm
  def check_category_or_cm_role
    split = @custom_element.category_split
    if ( current_user.has_role?(:designer) && @project.assigned_designer == current_user ) || 
      ( current_user.has_role?(:community_manager) && @project.lead&.assigned_cm == current_user) || 
      ( current_user.has_any_role?(:category_head, SEGMENT_ROLE_MAPPING.key(split)) )
      return true
    else
      raise CanCan::AccessDenied
    end
  end

  def update_params
    params.require(:custom_element).permit(:name, :dimension, :core_material, :shutter_finish, :designer_remark, 
      :photo, :ask_price, :asked_timeline, :category_split)
  end

  def custom_permit(params_to_permit)
    params_to_permit.permit(:name, :dimension, :core_material, :shutter_finish, :designer_remark, :photo, 
      :ask_price, :asked_timeline, :category_split)
  end
end
