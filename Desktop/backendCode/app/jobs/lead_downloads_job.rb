class LeadDownloadsJob < ApplicationJob
  queue_as :default

  def perform(lead_ids,user)
  	cs_agents = User.with_role(:cs_agent).pluck(:id)
  	designer = User.with_role(:designer).pluck(:id)
  	cm = User.with_role(:community_manager).pluck(:id)

  	p = Axlsx::Package.new
    lead_spread_sheet = p.workbook
    sr_no = 1

     lead_spread_sheet.add_worksheet(:name => "Basic Worksheet") do |sheet|
      if user.present? and user.has_any_role?(:sales_manager)
        header_names = ['Sr. No.',
        'ID',
        'Name',
        'Email',
        'Role',
        'Contact', 
        'Instagram Handle',
        'Lead Type', 
        'MKW / Full home',
        'Status', 
        'Reason For Lost', 
        'Reason For Drop', 
        'Remark', 
        'Lead Source',
        'Lead App',
        'Lead Campaign',
        'Date of Aquisition',
        'Time of Aquisition', 
        'Timestamp of Aquisition',
        'Intended Date to Start Work', 
        'Date of Qualification',
        'Time of Qualification',
        'Timestamp of Qualification',
        'Assigned Designer',
        'Assigned Designer Email',
        'Designer Assigned Date',
        'Designer Assigned Time',
        'Designer Assigned Timestamp',
        'Designer Status',
        'Designer Latest Remarks',
        'Assigned CM',
        'Assigned CM Email',
        'CM Status',
        'Pincode',
        'Project Name',
        'Call Back Day',
        'Call Back Time',
        'Qualifying Agent',
        'Society/Building Name',
        'Location',
        'City',
        'Project Type',
        'Project Wip Status',
        'Project Wip Sub Status',
        'Type of Accommodation',
        'Type of Home',
        'Scope of work',
        'Possession status',
        'Estimated month of Possession',
        'Home Value(In Rs. Lacs)',
        'Budget Value(In Rs. Lacs)',
        'Lead Generator',
        'Do you have a home loan against the property?',
        'Do you have a floor plan?', 
        'Additional Comments',
        'Calls By CS Agent', 
        'Calls By CMs', 
        'Calls By Designers', 
        'No. of Meetings',
        'First Attempt By CS agent',
        'First Attempt By CS agent Time', 
        'First Attempt By CS agent Timestamp', 
        'Last Attempt By CS agent', 
        'Last Attempt By CS agent Time', 
        'Last Attempt By CS agent Timestamp', 
        'Last Status by CS Agent',
        'First Attempt By Designer', 
        'First Attempt By Designer Time', 
        'First Attempt By Designer Timestamp', 
        'Last Attempt By Designer',
        'Last Attempt By Designer Time',
        'Last Attempt By Designer Timestamp',
        'First Attempt By Community Manager', 
        'First Attempt By Community Manager Time', 
        'First Attempt By Community Manager Timestamp', 
        'Last Attempt By Community Manager', 
        'Last Attempt By Community Manager Time', 
        'Last Attempt By Community Manager Timestamp', 
        'No of hours between acquisition and first cs agent attempt', 
        'No of hours between designer assignment and first designer attempt', 
        'No of hours between cm assignment and first cm attempt', 
        'Lead First Displayed', 
        'Lead First Displayed Time',
        'Lead First Displayed Timestamp',
        'Follow Up Date', 
        'Follow Up Time', 
        'Follow Up Timestamp', 
        'Calling Date for Not Contactable',
        'Calling Time for Not Contactable',
        'Calling Timestamp for Not Contactable',
        'Date of First Meeting', 
        'Time of First Meeting',
        'Timestamp of First Meeting',
        'Referral Partner Name', 
        'Referral Partner Type', 
        'First Call Attempt by Designer', 
        'First Call Attempt by CM',
        'Project Remark',
        'Arrivae Champion'
        ]
      else
       header_names = ['Sr. No.',
       'ID',
       'Name',
       'Email',
       'Role',
       'Contact',
       'Instagram Handle',
       'Lead Type',
       'MKW / Full home',
       'Status',
       'Reason For Lost',
       'Reason For Drop',
       'Remark',
       'Lead Source',
       'Lead App',
       'Lead Campaign',
       'Date of Aquisition',
       'Time of Aquisition',
       'Intended Date to Start Work',
       'Timestamp of Aquisition',
       'Date of Qualification',
       'Time of Qualification',
       'Timestamp of Qualification',
       'Asigned CS Agent',
       'Assigned Designer',
       'Assigned Designer Email',
       'Designer Assigned Date',
       'Designer Assigned Time',
       'Designer Assigned Timestamp',
       'Designer Status',
       'Designer Latest Remarks',
       'Assigned CM',
       'Assigned CM Email',
       'CM Status',
       'Pincode',
       'Project Name',
       'Call Back Day',
       'Call Back Time',
       'Society/Building Name',
       'Location',
       'City',
       'Project Type',
       'Project Wip Status',
       'Project Wip Sub Status',
       'Type of Accommodation',
       'Type of Home',
       'Scope of work',
       'Possession status',
       'Estimated month of Possession',
       'Home Value(In Rs. Lacs)',
       'Budget Value(In Rs. Lacs)',
       'Qualifying Agent',
       'Do you have a home loan against the property?',
       'Do you have a floor plan?',
       'Additional Comments',
       'Calls By CS Agent',
       'Calls By CMs',
       'Calls By Designers',
       'No. of Meetings',
       'First Attempt By CS agent',
       'First Attempt By CS agent Time',
       'First Attempt By CS agent Timestamp',
       'Last Attempt By CS agent',
       'Last Attempt By CS agent Time',
       'Last Attempt By CS agent Timestamp',
       'Last Status by CS Agent',
       'First Attempt By Designer',
       'First Attempt By Designer Time',
       'First Attempt By Designer Timestamp',
       'Last Attempt By Designer',
       'Last Attempt By Designer Time',
       'Last Attempt By Designer Timestamp',
       'First Attempt By Community Manager',
       'First Attempt By Community Manager Time',
       'First Attempt By Community Manager Timestamp',
       'Last Attempt By Community Manager',
       'Last Attempt By Community Manager Time',
       'Last Attempt By Community Manager Timestamp',
       'No of hours between acquisition and first cs agent attempt',
       'No of hours between designer assignment and first designer attempt',
       'No of hours between cm assignment and first cm attempt',
       'Lead First Displayed',
       'Lead First Displayed Time',
       'Lead First Displayed Timestamp',
       'Follow Up Date',
       'Follow Up Time',
       'Follow Up Timestamp',
       'Calling Date for Not Contactable',
       'Calling Time for Not Contactable',
       'Calling Timestamp for Not Contactable',
       'Date of First Meeting',
       'Time of First Meeting',
       'Timestamp of First Meeting',
       'Referral Partner Name',
       'Referral Partner Type',
       'First Call Attempt by Designer',
       'First Call Attempt by CM',
       'Project Remark',
       'Qualifying Agent',
       'Arrivae Champion'
       ]
      end

      headers = Hash.new
      header_names.each_with_index do |n, i|
        headers[n] = i
      end

       sheet.add_row header_names

         leads = Lead.where(id: lead_ids)
         leads.find_each do |lead|
          # approved_value = lead.lead_status == 'qualified' ? 'Yes' : 'No'
          # type_value = lead.lead_status == 'qualified' ? lead.user_type : "Lead for #{lead.user_type}"
          # lead = Lead.find lead["id"]
          creator = lead.created_by.present? ? User.find(lead.created_by) : nil
          assigned_cs_agent = creator.present? ? creator.has_any_role?(:sales_manager) ? "Not Assigned" : creator.name : "Not Assigned"
          
          lead_project = lead&.project
          project_wip_time = lead_project&.wip_time

          lead_status = lead.lead_status.humanize
          lead_campaign_name = lead.campaign.present? ? lead.campaign.name : ""

          lead_source = lead.lead_source
          if lead.lead_source.present?
           lead_source = lead.lead_source.name.humanize
          end

          lead_qualified_date = nil
          lead_qualified_by = nil
          if lead.lead_status == "qualified"
            lead_qualified_date =  lead.status_updated_at 
            lead_versions =  lead.versions.where(event: "update")
            lead_versions.each do |version|
              changes = YAML::load version.object_changes if version.present? && version.object_changes.present?
              if changes.present? && changes["lead_status"].present? && changes["lead_status"][1] == "qualified" && version.whodunnit.present?  
               lead_qualified_by = User.find(version.whodunnit).name
              end
            end
          end

          if lead.note_records.present?
             project_detail_data = lead.note_records.last
             project_name = project_detail_data.project_name
             project_call_back_day = project_detail_data.call_back_day
             project_call_back_time = project_detail_data.call_back_time
             project_society = project_detail_data.society
             project_location = project_detail_data.location
             project_city = project_detail_data.city
             project_type = project_detail_data.project_type
             project_type_of_accommodation = project_detail_data.accomodation_type
             project_type_home = project_detail_data.home_type
             project_scope_of_work = project_detail_data.scope_of_work.present? ?  project_detail_data.scope_of_work.map { |i|  i.to_s }.join(",") : ""
             project_possession_status = project_detail_data.possession_status
             project_estimated_possession_month =  project_detail_data.possession_status_date
             project_home_value = project_detail_data.home_value
             project_budget_value = project_detail_data.budget_value
             project_lead_generator = project_detail_data.lead_generator
             project_have_loan = project_detail_data.have_homeloan
             project_have_floor_plan = project_detail_data.have_floorplan
             project_comments = project_detail_data.notes
          end
          first_meeting_time = lead_project&.events&.where(agenda: "first_meeting")&.first

          assigned_cm = lead.assigned_cm
          pincode = lead.pincode

          if lead.project.present? && lead.project.assigned_designer.present?
            assigned_designer = lead.project&.assigned_designer
            designer_assigned_at = lead.project&.designer_projects.where(designer_id: assigned_designer)&.last
          end

          calls_by_cs_agent = lead.number_of_calls_by_user(cs_agents)
          calls_by_cm = lead.number_of_calls_by_user(cm)
          calls_by_designer = lead.number_of_calls_by_user(designer)
          no_of_meeting = project_wip_time.present? ? (lead.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count + lead.project.events.where("created_at > ? and scheduled_at < ?", project_wip_time, DateTime.now).count) : 0

          lead_history = lead.lead_attempt_history(lead, cs_agents, designer, cm)

          ownerablesArray = lead.project.present? ? [lead, lead.project] : lead
          follow_up_event = Event.where(ownerable: ownerablesArray, agenda: "follow_up", status: "scheduled").last if lead.lead_status == "follow_up"
          nc_event = Event.where(ownerable: ownerablesArray, agenda: ["follow_up_for_not_contactable", "not_contactable"], status: "scheduled").last if lead.lead_status == "not_contactable"

          follow_up_time = follow_up_event.present? ? follow_up_event.scheduled_at : nil
          not_contactable_time = nc_event.present? ? nc_event.scheduled_at : nil
          designer_first_call = lead.inhouse_call.where(user_id: designer)&.order("created_at ASC")&.first
          cm_first_call = lead.inhouse_call.where(user_id: cm)&.order("created_at ASC")&.first

          referral_partner = User.find(lead.referrer_id) if lead.referrer_id.present? && lead.referrer_type.in?(["broker", "referral", "employee_referral", "design_partner_referral", "client_referral", "display_dealer_referral", "non_display_dealer_referral"])
          lead_created_by = User.find(lead.created_by) if lead.created_by.present?

          if lead_created_by.present? && referral_partner.blank? && lead_created_by.has_any_role?(:broker, :referral, :employee_referral, :design_partner_referral, :client_referral, :display_dealer_referral, :non_display_dealer_referral)
            referral_partner = lead_created_by
          end

          if lead.lead_status == "lost" && lead.lost_reason == "others"
            remark = lead.lost_remark
          else
            remark = lead.remark
          end

          row_array = []
          row_array[headers['Sr. No.']] = sr_no
          row_array[headers['ID']] = lead.id
          row_array[headers['Name']] = lead.name
          row_array[headers['Email']] = lead.email
          row_array[headers['Role']] = lead.user_type
          row_array[headers['Contact']] = lead.contact
          row_array[headers['Instagram Handle']] = lead.instagram_handle
          row_array[headers['Lead Type']] = lead&.lead_type&.name
          row_array[headers['MKW / Full home']] = lead.tag&.name&.humanize
          row_array[headers['Status']] = lead_status
          row_array[headers['Reason For Lost']] = lead.lost_reason&.humanize
          row_array[headers['Reason For Drop']] = lead.drop_reason&.humanize
          row_array[headers['Remark']] = remark
          row_array[headers['Lead Source']] = lead_source
          row_array[headers['Lead App']] = lead.source == "app" ? "Yes" : "No"
          row_array[headers['Lead Campaign']] = lead_campaign_name
          row_array[headers['Date of Aquisition']] = lead.created_at.in_time_zone('Asia/Kolkata').strftime("%d-%m-%Y")
          row_array[headers['Time of Aquisition']] = lead.created_at.in_time_zone('Asia/Kolkata').strftime("%I:%M:%S %p")
          row_array[headers['Timestamp of Aquisition']] = lead.created_at&.in_time_zone('Asia/Kolkata').strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Intended Date to Start Work']] = lead.note_records&.last&.intended_date&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Date of Qualification']] = lead_qualified_date&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Time of Qualification']] = lead_qualified_date&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['Timestamp of Qualification']] = lead_qualified_date&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          if user.present? and user.has_any_role?(:sales_manager)
            ##
          else
            row_array[headers['Asigned CS Agent']] = assigned_cs_agent
          end
          row_array[headers['Assigned Designer']] = assigned_designer&.name
          row_array[headers['Assigned Designer Email']] = assigned_designer&.email
          row_array[headers['Designer Assigned Date']] = designer_assigned_at&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y") if designer_assigned_at.present?
          row_array[headers['Designer Assigned Time']] =designer_assigned_at&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p") if designer_assigned_at.present?
          row_array[headers['Designer Assigned Timestamp']] =designer_assigned_at&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p") if designer_assigned_at.present?
          row_array[headers['Designer Status']] = lead_history[:designer_last_status]&.humanize
          row_array[headers['Assigned CM']] = assigned_cm&.name
          row_array[headers['Assigned CM Email']] = assigned_cm&.email
          row_array[headers['CM Status']] = lead_history[:cm_last_status]&.humanize
          row_array[headers['Pincode']] = pincode
          row_array[headers['Project Name']] = project_name
          row_array[headers['Call Back Day']] = project_call_back_day
          row_array[headers['Call Back Time']] = project_call_back_time
          row_array[headers['Society/Building Name']] = project_society
          row_array[headers['Location']] = project_location
          row_array[headers['City']] = project_city
          row_array[headers['Project Type']] = project_type
          row_array[headers['Type of Accommodation']] = project_type_of_accommodation
          row_array[headers['Type of Home']] = project_type_home
          row_array[headers['Scope of work']] = project_scope_of_work
          row_array[headers['Possession status']] = project_possession_status
          row_array[headers['Estimated month of Possession']] = project_estimated_possession_month
          row_array[headers['Home Value(In Rs. Lacs)']] = project_home_value
          row_array[headers['Budget Value(In Rs. Lacs)']] = project_budget_value
          # row_array[headers['Lead Generator']] = project_lead_generator
          row_array[headers['Qualifying Agent']] = lead_qualified_by
          row_array[headers['Do you have a home loan against the property?']] = project_have_loan
          row_array[headers['Do you have a floor plan?']] = project_have_floor_plan
          row_array[headers['Additional Comments']] = project_comments
          row_array[headers['Calls By CS Agent']] = calls_by_cs_agent
          row_array[headers['Calls By CMs']] = calls_by_cm
          row_array[headers['Calls By Designers']] = calls_by_designer
          row_array[headers['No. of Meetings']] = no_of_meeting
          row_array[headers['First Attempt By CS agent']] = lead_history[:cs_agent_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['First Attempt By CS agent Time']] = lead_history[:cs_agent_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['First Attempt By CS agent Timestamp']] = lead_history[:cs_agent_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Last Attempt By CS agent']] = lead_history[:cs_agent_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Last Attempt By CS agent Time']] = lead_history[:cs_agent_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['Last Attempt By CS agent Timestamp']] = lead_history[:cs_agent_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Last Status by CS Agent']] = lead_history[:cs_agent_last_attempt_status]
          row_array[headers['First Attempt By Designer']] = lead_history[:designer_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['First Attempt By Designer Time']] = lead_history[:designer_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['First Attempt By Designer Timestamp']] = lead_history[:designer_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Last Attempt By Designer']] = lead_history[:designer_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Last Attempt By Designer Time']] = lead_history[:designer_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['Last Attempt By Designer Timestamp']] = lead_history[:designer_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['First Attempt By Community Manager']] = lead_history[:cm_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['First Attempt By Community Manager Time']] = lead_history[:cm_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['First Attempt By Community Manager Timestamp']] = lead_history[:cm_first_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Last Attempt By Community Manager']] = lead_history[:cm_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Last Attempt By Community Manager Time']] = lead_history[:cm_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['Last Attempt By Community Manager Timestamp']] = lead_history[:cm_last_attempt_date]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['No of hours between acquisition and first cs agent attempt']] = lead_history[:hours_defference_cs_agent]
          row_array[headers['No of hours between designer assignment and first designer attempt']] = lead_history[:hours_defference_designer]
          row_array[headers['No of hours between cm assignment and first cm attempt']] = lead_history[:hours_defference_cm]
          row_array[headers['Lead First Displayed']] = lead_history[:lead_first_display]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y")
          row_array[headers['Lead First Displayed Time']] = lead_history[:lead_first_display]&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")
          row_array[headers['Lead First Displayed Timestamp']] = lead_history[:lead_first_display]&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Follow Up Date']] = follow_up_time&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y") if follow_up_time.present?
          row_array[headers['Follow Up Time']] = follow_up_time&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")  if follow_up_time.present?
          row_array[headers['Follow Up Timestamp']] = follow_up_time&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")  if follow_up_time.present?
          row_array[headers['Calling Date for Not Contactable']] = not_contactable_time&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y") if not_contactable_time.present?
          row_array[headers['Calling Time for Not Contactable']] = not_contactable_time&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p")  if not_contactable_time.present?
          row_array[headers['Calling Timestamp for Not Contactable']] = not_contactable_time&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")  if not_contactable_time.present?
          row_array[headers['Project Wip Status']] = lead_project&.status.in?(Project::AFTER_WIP_STATUSES) ? lead_project&.status&.humanize : ""
          row_array[headers['Project Wip Sub Status']] = lead_project&.status.in?(Project::AFTER_WIP_STATUSES) ? lead_project&.sub_status&.humanize : ""
          row_array[headers['Designer Latest Remarks']] = lead_history[:designer_latest_remark]
          row_array[headers['Date of First Meeting']] = first_meeting_time&.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y") if first_meeting_time.present? && first_meeting_time.status == "done"
          row_array[headers['Time of First Meeting']] = first_meeting_time&.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%I:%M:%S %p") if first_meeting_time.present? && first_meeting_time.status == "done"
          row_array[headers['Timestamp of First Meeting']] = first_meeting_time&.scheduled_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p") if first_meeting_time.present? && first_meeting_time.status == "done"
          row_array[headers['Referral Partner Name']] = referral_partner&.name&.humanize
          row_array[headers['Referral Partner Type']] = referral_partner&.roles&.first&.name&.humanize
          row_array[headers['First Call Attempt by Designer']] = designer_first_call&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['First Call Attempt by CM']] = cm_first_call&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers['Project Remark']] = lead_project&.remarks
          row_array[headers['Qualifying Agent']] = lead_qualified_by
          row_array[headers['Arrivae Champion']] = lead.created_by.present? ? User.find(lead.created_by).is_champion ? "Yes" : "No" : "No"
          sheet.add_row row_array
          sr_no += 1

      end

     end

     file_name = "Lead-Report-#{user.id}-#{DateTime.now.in_time_zone('Asia/Kolkata').strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
     filepath = Rails.root.join("tmp",file_name)
     p.serialize(filepath)
     UserNotifierMailer.lead_list_email(filepath, file_name, user).deliver_now
     File.delete(filepath) if File.exist?(filepath)
  end

end
