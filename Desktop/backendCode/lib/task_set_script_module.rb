module TaskSetScriptModule
	def create_tasks_for_existing_projects
		@projects = Project.where(status: Project::AFTER_WIP_STATUSES)
		@projects.each do |project|
			# invok pre bid tasks 
			invoke_pre_bid_tasks(project) 

			# invoke 10 % tasks
			invoke_ten_per_task(project)

			# invoke 40 % tasks
			invoke_forty_per_task(project)
		end
	end

	def invoke_pre_bid_tasks(project)
		invoke_task(["Upload Floor Plan", "Upload Requirement Sheet"], "pre bid", project)

		if project.floorplans.present?
			complete_task(["Upload Floor Plan"], "pre bid", project)
		end

		if project.project_requirement.present?
			complete_task(["Upload Requirement Sheet"], "pre bid", project)
		end

		if project.project_requirement.present? && project.floorplans.present?
			invoke_task(["Create Initial BOQ"], "10 %", project)
		end
	end

	def invoke_ten_per_task(project)
		@quotations = project.quotations

		if @quotations.present? 
			invoke_task(["Create Initial BOQ"], "10 %", project)
			complete_task(["Create Initial BOQ"], "10 %", project)

			@quotations.each do |quotation|
				if !quotation.parent_quotation || !quotation&.parent_quotation&.is_approved
					initial_quotation_tasks(project, quotation)
				end
			end
		end
	end

	def initial_quotation_tasks(project, quotation)
		invoke_task(["Create Proposal"], "10 %", quotation)
# proposal
		if quotation.proposals.present?
			complete_task(["Create Proposal"], "10 %", quotation)
			if quotation.discount_value.present? &&  quotation.discount_value != 0
				invoke_task(["Discount Proposal"], "10 %", quotation)
				complete_task(["Discount Proposal"], "10 %", quotation)
				if quotation.discount_status == "accepted"
					invoke_task(["Discount Approval"], "10 %", quotation)
					complete_task(["Discount Approval"], "10 %", quotation)
					invoke_task(["Proposal Sharing"], "10 %", quotation)
					initial_proposal_tasks(project, quotation)
				end
			else
				invoke_task(["Proposal Sharing"], "10 %", quotation)
				initial_proposal_tasks(project, quotation)
			end
		end
	end

# initial proposal Sharing
	
	def initial_proposal_tasks(project, quotation)
		if quotation.status == "shared"
			complete_task(["Proposal Sharing"], "10 %", quotation)
			invoke_task(["Client Approval"], "10 %", quotation)
			if quotation.is_approved
				complete_task(["Client Approval"], "10 %", quotation)
				invoke_task(["Scope Checklist"], "10 %", project)
				invoke_task(["Payment Addition"], "10 %", quotation)

				if project.scope_of_work.present?
					complete_task(["Scope Checklist"], "10 %", project)
					if quotation.payments.present?
						complete_task(["Payment Addition"], "10 %", quotation)
						invoke_task(["Payment Verification"], "10 %", quotation)
						if quotation.payments.pluck(:is_approved).include?(true)
							complete_task(["Payment Verification"], "10 %", quotation)
						end
					end
				end
			elsif quotation.is_approved == false
				complete_task(["Client Approval"], "10 %", quotation)
				quotation.task_escalations.where(status: "no").destroy_all
			end

		end
	end

