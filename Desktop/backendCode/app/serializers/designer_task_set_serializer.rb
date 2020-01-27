class DesignerTaskSetSerializer
  include FastJsonapi::ObjectSerializer

	def serializable_hash
    data = super
    data[:data]
  end

  attribute :id 

  attribute :lead_id do |object|
    if object.ownerable_type == "Project"
      object.ownerable.lead_id
    elsif object.ownerable_type == "Quotation"
      object.ownerable.project.lead_id
    end
  end

  attribute :lead_name do |object|
    if object.ownerable_type == "Project"
      object.ownerable.lead.name
    elsif object.ownerable_type == "Quotation"
      object.ownerable.project.lead.name
    end
  end

  attributes :ownerable_id, :ownerable_type

  attribute :ownerable_name do |object|
    if object.ownerable_type == "Project"
      "Project Task"
    elsif object.ownerable_type == "Quotation"
      object.ownerable.reference_number
    end
  end

  attribute :next_task_name do |object|
    object.task_set.task_name
  end

  attribute :start_time

  attribute :time_left do |object|
    (( Time.parse(object.end_time.to_s) - Time.parse(DateTime.now.to_s))/3600).round if object
  end

  attribute :next_task_stage do |object|
    object.task_set.stage
  end


  attribute :lead_qualified_date do |object|
    if object.ownerable_type == "Project"
      object.ownerable.lead.status_updated_at
    elsif object.ownerable_type == "Quotation"
      object.ownerable.project.lead.status_updated_at
    end
  end

  attributes :end_time, :is_new

  

  attribute :project_status do |object|
    if object.ownerable_type == "Project"
      object.ownerable.status
    elsif object.ownerable_type == "Quotation"
      object.ownerable.project.status
    end
  end

  attribute :task_owner_name do |object|
    @task_set = object.task_set
    if object.ownerable_type == "Project" && @task_set.task_owner.in?(["designer", "community_manager"])
      if @task_set.task_owner == "designer"
        object.ownerable.assigned_designer.name.humanize
      else
        object.ownerable.assigned_designer&.cm.name.humanize
      end
    elsif object.ownerable_type == "Quotation" && @task_set.task_owner.in?(["designer", "community_manager"])
      if @task_set.task_owner == "designer"
        object.ownerable.project.assigned_designer.name.humanize
      else
        object.ownerable.project.assigned_designer&.cm.name.humanize
      end
    elsif @task_set.task_owner.in?(["category", "finance", "sitesupervisor", "cad"])
      @task_set.task_owner.humanize
    end
  end




 

  # attribute :client_info do |object|
  # 	lead = object.lead
  # 	{lead_id: lead.id, lead_name: lead.name, qualified_date: lead.updated_at}
  # end

  # # attribute :project_next_task do |object|
  # # 	object.task_escalations.where(status: "no")&.first&.task_set&.task_name
  # # end

  # # attribute :project_task_time_left do |object|
  # #   task = object.task_escalations.where(status: "no")&.first
  # #   (( Time.parse(task.end_time.to_s) - Time.parse(DateTime.now.to_s))/3600).round if task
  # # end


  # attribute :task_set_lists do |object|
  # 	arr = []
  #   project_task = object.task_escalations.where(status: "no")&.first
  #   arr.push({ownerable_id: object.id, ownerable_name: object.name, time_left: (( Time.parse(project_task.end_time.to_s) - Time.parse(DateTime.now.to_s))/3600).round,task_name: project_task.task_set.task_name, task_stage: project_task.task_set.stage}) if project_task.present?
  # 	object.quotations.each do |q|
  # 		task = q.task_escalations.where(status: "no")&.first
  # 		if task.present?
  # 			task_set = task&.task_set
  # 			arr.push({ownerable_id: task.ownerable_id, ownerable_name: q.reference_number, time_left: (( Time.parse(task.end_time.to_s) - Time.parse(DateTime.now.to_s))/3600).round,task_name: task_set&.task_name, task_stage: task_set&.stage})
  # 		end
  # 	end
  # 	arr
  # end

end