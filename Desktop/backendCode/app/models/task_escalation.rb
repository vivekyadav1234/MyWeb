# == Schema Information
#
# Table name: task_escalations
#
#  id             :integer          not null, primary key
#  task_set_id    :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  task_owner     :integer
#  start_time     :datetime
#  end_time       :datetime
#  completed_at   :datetime
#  remark         :text
#  status         :string           default("no")
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  is_new         :boolean          default(TRUE)
#  seen           :boolean          default(FALSE)
#

class TaskEscalation < ApplicationRecord
	has_paper_trail

  belongs_to :task_set
  belongs_to :ownerable, polymorphic: true
	validates_uniqueness_of :task_set, scope: :ownerable

	def self.invoke_task(task_sets, stage, object)
		task_sets.each do |taskSet|
			@task_set = TaskSet.find_by(task_name: taskSet, stage: stage)
			@taskescalation = self.new(task_set: @task_set, ownerable: object)
			# @taskescalation.task_owner = task_owner
			@taskescalation.start_time = DateTime.now
			@taskescalation.end_time = @taskescalation.start_time + @task_set.duration_in_hr.to_f.hours
			@taskescalation.save!
		end
		# invoke_next_optional_task
	end

	def self.mark_done_task(task_name, stage, object)
		@task_set = TaskSet.find_by(task_name: task_name, stage: stage)
		@taskescalation = object.task_escalations.find_by_task_set_id(@task_set.id)
		@taskescalation.update(status: "yes", completed_at: DateTime.now, seen: true) if @taskescalation.present?
		pending_task = TaskEscalation.check_pending_task(object)
		next_task = @task_set.next_compulsory_task
		TaskEscalation.invoke_task([next_task.task_name], next_task.stage, object) if !pending_task && next_task.present?
	end

	def self.undo_mark_done_task(task_name, stage, object)
		@task_set = TaskSet.find_by(task_name: task_name, stage: stage)
		@taskescalation = object.task_escalations.find_by_task_set_id(@task_set.id)
		@taskescalation.update(status: "no", completed_at: nil) if @taskescalation.present?
	end

	def self.destroy_task(object)
		@taskescalations = object.task_escalations.where(status: "no")
		@taskescalations.map{|task| task.destroy} if @taskescalations.present?
	end

	def self.check_pending_task(object)
		object.task_escalations.where(status: "no").present?
	end

	def self.check_for_escalation
		@escalated_tasks = TaskEscalation.where(status: 'no').where("end_time > ?", DateTime.now)
		@escalated_tasks.each do |task|
			@task_set = task.task_set
			if @task_set&.notify_to.present?
				emails = []
				@task_set.notify_to.each do |role|
					emails << task.get_emails(role, task)
				end
				emails = emails.flatten
				# UserNotifierMailer.task_escalated_email(task,emails).deliver_later!(wait_until: DateTime.now + 6.hours)
			end
		end if @escalated_tasks.present?
	end

	def get_emails(role, task)
		email = []
		if role == "community_manager"
			if task.ownerable_type == "Project"
			  email << task.ownerable&.assigned_designer&.cm&.email
			elsif task.ownerable_type == "Quotation"
				email << task.ownerable&.designer&.cm&.email
			end
		elsif role == "designer"
			if task.ownerable_type == "Project"
			  email << task.ownerable&.assigned_designer&.email
			elsif task.ownerable_type == "Quotation"
				email << task.ownerable&.designer&.email
			end
		elsif role == "business_head"
      email << User.joins(:roles).where(roles: {name: "business_head"} ).pluck(:email)
		end

		email
	end

	def self.filter_task_escalations(filter_options, projects, tasks)
		@tasks = tasks
		@projects = projects
		filter_options = JSON.parse(filter_options)
		if filter_options["wip_status"].present?
			@projects = @projects.where(status: filter_options["wip_status"])
			@quotations = Quotation.where(project_id: @projects.ids).where.not(status: "draft")
			@tasks = @tasks.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @projects.ids, @quotations.ids)
		end

		if filter_options["lead_id"].present?
			@projects = @projects.where(lead_id: filter_options["lead_id"])
			@quotations = Quotation.where(project_id: @projects.ids).where.not(status: "draft")
			@tasks = @tasks.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @projects.ids, @quotations.ids)
		end

		if filter_options["task_status"] == "overdue"
			@tasks = @tasks.where("end_time < ? and status = ?", DateTime.now, "no")
		end

		if filter_options["stage"].present?
			@tasks = @tasks.joins(:task_set).where(task_sets: {stage: filter_options["stage"]})
		end
		@tasks
	end

	def self.sort_tasks(sort_by,projects, tasks)
		@tasks = tasks
		@projects = projects
		sort_by = JSON.parse(sort_by)
		if sort_by["column_name"] == "due_date"
			@tasks = @tasks.order("end_time #{sort_by["order_by"]}")
		elsif sort_by["column_name"] == "lead_name"
			@temp_task = ""
			@projects = Project.joins(:lead).select("projects.id, leads.name").where(id: @projects.ids).order("leads.name #{sort_by["order_by"]}")
			@projects.each do |project|
				pr_task = @tasks.where("(ownerable_type = 'Project' AND ownerable_id = ?)", project.id)
				@quotations = Quotation.where(project_id: project.id).where.not(status: "draft")
				qu_task = @tasks.where("(ownerable_type = 'Quotation' AND ownerable_id in(?))",@quotations.ids)

				if @temp_task == "" && pr_task.present?
					@temp_task = pr_task
					@temp_task += qu_task
				elsif @temp_task == "" && qu_task.present? && !pr_task.present?
					@temp_task = qu_task
				else
					@temp_task += pr_task if pr_task.present?
					@temp_task += qu_task if qu_task.present?
				end
			end
			task_ids = @temp_task.pluck(:id)
			@tasks = @tasks.where(id: task_ids).order_as_specified(id: task_ids)
			# @tasks = @tasks.where("(ownerable_type = 'Project' AND ownerable_id in(?)) OR (ownerable_type = 'Quotation' AND ownerable_id in(?))", @projects.ids, @quotations.ids)
		end
		@tasks
	end

private
	# def invoke_optional_task

	# end

end
