require "#{Rails.root.join('app', 'serializers', 'project_handover_serializer')}"
class Api::V1::ProjectHandoversController < Api::V1::ApiController
  before_action :set_project
  before_action :set_project_handover, only: [:show, :update, :destroy, :add_revision, :child_revisions, :category_action_on_handover]

  # GET /project_handovers
  def index
    hash = Hash.new
    @project_handovers = @project.project_handovers.group_by(&:ownerable_type).map{|k,v|  hash[k] = v.sort_by(&:file_version).reverse.uniq(&:ownerable)}
    render json: hash, status: 200
  end

  # GET /project_handovers/1
  def show
    render json: @project_handover
  end

  # POST /project_handovers
  def create
    @project_handover = ProjectHandover.new(project_handover_params)

    if @project_handover.save
      render json: @project_handover, status: :created, location: @project_handover
    else
      render json: @project_handover.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /project_handovers/1
  def update
    if @project_handover.update(project_handover_params)
      render json: @project_handover
    else
      render json: @project_handover.errors, status: :unprocessable_entity
    end
  end

  # DELETE /project_handovers/1
  def destroy
    if @project_handover.status == "pending"
      @project_handover.destroy
      render json: {message: "File Deleted"}, status: 200
    else
      render json: {message: "File can not be deleted as this has been already shared"}, status: 403
    end
  end

  def grouped_index
    handover_status =  params[:status].present? ? YAML::load(params[:status]) : nil
    if params[:category].present? && params[:status].present? # all accepted production drawing files
      handovers = @project.project_handovers.where(status: params[:status], ownerable_type: YAML::load(params[:category]))
    elsif params[:parent_handover_id].present?
      handovers = handover_status.present? ? @project.project_handovers.where(status: handover_status, parent_handover_id: nil)  : @project.project_handovers.where(parent_handover_id: nil)
    else
      handovers =  handover_status.present? ? @project.project_handovers.where(status: handover_status)  : @project.project_handovers.all#.where(parent_handover_id: nil)
    end
    handovers = handovers.group_by(&:ownerable_type)
    #This flag is added for not fetching  child versions of a handover
    category_flag = params[:category].present? ? true : false
    ownerable_type_hash = Hash.new
    all_files = []
    handovers.each do |key, values|
      if values.present?
        values = values&.compact&.sort_by(&:file_version)&.reverse
        values_array = ProjectHandover.make_categorised_hash(values, category_flag).sort_by{|h| h[:status]}
        ownerable_type_hash["#{key}"] = values_array
        all_files.push key
      else
        next
      end
    end
    quatation_index = all_files.index('Quotation')
    if quatation_index && quatation_index > 0
      all_files[0], all_files[quatation_index] = all_files[quatation_index], all_files[0]
    end
    ownerable_type_hash["all_files"] = all_files
    ownerable_type_hash["handover_active"] = @project.project_handovers.where(status: "pending").present? ? true : false
    qcs = []
    design_qc = @project.project_quality_checks.design_qcs.last
    qcs << design_qc
    cost_qc = @project.project_quality_checks.cost_qcs.last
    qcs << cost_qc
    tech_qc = @project.project_quality_checks.tech_qcs.last
    qcs << tech_qc
    ownerable_type_hash["project_handover_qcs"] = qcs
    render json: {project_handover: ownerable_type_hash}, status: 200
  end


  #Share With category
  def share_with_category
    not_shared_handovers = @project.project_handovers.where(status: "pending")
    quotations = not_shared_handovers.where(ownerable_type: "Quotation").pluck(:ownerable_id)
    if not_shared_handovers.update(status: "pending_acceptance", shared_on: Time.zone.now, remarks: params[:remarks])
      @project.update(new_handover_file: true, last_handover_at: Time.zone.now)
      ProjectHandoverJob.perform_later(@project, not_shared_handovers.pluck(:id))
      @project.project_handovers.where(ownerable_type: "SiteMeasurementRequest", status: "pending_acceptance").update(status: "accepted", shared_on: Time.zone.now, status_changed_on: DateTime.now)
      Quotation.where(id: quotations).update(can_edit: false)
      # @project.project_handovers.where(ownerable_type: "Quotation", status: "pending_acceptance").update(status: "accepted")
      render json: {message: "Files Shared with Category"}, status: 200
    else
      render json: {message: "Files Not Shared, Please try again"}, status: 204
    end
  end

  def add_revision
     if @project_handover.status.in?(["pending"]) || @project_handover.child_versions.pluck(:status).include?("pending")
       return render json: {message: "Previous Version is still in pending state"}, status: 403
     else
       if @project_handover.child_versions.create!(ownerable_id: params[:owner_id], ownerable_type: @project_handover.ownerable_type, status: "pending", project_id: @project.id)
         UserNotifierMailer.revision_added(@project).deliver
         render json: {message: "Revision Added"}, status: 200
       else
         render json: {message: @project_handover.errors.full_messages}, status: :unprocessable_entity
       end
     end
  end

  def child_revisions
    hash = Hash.new
    hash[:parent_details] = @project_handover.as_json
    handovers =  @project_handover.child_versions.group_by(&:ownerable_type)
    ownerable_type_hash = Hash.new
    handovers.each do |key, values|
      values_to_pass = []
      values = values.sort_by(&:file_version).reverse.drop(1)
      values_to_pass << values
      values_to_pass << @project_handover
      values_to_pass = values_to_pass.flatten.sort_by(&:file_version)
      values_array = ProjectHandover.make_categorised_hash(values_to_pass, true)
      ownerable_type_hash["#{key}"] = values_array.reverse
    end
    hash[:child_details] = ownerable_type_hash
    render json: {project_handover:  hash}, status: 200
  end

  # Change the status of a handover
  def category_action_on_handover
    if @project_handover.ownerable_type == "Quotation"
      unless current_user.has_any_role?(:admin, :category_head) || current_user.segment_edit_access?(params[:segment])
        raise CanCan::AccessDenied
      end
      if @project_handover.process_handover_action(current_user, params)
        UserNotifierMailer.category_handover_action(@project_handover, @project, current_user, { segment: params[:segment] }).deliver_later
        render json: {message: "File #{params[:status]}"}, status: 200
      else
        render json: {message: @project_handover.errors.full_messages}, status: 422
      end        
    else
      unless current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)
        raise CanCan::AccessDenied
      end
      if @project_handover.update(status: params[:status], status_changed_on: DateTime.now, remarks: params[:remarks], status_updated_by: current_user)
        UserNotifierMailer.category_handover_action(@project_handover, @project, current_user).deliver_later
        render json: {message: "File #{params[:status]}"}, status: 200
      else
        render json: {message: @project_handover.errors.full_messages}, status: 422
      end
    end
  end

  # upload files from category
  # Create handover it and make status as accepted
  def upload_files_from_category
    unless current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES) 
      return render json: {message: "You are not authorized to perform this action"}, status: 401
    end

    if params[:files_to_upload].present?
      if params[:files_to_upload][:upload_type] == "CadDrawing"
        @upload = @project.cad_drawings.create!(name: params[:files_to_upload][:name], cad_drawing: params[:files_to_upload][:upload_file],
          cad_drawing_file_name: params[:files_to_upload][:file_name])
      elsif params[:files_to_upload][:upload_type].in?(["ThreeDImage", "ReferenceImage"])
        @upload = params[:files_to_upload][:upload_type].classify.constantize.create!(name: params[:files_to_upload][:name],project_id: @project.id)
        @content = @upload.build_content(document: params[:files_to_upload][:upload_file], scope: params[:files_to_upload][:upload_type].underscore,
          document_file_name: params[:files_to_upload][:file_name])
        @content.save!
      else
        return render json: {message: "Upload Type is not included"}, status: :unprocessable_entity
      end
      @project_handover = @project.project_handovers.create!(ownerable: @upload, status: "accepted", shared_on: DateTime.now, status_changed_on: DateTime.now, remarks: "Created and Accepted by Category", created_by: current_user, category_upload: true)
      # render json: @project_handover, status: :created
      return render json: {message: "File Uploaded"}, status: 200
    else
      render json: {message: "Please provide proper parameters"}, status: 400
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_handover
      @project_handover = ProjectHandover.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def project_handover_params
      params.require(:project_handover).permit(:name, :ownerable_id, :ownerable_type, :project_id, :shared, :accepted,  :shared_on,  :status_changed_o, :remarks)
    end

    def set_project
      @project = Project.find(params[:project_id])
    end
end