# final tasks for project 

	def invoke_forty_per_task(project)
		@quotations = project.quotations.where.not(parent_quotation_id: nil)

		if project.site_measurement_requests.present? 
			invoke_task(["Request site measurement"], "10% - 40%", project)
			complete_task(["Request site measurement"], "10% - 40%", project)
			invoke_task(["Assign SS for site measurement"], "10% - 40%", project)
			site_measurements = project.site_measurement_requests
			if site_measurements.pluck(:sitesupervisor_id).present?
				complete_task(["Assign SS for site measurement"], "10% - 40%", project)
				invoke_task(["upload measurements"], "10% - 40%", project)
				if site_measurements.pluck(:request_status).include?("complete")
					complete_task(["upload measurements"], "10% - 40%", project)
					tasks_for_final_quotations(@quotations, project)					
				end
			end
		else
			tasks_for_final_quotations(@quotations, project)
		end
	end

	def tasks_for_final_quotations(boqs, project)
		@quotations = boqs
		@quotations.each do |quotation|
			if quotation.parent_quotation.is_approved
				invoke_task(["Create Final BOQ"], "10% - 40%", quotation)
				complete_task(["Create Final BOQ"], "10% - 40%", quotation)
				invoke_task(["Create Proposal"], "10% - 40%", quotation)
				if quotation.proposals.present?
					complete_task(["Create Proposal"], "10% - 40%", quotation)
					if quotation.discount_value.present? 
						invoke_task(["Discount Proposal"], "10% - 40%", quotation)
						complete_task(["Discount Proposal"], "10% - 40%", quotation)
						invoke_task(["Discount Approval"], "10% - 40%", quotation)
						if quotation.discount_status == "accepted"
							complete_task(["Discount Approval"], "10% - 40%", quotation)
							final_quotation_sharing_dependacy_tasks(quotation)							
						end
					else
						final_quotation_sharing_dependacy_tasks(quotation)
					end
				end
			end
		end
	end

	def final_quotation_sharing_dependacy_tasks(quotation)
		invoke_task(["Upload CAD files", "Approve Final BOQ by CM"], "10% - 40%", quotation)
		if quotation.cad_uploads.pluck(:status).include?("approved")
			complete_task(["Upload CAD files"], "10% - 40%", quotation)
			invoke_task(["Approve Final BOQ by Category"], "10% - 40%", quotation)
			if quotation.category_approval != nil
				complete_task(["Approve Final BOQ by Category"], "10% - 40%", quotation)
			end
		end

		if quotation.cm_approval != nil
			complete_task(["Approve Final BOQ by CM"], "10% - 40%", quotation)
		end

		if quotation.cm_approval && quotation.category_approval
			invoke_task(["Proposal Sharing"], "10% - 40%", quotation)
			final_quotation_sharing(quotation)
		elsif quotation.cm_approval == false || quotation.category_approval == false
			quotation.task_escalations.where(status: "no").destroy_all
		end
	end

	def final_quotation_sharing(quotation)
		if quotation.status == "shared"
			complete_task(["Proposal Sharing"], "10% - 40%", quotation)
			invoke_task(["Client Approval"], "10% - 40%", quotation)
			if quotation.is_approved
				complete_task(["Client Approval"], "10% - 40%", quotation)
				invoke_task(["Payment Addition"], "10% - 40%", quotation)
				if quotation.payments.present?
					complete_task(["Payment Addition"], "10% - 40%", quotation)
					invoke_task(["Payment Verification"], "10% - 40%", quotation)
					if quotation.payments.pluck(:is_approved).include?(true)
						complete_task(["Payment Verification"], "10% - 40%", quotation)
					end
				end

			elsif quotation.is_approved == false
				complete_task(["Client Approval"], "10% - 40%", quotation)
				quotation.task_escalations.where(status: "no").destroy_all
			end
		end
	end

	def invoke_task(task_sets, stage, object)
		task_sets.each do |taskSet|
			@task_set = TaskSet.find_by(task_name: taskSet, stage: stage)
			@taskescalation = TaskEscalation.find_or_create_by(task_set: @task_set, ownerable: object)
			@taskescalation.start_time = DateTime.now
			@taskescalation.end_time = @taskescalation.start_time + @task_set.duration_in_hr.to_f.hours
			@taskescalation.save!
		end
	end

	def complete_task(task_name, stage, object)
		@task_set = TaskSet.find_by(task_name: task_name, stage: stage)
		@taskescalation = object.task_escalations.find_by_task_set_id(@task_set.id)
		@taskescalation.update(status: "yes", completed_at: DateTime.now)
	end

	def invoke_optional_tasks
	  @projects = Project.where(status: Project::AFTER_WIP_STATUSES)
		@projects.each do |project|
			if project.custom_elements.present?
				@task_set = TaskSet.find_by(task_name: "Custom Elements Feasibility", stage: "10 %")
        @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
				if project.custom_elements.where.not(price: nil).present?
					@task_set = TaskSet.find_by(task_name: "Custom Elements Estimation", stage: "10 %")
     			@task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
				end
			end

			if project.presentations.present?
				@task_set = TaskSet.find_by(task_name: "Client PPT", stage: "10 %")
      	@task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
			end

			if project.events.where(contact_type: "experience_center").present?
				@task_set = TaskSet.find_by(task_name: "EC Visit", stage: "pre bid")
        @task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
			end

			if project.events.where(contact_type: "site_visit").present?
				@task_set = TaskSet.find_by(task_name: "Site Visit", stage: "pre bid")
      	@task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
			end

			if project.project_booking_form.present?
				@task_set = TaskSet.find_by(task_name: "Booking form", stage: "10 %")
				@task_set.task_escalations.where(ownerable: project).last.update(status: "yes", completed_at: DateTime.now) if @task_set.task_escalations.where(ownerable: project).present?
   			@task_set.task_escalations.create(ownerable: project, start_time: DateTime.now, end_time: DateTime.now + @task_set.duration_in_hr.to_f.hours, status: "yes", completed_at: DateTime.now) if !@task_set.task_escalations.where(ownerable: project).present?
			end
		end
	end
end