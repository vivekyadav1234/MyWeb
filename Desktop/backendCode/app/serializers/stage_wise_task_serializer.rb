class StageWiseTaskSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data]
  end

  attributes :id, :task_name, :optional

  attribute :task_escalation do |task, params|
  	task_escalation = nil
  	ownerable_objects = []
  	ownerable_objects << params[:project] 
  	ownerable_objects << params[:quotation] if params[:quotation].present?
  	@task_escalation = task.task_escalations.find_by(ownerable: ownerable_objects)
  	if @task_escalation.present?
  		task_escalation = {progress: @task_escalation.status}
  		task_escalation[:timer] = @task_escalation.status == "yes" ? (( Time.parse(@task_escalation.end_time.to_s) - Time.parse(@task_escalation.completed_at.to_s))/3600).round : (( Time.parse(@task_escalation.end_time.to_s) - Time.parse(DateTime.now.to_s))/3600).round
  	end
  	task_escalation
  end

end