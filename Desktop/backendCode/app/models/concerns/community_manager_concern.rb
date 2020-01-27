# This module containes methods related to Csagents. This will prevent the User class from being bloated.
module CommunityManagerConcern
  extend ActiveSupport::Concern

  def customer_count_cm(leads,designer_id, current_user)
    counthash = Hash.new
    #converted_leads belonging to my designers
    # converted_leads = leads_for_my_designers

    assigned_hash = User.customers_with_status_cm(leads,designer_id)
    leads_assigned = assigned_hash[:leads_assigned]
    leads_not_assigned = assigned_hash[:leads_not_assigned]
    leads_no_projects = assigned_hash[:leads_no_projects]
    counthash[:leads_assigned] = leads_assigned.count
    counthash[:leads_not_assigned] = leads_not_assigned.count
    counthash[:leads_no_projects] = leads_no_projects.count
    counthash[:leads_dropped] = assigned_hash[:leads_dropped].count
    counthash[:leads_assigned_lost] = assigned_hash[:leads_assigned_lost].count
    counthash[:leads_assigned_not_contactable] = assigned_hash[:leads_assigned_not_contactable].count
    counthash[:leads_assigned_follow_up] = assigned_hash[:leads_assigned_follow_up].count
    counthash[:leads_assigned_after_wip] = assigned_hash[:leads_assigned_after_wip].count
    counthash[:leads_delayed_possession] = assigned_hash[:leads_delayed_possession].count
    counthash[:leads_delayed_project] = assigned_hash[:leads_delayed_project].count

    # puts "+++++++++#{counthash.inspect}++++++++"
    # unless designer_id.present?
    #   hash = Hash.new
    #   designer = User.find designer_id
    #   hash["id"] = user.id
    #   hash["name"] = user&.name
    #   hash["email"] = user&.email
    #   hash["leads_assigned_#{status}".to_sym] = public_send(:assigned_customers_with_status, leads_assigned, status, designer.id).count
    #   designer_data_hash.push hash
    # else
    #   designers = current_user.designers_for_cm
    #   designer_data_hash = []
    #   designers.each do |designer|
    #     hash = Hash.new
    #     hash["id"] = designer.id
    #     hash["name"] = designer&.name
    #     hash["email"] = designer&.email
    #     # Project::ALLOWED_CUSTOMER_STATUSES.each do |status|
    #     #   hash["leads_assigned_#{status}".to_sym] = public_send(:assigned_customers_with_status, leads_assigned, status, designer.id).count
    #     # end
    #     designer_data_hash.push hash
    #   end
    # end
    # counthash[:designer_data] = designer_data_hash
    counthash
  end

  def cm_dashboard_designers_actionable_count(leads, current_user)
    designer_data_hash = []

    leads_assigned = leads.joins(:designer_projects).where(designer_projects: {active: true}).distinct.order("designer_projects.created_at DESC")
    if current_user.has_role?(:city_gm)
      cm_ids = current_user.cms.pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)
    elsif current_user.has_role?(:design_manager)
      cm_ids = current_user.dm_cms.pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)  
    elsif current_user.has_role?(:community_manager) 
      designer_id = current_user.designers_for_cm.pluck(:id)
    elsif current_user.has_role?(:business_head)
      cm_ids = User.with_role(:community_manager).pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)        
    end
    designers = User.where(id: designer_id).joins(:designer_detail).where(designer_details: {active: true})
    designers.each do |designer|
      hash = Hash.new
      hash["id"] = designer.id
      hash["name"] = designer&.name
      hash["email"] = designer&.email
      hash["actionable_count"] = leads.joins(designer_projects: :project).where(designer_projects: { active: true, designer_id: designer.id }, projects: { status: Project::ALLOWED_CUSTOMER_STATUSES }).group("projects.status").count
      hash["total_count"] = hash["actionable_count"].values.compact.sum
      #"pre_10_percent", "10_50_percent", "50_percent", "installation"
      if hash["actionable_count"]["wip"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["inactive"] if hash["actionable_count"]["inactive"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["on_hold"] if hash["actionable_count"]["on_hold"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["pre_10_percent"] if hash["actionable_count"]["pre_10_percent"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["10_50_percent"] if hash["actionable_count"]["10_50_percent"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["50_percent"] if hash["actionable_count"]["50_percent"].present?
        hash["actionable_count"]["wip"] += hash["actionable_count"]["installation"] if hash["actionable_count"]["installation"].present?
      end
      ### {"inactive"=>7, "lost"=>14, "not_contactable"=>4, "on_hold"=>7, "qualified"=>6, "wip"=>93}
      ### status for display -> follow_up lost qualified not_contactable wip handover
      #hash["total_count"] = hash["actionable_count"]&.select {|k,v| %w[follow_up lost qualified not_contactable wip handover].include? k}&.values&.compact&.sum
      designer_projects = designer.designer_projects
      hash["last_lead_assigned_on"] = designer_projects.present? ? designer_projects.order(created_at: :desc).first.created_at.strftime("%d-%m-%Y, %H:%M:%S") : nil
      designer_data_hash.push hash
    end
    
    designer_data_hash
  end

  def community_manager_actionable(cm,leads,designer)
    assigned_hash = User.customers_with_status_cm(leads,"")
    leads_count = Hash.new
    leads_count[:leads_pending_to_assign] = assigned_hash[:leads_not_assigned].count
    leads_count[:follow_up_calls_for_today] = customers_to_be_called_today_by_cm(cm,"follow_up").uniq.compact.count 
    leads_count[:not_contactable_calls_for_today] = customers_to_be_called_today_by_cm(cm,"follow_up_for_not_contactable").uniq.compact.count 
    leads_count[:escalated_calls] = customers_to_be_called_today_but_escalated_by_cm(cm).uniq.compact.count 
    leads_count[:meeting_scheduled_today] = meeting_scheduled_cm(cm).uniq.compact.count 
    leads_count[:escalated_meetings_for_community_manager] = escalated_meeting_scheduled_cm(cm).uniq.compact.count 

    #Designers
    if designer.present?
      designers = User.where(id: designer)
    else
      designers = cm.designers_for_cm
    end
      leads_count[:escalated_meetings_for_designer] = escalated_meeting_cm_designer(designers).uniq.count
      leads_count[:designer_no_action_taken] = cm_designer_no_action_taken(designers).uniq.count
      leads_count[:designer_follow_up_calls_for_today] = customers_to_be_called_today_by_cm_designers(designers,"follow_up").uniq.count
      leads_count[:designer_not_contactable_calls_for_today] = customers_to_be_called_today_by_cm_designers(designers,"follow_up_for_not_contactable").uniq.count
      leads_count[:designer_escalated_calls] = customers_to_be_called_today_but_escalated_cm_designers(designers).uniq.count
      leads_count[:designer_meeting_scheduled] = meeting_scheduled_cm_designer(designers).uniq.count


    designers.each do |designer|
      designer_deadline = cm.designer_deadlines_count(designer)
      leads_count[:deadline_qualified] = leads_count[:deadline_qualified].to_i + designer_deadline[:qualified]
      leads_count[:deadline_follow_up] = leads_count[:deadline_follow_up].to_i + designer_deadline[:follow_up]
      leads_count[:deadline_not_contactable] = leads_count[:deadline_not_contactable].to_i + designer_deadline[:not_contactable]
    end

    leads_count
  end

  def meeting_scheduled_cm(cm)
    leads_1 = cm.events.where(status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day),ownerable_type: "Lead").where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).pluck(:ownerable_id)
    project_ids = cm.events.where(status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day),ownerable_type: "Project").where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).pluck(:ownerable_id)
    leads_2 = Project.where(id: project_ids).pluck(:lead_id).uniq.compact
    leads = leads_1 + leads_2
    leads.uniq    
  end

  def escalated_meeting_scheduled_cm(cm)
    # leads_1 = cm.events.where(status: ["scheduled","rescheduled"],ownerable_type: "Lead").where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).where("scheduled_at < ?", DateTime.now.beginning_of_day).pluck(:ownerable_id)
    project_ids = cm.events.where(status: ["scheduled","rescheduled"],ownerable_type: "Project").where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).where("scheduled_at < ?", DateTime.now.beginning_of_day).pluck(:ownerable_id)
    leads_id = Project.where(id: project_ids).pluck(:lead_id).uniq.compact
    leads_id.uniq
  end

  def customers_to_be_called_today_by_cm(cm,agenda)
    project_ids = cm.events.where(agenda: agenda,status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day),ownerable_type: "Project").pluck(:ownerable_id)
    leads_id = Project.where(id: project_ids).pluck(:lead_id).uniq.compact
    leads_id.uniq
  end

  def customers_to_be_called_today_but_escalated_by_cm(cm)
    project_ids = cm.events.where(agenda: ["follow_up","follow_up_for_not_contactable"],status: ["scheduled","rescheduled"],ownerable_type: "Project").where("scheduled_at < ?", DateTime.now.days_ago(1)).pluck(:ownerable_id)
    leads_id = Project.where(id: project_ids).pluck(:lead_id).uniq.compact
    leads_id.uniq
  end

  def assigned_customers_with_status(leads, status, designer_id)
    if designer_id.present? &&  designer_id > 0
      leads.joins(designer_projects: :project).where(designer_projects: { active: true, designer_id: designer_id }, projects: { status: status }).distinct
    else
      leads.joins(designer_projects: :project).where(designer_projects: { active: true }, projects: { status: status }).distinct
    end
  end

  def not_assigned_customers_with_status(leads, status, designer_id)
    if designer_id.present?
      leads.joins(designer_projects: :project).where(designer_projects: { active: true, designer_id: designer_id }, projects: { status: status }).distinct
    else
      leads.joins(:project).where(projects: {status: status}).distinct
    end
  end

  def assigned_customers_with_wip_status(leads, status)
    # lead_ids = leads.includes(:project, :designer_projects).find_all{|lead|
    #   designer_project = lead.designer_projects.where(active: true).take      
    #   status.include?(designer_project.project&.status)
    #   }.pluck(:id).uniq
    # Lead.where(id: lead_ids)

    leads.joins(designer_projects: :project).where(designer_projects: { active: true}, projects: {status: status}).distinct

  end

  def cm_designer_no_action_taken(designers)
    dps = DesignerProject.where(designer_id: designers,active: true).pluck(:project_id)
    evnt = designers.map{|designer| designer.events.where(ownerable_type: "Project",status: ["scheduled","rescheduled"]).pluck(:ownerable_id)}.flatten
    projects_without_event = dps - evnt
    lead_ids = Project.where(id: projects_without_event,status: "qualified").pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).uniq
  end

  def customers_for_cm_deadline(designers,status)
    date = DateTime.now.days_ago(1)
    dps = DesignerProject.where(designer_id: designers,active: true).pluck(:project_id)
    evnt = Event.where(ownerable_type: "Project",status:["scheduled","rescheduled"]).where("scheduled_at >= ?", date).pluck(:ownerable_id)
    events_without_project = dps - evnt
    lead_ids = Project.where(status: status,id: events_without_project).where("status_updated_at <= ?", date).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids)
  end

  def meeting_scheduled_cm_designer(designers)
    evnt = designers.map { |designer| 
          if designer.events.present?
            designer.events.where(status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day)).where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).pluck(:ownerable_id)
          end
     }.flatten
   lead_ids = Project.where(id: evnt).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).uniq
  end

  def escalated_meeting_cm_designer(designers)
    evnt = designers.map { |designer| 
          if designer.events.present?
            designer.events.where(status: ["scheduled","rescheduled"]).where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).where("scheduled_at < ?", DateTime.now.days_ago(1)).pluck(:ownerable_id)
          end
     }.flatten
   lead_ids = Project.where(id: evnt).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).uniq
  end

  def customers_to_be_called_today_by_cm_designers(designers,agenda)
    dps = DesignerProject.where(designer_id: designers,active: true).pluck(:project_id)
    evnt = designers.map{|designer| designer.events.where(agenda: agenda,status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day),ownerable_id: dps).pluck(:ownerable_id)}.flatten
    lead_ids = Project.where(id: evnt).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).uniq
  end

  def customers_to_be_called_today_but_escalated_cm_designers(designers)
     evnt = designers.map { |designer| 
          if designer.events.present?
            designer.events.where(agenda: ["follow_up","follow_up_for_not_contactable"],status: ["scheduled","rescheduled"]).where("scheduled_at < ?", DateTime.now.days_ago(1)).pluck(:ownerable_id)
          end
     }.flatten
    lead_ids = Project.where(id: evnt).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).uniq
  end

  #Leads for whom users (role :designer) have been assigned to this cm
  def leads_for_my_designers
    if self.has_role?(:city_gm)
      cm_ids = self.cms.pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)
    elsif self.has_role?(:design_manager)
      cm_ids = self.dm_cms.pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)  
    elsif self.has_role?(:community_manager) 
      designer_id = self.designers_for_cm.pluck(:id)
    elsif self.has_role?(:business_head)
      cm_ids = User.with_role(:community_manager).pluck(:id)
      designer_id = User.where(cm_id: cm_ids).pluck(:id)        
    end
    Lead.customer_only.joins(:designer_projects).where(designer_projects: { designer_id: designer_id }).
      where(lead_status: 'qualified').distinct
    # leads_to_consider_ids = designers_for_cm.map{|designer| designer.related_leads.pluck(:id)}.flatten.uniq
    # leads_to_consider = Lead.where(id: leads_to_consider_ids)
  end

  class_methods do
    def customers_with_status_cm(leads,designer_id)
      leads_without_dropped = leads.where.not(lead_status: 'dropped')
      leads_assigned = leads_without_dropped.joins(:designer_projects).where(designer_projects: {active: true}).distinct
      leads_no_projects = leads_without_dropped.where.not(id: leads.joins(:project).distinct)
      leads_assigned = leads_assigned.includes(:designer_projects).order("designer_projects.created_at DESC")
      assigned_leads_projects = leads_assigned.joins(:project)
      delayed_possession_leads = leads.joins(:project).where(projects: { status: "delayed_possession" })
      delayed_project_leads = leads.joins(:project).where(projects: { status: "delayed_project" })
      
      assigned_and_delayed_leads = leads_assigned+delayed_possession_leads+delayed_project_leads

      leads_not_assigned = leads_without_dropped.where.not(id: assigned_and_delayed_leads).order("status_updated_at DESC")


      hash = Hash.new
      hash[:leads_assigned] = leads_assigned
      hash[:leads_not_assigned] = leads_not_assigned
      hash[:leads_no_projects] = leads_no_projects
      # hash[:leads_dropped] = Lead.where(lead_status: 'dropped').order("created_at DESC")   #change later
      hash[:leads_dropped] = leads.where(lead_status: 'dropped').order("created_at DESC")
      hash[:leads_assigned_lost] = assigned_leads_projects.where(projects: {status: "lost"}).distinct
      hash[:leads_assigned_not_contactable] = assigned_leads_projects.where(projects: {status: "not_contactable"}).distinct
      hash[:leads_assigned_follow_up] = assigned_leads_projects.where(projects: {status: "follow_up"}).distinct
      hash[:leads_assigned_after_wip] = assigned_leads_projects.where(projects: {status: Project::AFTER_WIP_STATUSES}).distinct
      hash[:leads_delayed_possession] = delayed_possession_leads
      hash[:leads_delayed_project] = delayed_project_leads
      hash
    end
  end
end
