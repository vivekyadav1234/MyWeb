module Api::V1::Concerns::AdminScreen
  extend ActiveSupport::Concern

  def lead_metrics_filter_data
    h = Hash.new

    h[:cities] = [{"id": 'all', "itemName": "All"}] + City.all.map{|record| { "id": record.id, "itemName": record.name.humanize } }
    h[:cms] = [{"id": 'all', "itemName": "All"}] + User.with_role(:community_manager).joins(:tags).where(tags: {name: ["full_home", "mkw"]}).map{|record| { "id": record.id, "itemName": "#{record.email} - #{record.name}" } }
    h[:designers] = [{"id": 'all', "itemName": "All"}] + User.with_role(:designer).map{|record| { "id": record.id, "itemName": "#{record.email} - #{record.name}" } }
    h[:lead_sources] = LeadSource.all.map{|record| { "id": record.id, "itemName": record.name.humanize } }
    h[:lead_campaigns] = LeadCampaign.all.map{|record| { "id": record.id, "itemName": record.name.humanize } }
    h[:lead_types] = LeadType.all.map{|record| { "id": record.id, "itemName": record.name.humanize } }
    h[:lead_tags] = Tag.leads.map{|record| { "id": record.id, "itemName": record.name.humanize } }
    h[:data_scope] = ["overall_data", "fhi_data", "mkw_data"].map{ |e| { "id": e, "itemName": e.humanize }}
    h[:digital_physical] = ["all", "digital", "physical"].map{ |e| { "id": e, "itemName": e.humanize }}

    render json: h
  end

  def aws_city_cm_designer_data
    if params[:city] == "all" || params[:city].blank?
      cms_for_city = User.joins(:tags).where(tags: {name: ["full_home", "mkw"]})
      if params[:data_scope] == "fhi_data"
        cms_for_city = User.joins(:tags).where(tags: {name: "full_home"}).select(:id, :name, :email).distinct
      elsif params[:data_scope] == "mkw_data"
        cms_for_city = User.joins(:tags).where(tags: {name: "mkw"}).select(:id, :name, :email).distinct
      end
      designers_for_city = User.with_role(:designer)
    else
      city = City.find(params[:city])
      cms  = User.joins(:tags).where(tags: {name: ["full_home", "mkw"]})
      cms_for_city = cms.joins(:cities).where(cities: {id: city}).select(:id, :name, :email).distinct
      if params[:data_scope] == "fhi_data"
        cms_for_city = cms_for_city.joins(:tags).where(tags: {name: "full_home"}).select(:id, :name, :email).distinct
      elsif params[:data_scope] == "mkw_data"
        cms_for_city = cms_for_city.joins(:tags).where(tags: {name: "mkw"}).select(:id, :name, :email).distinct
      end
      designer_id_array = cms_for_city.map { |cm| cm.designers_for_cm.pluck(:id) }.flatten.compact
      designers_for_city = User.with_role(:designer).where(id: designer_id_array)
    end

    data_hash = {
      cms: cms_for_city.map { |record| {id: record.id, itemName: "#{record.email} - #{record.name}"} },
      designers: designers_for_city.map { |record| {id: record.id, itemName: "#{record.email} - #{record.name}"} },
    }

    render json: data_hash
  end

  def lead_metrics
    leads = filter_leads_admin(Lead.all)
    render json: leads.lead_metrics(@week_from_date)
  end

  def community_metrics
    leads = filter_leads_admin(Lead.all)
    render json: leads.community_metrics(@week_from_date)
  end

  def cm_designer_metrics
    leads = filter_leads_admin(Lead.all)
    render json: leads.cm_designer_metrics(@filter_params, @week_from_date)
  end

  def mkw_business_head
    leads = filter_leads_admin(Lead.all)
    render json: leads.mkw_business_head(@filter_params, @week_from_date)
  end

  # for business head - aws here means Arrivae Weekly Statistics.
  def aws_dashboard
    leads = filter_leads_aws(Lead.approved_users)
    # Let us strip the leads of all previous queries.
    @refreshed_leads = leads.where(id: leads.pluck(:id))
    h = Hash.new
    # shown at top level
    target_data = @refreshed_leads.get_aws_target_data(@filter_params)
    h[:card_data] = @refreshed_leads.aws_dashboard_card_data(target_data)
    # shown in a chart below
    @number_of_weeks ||= 5
    target_data_weekly = @refreshed_leads.get_aws_target_data(@filter_params, {one_week_only: true})
    h[:weekly_data] = @refreshed_leads.aws_dashboard_weekly_data(@number_of_weeks.to_i, target_data_weekly, @filter_params[:to_date])
    render json: h
  end

  # for business head - fhi/mkw qualified leads data (aws) tabulated
  def aws_weekly_data
    date_filter_flag = false
    leads = filter_leads_aws(Lead.approved_users, date_filter_flag)
    @refreshed_leads = leads.where(id: leads.pluck(:id))
    h = Hash.new
    @number_of_weeks = 7
    target_data_weekly = @refreshed_leads.get_aws_target_data(@filter_params, {one_week_only: true})
    h[:weekly_data] = @refreshed_leads.aws_tabular_weekly_data(@number_of_weeks.to_i, target_data_weekly, @filter_params)
    render json: h
  end

  # order book
  def aws_order_book
    leads = filter_leads_aws(Lead.approved_users)

    @refreshed_leads = leads.where(id: leads.pluck(:id)).joins(project: :payments).order("leads.id DESC").distinct
    paginate json: @refreshed_leads, each_serializer: LeadOrderBookSerializer
  end
  
  # this will give leads based on filters and current_user
  # def leads_via_current_user
  #   gm_dashboard_filters
  #   projects_lead_ids = Project.where("created_at >= ?", DateTime.parse('01/01/2018')).pluck(:lead_id)
  #   if current_user.has_role?(:community_manager)
  #     cms = current_user.id
  #     @all_leads = Lead.where(id: projects_lead_ids, assigned_cm_id: cms)
  #   elsif current_user.has_role?(:designer)
  #     projects = DesignerProject.where(designer_id: current_user).pluck(:project_id).uniq
  #     lds = Lead.joins(:project).where(projects: {id: projects})
  #     @all_leads = Lead.where(id: projects_lead_ids).where(id: lds)
  #   elsif current_user.has_role?(:business_head)
  #     cms = GmCmMapping.pluck(:cm_id).uniq
  #     @all_leads = Lead.where(assigned_cm_id: cms)
  #   else
  #     cms = @filter_params[:cm].present? ? @filter_params[:cm] : current_user.cms.pluck(:id)
  #     @all_leads = Lead.where(id: projects_lead_ids, assigned_cm_id: cms)
  #   end
  #   return @all_leads
  # end

  def gm_dashboard
    gm_dashboard_filters
    all_leads = @all_leads.filter_admin(@filter_params)
    h = Hash.new
    type_of_filter = @filter_params[:time_duration].present? ? @filter_params[:time_duration] : 'date_range'
    h[:type_of_filter] = type_of_filter
    h[:data] = @refreshed_leads.gm_dashboard_tabular_data(@number_of_iterations, type_of_filter, @options, {}, all_leads)
    render json: h
  end

  def gm_dashboard_data
    gm_dashboard_filters
    all_leads = @all_leads.filter_admin(@filter_params)
    type_of_filter = @filter_params[:time_duration].present? ? @filter_params[:time_duration] : 'date_range'
    detail_filter = {
      row: @filter_params[:row_name],
      column: @filter_params[:column_name]
    }
    data = @refreshed_leads.gm_dashboard_tabular_data(@number_of_iterations, type_of_filter, @options, detail_filter, all_leads)
    data = data[0].uniq&.order(:id)
    if data.present?
      if params[:search].present?
        data = data.search_leads(params[:search]).order(:id)
      end
      paginate json:  data, each_serializer: LeadGmSerializer, status: 200
    else
      render json: {message: "No Leads to display"}, status: 2000
    end
  end

  def city_gm_cm_and_designer
    gms = nil
    cms = nil
    designers = nil
    if current_user.has_role? (:community_manager)
      designers = User.where(cm_id: current_user).map{|d| {id: d.id, itemName: "#{d.email} - #{d.name}"}}
    elsif current_user.has_any_role?(:city_gm, :design_manager) 
      cm_ids =  current_user.has_role?(:design_manager) ? current_user.dm_cms.pluck(:id) : current_user.cms.pluck(:id)
      cms = current_user.has_role?(:design_manager) ? current_user.dm_cms.map{|cm| {id: cm.id, itemName: "#{cm.email} - #{cm.name}"}} : current_user.cms.map{|cm| {id: cm.id, itemName: "#{cm.email} - #{cm.name}"}}
      designers =  params[:cm].present? ? User.where(cm_id: params[:cm]).map{|d| {id: d.id, itemName: "#{d.email} - #{d.name}"}} : User.where(cm_id: cm_ids).map{|d| {id: d.id, itemName: "#{d.email} - #{d.name}"}}   
    elsif current_user.has_role? (:business_head)
      gms = User.with_role(:city_gm).map{|gm| {id: gm.id, itemName: "#{gm.email} - #{gm.name}"}}
      cm_ids = User.with_role(:community_manager).pluck(:id)
      cms = User.where(id: cm_ids).map{|cm| {id: cm.id, itemName: "#{cm.email} - #{cm.name}"}}
      designers = params[:cm].present? ? User.where(cm_id: params[:cm]).map{|d| {id: d.id, itemName: "#{d.email} - #{d.name}"}} : User.where(cm_id: cm_ids).map{|d| {id: d.id, itemName: "#{d.email} - #{d.name}"}}   
    end
    data_hash = {
      gms: gms,
      cms: cms,
      designers: designers
    }
    render json: data_hash, status: 200
  end


  def gm_dashboard_excel_report
    gm_dashboard_filters
    all_leads = @all_leads.filter_admin(@filter_params)
    type_of_filter = @filter_params[:time_duration].present? ? @filter_params[:time_duration] : 'date_range'
    detail_filter = {
      row: @filter_params[:row_name],
      column: @filter_params[:column_name]
    }
    data = @refreshed_leads.gm_dashboard_tabular_data(@number_of_iterations, type_of_filter, @options, detail_filter, all_leads)
    data = data[0].uniq.order(:id)
    if data.present?
      if params[:search].present?
        data = data.search_leads(params[:search])
        GmExcelReportJob.perform_later(data.to_a, current_user)
        render json: {message: "You will get excel report through mail"}, status: 200
      end
        GmExcelReportJob.perform_later(data.to_a, current_user)
        render json: {message: "You will get excel report through mail"}, status: 200
    else
      render json: {message: "No Leads to display"}, status: 2000
    end
  end


  private
  def filter_leads_admin(leads_to_filter)
    if params[:filter_params].present?
      @filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      @week_from_date = @filter_params[:week_from_date]
      leads_to_filter.filter_admin(@filter_params).filter_date_admin(@filter_params)
    else
      leads_to_filter
    end
  end

  # if date_filter_flag is set to false, then don't apply the date filter
  def filter_leads_aws(leads_to_filter, date_filter_flag=true)
    if params[:filter_params].present?
      @filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      @number_of_weeks = @filter_params[:number_of_weeks]
      aws_set_default_dates
      if date_filter_flag
        return leads_to_filter.filter_date_admin(@filter_params).filter_admin(@filter_params)
      else
        return leads_to_filter.filter_admin(@filter_params)
      end
    else
      @filter_params = Hash.new
      aws_set_default_dates
      if date_filter_flag
        return leads_to_filter.filter_date_admin(@filter_params)
      else
        return leads_to_filter
      end
    end
  end

  # keeping this separate just to be safe
  def filter_leads_gm(leads_to_filter, filter_params)
    leads_to_filter.filter_date_gm(filter_params).filter_admin(filter_params)
  end

  # set default dates if from and to not present.
  def aws_set_default_dates
    @filter_params[:from_date] = Lead::START_DATE_LEAD_STATISTICS if @filter_params[:from_date].blank?
    @filter_params[:to_date] = ( Date.today ) if @filter_params[:to_date].blank?
  end

  def gm_dashboard_filters
    @number_of_iterations = 7 - 1
    if params[:filter_params].present?
      @filter_params = JSON.parse(params[:filter_params]).symbolize_keys
      @number_of_weeks = @filter_params[:number_of_weeks]
      if @filter_params[:time_duration].present?
        if @filter_params[:time_duration] == "days"
          @filter_params[:from_date] = (DateTime.now.end_of_day - @number_of_iterations.days).beginning_of_day
          @filter_params[:to_date] = DateTime.now.end_of_day
        elsif @filter_params[:time_duration] == "weeks"
          @filter_params[:from_date] = (DateTime.now.end_of_week.end_of_day - @number_of_iterations.weeks).beginning_of_week.beginning_of_day
          @filter_params[:to_date] = DateTime.now.end_of_week.end_of_day
        elsif @filter_params[:time_duration] == "months"
          @filter_params[:from_date] = (DateTime.now.end_of_month.end_of_day - @number_of_iterations.months).beginning_of_month.beginning_of_day
          @filter_params[:to_date] = DateTime.now.end_of_month.end_of_day
        end
        @options = {
          start_time:   @filter_params[:from_date],
          end_time:    @filter_params[:to_date]
        }
      else
        @options = {
          start_time: DateTime.parse(@filter_params[:from_date].to_s).beginning_of_day + 1.day,
          end_time:  DateTime.parse(@filter_params[:to_date].to_s).end_of_day + 1.day
        }
        @filter_params[:from_date] = @options[:start_time]
        @filter_params[:to_date] = @options[:end_time]
      end
    end
    @filter_params[:date_filter_type] = "qualification"
    if current_user.has_role?(:community_manager)
      @all_leads = Lead.where(assigned_cm_id: current_user)
      leads = filter_leads_gm(@all_leads, @filter_params)  
    elsif current_user.has_role?(:designer)
      projects = DesignerProject.where(designer_id: current_user).pluck(:project_id).uniq
      @all_leads = Lead.joins(:project).where(projects: {id: projects})
      leads =  filter_leads_gm(@all_leads, @filter_params)
    elsif current_user.has_role?(:business_head)
      cms = User.with_role(:community_manager).pluck(:id)
      @all_leads = Lead.where(assigned_cm_id: cms)
      leads = filter_leads_gm(@all_leads, @filter_params)
    else
      @all_leads = current_user.has_role?(:design_manager) ? Lead.where(assigned_cm_id: current_user.dm_cms.pluck(:id)) : Lead.where(assigned_cm_id: current_user.cms.pluck(:id))
      leads = filter_leads_gm(@all_leads, @filter_params)
    end
    @refreshed_leads = leads.where(id: leads.pluck(:id))
  end

end
