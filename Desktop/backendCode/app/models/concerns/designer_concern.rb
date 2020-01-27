# This module containes methods related to Designers. This will prevent the User class from being bloated.
module DesignerConcern
  extend ActiveSupport::Concern
  # Send count of customers whose projects are assigned to this designer, grouped by status.
  def customers_count(column_name,from_date,to_date)
    hash = Hash.new
    dps = designer_projects.where(active: true).where.not(lead_id: nil).pluck(:project_id)
    projects = Project.where(id: dps)
    Project::ALLOWED_CUSTOMER_STATUSES.each do |status|
      if status[0].to_i > 0
        @leads = public_send(:customers_with_status, projects, status)      
        if column_name.present?
          @leads = filter_leads(@leads,column_name,from_date,to_date)
        end
        hash["s_"+status] = @leads.count
      else 
        @leads = public_send(:customers_with_status, projects, status)      
        if column_name.present?
          @leads = filter_leads(@leads,column_name,from_date,to_date)
        end       
        hash[status] = @leads.count
      end
    end
    hash[:active_designer_projects] = dps.uniq.count
    hash[:customers_no_lead] = designer_projects.where(active: true).where(lead_id: nil).count
    hash
  end

  def filter_leads(leads,column_name,from_date,to_date)
    filter_options = Hash.new
    filter_options['column_name'] = column_name
    filter_options['from_date'] = from_date
    filter_options['to_date'] = to_date         
    Lead.filter_leads_for_designers(leads,filter_options)
  end

  def designer_actionable_counts(designer)
    hash = Hash.new
    hash[:qualified_but_no_actions_taken] = customers_with_status_without_date_filter(designer,"qualified").uniq.compact.count
    hash[:follow_up_calls_for_today] = customers_to_be_called_today(designer,"follow_up").uniq.compact.count 
    hash[:not_contactable_calls_for_today] = customers_to_be_called_today(designer,"follow_up_for_not_contactable").uniq.compact.count 
    hash[:escalated_follow_up_and_not_contactable] = customers_to_be_called_today_but_escalated(designer).uniq.compact.count
    hash[:meeting_scheduled] = meeting_scheduled_designer(designer).uniq.compact.count
    hash[:meeting_scheduled_escalated] = meeting_scheduled_escalated_designer(designer).uniq.compact.count
    hash
  end

  def qualified_but_no_actions_taken(designer)
    designer_projects_active = designer.designer_projects.where(active: true).where.not(lead_id: nil).pluck(:project_id)
    events = self.events.where(status: ["scheduled","rescheduled"],ownerable_type: "Project").pluck(:ownerable_id).uniq
    projects = Project.where(status: "qualified",id: designer_projects_active - events)
    customers_with_out_status_without_date_filter(projects)    
  end

  def customers_to_be_called_today(designer,agenda)
    events_for_designer = designer.events.where(agenda: agenda,status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day)).pluck(:ownerable_id)
    Project.where(id: events_for_designer).distinct
  end

  def customers_to_be_called_today_but_escalated(designer)
    events_for_designer = designer.events.where(agenda: ["follow_up","follow_up_for_not_contactable"],status: ["scheduled","rescheduled"]).where("scheduled_at < ?", DateTime.now.days_ago(1)).pluck(:ownerable_id)
    Project.where(id: events_for_designer).distinct
  end

  def meeting_scheduled_designer(designer)
    events_for_designer = designer.events.where(status: ["scheduled","rescheduled"],scheduled_at: (Time.now.beginning_of_day..Time.now.end_of_day),ownerable_type: "Project").where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).pluck(:ownerable_id)
    Project.where(id: events_for_designer).distinct
  end

  def meeting_scheduled_escalated_designer(designer)
     events_for_designer = designer.events.where(status: ["scheduled","rescheduled"],ownerable_type: "Project").where("scheduled_at < ?" ,  DateTime.now.days_ago(1)).where.not(agenda: ["follow_up","follow_up_for_not_contactable"]).pluck(:ownerable_id)
     Project.where(id: events_for_designer).distinct
  end

  def customers_with_status_without_date_filter(designer,status)
    events_for_designer = designer.events.where(ownerable_type: "Project",status: ["scheduled","rescheduled"]).pluck(:ownerable_id)
    dps = designer.designer_projects.where(active: true).pluck(:project_id)
    lead_ids = Project.where(status: status,id: dps - events_for_designer).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).distinct
  end

  def customers_with_out_status_without_date_filter(projects)
    lead_ids = projects.pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).distinct
  end

  def customers_with_status(projects, status)
    lead_ids = projects.where(status: status).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).distinct
  end

  def designer_deadlines_count(designer)
    hash = Hash.new
    hash[:qualified] = customers_for_deadline(designer,"qualified").count
    hash[:follow_up] = customers_for_deadline(designer,"follow_up").count
    hash[:not_contactable] = customers_for_deadline(designer,"not_contactable").count
    # hash[:no_design_submitted] = customers_for_design_not_submited(designer).count
    hash
  end

  def customers_for_design_not_submited(designer)
    designer_designs = designer.designs
    designer_project = designer.designer_projects.where(active: true).pluck(:id)
    floorplans = designer_designs.map { |design| design.floorplan_id  }.compact.uniq
    project_id = Floorplan.where(id: floorplans).pluck(:project_id).compact.uniq
    Project.where(id: designer_project - project_id).distinct
  end
  
  def customers_for_deadline(designer,status)
    date = DateTime.now.days_ago(1)
    designer_projects_active = designer.designer_projects.where(active: true).pluck(:project_id)
    project_id = Project.where(id: designer_projects_active,status: status).where("status_updated_at <= ?", date).pluck(:id).uniq.compact
    events_for_designer = designer.events.where(status: ["scheduled","rescheduled"]).where("scheduled_at >= ?", date).pluck(:ownerable_id)
    lead_ids = Project.where(id: project_id - events_for_designer).pluck(:lead_id).uniq.compact
    Lead.where(id: lead_ids).distinct
  end

  class_methods do
    # customers are leads here!
    def designer_dashboard_hash(designer, customers)
      hash = Hash.new
      leads = []
      dndStatus = InhouseCall.new
      customers.each do |customer|
        user = customer.project&.user
        temp = customer.attributes.symbolize_keys.slice(:id, :name, :email, :contact,  
          :pincode, :created_at).merge({
            # roles: customer.user_type,
            is_active: user&.is_active,
            gst_number: user&.gst_number,
            pan: user&.gst_number,
            kyc_approved: user.kyc_approved,
            avatar: user&.avatar&.url,
            address_proof: user&.address_proof&.url
          })

        project = customer.project
        designer_project = DesignerProject.where(project: project, designer: designer).last
         event_time_hash = Hash.new 
          Event::ALL_AGENDAS.each do |agenda|
            time = project.events.find_by(agenda: agenda,status: ["scheduled","rescheduled"])
            event_time_hash[(agenda+"_time").to_sym] = time.present? ? time.scheduled_at : nil
          end

        temp[:event_scheduled_at] = event_time_hash
        temp[:project_details] = project&.attributes
        temp[:lead_details] = customer.attributes
        temp[:customer_status] = project&.status
        temp[:customer_call_back_time] = (project.events.present? && ["scheduled","rescheduled"].include?(project.events.last.status.to_s)) ? project.events.last.scheduled_at : ""
        temp[:designer_assignement_date] = designer_project&.created_at
        temp[:customer_remarks] = project&.remarks
        temp[:customer_do_not_disturb] = JSON.parse(dndStatus.check_number(customer.contact))['Numbers']['DND']
        leads << temp
      end

      hash[:users] = leads
      hash
    end
  end
end