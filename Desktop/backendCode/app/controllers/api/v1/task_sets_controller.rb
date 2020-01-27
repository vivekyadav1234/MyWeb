class Api::V1::TaskSetsController < Api::V1::ApiController
  before_action :set_project, only: [:get_pre_bid_tasks, :project_task_counts]
  before_action :set_quotation, only: [:get_ten_per_task_status, :get_ten_to_forty_per_tasks, :quotation_task_counts]
  before_action :set_task_escalation, only: [:mark_task_as_old]
  load_and_authorize_resource :task_set

  def designer_task_sets
    # if current_user.has_role?(:designer)
		  # @projects = current_user.active_assigned_projects.where(status: Project::AFTER_WIP_STATUSES)
    # elsif current_user.has_role?(:community_manager)
    #   @projects = Project.includes(:designer_projects).where(status: Project::AFTER_WIP_STATUSES, designer_projects: {designer_id: current_user.designers_for_cm&.ids, active: true})
    # end
    if current_user.has_role?(:designer)
      @projects = current_user.active_assigned_projects.where(status: Project::AFTER_WIP_STATUSES)
    elsif current_user.has_role?(:community_manager)
      @projects = Project.includes(:designer_projects).where(status: Project::AFTER_WIP_STATUSES, designer_projects: {designer_id: current_user.designers_for_cm&.ids, active: true})
    end
    @projects = @projects.search_projects(params[:search].to_s.downcase) if params[:search]
    @quotations = Quotation.where(project_id: @projects.ids).where.not(status: "draft")
    @tasks = TaskEscalation.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @projects.ids, @quotations.ids)
    hash_to_render = Hash.new
    hash_to_render[:lead_list] = Lead.joins(:project).select(:id, :name).where(projects: {id: @projects.ids})
    @tasks = @tasks.filter_task_escalations(params[:filter_by], @projects, @tasks) if params[:filter_by].present?
    @tasks = @tasks.sort_tasks(params[:sort_by], @projects, @tasks) if params[:sort_by].present?
    hash_to_render[:counts] = {outstanding: @tasks.where(status: "no").count, completed: @tasks.where(status: "yes").count, overdue: @tasks.where("end_time < ? and status = ?", DateTime.now, "no").count}
    hash_to_render[:designer_task_set] = paginate DesignerTaskSetSerializer.new(@tasks.where(status: "no")).serializable_hash , :per_page => 10
    render json: hash_to_render
  end

  def mark_task_as_old
    if @task_escalation.update(is_new: false)
      render json: {message: "Success"}, status: 200
    else
      render json: {message: "Something Went Wrong"}, status: 400
    end
  end

  def task_counts
    if current_user.has_role?(:designer)
      @projects = current_user.active_assigned_projects.where(status: Project::AFTER_WIP_STATUSES)
    elsif current_user.has_role?(:community_manager)
      @projects = Project.includes(:designer_projects).where(status: Project::AFTER_WIP_STATUSES, designer_projects: {designer_id: current_user.designers_for_cm&.ids, active: true})
    end
    @quotations = Quotation.where(project_id: @projects.ids)
    @tasks = TaskEscalation.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @projects.ids, @quotations.ids)
  	hash_to_render = {counts: {outstanding: @tasks.where(status: "no").count, completed: @tasks.where(status: "yes").count, overdue: @tasks.where("end_time < ? and status = ?", DateTime.now, "no").count}}
  	render json: hash_to_render
  end

  def quotation_task_counts
    quotation_ids = []
    if @quotation.parent_quotation.present?
      quotation_ids << @quotation.parent_quotation.id
    elsif @quotation.child_quotations.present?
      quotation_ids << @quotation.child_quotations.ids
    end
    quotation_ids << @quotation.id
    @tasks = TaskEscalation.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @quotation.project.id, quotation_ids)
    hash_to_render = {counts: {outstanding: @tasks.where(status: "no").count, completed: @tasks.where(status: "yes").count, overdue: @tasks.where("end_time < ? and status = ?", DateTime.now, "no").count}}
    render json: hash_to_render
  end

  def project_task_counts
    @quotations = @project.quotations
    @tasks = TaskEscalation.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @project.id, @quotations.ids)
    hash_to_render = {counts: {outstanding: @tasks.where(status: "no").count, completed: @tasks.where(status: "yes").count, overdue: @tasks.where("end_time < ? and status = ?", DateTime.now, "no").count}}
    render json: hash_to_render
  end

  def get_pre_bid_tasks
    @tasks = TaskSet.pre_bid_tasks
    task_hash = Hash.new
    task_hash[:stage_wise_task] = StageWiseTaskSerializer.new(@tasks, {params: {project: @project}}).serializable_hash
    task_hash[:lead_id] = @project.lead_id
    render json: task_hash
  end

  def get_ten_per_task_status
  	@tasks = TaskSet.ten_per_tasks
    task_hash = Hash.new
    @project = @quotation.project
    task_hash[:stage_wise_task] = StageWiseTaskSerializer.new(@tasks, {params: {project: @project, quotation: @quotation}}).serializable_hash
    task_hash[:quotation_id] = @quotation.id
    task_hash[:reference_number] = @quotation.reference_number
    task_hash[:project_id] = @project.id
    task_hash[:lead_id] = @project.lead_id
    task_hash[:child_quotation] = @quotation.child_quotations.where(is_approved: [nil,true])&.first&.id
  	render json: task_hash
  end

  def get_ten_to_forty_per_tasks
    @tasks = TaskSet.ten_to_forty_per_tasks
    task_hash = Hash.new
    @project = @quotation.project
    task_hash[:stage_wise_task] = StageWiseTaskSerializer.new(@tasks, {params: {project: @project, quotation: @quotation}}).serializable_hash
    task_hash[:quotation_id] = @quotation.id
    task_hash[:reference_number] = @quotation.reference_number
    task_hash[:project_id] = @project.id
    task_hash[:lead_id] = @project.lead_id
    task_hash[:parent_quotation] = @quotation.parent_quotation.id
    render json: task_hash
  end

  private

  	def set_project
  		@project = Project.find params[:project_id]
  	end

    def set_quotation
      @quotation = Quotation.find params[:quotation_id]
    end

    def set_task_escalation
      @task_escalation = TaskEscalation.find params[:task_escalation_id]
    end
end
