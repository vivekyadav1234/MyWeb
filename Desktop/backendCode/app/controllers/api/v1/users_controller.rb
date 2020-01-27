require_dependency "#{Rails.root.join("app", "serializers", "user_serializer")}"
require_dependency "#{Rails.root.join("app", "serializers", "lead_serializer")}"
require_dependency "#{Rails.root.join("app", "serializers", "fja_designer_dashboard_serializer")}"
require_dependency "#{Rails.root.join("app", "serializers", "project_serializer")}"
require_dependency "#{Rails.root.join("app", "serializers", "payment_serializer")}"

module Api::V1
  class UsersController < ApiController
    include ActionView::Helpers::DateHelper

    skip_before_action :authenticate_user!, only: [:send_visit_us_email, :password_reset_mobile, :otp_based_login]
    before_action :set_user, only: [:show, :update, :destroy, :add_role, :remove_role,
                                    :update_role, :kyc_approved, :activate, :deactivate, :csagent_dashboard, :csagent_online_change,
                                    :call_user, :assign_project, :designer_leads, :sales_manager_referrers, :load_referrer_users,
                                    :change_catalog_type]
    load_and_authorize_resource except: [:current_user_details, :download_list, :send_visit_us_email,
      :password_reset_mobile, :invite_champion, :invite_champion_info, :champions, :child_champions]

    # include SmsModule

    # cm city mapping

    def get_all_community_managers
      if current_user.has_any_role? :admin, :lead_head
        @users = User.with_role(:community_manager)
        paginate json: @users, each_serializer: CommunityManagerSerializer
      else
        render json: {message: "Access denied"}
      end
    end

    # for a given city id, return the list of designers and cms.
    def city_cm_designer_data
      if current_user.has_any_role? :admin, :lead_head, :community_manager, :designer, :business_head
        if params[:city] == "all" || params[:city].blank?
          cms_for_city = User.with_role(:community_manager)
          if params[:data_scope] == "fhi_data"
            cms_for_city = cms_for_city.joins(:tags).where(tags: { name: "full_home" }).select(:id, :name, :email).distinct
          elsif params[:data_scope] == "mkw_data"
            cms_for_city = cms_for_city.joins(:tags).where(tags: { name: "mkw" }).select(:id, :name, :email).distinct
          end
          designers_for_city = User.with_role(:designer)
        else
          city = City.find(params[:city])
          cms_for_city = User.with_role(:community_manager).joins(:cities).where(cities: {id: city}).select(:id, :name, :email).distinct
          if params[:data_scope] == "fhi_data"
            cms_for_city = cms_for_city.joins(:tags).where(tags: { name: "full_home" }).select(:id, :name, :email).distinct
          elsif params[:data_scope] == "mkw_data"
            cms_for_city = cms_for_city.joins(:tags).where(tags: { name: "mkw" }).select(:id, :name, :email).distinct
          end
          designer_id_array = cms_for_city.map { |cm| cm.designers_for_cm.pluck(:id) }.flatten.compact
          designers_for_city = User.with_role(:designer).where(id: designer_id_array)
        end

        data_hash = {
          cms: cms_for_city.map { |record| {id: record.id, itemName: "#{record.email} - #{record.name}"} },
          designers: designers_for_city.map { |record| {id: record.id, itemName: "#{record.email} - #{record.name}"} },
        }

        render json: data_hash
      else
        raise CanCan::AccessDenied
      end
    end

    def assign_cities_to_cm
      if current_user.has_any_role? :admin, :lead_head
        @user = User.find params[:user_id]
        ActiveRecord::Base.transaction do
          begin
            if params[:city_ids].present? && @user.has_role?(:community_manager)
              params[:city_ids].each do |city_id|
                CityUser.find_or_create_by(user_id: @user.id, city_id: city_id) if City.find(city_id).present?
              end
            end
          end
        end
        render json: CommunityManagerSerializer.new(@user).serializable_hash
      else
        render json: {message: "Access denied"}
      end
    end

    def clients_projects
      @project = current_user.projects
      if @project.present?
        render json: ClientProjectSerializer.new(@project).serializable_hash, status: 200
      else
        render json: [].to_json, status: 200
      end
    end

    def check_cm_available
      user = User.find_by(id: params[:cm_id])
      if user.present?
        puts "="*90
        puts user.is_cm_enable
        if user.is_cm_enable
          user.update! is_cm_enable: false
          return render json: {message: "response saved successfully"}, status: 200
        else
          user.update! is_cm_enable: true
          return render json: {message: "response saved successfully"}, status: 200
        end
      else
        return render json: {message: "invalid user"}, status: 400
      end
    end

    def un_assign_cities_to_cm
      if current_user.has_any_role? :admin, :lead_head
        @user = User.find params[:user_id]
        ActiveRecord::Base.transaction do
          begin
            if params[:city_ids].present? && @user.has_role?(:community_manager)
              params[:city_ids].each do |city_id|
                city_user = CityUser.find_or_initialize_by(user_id: @user.id, city_id: city_id) if City.find(city_id).present?
                city_user.destroy
              end
            end
          end
        end
        render json: CommunityManagerSerializer.new(@user).serializable_hash
      else
        render json: {message: "Access denied"}
      end
    end

    #get site supervisors
    def sitesupervisor_users
      if current_user.has_any_role? :admin, :lead_head
        @sitesupervisors = User.with_role :sitesupervisor
        render json: @sitesupervisors, each_serializer: UserIndexSerializer
      else
        render json: {message: "Access denied"}
      end
    end

    def get_all_site_supervisors
      if current_user.has_role? :community_manager
        array = []
        @sitesupervisors = current_user.sitesupervisors_for_cm
        @sitesupervisors.map { |sitesupervisor| array.push(sitesupervisor.slice(:id, :name)) }
        hash_to_render = Hash.new
        hash_to_render[:sitesupervisors] = array
        render json: hash_to_render
      else
        render json: {message: "Access denied"}
      end
    end

    def assign_sitesupervisor_to_cm
      unless current_user.has_any_role?(:admin, :lead_head)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      @sitesupervisor = User.find params[:sitesupervisor_id]
      unless @sitesupervisor.present? && @sitesupervisor.has_role?(:sitesupervisor)
        return render json: {message: "No user with sitesupervisor role was found for given sitesupervisor id."}, status: :unprocessable_entity
      end
      @cm = User.find params[:cm_id]
      unless @cm.present? && @cm.has_role?(:community_manager)
        return render json: {message: "No user with community_manager role was found for given cm id."}, status: :unprocessable_entity
      end
      @sitesupervisor.cm_for_site_supervisor = @cm
      if @sitesupervisor.save
        render json: {message: "Assigned to CM"}, status: :ok
      else
        render json: @sitesupervisor.errors.full_messages, status: :unprocessable_entity
      end
    end

    # GET /users
    def index
      load_users
      if params[:search].present? && !params[:search].blank?
        puts "fasfsa-=-==-"
        @users = @users.search_users(params[:search])
      end

      @users = paginate @users
      render json: @users.includes(:roles), each_serializer: UserIndexSerializer
    end

    def download_list
      if load_users
        send_data @users.to_csv, filename: "Arrivae users-#{Date.today}.csv", status: :ok
      else
        render json: {message: "Access denied"}
      end
    end

    # GET /users/1
    def show
      temp = {}
      if @user.has_role?(:designer)
        temp[:user] = DesignerProfileSerializer.new(@user).serializable_hash
        render json: temp
      else
        temp = {}
        temp[:user] = FjaUserDetailsSerializer.new(@user).serializable_hash
        render json: temp
      end
    end

    # POST /users
    def create
      @user = User.new(user_params)
      @user.avatar = params[:avatar] if params[:avatar]

      if @user.save
        render json: @user, status: :created, location: @user
      else
        render json: {message: @user.errors}, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /users/1
    def update
      @user.assign_attributes(user_params)
      @user.avatar = params[:avatar] if params[:avatar]

      if @user.save
        if params[:avatar].present?
          image = Paperclip.io_adapters.for(params[:avatar]["result"])
          image.original_filename = params[:avatarname]
          @user.avatar = image

          if @user.save
            pp "WOW, It's done"
          else
            pp @user.errors.messages
          end
        end

        if params[:address_proof].present?
          image = Paperclip.io_adapters.for(params[:address_proof]["result"])
          image.original_filename = params[:address_proof_name]
          @user.address_proof = image

          # puts "sunny"
          # puts image.to_json
          # puts "sharma"
          # puts image.original_filename
          if @user.save
            pp "WOW, It's done"
          else
            pp @user.errors.messages
          end
        end

        if current_user.has_role?(:designer) && current_user.designer_detail.present?
          @designer_detail = current_user.designer_detail
          @designer_detail.instagram_handle = params[:user][:instagram_handle] if params[:user][:instagram_handle].present?
          @designer_detail.designer_cv = params[:user][:designer_cv] if params[:user][:designer_cv].present?
          @designer_detail.save!
        end

        render json: @user
      else
        render json: {message: @user.errors}, status: :unprocessable_entity
      end
    end

    def kyc_approved
      @user.update!(kyc_approved: params.dig(:user, :kyc_approved)) unless params.dig(:user, :kyc_approved).nil?

      render json: @user
    end

    # DELETE /users/1
    def destroy
      @user.destroy
    end

    def current_user_details
      temp = {}
      temp[:user] = FjaUserDetailsSerializer.new(current_user).serializable_hash
      render json: temp
    end

    # To Lead Head, show a list of cs agents and their online_status
    def csagent_list
      unless current_user.has_any_role?(:admin, :lead_head)
        return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
      end
      hash = Hash.new
      arr = []
      @agents = User.with_role(:cs_agent)
      @agents.each do |agent|
        if agent.last_request_at.present?
          online_string = time_ago_in_words(agent.last_request_at) + " ago"
        else
          online_string = "not set"
        end
        online_status = (agent.online_status && (agent.last_request_at.blank? || agent.last_request_at > 30.minutes.ago)) ? true : false
        arr.push agent.attributes.slice("id", "email", "name").merge(
          'last_active': online_string.humanize,
          'online_status': online_status,
        )
      end
      hash[:users] = arr

      render json: hash
    end

    def csagent_dashboard
      if @user.has_role?(:cs_agent)
        temp_hash = {}
        temp_hash[:user] = FjaCsagentDashboardSerializer.new(@user).serializable_hash
        render json: temp_hash
      else
        render json: {message: "This user is not a CS Agent!"}, status: :unauthorized
      end
    end

    def cm_cities
      render json: current_user.cities, status: 200
    end

    def cm_dashboard_count
      if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
        # leads = Lead.customer_only.where(lead_status: ['qualified', 'dropped'])
        # converted_leads1 = leads.where(city: current_user.cities.pluck(:name)).pluck(:id)
        # converted_leads2 = leads.where(pincode: current_user.zipcodes.pluck(:code)).pluck(:id)
        # converted_leads3 = leads.joins(:note_records).where("lower(note_records.city) IN (?)", current_user.cities.pluck(:name)).distinct.pluck(:id)
        if current_user.has_role?(:community_manager)
          cms = current_user
        elsif current_user.has_role?(:city_gm)
          cms = current_user.cms
        elsif current_user.has_role?(:design_manager)
          cms = current_user.dm_cms
        elsif current_user.has_role?(:business_head)
          cms = User.with_role :community_manager
        end
        converted_leads = Lead.joins(:assigned_cm).where(users: {id: cms}).where(lead_status: ["qualified", "dropped"])
        #=============Lead Tags Filter=================

        # tags = current_user.tags.pluck(:id)
        # converted_tag_leads = converted_leads.where(tag_id: tags, assigned_cm_id: current_user.id)
        # converted_tag_user_leads = converted_tag_leads.present? ? converted_tag_leads.pluck(:id) : []
        # both_tag = Tag.find_by_name("both").id
        # converted_both_leads = converted_leads.where(tag_id: both_tag).pluck(:id)
        # converted_leads = Lead.where(id: (converted_tag_user_leads + converted_both_leads + converted_leads4 ).uniq)
        # #==============================================
        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          converted_leads = Lead.filter_customer_by_date(converted_leads, filter_options)
        end
        @customer_count = @user.customer_count_cm(converted_leads, params[:designer_id].to_i, current_user).merge({:leads_total_qualified => converted_leads.where(lead_status: "qualified").count})
        render json: @customer_count
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_dashboard_designer_actionables
      if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
        # leads = Lead.customer_only.where(lead_status: "qualified")
        # converted_leads1 = leads.where(city: current_user.cities.pluck(:name)).pluck(:id)
        # converted_leads2 = leads.where(pincode: current_user.zipcodes.pluck(:code)).pluck(:id)
        # converted_leads3 = leads.joins(:note_records).where("lower(note_records.city) IN (?)", current_user.cities.pluck(:name)).distinct.pluck(:id)
        # converted_leads = current_user.cm_leads.where(lead_status: "qualified").pluck(:id)
        # converted_leads = Lead.where(id: converted_leads)
        if current_user.has_role?(:community_manager)
          cms = current_user
        elsif current_user.has_role?(:city_gm)
          cms = current_user.cms
        elsif current_user.has_role?(:design_manager)
          cms = current_user.dm_cms
        elsif current_user.has_role?(:business_head)
          cms = User.with_role :community_manager
        end
        converted_leads = Lead.joins(:assigned_cm).where(users: {id: cms}).where(lead_status: "qualified")
        # converted_leads = params[:city].present? ? Lead.customer_only.leads_by_city(params[:city].to_s.downcase) :  current_user.cm_leads
        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          converted_leads = Lead.filter_customer_by_date(converted_leads, filter_options)
        end

        @customer_count = @user.cm_dashboard_designers_actionable_count(converted_leads, current_user)
        render json: @customer_count.to_json
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_dashboard
      if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
        # for :delayed_possession or :delayed_project, lead status will be qualified, so this works.
        status = params[:lead_category] == "leads_dropped" ? "dropped" : "qualified"
        # leads = Lead.customer_only.where(lead_status: status)
        # converted_leads1 = leads.where(city: current_user.cities.pluck(:name)).pluck(:id)
        # converted_leads2 = leads.where(pincode: current_user.zipcodes.pluck(:code)).pluck(:id)
        # converted_leads3 = leads.joins(:note_records).where("lower(note_records.city) IN (?)", current_user.cities.pluck(:name)).distinct.pluck(:id)
        if current_user.has_role?(:community_manager)
          cms = current_user
        elsif current_user.has_role?(:city_gm)
          cms = current_user.cms
        elsif current_user.has_role?(:design_manager)
          cms = current_user.dm_cms
        elsif current_user.has_role?(:business_head)
          cms = User.with_role :community_manager
        end
        converted_leads = Lead.joins(:assigned_cm).where(users: {id: cms}).where(lead_status: status)

        converted_leads = converted_leads.distinct

        converted_leads_my_designers = current_user.leads_for_my_designers
        #Lead Tags Filter
        # tags = current_user.tags.pluck(:id)
        # converted_tag_leads = converted_leads.where(tag_id: tags, assigned_cm_id: current_user.id)
        # converted_tag_user_leads = converted_tag_leads.present? ? converted_tag_leads.pluck(:id) : []
        # both_tag = Tag.find_by_name("both").id
        # converted_both_leads = converted_leads.where(tag_id: both_tag).pluck(:id)
        # converted_leads = Lead.where(id: (converted_tag_user_leads + converted_both_leads + converted_leads4).uniq)

        if params[:search].present?
          converted_leads = converted_leads.search_leads(params[:search].to_s.downcase)
        end

        if converted_leads.count > 0
          leads_hash = User.customers_with_status_cm(converted_leads, params[:designer_id].present? ? params[:designer_id].to_i : nil)
          if params[:lead_category] == "leads_total_qualified"
            @leads = converted_leads.order("leads.status_updated_at DESC")
          elsif params[:lead_category] == "leads_delayed_possession"
            @leads = converted_leads.joins(:project).where(projects: { status: "delayed_possession" })
          elsif params[:lead_category] == "leads_delayed_project"
            @leads = converted_leads.joins(:project).where(projects: { status: "delayed_project" })
          elsif ["leads_assigned", "leads_no_projects", "leads_not_assigned", "leads_dropped"].include?(params[:lead_category])
            @leads = leads_hash[params[:lead_category].to_sym]
          elsif [:leads_assigned_qualified, :leads_assigned_meeting_fixed, :leads_assigned_not_contactable,
                 :leads_assigned_follow_up, :leads_assigned_lost, :leads_assigned_10_50_percent, :leads_assigned_50_percent,
                 :leads_assigned_handover, :leads_assigned_installation, :leads_assigned_pre_10_percent, :leads_assigned_wip, :leads_assigned_on_hold, :leads_assigned_inactive].include?(params[:lead_category]&.to_sym)
            lead_status = params[:lead_category].partition("leads_assigned_").last
            @leads = @user.assigned_customers_with_status(leads_hash[:leads_assigned], lead_status, params[:designer_id].present? ? params[:designer_id].to_i : nil)
          else
            render json: {message: "No such lead_category."}, status: 400
            return
          end

          if params[:from_date].present? || params[:to_date].present?
            filter_options = Hash.new
            filter_options["column_name"] = "assigned_at"
            filter_options["from_date"] = params[:from_date]
            filter_options["to_date"] = params[:to_date]
            @leads = Lead.filter_customer_by_date(@leads, filter_options)
          end

          @leads = sort_by_lead_arrival(params[:sort_by], @leads, params[:lead_category]) if ["todays_lead", "old_lead"].include?(params[:sort_by])
          @leads = @leads.joins(:designer_projects).where(designer_projects: {active: true, designer_id: params[:designer_id]}).distinct if params[:designer_id].present?
          @leads = @leads.joins(:project).where(projects: {status: params[:sort_by]}).distinct if ["follow_up", "not_contactable", "lost"].include?(params[:sort_by])
          @leads = @leads.joins(:project).where(projects: {status: Project::AFTER_WIP_STATUSES}).distinct if params[:sort_by] == "wip"
          paginate json: @leads, each_serializer: LeadSerializerForCM
        else
          render json: {message: "No Leads Present"}, status: 200
        end
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_lead_download
      if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
        status = params[:lead_category].present? ? params[:lead_category] == "leads_dropped" ? "dropped" : "qualified" : ["dropped", "qualified"]
        if current_user.has_role?(:community_manager)
          cms = current_user
        elsif current_user.has_role?(:city_gm)
          cms = current_user.cms
        elsif current_user.has_role?(:design_manager)
          cms = current_user.dm_cms
        elsif current_user.has_role?(:business_head)
          cms = User.with_role :community_manager
        end
        @leads = Lead.joins(:assigned_cm).where(users: {id: cms}).where(lead_status: status)
        # @leads = converted_leads.distinct

        if params[:lead_category].present?
          leads_hash = User.customers_with_status_cm(@leads, params[:designer_id].present? ? params[:designer_id].to_i : nil) if params[:lead_category].present?
          if params[:lead_category] == "leads_total_qualified"
            @leads = @leads.order("leads.status_updated_at DESC")
          elsif ["leads_assigned", "leads_no_projects", "leads_not_assigned", "leads_dropped"].include?(params[:lead_category])
            @leads = leads_hash[params[:lead_category].to_sym]
          elsif [:leads_assigned_qualified, :leads_assigned_meeting_fixed, :leads_assigned_not_contactable,
                 :leads_assigned_follow_up, :leads_assigned_lost, :leads_assigned_10_50_percent, :leads_assigned_50_percent,
                 :leads_assigned_handover, :leads_assigned_installation, :leads_assigned_pre_10_percent, :leads_assigned_wip, :leads_assigned_on_hold, :leads_assigned_inactive].include?(params[:lead_category]&.to_sym)
            lead_status = params[:lead_category].partition("leads_assigned_").last
            @leads = @user.assigned_customers_with_status(leads_hash[:leads_assigned], lead_status, params[:designer_id].present? ? params[:designer_id].to_i : nil)
          else
            render json: {message: "No such lead_category."}, status: 400
            return
          end
        end
        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        @leads = sort_by_lead_arrival(params[:sort_by], @leads, params[:lead_category]) if ["todays_lead", "old_lead"].include?(params[:sort_by])
        @leads = @leads.joins(:designer_projects).where(designer_projects: {active: true, designer_id: params[:designer_id]}).distinct if params[:designer_id].present?
        @leads = @leads.joins(:project).where(projects: {status: params[:sort_by]}).distinct if ["follow_up", "not_contactable", "lost"].include?(params[:sort_by])
        @leads = @leads.joins(:project).where(projects: {status: Project::AFTER_WIP_STATUSES}).distinct if params[:sort_by] == "wip"
        CmDesignerLeadsJob.perform_later(@leads.map(&:id).uniq, "cm", current_user)
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    # Actionable for Community Manager
    def sort_by_lead_arrival(sort_by, leads, lead_category = nil)
      if (lead_category.present? && lead_category == "leads_assigned") && sort_by == "todays_lead"
        leads = leads.joins(:designer_projects).where(designer_projects: {active: true, created_at: DateTime.now.beginning_of_day..DateTime.now.end_of_day}).distinct
      elsif sort_by == "todays_lead"
        leads = leads.where(status_updated_at: DateTime.now.beginning_of_day..DateTime.now.end_of_day)
      elsif sort_by == "old_lead"
        leads = leads.where("leads.status_updated_at < ?", DateTime.now.beginning_of_day)
      end
      leads
    end

    def community_manager_actionable_counts
      if current_user.has_role?(:community_manager)
        # leads = Lead.customer_only.where(lead_status: 'qualified')
        # converted_leads1 = leads.where(city: current_user.cities.pluck(:name)).pluck(:id)
        # converted_leads2 = leads.where(pincode: current_user.zipcodes.pluck(:code)).pluck(:id)
        # converted_leads3 = leads.joins(:note_records).where("lower(note_records.city) IN (?)", current_user.cities.pluck(:name)).distinct.pluck(:id)
        # converted_leads = Lead.where(id:  (converted_leads1 + converted_leads2 + converted_leads3).uniq)

        # converted_leads = converted_leads.uniq

        converted_leads = current_user.cm_leads.where(lead_status: "qualified").pluck(:id)
        converted_leads = Lead.where(id: converted_leads)

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          converted_leads = Lead.filter_customer_by_date(converted_leads, filter_options)
        end

        @customer_count = @user.community_manager_actionable(@user, converted_leads, params[:designer_id])
        render json: @customer_count
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def call_needs_to_be_done_today_by_cm
      if current_user.has_role?(:community_manager)
        if params[:designer_id].present?
          designers = User.where(id: params[:designer_id])
        else
          designers = @user.designers_for_cm
        end

        if params[:calls_for] == "follow_up_calls_for_today" || params[:calls_for] == "not_contactable_calls_for_today"
          lead_ids = @user.customers_to_be_called_today_by_cm(@user, params[:agenda])
          @leads = Lead.where(id: lead_ids)
        elsif params[:calls_for] == "escalated_calls"
          lead_ids = @user.customers_to_be_called_today_but_escalated_by_cm(@user)
          @leads = Lead.where(id: lead_ids)
        elsif params[:calls_for] == "designer_follow_up_calls_for_today" || params[:calls_for] == "designer_not_contactable_calls_for_today"
          @leads = @user.customers_to_be_called_today_by_cm_designers(designers, params[:agenda])
        elsif params[:calls_for] == "designer_escalated_calls"
          @leads = @user.customers_to_be_called_today_but_escalated_cm_designers(designers)
        end

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        paginate json: @leads, each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_designer_no_action_taken
      if current_user.has_role?(:community_manager)
        if params[:designer_id].present?
          designers = User.where(id: params[:designer_id])
        else
          designers = @user.designers_for_cm
        end

        @leads = @user.cm_designer_no_action_taken(designers)

        if params[:sort_by].present?
          @leads = sort_by_lead_arrival(params[:sort_by], @leads)
        end

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        paginate json: @leads, each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def escalated_meetings_for_cm_dashboard
      if current_user.has_role?(:community_manager)
        if params[:meetings_for] == "escalated_meetings_for_community_manager"
          lead_ids = @user.escalated_meeting_scheduled_cm(@user)
          @leads = Lead.where(id: lead_ids)
        elsif params[:meetings_for] == "escalated_meetings_for_designer"
          if params[:designer_id].present?
            designers = User.where(id: params[:designer_id])
          else
            designers = @user.designers_for_cm
          end
          @leads = @user.escalated_meeting_cm_designer(designers)
        end

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        paginate json: @leads, each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_meeting_scheduled_for_today
      if current_user.has_role?(:community_manager)
        if params[:meetings_for] == "community_manager"
          lead_ids = @user.meeting_scheduled_cm(@user)
          @leads = Lead.where(id: lead_ids)
        elsif params[:meetings_for] == "designer"
          if params[:designer_id].present?
            designers = User.where(id: params[:designer_id])
          else
            designers = @user.designers_for_cm
          end
          @leads = @user.meeting_scheduled_cm_designer(designers)
        else
          render json: {message: "Send Proper Parameters!"}, status: :unauthorized
        end

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        paginate json: @leads, each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_deadlines
      if current_user.has_role?(:community_manager)
        @leads = @user.customers_for_cm_deadline(@user.designers_for_cm, params[:customer_status])

        if params[:from_date].present? || params[:to_date].present?
          filter_options = Hash.new
          filter_options["column_name"] = "assigned_at"
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @leads = Lead.filter_customer_by_date(@leads, filter_options)
        end

        paginate json: @leads, each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Community Manager!"}, status: :unauthorized
      end
    end

    def cm_wip_dashboard_counts
      if current_user.has_role?(:city_gm)
        cm_ids = current_user.cms.pluck(:id)
        designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
      elsif current_user.has_role?(:design_manager)
        cm_ids = current_user.dm_cms.pluck(:id)
        designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
      elsif current_user.has_role?(:community_manager)
        designer_id = params[:designer_id].present? ? params[:designer_id] : current_user.designers_for_cm.pluck(:id)
      elsif current_user.has_role?(:business_head)
        cm_ids = User.with_role(:community_manager).pluck(:id)
        designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
      end
      @hash_to_render = DesignerProject.wip_leads_count_of_designers(designer_id)
      render json: @hash_to_render, status: 200
    end

    def cm_wip_leads
      if current_user.has_any_role?(:city_gm, :community_manager, :design_manager, :business_head)
        if current_user.has_role?(:city_gm)
          cm_ids = current_user.cms.pluck(:id)
          designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
        elsif current_user.has_role?(:design_manager)
          cm_ids = current_user.dm_cms.pluck(:id)
          designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
        elsif current_user.has_role?(:community_manager)
          designer_id = params[:designer_id].present? ? params[:designer_id] : current_user.designers_for_cm.pluck(:id)
        elsif current_user.has_role?(:business_head)
          cm_ids = User.with_role(:community_manager).pluck(:id)
          designer_id = params[:designer_id].present? ? params[:designer_id] : User.where(cm_id: cm_ids).pluck(:id)
        end
        status = Project.project_status_after_wip_filters(params[:status])
        @leads = DesignerProject.wip_leads_of_designers(designer_id, status, "list")
        @leads = @leads.search_leads(params[:search].to_s.downcase) if params[:search].present?
        paginate json: @leads.order(created_at: :desc), each_serializer: LeadSerializerForCM
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end


    def wip_project_details
      designer_id = @user.designers_for_cm.pluck(:id)
      designer_projects_active = DesignerProject.where(active: true, designer_id: designer_id).pluck(:project_id)
      @payments = Payment.joins(:project).where(projects: {id: designer_projects_active})
      paginate json: @payments, each_serializer: PaymentWithProjectDetalsSerializer
    end

    # Actionable for Community Manager Ends

    def designer_profile
      unless current_user.has_any_role?(:admin, :designer)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      render json: @user, serializer: DesignerProfileSerializer
    end

    def designer_dashboard_count
      if current_user.has_role?(:designer)
        hash = Hash.new

        leads = Lead.where(id: @user.designer_projects.pluck(:lead_id).uniq)
        leads = @user.filter_leads(leads, params[:column_name], params[:from_date], params[:to_date]) if params[:column_name].present?
        #gives hash of status with count
        hash = leads.joins(designer_projects: :project).where(designer_projects: {active: true, designer_id: @user.id}, projects: {status: Project::ALLOWED_CUSTOMER_STATUSES}).group("projects.status").count

        #not used in designer dashboard
        # hash[:active_designer_projects] = @user.designer_projects.where(active: true).where.not(lead_id: nil).pluck(:project_id).uniq.count
        # hash[:customers_no_lead] = @user.designer_projects.where(active: true).where(lead_id: nil).distinct.count

        #sum count of all the after_wip_statuses
        hash["after_wip"] = 0
        Project::AFTER_WIP_STATUSES.each do |status|
          hash["after_wip"] += hash[status] if hash[status]
        end

        render json: hash
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def designer_dashboard
      if current_user.has_any_role?(:designer, :community_manager)
        @customers = Lead.where(id: @user.designer_projects.pluck(:lead_id).uniq)
        @customers = @customers.joins(designer_projects: :project).where(designer_projects: {active: true, designer_id: @user.id}, projects: {status: params[:customer_status]})
        # designer_projects_active = @user.designer_projects.where(active: true).pluck(:project_id)
        # projects = Project.where(id: designer_projects_active)
        # @customers = @user.customers_with_status(projects, params[:customer_status])

        if params[:search].present?
          @customers = @customers.search_leads(params[:search].to_s.downcase)
        end

        if params[:from_date].present? || params[:to_date].present? && params[:column_name].present?
          @customers = @user.filter_leads(@customers, params[:column_name], params[:from_date], params[:to_date]).distinct
        end

        @customers = paginate @customers
        leads = FjaDesignerDashboardSerializer.new(@customers.includes(:project), {params: {user: @user}}).serializable_hash
        temp_hash = {}
        temp_hash[:leads] = leads.map { |lead| lead[:attributes] }
        render json: temp_hash

        # paginate json: @customers.includes(:project), each_serializer: DesignerDashboardSerializer, user: @user
        # render json: User.designer_dashboard_hash(@user,@customers)
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def designer_leads_download
      customer_status = params[:customer_status] == "completed" ? "handover" : params[:customer_status]
      if customer_status.present? && customer_status != "after_wip"
        designer_projects_active = @user.designer_projects.where(active: true).pluck(:project_id)
        projects = Project.where(id: designer_projects_active)
        @customers = @user.customers_with_status(projects, customer_status)
      elsif customer_status == "after_wip"
        designer_projects_active = @user.designer_projects.where(active: true).pluck(:project_id)
        projects = Project.where(id: designer_projects_active)
        @customers = @user.customers_with_status(projects, ["wip", "pre_10_percent", "10_50_percent", "50_percent", "installation"])
      else
        lead_ids = @user.designer_projects.where(active: true).pluck(:lead_id)
        @customers = Lead.where(id: lead_ids).distinct
      end

      if params[:search].present?
        @customers = @customers.search_leads(params[:search].to_s.downcase)
      end

      if params[:from_date].present? || params[:to_date].present? && params[:column_name].present?
        filter_options = Hash.new
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
        @customers = Lead.filter_leads_for_designers(@customers, filter_options)
      end

      # send_data @customers.leads_download_xlsx("designer", current_user)
      CmDesignerLeadsJob.perform_later(@customers.pluck(:id), "designer", current_user)
    end

    # For WIP

    def designer_wip_dashboard_counts
      if current_user.has_any_role?(:designer)
        @hash_to_render = DesignerProject.wip_leads_count_of_designers(@user.id)
        render json: @hash_to_render, status: 200
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def wip_leads
      if current_user.has_any_role?(:designer)
        designer_id = @user.designers_for_cm.pluck(:id)
        status = Project.project_status_after_wip_filters(params[:status])
        @customers = DesignerProject.wip_leads_of_designers(@user.id, status, "list")
        if params[:search].present?
          @customers = @customers.search_leads(params[:search].to_s.downcase)
        end

        if params[:from_date].present? || params[:to_date].present? && params[:column_name].present?
          filter_options = Hash.new
          filter_options["column_name"] = params[:column_name]
          filter_options["from_date"] = params[:from_date]
          filter_options["to_date"] = params[:to_date]
          @customers = Lead.filter_leads_for_designers(@customers, filter_options)
        end

        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def wip_leads_for_category
      if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
        @projects = Project.where(status: Project::AFTER_WIP_STATUSES)
        render json: @projects
      else
        render json: {message: "This user is not a Category!"}, status: :unauthorized
      end
    end

    # For Deadlines Starts Here
    def leads_for_deadlines_count
      if current_user.has_any_role?(:designer)
        render json: @user.designer_deadlines_count(@user)
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def leads_for_deadlines
      if current_user.has_any_role?(:designer)
        @customers = @user.customers_for_deadline(@user, params[:customer_status])
        render json: User.designer_dashboard_hash(@user, @customers)
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    # For Deadlines Ends Here
    # For Actionables Starts Here
    def designer_actionables
      if current_user.has_any_role?(:designer, :community_manager)
        render json: @user.designer_actionable_counts(@user)
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def leads_qualified_but_no_actions_taken
      if current_user.has_any_role?(:designer, :community_manager)
        @customers = @user.customers_with_status_without_date_filter(@user, "qualified")
        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def all_calls_to_be_done_today
      if current_user.has_any_role?(:designer)
        projects = @user.customers_to_be_called_today(@user, params[:agenda])
        @customers = @user.customers_with_out_status_without_date_filter(projects)
        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def all_calls_to_be_done_today_escalated
      if current_user.has_any_role?(:designer)
        projects = @user.customers_to_be_called_today_but_escalated(@user)
        @customers = @user.customers_with_out_status_without_date_filter(projects)
        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def meeting_scheduled_for_today
      if current_user.has_any_role?(:designer)
        projects = @user.meeting_scheduled_designer(@user)
        @customers = @user.customers_with_out_status_without_date_filter(projects)
        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def meeting_scheduled_for_today_escalated
      if current_user.has_any_role?(:designer)
        projects = @user.meeting_scheduled_escalated_designer(@user)
        @customers = @user.customers_with_out_status_without_date_filter(projects.uniq)
        paginate json: @customers, each_serializer: DesignerDashboardSerializer, user: @user
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    #For Actionables Ends Here

    def get_all_status_for_project
      if current_user.has_role?(:designer)
        render json: {project_status: Project::ALLOWED_CUSTOMER_STATUSES}
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def desginer_all_projects
      if current_user.has_any_role?(:designer, :community_manager)
        designer_projects = @user.designer_projects.where(active: true)
        arr = []
        designer_projects.each do |designer_project|
          hash = Hash.new
          project = designer_project.project
          lead = project.lead
          arr << project.attributes.slice("id", "name", "user_id", "details", "created_at",
                                          "updated_at", "lead_id").symbolize_keys.merge(lead: {id: lead&.id, email: lead&.email, name: lead&.name})
        end
        h = {projects: arr}
        render json: h, status: :ok
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    def designer_leads
      if current_user.has_role?(:designer)
        @designer_leads = @user.active_assigned_projects.map { |project| [project.user_id, project.user.name] }.to_h
        render json: @designer_leads
      else
        render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
    end

    # Designers assigned to this CM.
    def designer_for_cm
      if current_user.has_any_role?(:city_gm, :community_manager, :design_manager, :business_head)
        if current_user.has_role?(:community_manager)
          designers = current_user.designers_for_cm
        elsif current_user.has_role?(:city_gm)
          cm_ids = current_user.cms.pluck(:id)
          designers = User.where(cm_id: cm_ids)
        elsif current_user.has_role?(:design_manager)
          cm_ids = current_user.dm_cms.pluck(:id)
          designers = User.where(cm_id: cm_ids)
        elsif current_user.has_role?(:business_head)
          cm_ids = User.with_role :community_manager
          designers = User.where(cm_id: cm_ids)
        end
        render json: designers, each_serializer: DesignerListCMSerializer
      elsif current_user.has_role?(:admin) && params[:cm_id].present?
        cm = User.find(params[:cm_id])
        designers = cm.designers_for_cm.select(:id, :email, :name).as_json
        render json: {designers: designers}
      else
        render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
    end

    def customer_details
      unless @user.has_role?(:designer) || @user.has_role?(:community_manager, :city_gm, :design_manager, :business_head)
        return render json: {message: "This user is not a Designer!"}, status: :unauthorized
      end
      @customer = User.find params[:customer_id]
      @project = @user.assigned_projects.where(user: @customer).last
      @designer_project = DesignerProject.where(project: @project, designer: @user).last

      render json: @customer, serializer: DesignerSerializer, designer_id: @user.id, project: @project,
        designer_project: @designer_project
    end

    def change_sub_status
      unless @user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
        return render json: {message: "This user is not authorized!"}, status: :unauthorized
      end

      ActiveRecord::Base.transaction do
        begin
          @project = Project.find(params[:project_id])
          @project.sub_status = params[:sub_status]
          @project.status = "pre_10_percent" if params[:sub_status] == "initial_proposal_accepted"
          if @project.save!
            render json: {message: "Sub status is Updated"}, status: 200
          else
            render json: {message: @project.errors.full_messages}, status: :unprocessable_entity
          end
        end
      end
    end

    def change_customer_status
      unless @user.has_any_role?(:designer, :community_manager, :city_gm, :design_manager, :business_head)
        return render json: {message: "This user is not a authorized!"}, status: :unauthorized
      end
      ActiveRecord::Base.transaction do
        begin
          @customer = User.find params[:customer_id]
          if @user.has_role?(:designer)
            @projects = @user.assigned_projects.where(user: @customer)
            # @designer_project = @user.designer_projects.where(active: true,project_id: @projects).take
            @project = @user.assigned_projects.find params[:project_id]
          elsif @user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
            @project = Project.find(params[:project_id])
            @designer_project = nil
          end

          if params[:customer_status] == "not_contactable" && @project.count_of_calls.to_i < 4
            @project.count_of_calls = @project.count_of_calls.to_i + 1
            @project.status = params[:customer_status] if params[:customer_status]
          elsif params[:customer_status] == "not_contactable" && @project.count_of_calls.to_i >= 4
            @project.status = "lost"
            @project.reason_for_lost = "other"
            @project.remarks = "lost after 5 tries"
            if @project.events.present?
              @project.events.each do |old_event|
                old_event.update(status: "done")
              end
            end
          elsif params[:customer_status] == "delayed_possession" || params[:customer_status] == "delayed_project"
            # First off, verify that the date (time) chosen is eligible for delayed possession.
            # For example, if currently it is Dec-2018, then minimum allowed is Mar-2019.
            unless date_eligible_for_delayed_possession?
              return render json: { message: "This date is not eligible for #{params[:customer_status].humanize}." }, status: :unprocessable_entity
            end
            if params[:call_from_mobile]
              @project.status = 'on_hold'
              @project.save!
            else
              @project.status = params[:customer_status]
            end
            @project.count_of_calls = 0
            @project.remarks = params[:remarks]
            # unassign designer
            @project.designer_projects.map{|designer_project| designer_project.update!(active: false)}
            if @project.events.present?
              @project.events.each do |old_event|
                old_event.update(status: "done")
              end
            end
          elsif params[:customer_status] == "wip"
            @project.wip_time = DateTime.now if params[:customer_status] == "wip"
            @project.status = params[:customer_status]
            @project.remarks = params[:remarks]
            @project.status_updated_at = DateTime.now
            TaskEscalation.invoke_task(["Upload Floor Plan", "Upload Requirement Sheet"], "pre bid", @project)
            generated_password = Devise.friendly_token.first(8)
            @customer.update!(password: generated_password)
            UserNotifierMailer.lead_credential_mail(@customer, generated_password).deliver_now!
            SmsModule.send_sms("Welcome to Arrivae. Use following credentials for login. For security reasons, it is recommended that you change this password after loggin in.\n Email: #{@customer.email} \n Password: #{generated_password}", @customer&.contact)
          elsif params[:customer_status] == "active"
            # last_status = @project.versions.last.reify
            @project.status = "wip"
            @project.remarks = params[:remarks]
          elsif params[:customer_status] == "lost"
            @project.status = params[:customer_status] if params[:customer_status]
            @project.reason_for_lost = params[:reason_for_lost]
            @project.remarks = params[:remarks]
          else
            if params[:customer_status] && params[:customer_status] == "inactive"
              @project.status = "inactive"
            elsif params[:customer_status] && params[:customer_status] == "on_hold"
              @project.status = 'on_hold'
              @project.save!
            elsif params[:customer_status] && params[:customer_status] == "follow_up"
              @project.status = "follow_up"
            end
            @project.reason_for_lost = params[:reason_for_lost]
            @project.remarks = params[:remarks]
            @project.count_of_calls.to_i == 0
          end

          if @project.save!
            # make events as done
            @events = @project.events.where(status: ["scheduled", "rescheduled"])
            @events.update(status: "done")

            emails = []
            emails.push(current_user.email)
            emails.push(@customer.email)
            if current_user.has_any_role?(:community_manager, :city_gm, :design_manager, :business_head)
              if @project.status == "not_contactable"
                create_event_project_status(DateTime.now.days_ago(-1), "follow_up_for_not_contactable", @project.id, emails)
              elsif @project.status == "follow_up"
                create_event_project_status(params[:customer_meeting_time], @project.status, @project.id, emails)
              elsif @project.status == "on_hold"
                create_event_project_status(params[:customer_meeting_time], @project.status, @project.id, emails)
              elsif @project.status == "delayed_possession"
                create_event_project_status(tminus60(params[:customer_meeting_time]), "delayed_possession", @project.id, emails)
                # also set the possession_status_date in the questionnaire in the proper format, eg 'Dec-2018'.
                @project.lead.note_records.first_or_create.update(possession_status_date: params[:customer_meeting_time].to_time.strftime("%b-%Y"))
              elsif @project.status == "delayed_project"
                create_event_project_status(tminus60(params[:customer_meeting_time]), "delayed_project", @project.id, emails)
              end
            elsif current_user.has_role?(:designer)
              emails.push(User.find(current_user.cm_id).email)
              @lead = Lead.find_by(:related_user => @customer.id)
              if @project.status == "not_contactable"
                create_event_project_status(DateTime.now.days_ago(-1), "follow_up_for_not_contactable", @project.id, emails)
              elsif @project.status == "follow_up"
                create_event_project_status(params[:customer_meeting_time], @project.status, @project.id, emails) if params[:customer_meeting_time].present?
              elsif @project.status == "on_hold"
                create_event_project_status(params[:customer_meeting_time], @project.status, @project.id, emails) if params[:customer_meeting_time].present?
              elsif @project.status == "delayed_possession"
                create_event_project_status(tminus60(params[:customer_meeting_time]), "delayed_possession", @project.id, emails)
                # also set the possession_status_date in the questionnaire in the proper format, eg 'Dec-2018'.
                @project.lead.note_records.first_or_create.update(possession_status_date: params[:customer_meeting_time].to_time.strftime("%b-%Y"))
              elsif @project.status == "delayed_project"
                create_event_project_status(tminus60(params[:customer_meeting_time]), "delayed_project", @project.id, emails)
              end
            end

            UserNotifierMailer.customer_designer_status_mail(@customer, @user, @project).deliver_later!(wait: 15.minutes)
            render json: @customer, serializer: DesignerSerializer, project: @project,
                   designer_project: @designer_project
          else
            render json: {message: @project.errors.full_messages}, status: :unprocessable_entity
          end
        end
      end
    end

    # Switch the online status of a cs agent.
    def csagent_online_change
      if current_user.has_role?(:cs_agent)
        if params[:online_status] == "online"
          current_user.update!(online_status: true)
          @next_lead = LeadPriorityEngine.new(current_user).get_prioritized_lead
          if @next_lead.present?
            if ["not_contactable", "follow_up"].include?(@next_lead.lead_status)
              @next_lead.lead_user_change(current_user)
            else
              @next_lead.auto_assign(current_user) unless current_user.forcefully_assigned_leads.include?(@next_lead)
            end
            return render json: @next_lead
          else
            return render json: {message: "No leads to currently assign to you."}, status: 204
          end
        elsif params[:online_status] == "offline"
          current_user.update!(online_status: false)
          # Unassign this cs_agent's leads if he goes offline, if applicable
          current_user.all_assigned_active_leads.each do |lead|
            ActiveRecord::Base.transaction do
              if ["not_claimed", "claimed"].include?(lead.lead_status)
                lead.unassign
                queue = lead.lead_queue
                if queue.present?
                  queue.status = "queued"
                  queue.save!
                end
              end
            end
          end
          render json: nil
        end
      else
        render json: {message: "This user is not a CS Agent!"}, status: :unauthorized
      end
    end

    # Change the catalog type used for this user, eg whether 'arrivae' or 'polka'
    def change_catalog_type
      @user = current_user
      if @user.update(catalog_type: params[:catalog_type])
        render json: { message: "Successfully switched catalog." }
      else
        render json: { message: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def add_role
      if params.has_key?(:user) && params[:user][:role].present?
        @user.add_role params[:user][:role]
        UserNotifierMailer.user_role_add_email(@user, params[:user][:role]).deliver
        SmsModule.send_sms("Congrats. Your new role in Arrivae is #{params[:user][:role]}", @user.contact)
        render json: {message: "#{params[:user][:role]} role created"}, status: :created
      else
        render json: {message: "Role is required"}, status: :unprocessable_entity
      end
    end

    def remove_role
      if params.has_key?(:user) && params[:user][:role].present?
        @user.remove_role params[:user][:role]
        UserNotifierMailer.user_role_remove_email(@user, params[:user][:role]).deliver_later!(wait: 15.minutes)
        SmsModule.send_sms("You have been unassigned the role #{params[:user][:role]} in Arrivae", @user.contact)
        render json: {message: "#{params[:user][:role]} role removed"}
      else
        render json: {message: "Role is required"}, status: :unprocessable_entity
      end
    end

    def update_role
      if params.has_key?(:user) && params[:user][:role].present? && @user.confirmed_at.present?
        @user.role_ids = []
        @user.add_role params[:user][:role]
        lead = Lead.where(related_user_id: @user.id).last
        lead_type = LeadType.find_by(name: params[:user][:role])
        if lead.present? && lead_type.present?
          lead.lead_type = lead_type
          lead.save
        end
        UserNotifierMailer.user_role_add_email(@user, params[:user][:role]).deliver
        SmsModule.send_sms("Congrats. Your new role in Arrivae is #{params[:user][:role]}", @user.contact)
        render json: @user
      else
        render json: {message: "Role is required"}, status: :unprocessable_entity
      end
    end

    def designer_active_leads
      if params[:designer_id].blank? || User.find_by(id: params[:designer_id]).blank?
        return render json: {message: "palese provide proper designer id"}, status: 404
      end
      designer = User.find(params[:designer_id])
      leads_count = designer.active_assigned_projects.where(status: ["qualified", "not_contactable", "follow_up", "wip"]).count
      render json: {leads_count: leads_count}, status: 200
    end

    def assign_project
      begin
        if params.has_key?(:user) && params[:user][:designer_id].present? && params[:user][:project_id].present?
          # @client = User.find(params[:user][:client_id])
          # if !params[:user][:project_id].present?
          #   @client.projects.build(:name => Bazaar.heroku, :details => "Update project details here.")
          #   @client.save!
          # end
          # project = @client.projects.last
          @project = Project.find params[:user][:project_id]
          @project.assign_project params[:user][:designer_id]

          @events = @project.events.where(status: ["scheduled", "rescheduled"])
          @events.where.not(agenda: ['1st_call', '1st_call_by_cm', '1st_call_by_gm']).each do |event|
            event.update(status: "done")
          end if @events.present?

          designer = User.find(params[:user][:designer_id])
          exophone = "08033947433"
          client = User.find(params[:user][:client_id])
          create_event_project_status(DateTime.now, "lead_assigned", @project.id, [User.find(params[:user][:designer_id]).email])
          SmsModule.send_sms("Your Home. Your Design. On the Way. #{designer.name.titleize} will call you within 24 hours from #{exophone}. You can reach them at #{exophone} with Extension #{designer.extension}.", client.contact)
          render json: @user, status: :created
        else
          render json: {message: "Missing parameters - designer_id and project_id are required."}, status: 401
        end
      rescue => error
        render json: {message: error.message}, status: :unprocessable_entity
      end
    end

    # GET For admin, lead_head
    def designer_cm_index
      unless current_user.has_any_role?(:admin, :lead_head, :category_head, *Role::CATEGORY_ROLES, :business_head, :community_manager, :category_head)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      hash = Hash.new
      designers = User.with_role(:designer).select(:id, :email, :name).as_json
      cms = User.with_role(:community_manager).select(:id, :email, :name).as_json

      hash[:designer_list] = designers
      hash[:cm_list] = cms
      render json: hash, status: :ok
    end

    def user_pincode_mapping_xlxs
      cms = User.with_role(:community_manager)
      render json: User.pincode_mapping_xlxs(cms), status: 200

    end

    def cm_designers
      unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
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
      hash = Hash.new
      designers = User.where(id: designer_id).joins(:designer_detail).select(:id, :email, :name).where("designer_details.active = ?", true).as_json
      hash[:designer_list] = designers
      render json: hash, status: :ok
    end

    def assigned_designers_to_cm
      unless current_user.has_any_role?(:admin, :community_manager)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      designers_array = []
      designers = current_user.designers_for_cm
      designers.each do |designer|
        designer_detail = designer.designer_detail
        hash = Hash.new
        hash[:id] = designer.id
        hash[:name] = designer.name
        hash[:contact] = designer.contact
        hash[:exophone] = User::COMMON_EXOPHONE
        hash[:extension] = designer.extension
        hash[:email] = designer.email
        hash[:instagram_handle] = designer_detail&.instagram_handle
        hash[:designer_cv] = designer_detail&.designer_cv
        hash[:status] = designer_detail&.active
        designers_array.push(hash)
      end
      render json: {designers: designers_array}, status: :ok
    end

    def change_status_of_designer
      unless current_user.has_any_role?(:admin, :community_manager)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      designer = User.find params[:designer_id]
      designer.create_designer_detail if designer.designer_detail.blank?
      if designer.designer_detail.update(active: params[:active])
        render json: {message: "Status Updated successfully"}, status: 200
      else
        render json: designer.errors, status: :unprocessable_entity
      end
    end

    # POST For admin, lead_head
    def assign_designer_to_cm
      unless current_user.has_any_role?(:admin, :lead_head)
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      @lead = Lead.find params[:designer_id]
      @designer = @lead.related_user
      unless @designer.present? && @designer.has_role?(:designer)
        return render json: {message: "No user with designer role was found for given designer id."}, status: :unprocessable_entity
      end
      @cm = User.find params[:cm_id]
      unless @cm.present? && @cm.has_role?(:community_manager)
        return render json: {message: "No user with community_manager role was found for given cm id."}, status: :unprocessable_entity
      end
      @designer.cm = @cm
      if @designer.save
        User.migrate_all_leads_to_cm(@designer, @cm)
        render json: @designer, status: :ok
      else
        render json: @designer.errors.full_messages, status: :unprocessable_entity
      end
    end

    # def assign_project
    #   @user.assign_project
    # end

    def activate
      @user.update(is_active: true)
      updated_password = @user.update_password
      UserNotifierMailer.user_activation_email(@user, updated_password).deliver
      SmsModule.send_sms("Congrats. Your account is activated in arrivae.com", @user.contact)
      render json: {message: "Account activated"}
    end

    def deactivate
      role = @user.roles.pluck(:name).uniq
      @user.update(is_active: false)
      if role.include? "designer"
        @user.assigned_projects.destroy_all
      end
      @user.update(:password => "deactivatedbyadmin")

      UserNotifierMailer.user_deactivation_email(@user).deliver
      SmsModule.send_sms("Your account has been de-activated in arrivae.com", @user.contact)
      render json: {message: "Account deactivated"}
    end

    def password_reset
      updated_password = @user.update_password
      UserNotifierMailer.user_deactivation_email(@user).deliver
      SmsModule.send_sms("Your password has been updated in arrivae.com. You will receive your credentials via email.", @user.contact)
    end

    # used by the Lead App.
    def password_reset_mobile
      @customer = User.find_by_email params[:email]
      unless @customer.present?
        return render json: {message: "No user with this email."}, status: 404
      end
      updated_password = Devise.friendly_token.first(8)
      if @customer.update(password: updated_password)
        UserNotifierMailer.lead_credential_mail(@customer, updated_password).deliver!
        render json: {message: "Password reset and sent by email."}
      else
        render json: {message: "Password could not be reset."}, status: :unprocessable_entity
      end
    end


    # admin can invite any user and he can make user as an arrivae champion while inviting
    def invite_user
      if params.has_key?(:user)
        if ["lead_head", "cs_agent", "community_manager", "finance", "sitesupervisor", "cad", "customer_head", "vendor", "design_head", "business_head",
            "referral", "order_manager", "catalog_viewer", "employee_referral", "design_partner_referral", "category_head",
            "client_referral", "display_dealer_referral", "non_display_dealer_referral", "sales_manager", "catalogue_head", 
            "developer", "associate_partner", "others", "city_gm", "design_manager", "category_panel", 
            "category_non_panel", "category_services"].include?(params[:user][:user_type]) # removed arrivae_champion because that role is not present in the system

          if User.find_by_email(params[:user][:email]).present?
            return render json: {message: "User with email #{params[:user][:email]} already exists."}, status: :unprocessable_entity
          end
          password = (0...8).map { (65 + rand(26)).chr }.join
          user = User.new(email: params[:user][:email], contact: params[:user][:contact], name: params[:user][:name], password: password, is_champion: params[:user][:is_champion])
          user.save
          user.confirm
          role = params[:user][:user_type]
          user.add_role(params[:user][:user_type].to_sym)
          UserNotifierMailer.user_invited_welcome_email(user, password, role).deliver!
          if Rails.env.production?
            SmsModule.send_sms("Welcome to Arrivae.com. Login credentials have been mailed to you.", user.contact)
          end
          render json: {message: "#{user.email} invited successfully"}
        elsif ["arrivae_champion"].include?(params[:user][:user_type])
          return render json: {message: " #{params[:user][:user_type]} Role no longer exists."}, status: :unprocessable_entity
        else
          if Lead.find_by_email(params[:user][:email]).present? || User.find_by_email(params[:user][:email]).present?
            return render json: {message: "User with email #{params[:user][:email]} already exists."}, status: :unprocessable_entity
          end
          lead = Lead.new(email: params[:user][:email], name: params[:user][:name], contact: params[:user][:contact],
                          address: params[:user][:address], details: params[:user][:details], city: params[:user][:city],
                          pincode: params[:user][:pincode], :lead_status => "qualified")
          lead.lead_type = LeadType.find_by(name: params[:user][:user_type])
          lead.lead_source = LeadSource.find_by(name: "website")
          lead.invited = true
          ActiveRecord::Base.transaction do
            begin
              if lead.save!
                lead.approve({is_champion: params[:user][:is_champion]})
                render json: {message: "#{lead.email} invited successfully"}
              else
                render json: {message: lead.errors.full_messages}, status: :unprocessable_entity
              end
            end
          end
        end
      else
        render json: {message: "Params missing"}
      end
    end

    # only arrivae champion can invite leve2 level 3 referers
    # Arrivae champion can invite user below his level only.
    # If inviting level 3 user, level 2 users's id must be provided (parent_id).
    # User who is arrivae champion can access this method
    def invite_champion
      if !current_user.is_champion
        return render json: {message: "Only Arrivae Champions are allowed to invite his child users."}, status: :unauthorized
      elsif params[:champion_level].blank?
        return render json: {message: "Parameter champion_level must be present!"}, status: :unprocessable_entity
      elsif current_user.is_champion && params[:champion_level].to_i == 1 # checking whether a user is arrivae champion or not with column is_champion
        return render json: {message: "You may not invite level 1 Users."}, status: :unauthorized
      elsif params[:champion_level].to_i != 1 && params[:parent_id].blank?
        return render json: {message: "Level 2 or 3 Champion must be mapped to a Level 1 user."}, status: :unprocessable_entity
      elsif params[:email].blank? || params[:contact].blank?
        return render json: {message: "Parameters email and contact are required."}, status: :unprocessable_entity
      end

      #['dealer', 'non_display_referral', 'display_dealer_referral', 'employee_referral', 'client_referral', 'design_partner_referral', "developer", "associate_partner", 'other']
      # Modified allowed roles that can be invited

      allowed_roles = ['broker',
        'employee_referral',
        'design_partner_referral',
        'client_referral',
        'display_dealer_referral',
        'non_display_referral',
        'others',
        'associate_partner',
        'dealer'
      ]

      unless allowed_roles.include?(params[:user_type])
        return render json: {message: "You may only invite following roles - #{allowed_roles.join(',')}."}, status: :unauthorized
      end

      if User.find_by_email(params[:email]).present?
        return render json: {message: "User with email #{params[:email]} already exists."}, status: :unprocessable_entity
      end
      if User.find_by_contact(params[:contact]).present?
        return render json: {message: "User with phone number #{params[:contact]} already exists."}, status: :unprocessable_entity
      end

      password = (0...8).map { (65 + rand(26)).chr }.join
      @user = User.new(
        password: password,
        name: params[:name],
        contact: params[:contact],
        email: params[:email],
        user_level: params[:champion_level].to_i,
        parent_id: params[:parent_id],
        invited_by_id: current_user.id
        )

      if @user.save
        @user.confirm
        role = params[:user_type]
        @user.add_role(role.to_sym)
        # If sales_manager is inviting a champion, map the champion to him.
        if current_user.has_role?(:sales_manager)
          @user.update(sales_manager: current_user)
        end
        UserNotifierMailer.user_invited_welcome_email(@user, password, role).deliver!
        if Rails.env.production?
          SmsModule.send_sms("Welcome to Arrivae.com. Login credentials have been mailed to you.", @user.contact)
        end
        render json: {message: "Champion with email: #{@user.email} and phone number: #{@user.contact} has been successfully invited"}
      else
        render json: {message: @user.errors.full_messages}, status: :unprocessable_entity
      end
    end

    # This end-point will return the info necessary for inviting an arrivae_champion
    # No need to authorize this end-point because all roles have access to it.
    def invite_champion_info
      unless current_user.is_champion
        return render json: {message: "User must be Arrivae Champion."}, status: 400
      end

      cur_level = current_user.user_level
      info_hash = Hash.new
      # # Admin, Lead Head can invite any level.
      # if current_user.has_any_role?(:admin, :lead_head)
      #   info_hash[:allowed_champion_levels] = User::LEVELS
      #   (1..User::LEVELS.max).each do |i|
      #     info_hash[i.to_s] = User.where(is_champion: true, user_level: i).map{|user| {id: user.id, email: "#{user.name} (#{user.email})"}}
      #   end
      # # Sales Manager can invite any level - but must keep it within his referrers.
      # elsif current_user.has_role?(:sales_manager)
      #   info_hash[:allowed_champion_levels] = User::LEVELS
      #   (1..User::LEVELS.max).each do |i|
      #     info_hash[i.to_s] = User.where(is_champion: true, user_level: i, sales_manager: current_user).map{|user| {id: user.id, email: "#{user.name} (#{user.email})"}}
      #   end
      # elsif current_user.is_champion
      #   info_hash[:allowed_champion_levels] = (cur_level+1..User::LEVELS.max).to_a
      #   # champions mapped to this champion; or their children champion, etc.
      #   mapped_champions = current_user.self_and_descendants
      #   (1..User::LEVELS.max).each do |i|
      #     info_hash[i.to_s] = mapped_champions.where(user_level: i).map{|user| {id: user.id, email: "#{user.name} (#{user.email})"}}
      #   end
      # # other users can invite only level 1 champions
      # else
      #   info_hash[:allowed_champion_levels] = [1]
      #   info_hash[cur_level.to_s] = [{id: current_user.id, email: "#{current_user.name} (#{current_user.email})"}]
      # end

      if current_user.is_champion
        info_hash[:allowed_champion_levels] = (cur_level+1..User::LEVELS.max).to_a
        # champions mapped to this champion; or their children champion, etc.
        mapped_champions = current_user.self_and_descendants
        (1..User::LEVELS.max).each do |i|
          info_hash[i.to_s] = mapped_champions.where(user_level: i).map{|user| {id: user.id, email: "#{user.name} (#{user.email})"}}
        end
      end

      render json: info_hash
    end

    # List all arrivae_champions of the given level.
    # No need to authorize this end-point because all roles have access to it.
    def champions
      # unless params[:champion_level].present?
      #   return render json: {message: "Champion level must be provided."}, status: 400
      # end

      # if current_user.has_role?(:sales_manager)
      #   @arrivae_champions = User.with_role(:arrivae_champion).where(user_level: params[:champion_level].to_i).where(sales_manager: current_user)
      # elsif current_user.has_role?(:arrivae_champion)
      #   @arrivae_champions = current_user.self_and_descendants.with_role(:arrivae_champion).where(user_level: params[:champion_level].to_i)
      # else
      #   @arrivae_champions = User.with_role(:arrivae_champion).where(user_level: params[:champion_level].to_i)
      # end # this ia no longer neede beacause arrivae champions will be in only one level.

      @arrivae_champions = User.where(is_champion: true)

      info_hash = Hash.new
      info_hash[:champions] = @arrivae_champions.map{|user| {id: user.id, email: "#{user.name} (#{user.email})"}}

      render json: info_hash
    end

    # List all child users mapped against the given arrivae_champion.
    # No need to authorize this end-point because all roles have access to it.

    def child_champions
      if current_user.is_champion
        @arrivae_champion = current_user
      else
        @arrivae_champion = User.where(is_champion: true).find(params[:champion_id])
      end

      info_hash = Hash.new
      info_hash[:champions] = @arrivae_champion.children.map{|user| {id: user.id, email: "#{user.name} (#{user.email})", user_level: user.user_level}}

      render json: info_hash
    end

    # List all child users mapped against the given user.
    # No need to authorize this end-point because all roles have access to it.
    def user_children_with_role
      unless params[:user_id].present? && params[:role]
        return render json: {message: "User id  and role name must be provided."}, status: 400
      end

      @user = User.find(params[:user_id])

      info_hash = Hash.new
      info_hash[:champions] = @user.children.with_role(params[:role]).map{|user| {id: user.id, email: "#{user.name} (#{user.email})", user_level: user.user_level}}

      render json: info_hash
    end

    # Request a list of users with the given role.
    def request_role
      if params[:role].present?
        role = params[:role].downcase
        @users = User.with_role(role)
        render json: { users: @users.map{|user| user.slice(:id, :name, :email)} }
      else
        render json: {message: "Role is required"}
      end
    end

    def call_user
      from = @user.contact
      if params[:lead_id].present?
        to_user = Lead.find(params[:lead_id])
      elsif params[:client_id].present?
        to_user = User.find(params[:client_id])
      elsif params[:contact_no].present?
        to = params[:contact_no]
      end
      to = to_user.contact if to_user.present?

      exotel = Exotel.new
      if from.present? && to.present?
        response = exotel.call(from, to)
      else
        response = "Contact number not present"
      end
      puts response.to_json
      render json: {message: response}
    end

    def send_visit_us_email
      reciever_email = Rails.env == "production" ? "edwin@arrivae.com" : "abhinav@gloify.com"
      datetime = params[:datetime_for_meeting].present? ? DateTime.parse(params[:datetime_for_meeting]).strftime("%-d %B %Y, %I:%M:%S %p") : "None"

      UserNotifierMailer.visit_us_details(reciever_email, params[:name], params[:email], params[:mobile_number], datetime, params[:city], params[:address]).deliver_now!
      render json: {message: "mail sent successfully"}
    end

    def get_cm_tag_mapping
      cms = User.with_role(:community_manager)
      if cms.present?
        cm_tag_mapping = []
        cms.each do |cm|
          cm_tag = Hash.new
          cm_tag["cm_id"] = cm.id
          cm_tag["cm_name"] = cm.name
          cm_tag["tags"] = cm.tags.pluck(:id)
          cm_tag_mapping.push cm_tag
        end
        render json: {cm_tag_mapping: cm_tag_mapping}, status: 200
      else
        render json: {message: "No Community Manager Present"}, status: 204
      end
    end

    def post_cm_tag_mapping
      if params[:cm_ids].present?
        params[:cm_ids].each do |cm_id, values|
          cm = User.find_by_id(cm_id)
          cm.cm_tag_mappings.destroy_all if cm.present?
          if cm.present?
            values.each { |v| cm.cm_tag_mappings.where(tag_id: v).first_or_create }
          end
        end
        render json: {message: "Mapping Updated"}, status: 200
      end
    end

    def import_user_pincode_mapping
      str = params[:attachment].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "")
      filepath = Rails.root.join("tmp").join("mapping.xlsx")
      File.open(filepath, "wb") do |f|
        f.write(Base64.decode64(str))
        f.close
      end
      workbook = Roo::Spreadsheet.open filepath.to_s
      worksheet = workbook.sheet("Sheet1")

      headers = Hash.new
      workbook.row(1).each_with_index do |header, i|
        headers[header.downcase] = i
      end
      user_not_found = []
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        city = City.where(name: workbook.row(row)[headers["district"]].gsub(" ", "").underscore).first_or_create
        code = city.zipcodes.where(code: workbook.row(row)[headers["pincode"]]).first_or_create
        users_emails = []
        puts "-=-=-=-"
        puts "#{row}"
        puts "#{workbook.row(row)[headers["pincode"]]}"
        puts "-=-=-=-"
        users_emails.push workbook.row(row)[headers["full home community manager"]] if headers.keys.include?("full home community manager")
        users_emails.push workbook.row(row)[headers["mkw community manager"]] if headers.keys.include?("mkw community manager")
        users_emails.push workbook.row(row)[headers["both community manager"]] if headers.keys.include?("both community manager")
        users_emails.push workbook.row(row)[headers["full home designer"]] if headers.keys.include?("full home designer")
        users_emails.push workbook.row(row)[headers["mkw designer"]] if headers.keys.include?("mkw designer")
        users_emails.push workbook.row(row)[headers["offices community manager"]] if headers.keys.include?("offices community manager")
        users = User.where(email: users_emails)
        users.each do |user|
          user.user_zipcode_mappings.where(zipcode_id: code.id).first_or_create
        end
        user_not_found.push (users_emails.uniq - users.pluck(:email))
      end
      user_not_found = user_not_found.flatten.uniq.compact
      if user_not_found.count > 0
        render json: {message: "#{user_not_found} Users not present, please check the emails and upload again"}, status: 206
      else
        render json: {message: "Mapping Successfully Updated"}, status: 200
      end
    end

    def list_of_cm
      hash = Hash.new
      cms = User.with_role(:community_manager).select(:id, :email, :name).as_json
      hash[:community_managers] = cms
      render json: hash, status: :ok
    end

    def migrate_cm_data
      unless params[:from_id].present? && params[:to_id].present?
        return render json: {message: "Please selete CM's to migrate data"}, status: 422
      end
      if params[:from_id] == params[:to_id]
        return render json: {message: "From and To CM can not be same"}, status: 422
      end
      hash = Hash.new
      from_user = User.find(params[:from_id])
      to_user = User.find(params[:to_id])

      from_leads = from_user.cm_leads
      from_designers = from_user.designers_for_cm
      from_zip_codes = from_user.zipcodes
      to_zip_codes = to_user.zipcodes
      zipcodes_to_map = (from_zip_codes - to_zip_codes).count
      hash[:leads] = from_leads.count
      hash[:designer] = from_designers.count
      hash[:zipcodes] = zipcodes_to_map
      UserDataMigration.create(from: from_user.id, to: to_user.id, migrated_data: hash)
      from_leads.update(assigned_cm_id: to_user.id)  #leads migration to new CM
      from_designers.update(cm_id: to_user.id)  #designer migration to new CM
      #assign pincode to new user

      from_zip_codes.each do |zipcode|
        to_user.user_zipcode_mappings.where(zipcode_id: zipcode.id).first_or_create
      end
      from_user.user_zipcode_mappings.destroy_all #delete existing user Mapping

      return render json: {message: "Data Migrated from #{from_user.name} to #{to_user.name}"}, status: 200
    end

    def cm_assigned_data
      if params[:cm_id].present?
        cm = User.find(params[:cm_id])
        unless cm.has_role?(:community_manager)
          return render json: {message: "Please select Community Manager"}, status: 422
        end
        hash = Hash.new
        hash[:lead_count] = cm.cm_leads.count
        hash[:designer_count] = cm.designers_for_cm.count
        hash[:zip_code_count] = cm.zipcodes.count

        return render json: {cm_data: hash}, status: 200
      else
        return render json: {message: "Please select Community Manager"}, status: 422
      end
    end

    def data_migration_history
      unless current_user.has_role?(:admin)
        return render json: {message: "You are not authorized for this action"}, status: 403
      end
      paginate json: UserDataMigration.all, each_serializer: UserDataMigrationSerializer, status: 200
    end

    # GET /users/referrers
    def referrers
      if current_user.has_role? :admin
        @referrers = User.referrers
        if params[:search].present? && !params[:search].blank?
          @referrers = @referrers.search_users(params[:search])
        end
        @referrers = paginate @referrers
        render json: @referrers, each_serializer: ReferrersUserSerializer
      else
        render json: {message: "Access denied"}
      end
    end

    # GET /users/sales_managers
    def sales_managers
      if current_user.has_role? :admin
        @sales_managers = User.sales_managers.map { |sm| {id: sm.id, name: sm.name, email: sm.email} }
        render json: {sales_managers: @sales_managers}
      else
        render json: {message: "Access denied"}
      end
    end

    # POST /users/assign_sales_manager_to_referrer
    def assign_sales_manager_to_referrer
      unless current_user.has_any_role? :admin
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      @sales_manager = User.find params[:sales_manager_id]
      unless @sales_manager.present? && @sales_manager.has_role?(:sales_manager)
        return render json: {message: "No user with sales manager role was found for given sales manager id."}, status: :unprocessable_entity
      end
      @referrer = User.find params[:referrer_id]
      unless @referrer.present? && @referrer.is_a_referrer?
        return render json: {message: "No user as referrer was found for given referrer id."}, status: :unprocessable_entity
      end
      @referrer.sales_manager = @sales_manager
      if @referrer.save
        UserNotifierMailer.referrer_assigned(@sales_manager, @referrer).deliver_now!
        render json: {message: "Assigned to sales manager"}, status: :ok
      else
        render json: @referrer.errors.full_messages, status: :unprocessable_entity
      end
    end

    # GET /users/id/sales_manager_referrers
    def sales_manager_referrers
      @referrers = @user.referrers
      if params[:search].present? && !params[:search].blank?
        @referrers = @referrers.search(params[:search])
      end
      @referrers = paginate @referrers
      render json: @referrers, each_serializer: SalesManagerReferrersUserSerializer
    end

    # GET /users/id/load_referrer_users?role=role_val
    def load_referrer_users
      # Given access to more roles to ger referrer users
      unless current_user.has_any_role? :sales_manager, :cs_agent, :lead_head, :designer, :community_manager, :admin, :arrivae_champion
        return render json: {message: "You don't have permission to do this."}, status: :unauthorized
      end
      if params[:role].present?
        role = params[:role].parameterize
        if Role.referrers.pluck(:name).include? role
          if @user.has_role? :sales_manager # previously sales manager had referrers by following query
            @referrers = @user.referrers.with_role(role)
          else
            @referrers = User.with_role(role) # This is to get user with the role
          end
          render json: @referrers, each_serializer: UserReferrersByRoleSerializer # changed name of serializer SalesManagerReferrersByRoleSerializer as UserReferrersByRoleSerializer
        else
          return render json: {message: "Provided role is not a referrer role."}, status: :unprocessable_entity
        end
      else
        return render json: {message: "Please provide a role"}, status: :ok
      end
    end

    # GET /users/id/referrer_user_types
    def referrer_user_types
      referrer_roles = {referral_roles: Role.referrers.map { |r| {name: r.name} }}
      render json: referrer_roles
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:name, :email, :contact, :nickname, :avatar, :pincode,
                                   :gst_number, :pan, :address_proof, :kyc_approved, :extension)
    end

    def all_filter_options
      filter_options = Hash.new
      if params[:from_date].present? || params[:to_date].present? && params[:column_name].present?
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
      end
      filter_options["search"] = params[:search] if params[:search].present?
      filter_options["designer_id"] = params[:designer_id] if params[:designer_id].present?
      filter_options
    end

    # List all users depending on your role
    def load_users
      if current_user.has_role? :design_head
        # @users = User.active_users.with_role :designer
        # @users = @users.latest_created_at_first
        @users = User.active_users.latest_created_at_first
      elsif (current_user.has_role? :admin)
        # @users = User.active_users
        # @users = @users.latest_created_at_first
        @users = User.active_users.latest_created_at_first
      elsif (current_user.has_role? :customer_head)
        # @users = User.active_users.with_role :customer
        # @users = @users.active_users.latest_created_at_first
        @users = User.active_users.latest_created_at_first.with_role :customer
      else
        # @users = User.all.where(id: current_user.id)
        # @users = @users.active_users.latest_created_at_first
        return false
      end
    end

    def create_event_project_status(follow_up_time, agenda, project_id, emails)
      date = follow_up_time

      @event = Event.create!(agenda: agenda, contact_type: "phone_call", scheduled_at: date, ownerable: Project.find(project_id))
      @event.add_participants(emails, current_user.id)
      if @event.present? && @event.agenda != "leads_assigned"
        @event.users.each do |user|
          UserNotifierMailer.event_created_email(@event, user).deliver_later!(wait: 15.minutes)
          UserNotifierMailer.event_reminder(@event, user).deliver_later!(wait_until: @event.scheduled_at - 30.minute)
          SmsModule.delay(run_at: @event.scheduled_at - 10.minutes).send_sms("You have a scheduled event in 10 minutes. Client Name: #{@event&.ownerable&.user&.name&.humanize},Agenda: #{@event.agenda.humanize}, Scheduled at: #{@event.scheduled_at.strftime("%-d/%-m/%y: %I:%M %p")}", user.contact)
        end
      end
    end

    def tminus60(input_time)
      input_time.to_date.beginning_of_month + 11.hours
    end

    # Check if params[:customer_meeting_time] is eligible.
    # For example, if currently it is Dec-2018, then minimum allowed is Mar-2019.
    def date_eligible_for_delayed_possession?
      beginning_of_next_month = (Date.today + 1.month).beginning_of_month
      minimum_eligible_date = beginning_of_next_month + 2.months
      params[:customer_meeting_time].present? && ( params[:customer_meeting_time].to_date >= minimum_eligible_date )
    end
  end
end
