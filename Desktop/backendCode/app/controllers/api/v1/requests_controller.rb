module Api::V1
  class RequestsController < ApiController
    include ActionView::Helpers::DateHelper
    before_action :set_request, only: [:get_images_for_request, :add_images_to_request ,:show, :update, :destroy, :reschedule_the_site_measurment_request, :assign_site_suppervisor_for_request, :complete_site_measurment_request, :discard_the_request]


    #get all requests
    # GET "/v1/requests"

    def site_supervisor_dashboard_count
      if current_user.has_role? :sitesupervisor
        hash_to_render = SiteMeasurementRequest.site_supervisor_dashboard_count(current_user)
        render json: hash_to_render, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def live_and_finished_projects
      if current_user.has_role? :sitesupervisor

        @projects = SiteMeasurementRequest.sitesupervisor_projects(params[:status],current_user)
        render json: @projects, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def index
      if current_user.has_any_role? :designer, :category_head, *Role::CATEGORY_ROLES, :city_gm, :design_manager, :business_head
        @project = Project.find params[:project_id]
        @requests = @project.site_measurement_requests
        render json: @requests, status: :ok
      elsif current_user.has_role? :community_manager
        if params['project_id'].present?
          @project = Project.find params[:project_id]
          @requests = @project.site_measurement_requests
        else
          @designer = current_user.designers_for_cm
          @requests = SiteMeasurementRequest.where(designer_id: @designer)
        end
        render json: @requests, status: :ok
      elsif current_user.has_role? :sitesupervisor
        @requests = current_user.sitesupervisors_site_measurement_requests.where.not(request_status: ["pending", "discarded"])
        render json: @requests, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def escalated_site_measurment
      if current_user.has_role? :community_manager
        @designer = current_user.designers_for_cm
        @requests = SiteMeasurementRequest.where(designer_id: @designer).where.not(request_status: "complete").where("scheduled_at < ?",  DateTime.now.days_ago(1))
        render json: @requests, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def requests_for_project
       if current_user.has_role? :sitesupervisor
        @project = Project.find params[:project_id]
        @requests = @project.site_measurement_requests.where(sitesupervisor_id: current_user.id).where.not(request_status: ["pending", "discarded"])
        render json: @requests, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end


    # GET "/v1/requests/1"
    def show
     if current_user.has_any_role? :designer, :community_manager
        render json: @request, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    # create request
    # POST "/v1/requests"
    def create
      if current_user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
        @project = Project.find params[:site_measurement_request][:project_id]
        @request = @project.site_measurement_requests.new(request_params)
        @request.designer_id = @project.assigned_designer.id
        if @request.save!
          cm = @project.lead.assigned_cm
          oms_for_cm_ids = OfficeOmcm.where(user_id: cm.id, is_active: true).pluck(:office_user_id)
          office_emails = OfficeUser.where(id: oms_for_cm_ids).pluck(:email).compact
          cm_om_emails = office_emails << cm.email
          UserNotifierMailer.site_measurement_request_mail(@request, cm_om_emails).deliver_later!

          # ========================================================================
          # Author: Sanketkumar Karve
          # Date: 8th Nov 2019
          # Description: On creating site measurement request in delta. 
          #     Add Notification for Office Users like:  
          #     If OM is already assigned, then notify Operations Manager as an email
          #     If PM is already assigned, then notify Project Manager as an email
          # -----------------------------------------------------------------------
          # commented bt Nilhil, office mailer code on measurement request creation
          # =======================================================================
          #community_manager_id = @project.lead.assigned_cm_id
          #office_role = OfficeRole.where(name: ['project_engineer', 'project_engineer'])
          #office_user_ids  = OfficeProjectUser.where(project_id: @project.id, office_role_id: office_role, is_active: true).distinct(:office_user_id).pluck(:office_user_id)
          #UserNotifierMailer.site_measurement_request_office_mail(@request, OfficeUser.find([office_user_ids])).deliver_later! if office_user_ids.present?
          render json: @request, status: :ok
        else
          render json: @request.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    # Update Request
    # PATCH "/v1/requests/:id"

    def update
      if current_user.has_any_role?(:designer, :community_manager)
        if @request.update_attributes!(request_params)
          render json: @request, status: :ok
        else
          render json: @request.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end


    #DELETE   /v1/requests/:id
    def destroy
      if current_user.has_any_role?(:designer, :community_manager)
        if @request.destroy!
          render json: {message: "destroyed successfully"}, status: :ok
        else
          render json: @request.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def add_images_to_request
      if current_user.has_role? :sitesupervisor
        if params[:image_details].present?
            params[:image_details].each do |image|
              @site_gallery = @request.site_galleries.new(site_image: image[:image])
              @site_gallery.site_image_file_name = image[:file_name] if image[:file_name].present?
              @site_gallery.save!
            end
          UserNotifierMailer.site_measurement_images_mail(@request).deliver_later!
          render json: @request, status: :ok
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def remove_images_from_request
      if  current_user.has_any_role? :sitesupervisor, :designer, :community_manager, :category_head, *Role::CATEGORY_ROLES
        @image = SiteGallery.find params[:image_id]
        if @image.destroy!
          render json: {message: "deleted successfully"}, status: 200
        else
          render json:  @image.errors.full_messages , status: 400
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def get_images_for_request
      if current_user.has_any_role? :sitesupervisor, :designer, :community_manager, :category_head, *Role::CATEGORY_ROLES
        @images = @request.site_galleries
        render json: @images, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def complete_site_measurment_request
      if current_user.has_role? :sitesupervisor
        if params[:status].present?
          @request.update_attributes!(request_status: params[:status],remark: params[:remark])
          @request.complete_task
          # @request.project.update_attributes!(status: "10_50_percent")
          @request.project.change_status
          @request&.event.update_attributes!(status: "done", remark: params[:remark])
          str = "Site measurement is completed"
          if params[:images].present?
            params[:images].each do |image|
              @request.site_galleries.create!(site_image: image[:image], site_image_file_name: image[:file_name])
            end
            str += "And Images Uploaded"
          end
        end
        @request.project.update(sub_status:  "site_measurement_done") if @request.project&.sub_status == "initial_payment_recieved"
        UserNotifierMailer.site_measurement_completed_mail(@request,str).deliver_now!
        render json: @request, status: :ok
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def discard_the_request
      if current_user.has_any_role?(:designer, :community_manager)
        if @request.request_type == "standalone_site_measurement_request"
          if @request.update_attributes!(request_status: "discarded")
            render json: @request, status: :ok
          else
            render json: @request.errors.full_messages, status: :unprocessable_entity
          end
        elsif @request.request_type == "approved_boq_request"
          if @request.update_attributes!(request_status: "discarded")
            render json: @request, status: :ok
          else
            render json: @request.errors.full_messages, status: :unprocessable_entity
          end
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def reschedule_the_site_measurment_request
      if current_user.has_any_role?(:designer, :community_manager) && @request.request_status != "complete"
        if @request.update_attributes!(scheduled_at: params[:scheduled_at])
            @event = @request.event
            if @event.present?
              @event.update_attributes!(scheduled_at: params[:scheduled_at],status: "rescheduled")
              @event.users.each do |user|
              UserNotifierMailer.event_rescheduled_email(@event,user).deliver_later!(wait: 15.minutes)
              UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
              SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
            end
          end
          render json: @request, status: :ok
        else
          render json: @request.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

    def assign_site_suppervisor_for_request
      if current_user.has_role?(:community_manager)
        if @request.update_attributes!(sitesupervisor_id: params[:sitesupervisor_id],request_status: "assigned")
          @request.complete_assigning_task
          if @request.rescheduled_at.present?
            @scheduled_at = @request.rescheduled_at
          else
            @scheduled_at = @request.scheduled_at
          end
          @event = Event.create!(agenda: "site_visit",ownerable: @request,scheduled_at: @scheduled_at, contact_type: @request.request_type, location:  @request.address)
          emails = [current_user.email,@request.designer.email, @request.sitesupervisor.email, @request.project.user.email]
          @event.add_participants(emails,current_user.id)
          if @event.present?
             @event.users.each do |user|
               UserNotifierMailer.event_created_email(@event,user).deliver_later!
               UserNotifierMailer.event_reminder(@event,user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
               SmsModule.delay(run_at: @event.scheduled_at - 30.minute).send_sms("You have a scheduled event in 30 minutes. Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
            end
          end
          render json: @request, status: :ok
        else
          render json: @request.errors.full_messages, status: :unprocessable_entity
        end
      else
        render json: {message: "Access denied"}, status: 401
      end
    end

  private

    def request_params
      params.require(:site_measurement_request).permit(:request_type, :address, :scheduled_at, :designer_id, :project_id)
    end

    def set_request
      @request = SiteMeasurementRequest.find params[:id]
    end

  end
end
