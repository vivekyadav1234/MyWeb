require "#{Rails.root.join('app','serializers','event_serializer')}"
require "#{Rails.root.join('app','serializers',"project_serializer")}"

class Api::V1::Mobile::EventsController < Api::V1::ApiController
  # skip_before_action :authenticate_user!
  before_action :get_event, only:[:show, :update, :destroy, :reschedule_event, :change_event_status, :create_mom, :update_mom, :share_mom, :view_mom, :delete_mom]
  # load_and_authorize_resource
  # swagger_controller :events, 'Mobile Events'
  #
  # swagger_api :index do
  #   summary 'Returns all events'
  #   notes 'You need to pass authentication token!!!'
  # end

  def create
    ActiveRecord::Base.transaction do
      begin
        unless params[:event][:scheduled_at] < Time.zone.now
          # To mark done old events
          # @old_events = Event.where(agenda: params[:event][:agenda],ownerable_id: params[:event][:ownerable_id], ownerable_type: params[:event][:ownerable_type],status: ["scheduled","rescheduled"])
          # if @old_events.present?
          #   @old_events.each do |old_event|
          #     old_event.update(status: "done")
          #   end
          # end
          ownerable_id = params[:ownerable_id] ? params[:ownerable_id] : params[:event][:ownerable_id]
          if params[:event][:agenda] == "follow_up_meeting" && Event.where(agenda: Event::MANUAL_EVENTS, ownerable_type: "Project", ownerable_id: ownerable_id).count == 0
           return render json: {message: "Event can't be created because First Meeting has not been completed yet."}, status: 422
          end
          @event = Event.create!(event_params)
          @event.update_attributes!(
            scheduled_at: params[:event][:scheduled_at],
            ownerable_id: params[:event][:ownerable_id],
            ownerable_type: params[:event][:ownerable_type]
          )

          @event.add_participants(
            params[:event][:emails].split(";").map(&:strip), current_user.id
          )
          @event.add_participants([current_user.email], current_user.id)


          if @event.save!
            client_name = @event.ownerable_type == "Project" ?  "Client Name: "+@event&.ownerable&.user&.name&.humanize+", " : @event.ownerable_type == "Lead" ? "Client Name: "+@event&.ownerable&.name&.humanize+", " : ""
            @event.users.each do |user|
             UserNotifierMailer.event_created_email(@event,user).deliver_later!(wait: 15.minutes)
             UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)

             SmsModule.delay(run_at: @event.scheduled_at - 10.minutes).send_sms("You have a scheduled event in 10 minutes. #{client_name}Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
            end

            @event.add_participants(params[:event][:emails].split(";").map(&:strip), current_user.id)
            @event.add_participants([current_user.email], current_user.id)

            if @event.save!
              client_name = @event.ownerable_type == "Project" ?  "Client Name: "+@event&.ownerable&.user&.name&.humanize+", " : @event.ownerable_type == "Lead" ? "Client Name: "+@event&.ownerable&.name&.humanize+", " : ""
              @event.users.each do |user|
               UserNotifierMailer.event_created_email(@event,user).deliver_later!(wait: 15.minutes)
               UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)

               SmsModule.delay(run_at: @event.scheduled_at - 10.minutes).send_sms("You have a scheduled event in 10 minutes. #{client_name}Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
              end

              render json: @event, status: :created
            else
              render json: {message: @event.errors.full_messages}
            end
          else
            render json: {message: "Enter valid date and time"}, status: 422
          end
        else
          render json: {message: 'We can\'t schedule a meeting in past.'}, status: 400
        end
      rescue ArgumentError => e
        render json: {message: e}, status: 400
      end
    end
  end


  def reschedule_event
    unless DateTime.parse(params[:event][:scheduled_at]) < Date.today
      if @event.agenda != "first_meeting"
        @event.update!(status: "done", remark: "Event rescheduled")
        @new_event = Event.create!(event_params)
        @new_event.status = "rescheduled"
        @new_event.add_participants(params[:event][:emails].split(";").map(&:strip), current_user.id)
        @new_event.users.each do |user|
          UserNotifierMailer.event_rescheduled_email(@new_event,user).deliver_later!(wait: 15.minutes)
          UserNotifierMailer.event_reminder(@new_event,user).deliver_later!(wait_until: @new_event.scheduled_at - 30.minute)
          SmsModule.delay(run_at: @new_event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@new_event.agenda.humanize}, Scheduled at: #{@new_event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
        end

        if @new_event.save!
          render json: @new_event, status: 200
        else
          render json: @new_event.errors[:message]
        end
      else
        @event.update!(event_params)
        @event.event_users.destroy_all
        @event.status = "rescheduled"
        @event.add_participants(params[:event][:emails].split(";").map(&:strip), current_user.id)
        @event.users.each do |user|
          UserNotifierMailer.event_rescheduled_email(@event,user).deliver_later!(wait: 15.minutes)
          UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
          SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
        end
      end

    else
      render json: {message: "Enter valid date and time"}, status: 422
    end
  end

  def change_event_status
    if @event.present?
      @event.status = params[:status]
      @event.remark = params[:remark]
      if @event.status == "done" && @event.agenda == "on_hold"
        # project = @event.ownerable.versions.last.reify
        @event.ownerable.update!(status: "wip")
      end

      if @event.save(validate: false)
        render json: @event, status: 200
      else
        render json: @event.errors[:message]
      end

    else
      render json: {message: "Pass proper ID"}, status: 422
    end
  end

  def update
    unless DateTime.parse(params[:event][:scheduled_at]) < Time.zone.now
      if @event.update!(event_params)
        if @event.status == "rescheduled"
          @event.add_participants(params[:event][:emails].split(";").map(&:strip), current_user.id)
          @event.users.each do |user|
            UserNotifierMailer.event_rescheduled_email(@event,user).deliver_later!(wait: 15.minutes)
            UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
            SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
          end
         elsif @event.status == "done" && @event.agenda == "on_hold"
          # project = @event.ownerable.versions.last.reify
          @event.ownerable.update!(status: "wip")
        end
        render json: @event, status: :created
      else
        render json: @event.errors[:message]
      end
    else
      render json: {message: "Enter valid date and time"}, status: 422
    end
  end

  def destroy
    @event.destroy
  end

  def show
    render json: @event
  end

  def index
    if current_user.nil?
      return render json: {message: "It seems your session has expired. Please login to proceed."}, status: 422
    end
    if params[:designer_id].present?
      @user = User.find params[:designer_id]
      @events = @user.events.where(ownerable_type: "Project")
    else
      if current_user.has_role?(:community_manager)
        events_for_cm = current_user.events
        if params[:actionables_of] == "cm"
          @events = current_user.events
        else
          designers = current_user.designers_for_cm
          event_ids = designers.map{|designer|  designer.events.pluck(:id)}.flatten

          if params[:actionables_of] == "designer"
            @events = Event.where(id: event_ids)
          else
            @events = Event.where(id: (events_for_cm.pluck(:id) + event_ids).uniq)
          end
        end
      elsif current_user.has_role?(:city_gm)
        events_for_gm = current_user.events
        if params[:actionables_of] == "gm"
          @events = current_user.events
        else
          event_ids = []
          GmCmMapping.where(gm_id: current_user.id).each do |cgmap|
            cm = cgmap.cm
            event_ids += cm.events.pluck(:id)
            designers = cm.designers_for_cm
            event_ids += designers.map{|designer|  designer.events.pluck(:id)}.flatten
          end
          if params[:actionables_of] == "designer"
            @events = Event.where(id: event_ids)
          else
            @events = Event.where(id: (events_for_gm.pluck(:id) + event_ids).uniq)
          end
        end

      elsif current_user.has_role?(:designer)
        @events = current_user.events

      elsif current_user.has_role?(:sitesupervisor)
        @events = current_user.events
      end
    end

    if params[:ownerable_id].present?
      @events = @events.where(ownerable_type: "Project",ownerable_id: params[:ownerable_id])
    end
    status = params.dig(:status).to_s.split(',')
    if status.count.zero?
      status =["scheduled", "rescheduled"]
    end
    @events = @events.where(
      scheduled_at: DateTime.parse(params[:from_date]).beginning_of_day..DateTime.parse(params[:to_date]).end_of_day
    ).where(status: status).where(agenda: ::Event::MOBILE_EVENTS).order(scheduled_at: :desc)
    events = ::Mobile::EventBasicSerializer.new(@events.includes(:users, :ownerable)).serializable_hash
    temp_hash = {}
    temp_hash[:leads] = events.map{|event| event[:attributes]}
    if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
      # if current_user.has_role?(:city_gm)
      #   cm_ids = current_user.cms.pluck(:id)
      #   designer_id = User.where(cm_id: cm_ids).pluck(:id)
      # elsif current_user.has_role?(:design_manager)
      #   cm_ids = current_user.dm_cms.pluck(:id)
      #   designer_id = User.where(cm_id: cm_ids).pluck(:id)
      # elsif current_user.has_role?(:community_manager)
      #   designer_id = current_user.designers_for_cm.pluck(:id)
      # elsif current_user.has_role?(:business_head)
      #   cm_ids = User.with_role(:community_manager).pluck(:id)
      #   designer_id = User.where(cm_id: cm_ids).pluck(:id)
      # end
      if current_user.has_role?(:community_manager)
        cms = current_user
      elsif current_user.has_role?(:city_gm)
        cms = current_user.cms
      elsif current_user.has_role?(:design_manager)
        cms = current_user.dm_cms
      elsif current_user.has_role?(:business_head)
        cms = User.with_role :community_manager
      end
      lead_ids = Lead.joins(:project).joins(:assigned_cm).where(
        id: Project.where(status: ['qualified']).pluck(:lead_id)).where(
        users: {id: cms}).where(lead_status: ["qualified"]).pluck(:id)
      qualified_leads = DesignerProject.where(active: true, lead_id: lead_ids).pluck(:lead_id)
      temp_hash[:pending_leads] = Lead.where(id: qualified_leads).count
      # designer_projects = DesignerProject.where(active: true, designer_id: designer_id)
      # temp_hash[:pending_leads] = designer_projects.includes(project: :lead).count
    elsif current_user.has_role?(:designer)
      temp_hash[:pending_leads] = Lead.where(
        id: Project.where(status: ['qualified']).pluck(:lead_id)
      ).where(
        id: current_user.designer_projects.where(active: true).pluck(:lead_id).uniq
      ).where(lead_status: ["qualified"]).count
      # current_user.designer_projects.where(active: true).count
    else
      temp_hash[:pending_leads] = 0
    end

    render json: temp_hash

    # render json: @events.includes(:users, ownerable: :user)
  end

  def history
    agenda = params.dig(:history_type).to_s.split(',')
    if agenda.include?('status')
      unless current_user.has_any_role?(:admin, :lead_head, :community_manager, :designer, :city_gm, :design_manager, :business_head)
        return render json: {message: "Unauthorized!"}, status: :unauthorized
      end
      @project = Project.find(params[:ownerable_id])
      # return render json: @project, serializer: ::MobileLeadLogSerializer
      projects = ::MobileProjectLogSerializer.new(@project).serializable_hash
      return render json: projects, status: :ok
    end
    if params[:designer_id].present?
      @user = User.find params[:designer_id]
      @events = @user.events.where(ownerable_type: "Project")
    else
      if current_user.has_any_role?(:community_manager, :city_gm, :business_head)
        events_for_cm = current_user.events
        if params[:actionables_of] == "cm"
          @events = current_user.events
        else
          designers = User.none
          if current_user.has_role?(:community_manager)
            designers = current_user.designers_for_cm
          elsif current_user.has_role?(:city_gm)
            designers = current_user.designers_for_gm
          elsif current_user.has_role?(:business_head)
            designers = current_user.designers_for_bh
          end
          event_ids = designers.map{|designer|  designer.events.pluck(:id)}.flatten

          if params[:actionables_of] == "designer"
            @events = Event.where(id: event_ids)
          else
            @events = Event.where(id: (events_for_cm.pluck(:id) + event_ids).uniq)
          end
        end

      elsif current_user.has_role?(:designer)
        @events = current_user.events

      elsif current_user.has_role?(:sitesupervisor)
        @events = current_user.events
      end
    end

    if params[:ownerable_id].present?
      @events = @events.where(ownerable_type: "Project",ownerable_id: params[:ownerable_id])
    end
    status = params.dig(:status).to_s.split(',')
    if status.count.zero?
      status = ::Event::ALL_STATUSES
    end

    if agenda.count.zero?
      agenda = ::Event::CALL_AGENDAS
    elsif agenda.include?('meeting') || agenda.include?('meet')
      agenda = ::Event::MEETING_AGENDA
    elsif agenda.include?('call')
      agenda = ::Event::CALL_AGENDAS
    end
    from_date = params.dig(:from_date) ? DateTime.parse(params[:from_date]) : DateTime.parse('2017-10-10')
    to_date = params.dig(:from_date) ? DateTime.parse(params[:to_date]) : DateTime.now
    @events = @events.where(
      scheduled_at: from_date.beginning_of_day..to_date.end_of_day
    ).where(status: status).where(agenda: agenda).order(scheduled_at: :desc)
    events = ::Mobile::EventBasicSerializer.new(@events.includes(:users, :ownerable)).serializable_hash
    temp_hash = {}
    temp_hash[:leads] = events.map{|event| event[:attributes]}
    render json: temp_hash

    # render json: @events.includes(:users, ownerable: :user)
  end

  def last_call
    agenda = ::Event::CALL_AGENDAS
    @events = current_user.events.where(agenda: agenda)
    if params[:ownerable_id].present?
      @events = @events.where(
        ownerable_type: "Project",
        ownerable_id: params[:ownerable_id]).order(scheduled_at: :desc).limit(1)
    else
      render json: {error: 'Please send the ownerable_id'}
      return
    end
    events = ::Mobile::EventBasicSerializer.new(@events.includes(:users, :ownerable)).serializable_hash
    temp_hash = {}
    temp_hash[:leads] = events.map{|event| event[:attributes]}
    render json: temp_hash
  end

  def last_meeting
    agenda = ::Event::MEETING_AGENDA
    @events = current_user.events.where(agenda: agenda)
    if params[:ownerable_id].present?
      @events = @events.where(
        ownerable_type: "Project",
        ownerable_id: params[:ownerable_id]).order(scheduled_at: :desc).limit(1)
    else
      return render json: {error: 'Please send the owner_id'}
    end
    events = ::Mobile::EventBasicSerializer.new(@events.includes(:users, :ownerable)).serializable_hash
    temp_hash = {}
    temp_hash[:leads] = events.map{|event| event[:attributes]}
    render json: temp_hash
  end

  def mobile
    index
  end

  def get_ownerable
    if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
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
      designer_projects = DesignerProject.where(active: true, designer_id: designer_id)
      hash_to_render = designer_projects.includes(project: :lead).map{|project| project.ownerable_details}

      alpha = {"data" => hash_to_render.compact}
      render json: alpha

    elsif current_user.has_role?(:designer)
      @projects = current_user.designer_projects.where(active: true)
      hash_to_render = @projects.includes(project: :lead).map{|project| project.ownerable_details}

      alpha = {"data" => hash_to_render.compact}
      render json: alpha
    else
      render json: {message: "The User is Unauthorized"}
    end
  end

  def email_details_for_event
    arr = []
    if current_user.has_any_role?(:designer,:community_manager, :city_gm, :design_manager, :business_head)
      @project = Project.find(params[:ownerable_id])
      hash = Hash.new
      if current_user.cm.present?
        cm_hash = { "name" => current_user.cm.name, "email" => current_user.cm.email }
        arr = arr.push(cm_hash)
      else
        cm_hash = nil
      end

      if @project.lead.present?
        lead_hash = { "name" => @project.lead.name, "email" => @project.lead.email }
        arr = arr.push(lead_hash)
      else
        lead_hash = nil
      end
      hash[:obj] = arr
      render json: hash
    else
      render json: {message: "The User is Unauthorized"}
    end
  end

  def meeting_scheduled_for_customer
    if current_user.has_role?(:customer)
      @events = current_user.events
      render json: @events
    else
      render json: {message: "The User is Unauthorized"}
    end
  end

  def events_for_ownerable
    if current_user.has_any_role?(:community_manager, :designer, :city_gm, :design_manager, :business_head)
      # @events = Event.where(ownerable_id: params[:ownerable_id], ownerable_type: params[:ownerable_type])
      @events = Event.where(
        ownerable_id: params[:ownerable_id],
        ownerable_type: params[:ownerable_type],
        scheduled_at: DateTime.parse(params[:from_date]).beginning_of_day..DateTime.parse(params[:to_date]).end_of_day
      )
      render json: @events
    else
      render json: {message: "The User is Unauthorized"}
    end
  end

  def download_event
    if current_user.has_any_role? :city_gm, :design_manager, :business_head, :community_manager, :lead_head
      if current_user.has_role?(:city_gm)
        cm_ids = current_user.cms.pluck(:id)
        designer_id = User.where(cm_id: cm_ids).pluck(:id)
        @events = current_user.events.where(ownerable_type: "Project") + Event.includes(:users).where(users: {id: designer_id}, ownerable_type: "Project")
      elsif current_user.has_role?(:design_manager)
        cm_ids = current_user.dm_cms.pluck(:id)
        designer_id = User.where(cm_id: cm_ids).pluck(:id)
        @events = current_user.events.where(ownerable_type: "Project") + Event.includes(:users).where(users: {id: designer_id}, ownerable_type: "Project")
      elsif current_user.has_role?(:community_manager)
        @events = current_user.events.where(ownerable_type: "Project") + Event.includes(:users).where(users: {id: current_user.designers_for_cm&.ids}, ownerable_type: "Project")
      elsif current_user.has_role?(:business_head)
        cm_ids = User.with_role(:community_manager).pluck(:id)
        designer_id = User.where(cm_id: cm_ids).pluck(:id)
        @events = current_user.events.where(ownerable_type: "Project") + Event.includes(:users).where(users: {id: designer_id}, ownerable_type: "Project")
      elsif current_user.has_role?(:lead_head)
        @events = Event.where(ownerable_type: "Project")
      end
      EventReportDownloadJob.perform_later(@events.pluck(:id).uniq, current_user, current_user.roles.last.name)
    else
      render json: {message: "The User is Unauthorized"}
    end
  end

  # Here you will get manual events of the project
  def get_manual_events_of_project
    unless params[:ownerable_id].present?
      return render json: {message: "Please Provide ownerable ID"}, status: :unprocessable_entity
    end
    @events = Event.where(agenda: Event::MANUAL_EVENTS, ownerable_type: "Project", ownerable_id: params[:ownerable_id])
    render json: @events, status: 200
  end

  # To Create mom you can use this method
  def create_mom
    unless params[:mom_description].present?
      return render json: {message: "MOM description is must"}, status: :unprocessable_entity
    end

    if @event.update(mom_description: params[:mom_description], mom_status: "present")
      if params[:share_with].present?
        @event.update(mom_status: "shared")
        UserNotifierMailer.share_mom_details(params[:share_with], @event).deliver_now!
      end
       render json: {message: "MOM for the event is created"}, status: 200
    else
      render json: {message: "MOM for the event is not created"}, status: 400
    end
  end

  # Updating the mom content
  def update_mom
    if @event.mom_status == "shared"
      return render json: {message: "You can not perform this action because MOM is shared"}, status: :unprocessable_entity
    end
    if params[:mom_description].present?
      @event.update(mom_description: params[:mom_description])
      render json: {message: "Mom is updated"}, status: 200
    else
      render json: {message: "Mom provide Mom Description"}, status: 400
    end
  end

  # Share the mom content
  def share_mom
    if @event.mom_status == "shared"
      return render json: {message: "You can not perform this action because MOM is shared"}, status: :unprocessable_entity
    end
    unless params[:share_with].present?
      return render json: {message: "Please Provide mail ids"}, status: :unprocessable_entity
    end
    @event.update(mom_status: "shared")
    UserNotifierMailer.share_mom_details(params[:share_with], @event).deliver_now!
    render json: {message: "MOM is shared"}, status: 200
  end

  # Delete Mom Contents
  def delete_mom
    if @event.mom_status == "shared"
      return render json: {message: "You can not perform this action because MOM is shared"}, status: :unprocessable_entity
    end
    if @event.update(mom_status: "pending", mom_description: nil)
      render json: {message: "MOM deleted Successfully"}, status: 200
    else
      render json: {message: "Something Went Wrong"}, status: 400
    end
  end

  # To view the mom
  def view_mom
    if @event.mom_status != "pending"
      render json: {id: @event.id, mom_status: @event.mom_status, mom_description: @event.mom_description }
    else
      render json: {message: "MOM is not created"}, status: 404
    end
  end

  private
  def get_event
    @event = Event.find(params[:id])
  end

  def event_params
    params.require(:event).permit(:id, :agenda, :description, :scheduled_at,
      :status, :ownerable_type, :ownerable_id, :location, :contact_type, :remark,
      :review_location
    )
  end


end
