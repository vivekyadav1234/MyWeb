require_dependency "#{Rails.root.join("app", "serializers", "lead_serializer")}"
class Api::V1::LeadsController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: [:create, :create_contact_lead, :create_voucher_lead, :update_lead_status, :alternate_contacts,
    :create_lead, :update_lead_status_from_landing_page, :update_lead_status2, :get_pincodes_on_city_basis ]
  before_action :set_lead, only: [:show, :update, :destroy, :approve_user, :update_status, :mark_escalated, :get_lead_info, :assign_cm_to_lead, :update_basic_info, :alternate_contacts, :sales_life_cycle_report]

  load_and_authorize_resource except: [:create, :download_leads, :create_contact_lead, :create_voucher_lead, :get_all_projects_belongs_to_lead, :update_lead_status, :update_lead_status_from_landing_page, :create_lead, :sales_life_cycle_report, :update_lead_status2, :get_pincodes_on_city_basis]

  include Api::V1::Concerns::AdminScreen

  def get_pincodes_on_city_basis
   if params[:city].present?
      city = params[:city].downcase
      if city == "delhi ncr"
        # city = "delhi_ncr"
        # city = City.find_by_name city
        zipcodes = Zipcode.where(" city_id IN (?) ", [4, 13,14,15,16,17,18,19,20,22,23,24,25])
      else
        city = City.find_by_name city
        if city.blank?
          return render json: { message: "City with name #{city} not found." }, status: :not_found
        end
        zipcodes = Zipcode.where(" city_id = ? ", city.id)
      end

      if params[:landing_page]
        @zipcodes_codes = zipcodes.where(landing_page_hidden: false).collect{|c| c.code}
      else
        @zipcodes_codes = zipcodes.collect{|c| c.code}
      end

     render json: @zipcodes_codes.to_json, status: 200
   end
  end
  #get project details for a lead
def get_all_projects_belongs_to_lead
  @lead = current_user.related_leads
  render json: @lead, each_serializer: LeadProjectSerializer
end

  # GET /api/v1/leads
  def index
    if load_leads
      source = params[:source] || "all"
      sources = (source == "all" || source.blank?) ? ["digital", "bulk"] : source
      @leads = @leads.where(:source => sources).joins(:lead_type).where.not(lead_types: {name: ["broker"]}).uniq

      #filter if params given
      if params[:column_name].present? && (params[:from_date].present? || params[:to_date].present?)
        filter_options = Hash.new
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
        from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now - 10.years
        to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
        @leads = @leads.where({params[:column_name] => from_time..to_time})
      end
      #filter done
      if params[:cs_agent].present?
        @leads = @leads.joins(:lead_users).where(lead_users: {user_id: params[:cs_agent].split(",")}).distinct
      end
      #
      # # return those leads whose contact or email matches the entered
      # # search param
      if params[:search].present?
        @leads = @leads.where("email like ?", "%#{params[:search]}%").or(@leads.where("contact like ?", "%#{params[:search]}%")).or(@leads.where("name like ?", "%#{params[:search]}%"))
      end
      hash_to_render = Hash.new
      hash_to_render[:leads] = ActiveModelSerializers::SerializableResource.new(@leads, each_serializer: LeadSerializer).serializable_hash[:leads].sort_by { |k| k[:id] }.reverse
      hash_to_render = ActiveModelSerializers::SerializableResource.new(@leads, each_serializer: LeadSerializer).serializable_hash
      hash_to_render[:source_array] = Lead.pluck(:source).uniq
      hash_to_render[:lead_status_array] = Lead::ALL_LEAD_STATUSES
      hash_to_render[:lead_type_id_array] = LeadType.all.map { |lead_type| lead_type.attributes.slice("id", "name") }
      hash_to_render[:lead_source_id_array] = LeadSource.all.map { |lead_source| lead_source.attributes.slice("id", "name") }
      hash_to_render[:cs_agent_list] = User.with_role(:cs_agent).map { |agent| agent.attributes.slice("id", "name", "email") }
      hash_to_render[:lead_campaign_id_array] = LeadCampaign.active_campaign
      render json: hash_to_render
    else
      render json: {message: "Access denied"}
    end
  end

  def filtered_index
    if load_leads
      # if an array of ids given, filter for those. Else filter assuming all leads
      # as per role.
      if params[:lead_ids]
        @leads = Lead.where(id: params[:lead_ids])
      end

      # Filter leads as per provided params, except dates/times
      @filter_hash = build_filter_hash
      # puts "+++++++++#{@filter_hash}++++++++++"
      @leads = @leads.where(@filter_hash) if @filter_hash.present?

      #filter by date if params given
      if params[:column_name].present? && (params[:from_date].present? || params[:to_date].present?)
        filter_options = Hash.new
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
        from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now - 10.years
        to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
        @leads = @leads.where({params[:column_name] => from_time..to_time})
      end
      #filter done
      if params[:cs_agent].present?
        @leads = @leads.joins(:lead_users).where(lead_users: {user_id: params[:cs_agent].split(",")}).distinct
      end
      # # return those leads whose contact or email matches the entered

      if params[:cm_ids].present?
        @leads =  @leads.where(assigned_cm_id: params[:cm_ids].split(","))
      end

      if params[:digital_physical].present?
        physical_source_ids = LeadSource.where(name: Lead::PHYSICAL_SOURCES).pluck(:id)
        if params[:digital_physical] == "digital"
          digital_source_ids = LeadSource.where(name: Lead::DIGITAL_SOURCES_AWS).pluck(:id)
          @leads = @leads.where(lead_source_id: digital_source_ids)
        elsif params[:digital_physical] == "physical"
          physical_source_ids = LeadSource.where(name: Lead::PHYSICAL_SOURCES).pluck(:id)
          @leads = @leads.where(lead_source_id: physical_source_ids)
        end
      end

      if params[:internal_external].present?
        if params[:internal_external] == "internal"
          @leads = @leads.joins(project: :designers).where(users: {internal: true})
        else
          @leads = @leads.joins(project: :designers).where.not(users: {internal: true})
        end
      end

      if params[:mkw_fhi].present?
        cms = User.with_role :community_manager
        if params[:mkw_fhi] == "mkw"
          mkw_cms = cms.joins(:tags).where(tags: {name: "mkw"}).pluck(:id)
          @leads = @leads.where(assigned_cm_id: mkw_cms)
        elsif params[:mkw_fhi] == "fhi"
          fhi_cms = cms.joins(:tags).where(tags: {name: "full_home"}).pluck(:id)
          @leads = @leads.where(assigned_cm_id: fhi_cms)
        end
      end

      # # search param
      if params[:search].present?
        @leads = @leads.search_leads(params[:search].to_s.downcase)
        # @leads = @leads.where("email like ?", "%#{params[:search].to_s.downcase}%").or(@leads.where("contact like ?", "%#{params[:search].to_s.downcase}%")).or(@leads.where("name like ?", "%#{params[:search].to_s.downcase}%"))
      end



      page = params[:page].to_i
      if @leads.count < ((page - 1) * 15)
        params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
      end
      @leads = @leads.order(id: :desc)
      paginate json: @leads
    else
      render json: {message: "Access denied"}
    end
  end

  def sales_manager_filtered_index
    if sales_manager_load_leads
      # if an array of ids given, filter for those. Else filter assuming all leads
      # as per role.
      if params[:lead_ids]
        @leads = @leads.where(id: params[:lead_ids])
      end

      # Filter leads as per provided params, except dates/times
      @filter_hash = sales_manager_build_filter_hash
      # puts "+++++++++#{@filter_hash}++++++++++"
      referrers_ids = params[:referrer_id].present? ? params[:referrer_id].split(",") : nil
      @leads = @leads.where(@filter_hash) if @filter_hash.present?
      @leads = @leads.where("created_by IN (?) OR referrer_id IN (?)", referrers_ids, referrers_ids) if referrers_ids.present?

      #filter by date if params given
      if params[:column_name].present? && (params[:from_date].present? || params[:to_date].present?)
        filter_options = Hash.new
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
        from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now - 10.years
        to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
        @leads = @leads.where({params[:column_name] => from_time..to_time})
      end
      # # return those leads whose contact or email matches the entered
      # # search param
      if params[:search].present?
        @leads = @leads.search_leads(params[:search].to_s.downcase)
      end

      page = params[:page].to_i
      if @leads.count < ((page - 1) * 15)
        params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
      end

      paginate json: @leads
    else
      render json: {message: "Access denied"}
    end
  end

  def filter_details
    hash_to_render = Hash.new
    hash_to_render[:source_array] = Lead.pluck(:source).uniq
    hash_to_render[:lead_status_array] = Lead::ALL_LEAD_STATUSES
    hash_to_render[:lead_type_id_array] = LeadType.all.map { |lead_type| lead_type.attributes.slice("id", "name") }
    if current_user.has_any_role?(:sales_manager)
      hash_to_render[:lead_source_id_array] = LeadSource.where(name: ["dealer", "referral"]).map { |lead_source| lead_source.attributes.slice("id", "name") }
      hash_to_render[:referrer_ids] = current_user.referrers.map { |referrer| referrer.attributes.slice("id", "email", "name") }
    else
      hash_to_render[:lead_source_id_array] = LeadSource.all.map { |lead_source| lead_source.attributes.slice("id", "name") }
    end
    hash_to_render[:cs_agent_list] = User.with_role(:cs_agent).map { |agent| agent.attributes.slice("id", "name", "email") }
    hash_to_render[:lead_campaign_id_array] = LeadCampaign.active_campaign
    hash_to_render[:cm_list] = User.with_role(:community_manager).map{|manager| manager.attributes.slice("id", "name", "email")}
    render json: hash_to_render
  end

  def lead_head_dashboard_count
    if load_leads
      # for filtering
      @leads = filtered_leads(params[:from_date], params[:to_date], params[:lead_campaign_id],
                              params[:lead_source_id], params[:lead_type_id])
      hash_to_render = filtered_count(@leads)
      render json: hash_to_render
    else
      render json: {message: "Access denied"}
    end
  end

  def sales_manager_dashboard_count
    if sales_manager_load_leads
      @leads = filtered_leads(params[:from_date], params[:to_date], params[:lead_campaign_id],
                              params[:lead_source_id], params[:lead_type_id], params[:referrer_id])
      hash_to_render = filtered_count(@leads)
      render json: hash_to_render
    else
      render json: {message: "Access denied"}
    end
  end

  def filtered_count(leads)
    hash = Hash.new
    Lead::ALL_LEAD_STATUSES.each do |status|
      hash[status] = public_send(:leads_status, leads, status).count
    end
    customer = LeadType.where(name: "customer").first.id
    designer = LeadType.where(name: "designer").first.id
    manufacturer = LeadType.where(name: "manufacturer").first.id
    broker = LeadType.where(name: "broker").first.id
    hash[:total_leads] = leads.count
    customer_leads = leads.where(lead_type_id: customer)
    hash[:customer] = customer_leads.count
    hash[:converted_customer] = customer_leads.where(lead_status: "qualified").count

    designer_leads = leads.where(lead_type_id: designer)
    hash[:designer] = designer_leads.count
    hash[:converted_designer] = designer_leads.where(lead_status: "qualified").count

    manufacturer_leads = leads.where(lead_type_id: manufacturer)
    hash[:manufacturer] = manufacturer_leads.count
    hash[:converted_manufacturer] = manufacturer_leads.where(lead_status: "qualified").count

    broker_leads = leads.where(lead_type_id: broker)
    hash[:broker] = broker_leads.count
    hash[:converted_broker] = broker_leads.where(lead_status: "qualified").count
    hash
  end

  def leads_status(leads, status)
    leads.where(lead_status: status)
  end

  def filtered_leads(from_date, to_date, campaign, lead_source, lead_type, referrer = nil)
    from_date = from_date.present? ? DateTime.parse(from_date.to_s).beginning_of_day : Time.zone.now - 10.years
    to_date = to_date.present? ? DateTime.parse(to_date.to_s).end_of_day : Date.today.end_of_day
    leads = @leads
    if from_date.present? || to_date.present?
      leads_created_at = leads.where(created_at: from_date..to_date)
      # leads_updated_at = leads.where(updated_at: from_date.beginning_of_day..to_date.end_of_day)
      leads = leads_created_at.uniq
    end

    if campaign.present?
      leads = leads.where(lead_campaign_id: campaign.split(",").uniq)
    end

    if lead_source.present?
      leads = leads.where(lead_source_id: lead_source.split(",").uniq)
    end

    if lead_type.present?
      leads = leads.where(lead_type_id: lead_type.split(",").uniq)
    end

    if referrer.present?
      referrers_ids = referrer.split(",").uniq
      leads = leads.where("created_by IN (?) OR referrer_id IN (?)", referrers_ids, referrers_ids)
    end
    leads
  end

  # From a given array of leads, return those whose contact or email matches the entered
  # search param
  def freesearch
    unless current_user.has_any_role?(:admin, :lead_head, :community_manager)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    @leads = Lead.where(id: params[:lead_ids])

    hash_to_render = ActiveModelSerializers::SerializableResource.new(@leads, each_serializer: LeadSerializer).serializable_hash
    hash_to_render[:source_array] = Lead.pluck(:source).uniq
    hash_to_render[:lead_status_array] = Lead::ALL_LEAD_STATUSES
    hash_to_render[:lead_type_id_array] = LeadType.all.map { |lead_type| lead_type.attributes.slice("id", "name") }
    hash_to_render[:lead_source_id_array] = LeadSource.all.map { |lead_source| lead_source.attributes.slice("id", "name") }
    hash_to_render[:lead_campaign_id_array] = LeadCampaign.all.map { |lead_campaign| lead_campaign.attributes.slice("id", "name") }
    hash_to_render[:cs_agent_list] = User.with_role(:cs_agent).map { |agent| agent.attributes.slice(:id, :name, :email) }

    render json: hash_to_render
  end

  # All broker leads
  def broker_leads
    if load_leads
      @leads = LeadType.find_by(name: "broker").leads
      render json: @leads
    end
  end

  #All leads of this broker
  def broker_lead_details
    # Now all roles should have access as all roles can add leads.
    # unless current_user.has_any_role?(:broker, :referral, :client_referral, :employee_referral, :design_partner_referral, :display_dealer_referral, :non_display_dealer_referral, :others)
    #   return render json: {message: "This user is not a broker!"}, status: :unauthorized
    # end
    @leads = Lead.where("created_by = ? OR referrer_id = ?", current_user.id, current_user.id)

    # Filter leads as per provided params (currently only status)
    if params[:status].present?
      @leads = @leads.where(lead_status: params[:status].split(","))
    end

    # filter by acquisition date (ie created_at) if applicable
    if params[:from_date].present? || params[:to_date].present?
      from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now - 10.years
      to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
      @leads = @leads.where({created_at: from_time..to_time})
    end

    # return those leads which fulfil the search criteria
    if params[:search].present?
      @leads = @leads.search_leads(params[:search].to_s.downcase)
    end

    paginate json: @leads.order(created_at: :desc), each_serializer: BrokerAppSerializer
  end

  def single_broker_lead
    # Now all roles should have access as all roles can add leads.
    # unless current_user.has_any_role?(:broker, :referral, :client_referral, :employee_referral, :design_partner_referral, :display_dealer_referral, :non_display_dealer_referral, :others)
    #   return render json: {message: "This user is not a broker!"}, status: :unauthorized
    # end
    @lead = Lead.where(created_by: current_user.id).find(params[:lead_id])

    render json: @lead, serializer: BrokerAppSerializer
  end

  # List leads added by this champion and/or his descendant champions.
  # If parameter champion_id is not present, then all the leads added by this champion (ie current user),
  # his child champions and their child champions - basically, all the descendants.
  # If parameter champion_id is present, then all the leads added ONLY by that champion.
  # If the parameter champion_id does not belong to this (ie current user) champion's descendant champions, then response will be 403 unauthorized.
  def list_champion_leads
    champion_ids = current_user.self_and_descendant_ids

    if params[:champion_id].blank?
      @leads = Lead.where("created_by IN (?) OR referrer_id IN (?)", champion_ids, champion_ids).latest_created_at_first
    else
      champion_user = User.find params[:champion_id]
      if champion_user.present? && !champion_ids.include?(params[:champion_id].to_i)
        return render json: { message: "Provided champion_id does not belong to one of your champions." }, status: :unauthorized
      else
        @leads = Lead.where("created_by IN (?) OR referrer_id IN (?)", params[:champion_id], params[:champion_id]).latest_created_at_first
      end
    end

    render json: @leads, each_serializer: BrokerAppSerializer
  end

  def designer_leads
    if load_leads
      if params[:search].present?
        @leads = LeadType.joins(:leads).find_by(name: "designer").leads.where("leads.email ILIKE ? OR leads.name ILIKE ? OR leads.id=?", "%#{params[:search]}%","%#{params[:search]}%","#{params[:search]}".to_i).order(created_at: :desc)
      else
        @leads = LeadType.find_by(name: "designer").leads.order(created_at: :desc)
      end
      page = params[:page].to_i
      if @leads.count < ((page - 1) * 15)
        params[:page] = (page - 1) > 1 ? (page - 1).to_s : "1"
      end
      paginate json: @leads, each_serializer: DesignerLeadSerializer
    end
  end

  def change_user_type
    user = User.find_by_id(params[:related_user_id])
    if user.present?
      user.update(internal: params[:type])
      return render json: {message: "User Type Updated"}, status: 200
    else
      return render json: {message: "User not found"}, status: 204
    end

  end

  def duplicate_leads
    unless current_user.has_any_role?(:lead_head, :admin)
      return render json: {message: "You are not authorized to access this."}, status: :unauthorized
    end

    @leads = Lead.unscoped.where(duplicate: true)

    render json: @leads
  end

  def download_leads
    if load_leads
      if Rails.env.production?
        file_name = "Lead-Report.xlsx"
        filepath = Rails.root.join("app", "data", "ProdLeadReport",file_name)
      else
        file_name = "Lead-Report-Qa.xlsx"
        filepath = Rails.root.join("app", "data", "QaLeadReport",file_name)
      end

      # filepath = filepath.to_s
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object("production/LeadReport.xlsx")

      # file_name = "samplecheck.csv"
      # filepath = Rails.root.join("app", "data", "ProdLeadReport", file_name)
      # base_encoded_file = Base64.encode64(File.open(filepath).to_a.join)
      url = obj.presigned_url("get", expires_in: 3.minutes)
      render json: {lead_report: url}, status: 200
    else
      render json: {message: "Access denied"}
    end
  end

  # GET /v1/leads/sales_manager_download_leads
  def sales_manager_download_leads
    if sales_manager_load_leads
      # if an array of ids given, filter for those. Else filter assuming all leads
      # as per role.
      if params[:lead_ids]
        @leads = @leads.where(id: params[:lead_ids])
      end

      # Filter leads as per provided params, except dates/times
      @filter_hash = sales_manager_build_filter_hash
      # puts "+++++++++#{@filter_hash}++++++++++"
      referrers_ids = params[:referrer_id].present? ? params[:referrer_id].split(",") : nil
      if referrers_ids.present?
        @leads = @leads.where(@filter_hash).where("created_by IN (?) OR referrer_id IN (?)", referrers_ids, referrers_ids) if @filter_hash.present?
      else
        @leads = @leads.where(@filter_hash) if @filter_hash.present?
      end

      #filter by date if params given
      if params[:column_name].present? && (params[:from_date].present? || params[:to_date].present?)
        filter_options = Hash.new
        filter_options["column_name"] = params[:column_name]
        filter_options["from_date"] = params[:from_date]
        filter_options["to_date"] = params[:to_date]
        from_time = params[:from_date].present? ? Date.parse(params[:from_date].to_s).beginning_of_day : Time.zone.now - 10.years
        to_time = params[:to_date].present? ? Date.parse(params[:to_date].to_s).end_of_day : Date.today.end_of_day
        @leads = @leads.where({params[:column_name] => from_time..to_time})
      end

      # # return those leads whose contact or email matches the entered
      # # search param
      if params[:search].present?
        @leads = @leads.where("email like ?", "%#{params[:search]}%").or(@leads.where("contact like ?", "%#{params[:search]}%")).or(@leads.where("name like ?", "%#{params[:search]}%"))
      end

      LeadDownloadsJob.perform_later(@leads.pluck(:id).uniq, current_user)
      # send_data @leads.to_xlsx
      # send_file @leads.to_xlsx, :type=>"application/xlsx", :disposition => 'attachment'
      # send_data @leads.to_csv, filename: "Arrivae leads-#{Date.today}.csv", status: :ok
    else
      render json: {message: "Access denied"}
    end
  end

  # GET /api/v1/leads/1
  def show
    render json: @lead
  end

  def get_lead_info
    render json: @lead, serializer: LeadSerializerForCM
  end

  # Show log of changes to this lead
  def show_logs
    unless current_user.has_any_role?(:admin, :lead_head, :community_manager, :designer, :city_gm, :design_manager, :business_head)
      return render json: {message: "Unauthorized!"}, status: :unauthorized
    end

    render json: @lead, serializer: LeadLogSerializer
  end

  def create_lead
    @lead = Lead.new(lead_params)

    lead_type_name = params[:lead_type].present? ? params[:lead_type] : params[:lead][:lead_type_name].present? ? params[:lead][:lead_type_name] : "customer"
    lead_type = LeadType.find_by(name: lead_type_name)
    @lead.lead_type = lead_type if @lead.lead_type.blank?

    if params[:lead_source].present?
      lead_source = LeadSource.find_or_create_by(name: params[:lead_source])
      @lead.lead_source = lead_source
    end

    if params[:lead_campaign].present?
      lead_campaign = LeadCampaign.find_or_create_by(name: params[:lead_campaign])
      @lead.lead_campaign = lead_campaign
    else
      lead_source = LeadSource.find_by(name: "website")
      @lead.lead_source = lead_source
    end

    if  params[:lead_utm_content].present?
      lead_utm_content = LeadUtmContent.find_or_create_by(name: params[:lead_utm_content])
    else
      lead_utm_content = LeadUtmContent.find_or_create_by(name: "No Content")
    end

    if  params[:lead_utm_medium].present?
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: params[:lead_utm_medium])
    else
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: "No Medium")
    end

    if  params[:lead_utm_term].present?
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: params[:lead_utm_term])
    else
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: "No Term")
    end

    @lead.lead_utm_content = lead_utm_content if @lead.lead_utm_content.blank?
    @lead.lead_utm_medium = lead_utm_medium if @lead.lead_utm_medium.blank?
    @lead.lead_utm_term = lead_utm_term if @lead.lead_utm_term.blank?

    if @lead.save
      scope_of_work_params = ""
      if params[:scope_of_work].present?
        if params[:scope_of_work] == "Full Home Interiors"
          scope_of_work_params = "Full Home Interiors (Design)"
        elsif params[:scope_of_work] == "Modular Kitchen & Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Kitchen"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Interiors Without Services"
          scope_of_work_params = "Interiors Without Services"
        end
      end
      if @lead.note_records.blank?
        note_records = @lead.note_records.create(customer_name: @lead.name, phone: @lead.contact, city: @lead.city, scope_of_work: "", budget_value: params[:customer_budget])
        note_records.scope_of_work.push scope_of_work_params
        note_records.save!
      else
        @lead.note_records.first.scope_of_work.push scope_of_work_params
        @lead.note_records.first.save
      end

      render json: @lead, status: :created
    else
      render json: {message: @lead.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def create
    @lead = Lead.new(lead_params)
    lead_type_name = params[:lead_type].present? ? params[:lead_type] : params[:lead][:lead_type_name].present? ? params[:lead][:lead_type_name] : "customer"
    lead_type = LeadType.find_by(name: lead_type_name)

    if params[:lead][:lead_source].present?
      lead_source = LeadSource.find_or_create_by(name: params[:lead][:lead_source])
    else
      lead_source = LeadSource.find_by(name: "website")
    end

    if  params[:lead][:lead_campaign].present?
      lead_campaign = LeadCampaign.find_or_create_by(name: params[:lead][:lead_campaign])
    else
      lead_campaign = LeadCampaign.find_or_create_by(name: "No Campaign")
    end

    if  params[:lead][:lead_utm_content].present?
      lead_utm_content = LeadUtmContent.find_or_create_by(name: params[:lead][:lead_utm_content])
    else
      lead_utm_content = LeadUtmContent.find_or_create_by(name: "No Content")
    end

    if  params[:lead][:lead_utm_medium].present?
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: params[:lead][:lead_utm_medium])
    else
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: "No Medium")
    end

    if  params[:lead][:lead_utm_term].present?
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: params[:lead][:lead_utm_term])
    else
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: "No Term")
    end

    @lead.lead_type = lead_type if @lead.lead_type.blank?
    @lead.lead_source = lead_source if @lead.lead_source.blank?
    @lead.lead_campaign = lead_campaign if @lead.lead_campaign.blank?
    @lead.lead_utm_content = lead_utm_content if @lead.lead_utm_content.blank?
    @lead.lead_utm_medium = lead_utm_medium if @lead.lead_utm_medium.blank?
    @lead.lead_utm_term = lead_utm_term if @lead.lead_utm_term.blank?
    if @lead.save
      @lead.lead_cv = params[:lead][:lead_cv].present? ? params[:lead][:lead_cv] : params[:lead_cv].present? ? params[:lead_cv] : ""
      @lead.save!
      if params[:lead][:by_csagent].present?
        options = {}
        options[:lead_status] = params[:lead_status].present? ? params[:lead_status] : "claimed"
        @lead.assign_to_csagent(current_user, options)   #forcefully assign
        # 24-10-2019: Removed lead qualification when lead is added by cs_agent.
      end
      if params[:lead][:by_designer].present?
        u = User.where(email: params[:lead][:email]).first
        unless u.present?
          @lead.lead_status = "qualified"
          @lead.save!
          @lead.approve
          project = @lead.project
          @lead.designer_projects.create(designer_id: current_user.id, customer_status: "qualified", project_id: @lead.project_id, active: true)
        else
          return render json: {message: "User already present with role #{u.roles&.first&.name}"}, status: :unauthorized
        end
      end
      # For CM created leads, qualify them but don't assign to any designer.
      # Set the flag properly so that this lead will NOT be auto assigned to another CM upon change in 
      # questionnaire data.
      if params[:lead][:by_community_manager].present?
        u = User.where(email: params[:lead][:email]).first
        unless u.present?
          @lead.lead_status = "qualified"
          @lead.save!
          @lead.approve
          project = @lead.project
        else
          return render json: {message: "User already present with role #{u.roles&.first&.name}"}, status: :unauthorized
        end
      end
      render json: @lead, status: :created
    else
      render json: {message: @lead.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def sales_manager_create_lead #This method was not present in release : This is to add leads from sales manager
    @lead = Lead.new(lead_params)
    lead_type_name = params[:lead_type].present? ? params[:lead_type] : params[:lead][:lead_type_name].present? ? params[:lead][:lead_type_name] : "customer"
    lead_type = LeadType.find_by(name: lead_type_name)
    lead_source = LeadSource.find_by(name: "website")
    lead_campaign = LeadCampaign.find_by(name: "Referral Partner Campaign")
    @lead.lead_type = lead_type if @lead.lead_type.blank?
    @lead.lead_source = lead_source if @lead.lead_source.blank?
    @lead.lead_campaign = lead_campaign if @lead.lead_campaign.blank?
    if @lead.save
      @lead.lead_cv = params[:lead][:lead_cv].present? ? params[:lead][:lead_cv] : params[:lead_cv].present? ? params[:lead_cv] : ""
      @lead.save!
      if params[:lead][:by_csagent].present?
        options = {}
        options[:lead_status] = params[:lead_status].present? ? params[:lead_status] : "claimed"
        @lead.assign_to_csagent(current_user, options)   #forcefully assign
        u = User.where(email: params[:lead][:email]).first if lead_type_name != "customer"
        puts "=-=-=-=-=--=-=-=-1"
        unless u.present?
          puts "=-=-=-=-=--=-=-=-2"
          @lead.lead_status = "qualified"
          @lead.save!
          @lead.approve
        end
      end
      if params[:lead][:by_designer].present?
        puts "=-=-=-=-=--=-=-=-"
        u = User.where(email: params[:lead][:email]).first
        unless u.present?
          @lead.lead_status = "qualified"
          @lead.save!
          @lead.approve
          puts "=========="
          puts @lead.as_json
          puts "=========="
          project = @lead.project
          @lead.designer_projects.create(designer_id: current_user.id, customer_status: "qualified", project_id: @lead.project_id, active: true)
        else
          return render json: {message: "User already present with role #{u.roles&.first&.name}"}, status: :unauthorized
        end
      end
      render json: @lead, status: :created
    else
      render json: {message: @lead.errors.full_messages}, status: :unprocessable_entity
    end
  end


  def designer_lead_add
    unless current_user.has_any_role?(:designer, :community_manager)
      raise CanCan::AccessDenied
    end
    u = User.where(email: params[:lead][:email]).first
    l = Lead.where(contact: params[:lead][:contact]).first
    if l.present?
      return render json: {message: "Lead with Phone Number already presernt"}, status: 401
    end
    unless u.present?
      @lead = Lead.new(lead_params)
      lead_type = LeadType.find_by(id: params[:lead][:lead_type_id])
      lead_source = LeadSource.find_by(id: params[:lead][:lead_source_id])
      lead_campaign = LeadCampaign.find_by(name: "Walk-In")
      @lead.lead_type = lead_type if @lead.lead_type.blank?
      @lead.lead_source = lead_source if @lead.lead_source.blank?
      @lead.lead_campaign = lead_campaign if @lead.lead_campaign.blank?
      @lead.lead_status = "qualified"
      @lead.save!
      @lead.approve
      project = @lead.project
      if current_user.has_role?(:designer)
        @lead.assigned_cm_id = current_user.cm.id
        @lead.designer_projects.create(designer_id: current_user.id, customer_status: "qualified", project_id: @lead.project_id, active: true)
        # Event
        @event = Event.create!(agenda: "lead_assigned", contact_type: "phone_call", scheduled_at: DateTime.now, ownerable: project)
        @event.add_participants([current_user.email], current_user.id)
      else
        @lead.assigned_cm = current_user
      end
      @lead.disable_cm_auto_assign = true  #manually created lead, don't take it away from CM.
      @lead.save!
      render json: @lead, status: :created
    else
      render json: {message: "User already present with role #{u.roles&.first&.name}"}, status: :unauthorized
    end
  end

  # Create a lead when someone enters their contact number in the footer of our site.
  # it should automatically be assigned the type customer, source website and campaign
  # request_a_callback.
  def create_contact_lead
    lead_type = LeadType.find_by(name: "customer")
    lead_source = LeadSource.find_by(name: "website")
    lead_campaign = LeadCampaign.find_by(name: "request_a_callback")
    @lead = Lead.new(contact: params[:lead][:phone_number], lead_type: lead_type, lead_source: lead_source,
                     lead_campaign: lead_campaign)
    @lead.invited = true  #this will prevent email sending
    if @lead.save!
      render json: @lead, status: :created
    else
      render json: {message: @lead.errors}, status: :unprocessable_entity
    end
  end

  def create_voucher_lead
    @voucher = Voucher.find_by(code: params[:voucher_code])
    if !@voucher.is_used
      lead_type = LeadType.find_by(name: "customer")
      lead_source = LeadSource.find_by(name: "hfc")
      lead_campaign = LeadCampaign.find_by(name: "Bajaj Finserv Voucher Campaign")
      @lead = Lead.new(contact: params[:lead][:contact], lead_type: lead_type, lead_source: lead_source,
                       lead_campaign: lead_campaign, email: params[:lead][:email], city: params[:lead][:city], name: params[:lead][:name])
      @lead.invited = true  #this will prevent email sending

      if @lead.save!
        @voucher.update(lead_id: @lead.id, is_used: true)
        render json: @lead, status: :created
      else
        render json: {message: @lead.errors}, status: :unprocessable_entity
      end
    else
      render json: {message: "Invalid Voucher Code!"}, status: :unprocessable_entity
    end
  end

  # lead created by broker and referral roles
  def create_broker_lead
    if params[:lead][:email].present? && Lead.where(email: params[:lead][:email]).present?
      return render json: {message: "A lead with email #{params[:lead][:email]} already exists.Please put a different email ID or leave the field blank"}, status: :unprocessable_entity
    end

    lead_type = LeadType.find_by(name: "customer")
    lead_source = nil
    lead_campaign = nil

    if current_user.is_champion
      lead_source = LeadSource.referral
      lead_campaign = LeadCampaign.arrivae_champion_campaign
    elsif current_user.has_role?(:broker)
      lead_source = LeadSource.find_by(name: "broker")
    elsif current_user.has_any_role?(:referral, :client_referral, :employee_referral, :design_partner_referral, :display_dealer_referral, :non_display_dealer_referral, :arrivae_champion, :others)
      lead_source = LeadSource.referral
      lead_campaign = LeadCampaign.referral_partner_campaign
    else
      # Changed because all roles can now add leads.
      lead_source = LeadSource.referral
      lead_campaign = LeadCampaign.referral_partner_campaign
      # return render json: {message: "Unauthorized - only broker or referral partner roles are allowed to do this."}, status: :unauthorized
    end

    @lead = Lead.new(
      contact: params[:lead][:contact],
      name: params[:lead][:name],
      email: params[:lead][:email],
      pincode: params[:lead][:pincode],
      lead_type: lead_type,
      lead_source: lead_source,
      lead_campaign: lead_campaign,
      created_by: current_user.id,
      referrer_type: params[:lead][:referrer_type],
      referrer_id: params[:lead][:referrer_id]
    )
    @lead.invited = true  #this will prevent email sending
    @lead.source = "app" if params[:lead][:source]

    if @lead.save!
      render json: @lead, status: :created
    else
      render json: {message: @lead.errors}, status: :unprocessable_entity
    end
  end

  def edit_broker_lead
    @lead = Lead.where(created_by: current_user).find params[:id]
    @lead.assign_attributes(broker_update_lead_params)

    if @lead.save
      render json: @lead, status: :created
    else
      render json: {message: @lead.errors}, status: :unprocessable_entity
    end
  end

  def create_voucher_lead
    @voucher = Voucher.find_by(code: params[:voucher_code])
    if !@voucher.is_used
      lead_type = LeadType.find_by(name: "customer")
      lead_source = LeadSource.find_by(name: "hfc")
      lead_campaign = LeadCampaign.find_by(name: "Bajaj Finserv Voucher Campaign")
      @lead = Lead.new(contact: params[:lead][:contact], lead_type: lead_type, lead_source: lead_source,
                       lead_campaign: lead_campaign, email: params[:lead][:email], city: params[:lead][:city], name: params[:lead][:name])
      @lead.invited = true  #this will prevent email sending

      if @lead.save!
        @voucher.update(lead_id: @lead.id, is_used: true)
        render json: @lead, status: :created
      else
        render json: {message: @lead.errors}, status: :unprocessable_entity
      end
    else
      render json: {message: "Invalid Voucher Code!"}, status: :unprocessable_entity
    end
  end

  def update
    ActiveRecord::Base.transaction do
      begin
        if @lead.update(lead_params)
          if params[:lead][:lead_cv].present?
            @lead.lead_cv = params[:lead][:lead_cv]
            @lead.save!
          end
          if @lead.lead_status == "qualified"
            # @lead.send_mail_to_cm_for_qualified_leads
            @lead.approve
            lead_events = @lead.events.where(status: ["scheduled", "rescheduled"])
            if lead_events.present?
              lead_events.each do |event|
                event.update(status: "done")
              end
            end
          end

          if @lead.lead_status == "follow_up"
            if current_user.has_role?(:lead_head)
              unless params[:lead][:follow_up_time].present?
                return render json: {message: "please select follow up time "}, status: 422
              end
              create_event_for_follow_up(params[:lead][:follow_up_time], @lead.lead_status, @lead.user_type, @lead.id, [current_user.email])
            elsif current_user.has_role?(:cs_agent)
              emails = (User.with_role :lead_head).map(&:email)
              emails.push(current_user.email)
              create_event_for_follow_up(params[:lead][:follow_up_time], @lead.lead_status, @lead.user_type, @lead.id, emails)
            end
          end

          if @lead.lead_status == "not_contactable"
            if current_user.has_role?(:lead_head)
              create_event_for_follow_up(DateTime.now + 24.hours, @lead.lead_status, @lead.user_type, @lead.id, [current_user.email])
            elsif current_user.has_role?(:cs_agent)
              emails = (User.with_role :lead_head).map(&:email)
              emails.push(current_user.email)
              create_event_for_follow_up(DateTime.now + 24.hours, @lead.lead_status, @lead.user_type, @lead.id, emails)
            end
            # @whatsapp_msg = @lead.whatsapps.create!(to: @lead.contact, message: Whatsapp::NOT_CONTACTABLE_MESSAGE)
            # response = @whatsapp_msg.send_message(@lead.contact, Whatsapp::NOT_CONTACTABLE_MESSAGE)
            # @whatsapp_msg.update!(response: response.body)
            SmsModule.send_sms(Whatsapp::NOT_CONTACTABLE_MESSAGE, @lead.contact)

            # @whatsapp_msg = @lead.whatsapps.create!(to: @lead.contact, message: Whatsapp::SCHEDULE_VISIT)
            # response = @whatsapp_msg.send_message(@lead.contact, Whatsapp::SCHEDULE_VISIT)
            # @whatsapp_msg.update!(response: response.body)
            SmsModule.send_sms(Whatsapp::SCHEDULE_VISIT, @lead.contact)
          end

          if @lead.lead_status == "delayed_possession" || @lead.lead_status == "delayed_project"
            intended_time = @lead.intended_time(@lead.lead_status)
            if intended_time.present?
              @lead.schedule_delay(intended_time)
            else
              UserNotifierMailer.lead_no_delay_time(@lead).deliver!
            end
          end

          return render json: @lead, status: 200
        else
          return render json: {message: @lead.errors}, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /api/v1/leads/1
  def destroy
    if @lead.destroy
      render json: {message: "Lead successfully destroyed."}
    else
      render json: {message: "This lead cannot be deleted. Perhaps it was qualified?"}, status: :unprocessable_entity
    end
  end

  def escalated_leads
    # puts "======"
    # puts "Escalated Lead"
    # puts "======"
    if load_leads
      @leads = @leads.where(:lead_status => ["not_attempted", "not_claimed", "claimed", "follow_up", "not_contactable"], lead_escalated: true)
      hash_to_render = ActiveModelSerializers::SerializableResource.new(@leads, each_serializer: LeadSerializer).serializable_hash
      hash_to_render[:cs_agent_list] = User.with_role(:cs_agent).map { |agent| agent.attributes.slice("id", "name", "email") }

      render json: hash_to_render
    else
      render json: {message: "Access denied"}
    end
  end

  # Mark a lead as escalated
  def mark_escalated
    # puts "======"
    # puts "Mark Escalation"
    # puts "======"
    unless current_user.has_any_role?(:admin, :lead_head) || (@lead.assigned_cs_agent == current_user)
      render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    # If lead is already qualified, then don't do anything
    @lead.update!(lead_escalated: true, reason_for_escalation: params[:reason_for_escalation]) unless @lead.lead_status == 'qualified'
  end

  # Mark a lead as de-escalated. Only admin or lead_head can do this.
  def unmark_escalated
    unless current_user.has_any_role?(:admin, :lead_head)
      render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    @lead.update!(lead_escalated: false, reason_for_escalation: nil)
  end

  def update_lead_status_from_landing_page
    @lead = Lead.find params[:id]
    @lead.email = params[:email]
    @lead.pincode = params[:pincode] if params[:pincode]

    if params[:lead_source].present?
      lead_source = LeadSource.find_or_create_by(name: params[:lead_source])
      @lead.lead_source = lead_source
    end

    if params[:lead_campaign].present?
      lead_campaign = LeadCampaign.find_or_create_by(name: params[:lead_campaign])
      @lead.lead_campaign = lead_campaign
    end

    if  params[:lead_utm_content].present?
      lead_utm_content = LeadUtmContent.find_or_create_by(name: params[:lead_utm_content])
    else
      lead_utm_content = LeadUtmContent.find_or_create_by(name: "No Content")
    end

    if  params[:lead_utm_medium].present?
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: params[:lead_utm_medium])
    else
      lead_utm_medium = LeadUtmMedium.find_or_create_by(name: "No Medium")
    end

    if  params[:lead_utm_term].present?
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: params[:lead_utm_term])
    else
      lead_utm_term = LeadUtmTerm.find_or_create_by(name: "No Term")
    end

    @lead.lead_utm_content = lead_utm_content if @lead.lead_utm_content.blank?
    @lead.lead_utm_medium = lead_utm_medium if @lead.lead_utm_medium.blank?
    @lead.lead_utm_term = lead_utm_term if @lead.lead_utm_term.blank?

    if @lead.save!
      possession_status_note_record = ""
      possession_status_date_note_record = ""
      home_type = ""
      if params[:possession_status] == "new"
        possession_status_note_record = "Awaiting Possession"
        home_type = "New (No one has ever stayed in that home)"
        possession_status_date_note_record = params[:possession_status_date] if params[:possession_status_date].present?
      elsif params[:possession_status] == "currently_staying"
        possession_status_note_record = "Possession Taken"
        home_type = "Old (Currently staying in the house)"
      end

      scope_of_work_params = ""
      if params[:scope_of_work].present?
        if params[:scope_of_work] == "Full Home Interiors"
          scope_of_work_params = "Full Home Interiors"
        elsif params[:scope_of_work] == "Modular Kitchen & Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Kitchen"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Interiors Without Services"
          scope_of_work_params = "Interiors Without Services"
        end
      end
      if @lead.note_records.blank?
        if params[:project_start_date].present?
          project_start_date = params[:project_start_date].to_date
        else
          project_start_date = nil
        end
        note_records = @lead.note_records.create(customer_name: @lead.name, 
                                      phone: @lead.contact, 
                                      project_name: "", 
                                      city: params[:city], 
                                      location: params[:location], 
                                      scope_of_work: params[:scope_of_work], 
                                      possession_status: possession_status_note_record, 
                                      possession_status_date: possession_status_date_note_record, 
                                      budget_value: params[:customer_budget], 
                                      intended_date: project_start_date, 
                                      home_type: home_type, 
                                      project_type: params[:project_type], 
                                      accomodation_type: params[:accomodation_type], 
                                      additional_comments: params[:additional_comments],
                                      site_measurement_required: params[:site_measurement_required],
                                      site_measurement_date: params[:site_measurement_required],
                                      visit_ec: params[:visit_ec],
                                      visit_ec_date: params[:visit_ec_date]
                                      )
        note_records.scope_of_work.push scope_of_work_params if scope_of_work_params != ""
        note_records.save!
      else
        @lead.note_records.first.scope_of_work.push scope_of_work_params if scope_of_work_params != ""
        @lead.note_records.first.possession_status = params[:possession_status]
        @lead.note_records.first.possession_status_date = params[:possession_status_date]
        @lead.note_records.first.intended_date = params[:project_start_date].to_date
        @lead.note_records.first.save
      end
      project = @lead.project
      unless project.blank?
        project_detail = project.project_detail
        if params[:possession_status].present?
          if params[:possession_status] == "currently_staying"
            project_detail.possession_status = "Possession Taken"
          elsif params[:possession_status] == "new"
            project_detail.possession_status = "Awaiting Possession"
            project_detail.possession_date = possession_status_date_note_record
          end
        end
        project_detail.scope_of_work.push scope_of_work_params
        project_detail.save!
      end
      @lead.lead_queue.delete if @lead.lead_queue.present?
    end
    lead_events = @lead.events.where(status: ["scheduled", "rescheduled"])
    if lead_events.present?
      lead_events.each do |event|
        event.update(status: "done")
      end
    end

    render json: {status: 200, message: "Thank you for details."}.to_json
  end

  def update_lead_status
    @lead = Lead.find params[:id]
    status = params[:lead_status].present? ? params[:lead_status] : params[:lead][:lead_status]
    @lead.email = params[:email]
    @lead.lead_status = status
    @lead.status_updated_at = Time.zone.now
    @lead.pincode = params[:pincode] if params[:pincode]

    if @lead.save!
      possession_status_note_record = ""
      possession_status_date_note_record = ""
      home_type = ""
      if params[:possession_status] == "new"
        possession_status_note_record = "Awaiting Possession"
        home_type = "New (No one has ever stayed in that home)"
        possession_status_date_note_record = params[:possession_status_date] if params[:possession_status_date].present?
      else
        possession_status_note_record = "Possession Taken"
        home_type = "Old (Currently staying in the house)"
      end

      scope_of_work_params = ""
      if params[:scope_of_work].present?
        if params[:scope_of_work] == "Full Home Interiors"
          scope_of_work_params = "Full Home Interiors"
        elsif params[:scope_of_work] == "Modular Kitchen & Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Kitchen"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Interiors Without Services"
          scope_of_work_params = "Interiors Without Services"
        end
      end
      if @lead.note_records.blank?
        note_records = @lead.note_records.create(customer_name: @lead.name, 
                              phone: @lead.contact, 
                              project_name: "", 
                              city: params[:city], 
                              location: params[:location], 
                              scope_of_work: params[:scope_of_work], 
                              possession_status: possession_status_note_record, 
                              possession_status_date: possession_status_date_note_record, 
                              budget_value: params[:customer_budget], 
                              intended_date: params[:project_start_date].to_date, 
                              home_type: home_type, 
                              project_type: params[:project_type], 
                              accomodation_type: params[:accomodation_type], 
                              additional_comments: params[:additional_comments], 
                              society: params[:property_name], 
                              home_value: params[:home_value], 
                              have_homeloan: params[:have_home_loan], 
                              financial_solution_required: params[:financial_solution_required], 
                              have_floorplan: params[:have_floorplan], 
                              lead_floorplan: params[:lead_floorplan]&.first,
                              site_measurement_required: params[:site_measurement_required],
                              site_measurement_date: params[:site_measurement_required],
                              visit_ec: params[:visit_ec],
                              visit_ec_date: params[:visit_ec_date]
                              )

        note_records.scope_of_work.push scope_of_work_params
        note_records.save!
      else
        @lead.note_records.first.scope_of_work.push scope_of_work_params
        @lead.note_records.first.save
      end
      @lead.approve
      project = @lead.project
      unless project.blank?
        project_detail = project.project_detail
        if params[:possession_status].present?
          if params[:possession_status] == "currently_staying"
            project_detail.possession_status = "Possession Taken"
          elsif params[:possession_status] == "new"
            project_detail.possession_status = "Awaiting Possession"
            project_detail.possession_date = possession_status_date_note_record
          end
        end
        project_detail.scope_of_work.push scope_of_work_params
        project_detail.save!
      end
      @lead.lead_queue.delete if @lead.lead_queue.present?
    end
    lead_events = @lead.events.where(status: ["scheduled", "rescheduled"])
    if lead_events.present?
      lead_events.each do |event|
        event.update(status: "done")
      end
    end

    render json: {status: 200, message: "Thank you for details."}.to_json
  end

  def update_lead_status2
    @lead = Lead.find params[:id]
    status = params[:lead_status].present? ? params[:lead_status] : params[:lead][:lead_status]
    @lead.email = params[:email]
    @lead.lead_status = status
    @lead.status_updated_at = Time.zone.now
    @lead.pincode = params[:pincode] if params[:pincode]
    @lead.from_fasttrack_page = params[:from_fasttrack_page] if params[:from_fasttrack_page]

    if @lead.save!
      possession_status_note_record = ""
      possession_status_date_note_record = ""
      home_type = ""
      if params[:possession_status] == "new"
        possession_status_note_record = "Awaiting Possession"
        home_type = "New (No one has ever stayed in that home)"
        possession_status_date_note_record = params[:possession_status_date] if params[:possession_status_date].present?
      else
        possession_status_note_record = "Possession Taken"
        home_type = "Old (Currently staying in the house)"
      end

      scope_of_work_params = ""
      if params[:scope_of_work].present?
        if params[:scope_of_work] == "Full Home Interiors"
          scope_of_work_params = "Full Home Interiors"
        elsif params[:scope_of_work] == "Modular Kitchen & Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Kitchen"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Modular Wardrobe"
          scope_of_work_params = "Modular Kitchen"
        elsif params[:scope_of_work] == "Interiors Without Services"
          scope_of_work_params = "Interiors Without Services"
        end
      end
      if @lead.note_records.blank?
        note_records = @lead.note_records.create(customer_name: @lead.name, 
                          phone: @lead.contact, 
                          project_name: "", 
                          city: params[:city], 
                          location: params[:location], 
                          scope_of_work: params[:scope_of_work], 
                          possession_status: possession_status_note_record, 
                          possession_status_date: possession_status_date_note_record, 
                          budget_value: params[:customer_budget], 
                          intended_date: params[:project_start_date].to_date, 
                          home_type: home_type, 
                          project_type: params[:project_type], 
                          accomodation_type: params[:accomodation_type], 
                          additional_comments: params[:additional_comments], 
                          society: params[:property_name], 
                          home_value: params[:home_value], 
                          have_homeloan: params[:have_home_loan], 
                          financial_solution_required: params[:financial_solution_required], 
                          have_floorplan: params[:have_floorplan], 
                          lead_floorplan: params[:lead_floorplan]&.first,
                          site_measurement_required: params[:site_measurement_required],
                          site_measurement_date: params[:site_measurement_required],
                          visit_ec: params[:visit_ec],
                          visit_ec_date: params[:visit_ec_date]
                          )

        note_records.scope_of_work.push scope_of_work_params
        note_records.save!
      else
        @lead.note_records.first.scope_of_work.push scope_of_work_params
        @lead.note_records.first.save
      end
      project = @lead.project
      unless project.blank?
        project_detail = project.project_detail
        if params[:possession_status].present?
          if params[:possession_status] == "currently_staying"
            project_detail.possession_status = "Possession Taken"
          elsif params[:possession_status] == "new"
            project_detail.possession_status = "Awaiting Possession"
            project_detail.possession_date = possession_status_date_note_record
          end
        end
        project_detail.scope_of_work.push scope_of_work_params
        project_detail.save!
      end
      @lead.lead_queue.delete if @lead.lead_queue.present?
    end
    lead_events = @lead.events.where(status: ["scheduled", "rescheduled"])
    if lead_events.present?
      lead_events.each do |event|
        event.update(status: "done")
      end
    end

    render json: {status: 200, message: "Thank you for details."}.to_json
  end

  def update_status
    status = params[:lead_status].present? ? params[:lead_status] : params[:lead][:lead_status]
    @lead.instagram_handle = params[:instagram_handle] if params[:instagram_handle].present?
    @lead.lead_cv = params[:lead_cv] if params[:lead_cv].present?

    # CS agent is not allowed to update the status if the lead is already qualified - added this
    # mainly for marketing page leads.
    if @lead.lead_status == 'qualified' && !(current_user.has_any_role?(:admin,:lead_head,:community_manager, :city_gm, :design_manager, :business_head) && status=='dropped') &&
      !(current_user.has_any_role?(:admin,:lead_head,:cs_agent) && @lead.created_by==current_user.id && @lead.created_at>30.minutes)
      return render json: {message: "Your form was rejected because this lead was qualified by someone before you submitted the form."}, status: :unprocessable_entity
    end

    if status == "qualified"
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      update_email_and_contact
      if @lead.save!
        # @lead.send_mail_to_cm_for_qualified_leads
        @lead.approve
        @lead.lead_queue.delete if @lead.lead_queue.present?
      end
      lead_events = @lead.events.where(status: ["scheduled", "rescheduled"])
      if lead_events.present?
        lead_events.each do |event|
          event.update(status: "done")
        end
      end

      render json: {status: 200, message: "Successfully updated."}.to_json
    elsif status == "follow_up"
      @lead.follow_up_time = params[:follow_up_time]
      @lead.remark = params[:lead][:remark]
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      @lead.lead_users.update(active: false)
      update_email_and_contact
      @lead.save!
      if current_user.has_role?(:lead_head)
        create_event_for_follow_up(params[:follow_up_time], status, @lead.user_type, @lead.id, [current_user.email])
      elsif current_user.has_role?(:cs_agent)
        emails = (User.with_role :lead_head).map(&:email)
        emails.push(current_user.email)
        create_event_for_follow_up(params[:follow_up_time], status, @lead.user_type, @lead.id, emails)
      end
      render json: {
               status: 200,
               message: "Successfully updated.",
             }.to_json
    elsif status == "lost"
      # @lead.update(:lost_remark => params[:lost_remark])
      @lead.lost_remark = params[:lost_remark]
      @lead.lost_reason = params[:lead][:lost_reason]
      @lead.drop_reason = params[:drop_reason]
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      update_email_and_contact
      # if @lead.events.present?
      #   @lead.events.each do |old_event|
      #     old_event.update(status: "done")
      #   end
      # end
      @events = @lead.project&.events&.where(status: ["scheduled", "rescheduled"])
      @lead_events = @lead.events&.where(status: ["scheduled", "rescheduled"])
      if @events.present?
        @events.each do |old_event|
          old_event.update(status: "done")
        end
      end

      if @lead_events.present?
        @lead_events.each do |old_event|
          old_event.update(status: "done")
        end
      end

      @lead.save!
      @lead.lead_users.update(active: false)
      render json: {
               status: 200,
               message: "Successfully updated.",
             }.to_json
    elsif status == "not_contactable"
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      update_email_and_contact
      @lead.not_contactable_counter = @lead.not_contactable_counter.to_i + 1
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      @lead.save!
      @lead.lead_users.update(active: false)
      # @whatsapp_msg = @lead.whatsapps.create!(to: @lead.contact, message: Whatsapp::NOT_CONTACTABLE_MESSAGE)
      # response = @whatsapp_msg.send_message(@lead.contact, Whatsapp::NOT_CONTACTABLE_MESSAGE)
      # @whatsapp_msg.update!(response: response.body)
      SmsModule.send_sms(Whatsapp::NOT_CONTACTABLE_MESSAGE, @lead.contact)

      # @whatsapp_msg = @lead.whatsapps.create!(to: @lead.contact, message: Whatsapp::SCHEDULE_VISIT)
      # response = @whatsapp_msg.send_message(@lead.contact, Whatsapp::SCHEDULE_VISIT)
      # @whatsapp_msg.update!(response: response.body)
      SmsModule.send_sms(Whatsapp::SCHEDULE_VISIT, @lead.contact)

      create_event_for_follow_up(Time.zone.now + 24.hours, status, @lead.user_type, @lead.id, [current_user.email])
      render json: {message: "Successfully updated."}, status: :ok
    elsif status == "dropped"
      unless current_user&.has_any_role?("admin", "community_manager", "city_gm", "design_manager", "business_head")
        render json: {message: "You are not permitted to do this."}, status: :unauthorized
        return
      end
      @lead.lost_remark = params[:lost_remark]
      @lead.lost_reason = params[:lost_reason]
      @lead.drop_reason = params[:drop_reason]
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      # @lead.events.update_all(status: "done") if @lead.events.present?
      # @lead.project.events.update_all(status: "done") if @lead.project.present? && @lead.project.events.present?

      @events = @lead.project&.events&.where(status: ["scheduled", "rescheduled"])
      @lead_events = @lead.events&.where(status: ["scheduled", "rescheduled"])
      if @events.present?
        @events.each do |old_event|
          old_event.update(status: "done")
        end
      end

      if @lead_events.present?
        @lead_events.each do |old_event|
          old_event.update(status: "done")
        end
      end

      update_email_and_contact
      @lead.save!
      render json: {message: "Lead successfully dropped."}, status: :ok
    elsif status == "delayed_possession" || status == "delayed_project"
      @lead.lead_status = status
      @lead.status_updated_at = Time.zone.now
      @lead.lead_escalated = false
      @lead.reason_for_escalation = nil
      @events =  @lead.project&.events&.where(status: ["scheduled", "rescheduled"])
      @lead_events = @lead.events&.where(status: ["scheduled", "rescheduled"])
      if @events.present?
        @events.each do |old_event|
          old_event.update(status: "done")
        end
      end
      if @lead_events.present?
        @lead_events.each do |old_event|
          old_event.update(status: "done")
        end
      end

      update_email_and_contact
      @lead.save!
      intended_time = @lead.intended_time(status)
      # Schedule for re-activation of delayed_possession and delayed_project leads when the time comes.
      # Schedule only if the lead is already present - not when creating a new lead - intended_time takes care of that.
      # AND if intended time is present (:possession_status_date is present for delayed_possession OR
      # :intended_date is present for delayed_project).
      if intended_time.present?
        @lead.schedule_delay(intended_time)
      else
        UserNotifierMailer.lead_no_delay_time(@lead).deliver!
      end
      render json: {message: "Lead successfully setup for #{status.humanize.downcase}."}, status: :ok
    end
    AlternateContact.add_alternate_contact(params[:lead][:alternate_contacts], @lead.id, "Lead") if params[:lead][:alternate_contacts].present?
    AlternateContact.add_alternate_contact(params[:alternate_contacts], @lead.id, "Lead") if params[:alternate_contacts].present? #temperary fix
    @lead.status_of_lead_to_lead_head
  end

  # Assign a lead to a cs_agent
  def assign_lead
    begin
      if params[:id] && params[:agent_id].present?
        agent = User.find params[:agent_id]
        unless agent.present? && agent.has_role?("cs_agent")
          return render json: {message: "No such cs_agent was found."}, status: :not_found
        end
        if @lead.lead_status == "qualified"
          return render json: {message: "Lead is in Qualified Status cannot be assign to CS Agent "}, status: 403
        end
        if @lead.lead_status == "lost"
          return render json: {message: "Lead is in Lost Status cannot be assign to CS Agent "}, status: 403
        end
        if @lead.lead_users.where(active: true).present?
          return render json: {message: "CS Agent is working on the lead "}, status: 403
        end
        @lead.assign_to_csagent(agent)  #forcefully assign
        @lead.lead_queue.destroy if @lead.lead_queue
        render json: @lead, user: current_user, status: :created
      else
        render json: @lead, user: current_user, status: :unprocessable_entity
      end
    rescue => error
      render json: {message: error.message}, status: :unprocessable_entity
    end
  end

  # remove a lead from a cs_agent
  def unassign_leads
    unless current_user.has_any_role?(:admin, :lead_head) || (current_user.has_role?(:cs_agent) && @lead.is_assigned_to?(current_user))
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end
    if params[:id] && params[:agent_id].present?
      agent = User.find params[:agent_id]
      unless agent.present? && agent.has_role?("cs_agent")
        render json: {message: "No such cs_agent was found."}, status: :not_found
      end
      @lead.unassign  #forcefully assign
      # queue = @lead.lead_queue
      # if queue.present?
      #   queue.status = "queued"
      #   queue.save!
      # end
      render json: @lead, user: current_user, status: :created
    else
      render json: {message: "Insufficient parameters."}, status: 400
    end
  end

  def refresh_leads
    puts "======"
    puts "Refresh Lead"
    puts "======"
    unless current_user.has_role?(:cs_agent)
      render json: {message: "You are not authorized to perform this action. Only cs_agent role is permitted to do this"}, status: :unauthorized
    end

    @next_lead = LeadPriorityEngine.new(current_user).get_prioritized_lead
    puts "-=-=-=-=-=-=-=-=-=-"
    puts "#{@next_lead.as_json}"
    puts "-=-=-=-=-=-=-=-=-=-"
    if @next_lead.present?
      if ["not_contactable", "follow_up"].include?(@next_lead.lead_status)
        @next_lead.lead_user_change(current_user)
      else
        @next_lead.auto_assign(current_user) unless current_user.forcefully_assigned_leads.include?(@next_lead)
      end
      render json: @next_lead
    else
      render json: {message: "No leads to currently assign to you."}, status: 204
    end
  end

  def claim_lead
    unless current_user.has_role?(:cs_agent) && @lead.is_assigned_to?(current_user)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end
    if @lead.claim_lead(current_user)
      render json: @lead, user: current_user
    else
      render json: {message: "lead could not be claimed - #{@lead.errors.full_messages}"}, status: :unprocessable_entity
    end
  end

  def approve_user
    begin
      @lead.approve
      render json: @lead, status: :created
    rescue => error
      render json: {message: error.message}, status: :unprocessable_entity
    end
  end

  # return a list of lead types, sources and campaign and the email of the cs agent assigned
  # to each. Also give a list of cs-agents so one can be assigned if needed.
  def lead_pool_list
    unless current_user.has_any_role?(:admin, :lead_head, :cs_agent, :designer, :community_manager)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    hash = Hash.new
    hash[:lead_types] = LeadType.all.map { |lead_type|
      assigned_cs_agent_email = lead_type.assigned_cs_agent&.email
      lead_type.attributes.slice("id", "name").merge(assigned_cs_agent: assigned_cs_agent_email)
    }

    hash[:lead_sources] = LeadSource.all.map { |lead_source|
      assigned_cs_agent_email = lead_source.assigned_cs_agent&.email
      lead_source.attributes.slice("id", "name").merge(assigned_cs_agent: assigned_cs_agent_email)
    }
    hash[:designer_lead_sources] = LeadSource.where(name: "dealer").map { |lead_source|
      assigned_cs_agent_email = lead_source.assigned_cs_agent&.email
      lead_source.attributes.slice("id", "name").merge(assigned_cs_agent: assigned_cs_agent_email)
    }
    hash[:lead_campaigns] = LeadCampaign.all.map { |lead_campaign|
      if lead_campaign.status == "active"
        assigned_cs_agent_email = lead_campaign.assigned_cs_agent&.email
        lead_campaign.attributes.slice("id", "name").merge(assigned_cs_agent: assigned_cs_agent_email)
      end
    }.compact
    hash[:designer_lead_campaigns] = [LeadCampaign.where(name: "Walk-In").first_or_create.slice("id", "name").merge(assigned_cs_agent: nil)]
    hash[:cs_agents] = User.with_role(:cs_agent).map { |agent| agent.attributes.slice("id", "name", "email") }

    render json: hash
  end

  def assign_cs_agent_to_source
    unless current_user.has_any_role?(:admin, :lead_head)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    @lead_source = LeadSource.find(params[:lead_source_id])
    if @lead_source.update(assigned_cs_agent_id: params[:cs_agent_id])
      render json: @lead_source
    else
      render json: @lead_source.errors, status: :unprocessable_entity
    end
  end

  def assign_cs_agent_to_type
    unless current_user.has_any_role?(:admin, :lead_head)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    @lead_type = LeadType.find(params[:lead_type_id])
    if @lead_type.update(assigned_cs_agent_id: params[:cs_agent_id])
      render json: @lead_type
    else
      render json: @lead_type.errors, status: :unprocessable_entity
    end
  end

  def assign_cs_agent_to_campaign
    unless current_user.has_any_role?(:admin, :lead_head)
      return render json: {message: "You are not authorized to perform this action."}, status: :unauthorized
    end

    @lead_campaign = LeadCampaign.find(params[:lead_campaign_id])
    if @lead_campaign.update(assigned_cs_agent_id: params[:cs_agent_id])
      render json: @lead_campaign
    else
      render json: @lead_campaign.errors, status: :unprocessable_entity
    end
  end

  # Import leads from an excel.
  def import_leads
    if params[:referrer_id].present?
      referrer = User.find(params[:referrer_id])
      if referrer.present?
        referrer_id = referrer.id
      else
        return render json: {message: "Referrer id not valid"}, status: 403
      end
    else
      referrer_id = nil
    end
    if params[:referrer_type].present?
      if Role.find_by(name: params[:referrer_type]).present?
        referrer_type = params[:referrer_type]
      else
        return render json: {message: "Referrer type not valid"}, status: 403
      end
    else
      referrer_type = nil
    end
    initial_lead_contacts = Lead.pluck :contact
    included_leads = []

    str = params[:attachment_file].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "")
    filepath = Rails.root.join("tmp").join("leads.xlsx")
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    workbook = Roo::Spreadsheet.open filepath.to_s

    headers = Hash.new
    workbook.row(1).each_with_index do |header, i|
      headers[header] = i
    end

    # Iterate over the rows. Skip the header row in the range.
    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      # Get the column data using the column heading.
      email = workbook.row(row)[headers["Email"]]
      contact = workbook.row(row)[headers["Contact"]]
      included_leads << contact
      # description = workbook.row(row)[headers['Description']]
      name = workbook.row(row)[headers["Name"]]
      user_type = workbook.row(row)[headers["User type"]]
      address = workbook.row(row)[headers["Address"]]
      details = workbook.row(row)[headers["Additional details"]]
      city = workbook.row(row)[headers["City"]]
      pincode = workbook.row(row)[headers["Pincode"]]
      source = "bulk"
      lead_source = nil
      lead_type = nil
      if params[:lead_campaign_id].present?
        lead_campaign = LeadCampaign.find params[:lead_campaign_id]
      end
      lead_source = LeadSource.find_by(id: params[:lead_source_id])
      lead_type = LeadType.find_by(name: user_type&.downcase)
      if email.present?
        lead = Lead.where(contact: contact).first_or_initialize
        next unless lead.new_record?  #we only want to import new leads, not update existing leads here!
        lead.assign_attributes(name: name, email: email, address: address, details: details,
                               city: city, pincode: pincode, source: source, created_by: current_user.id,
                               lead_source: lead_source, lead_type: lead_type, lead_campaign: lead_campaign,
                               referrer_id: referrer_id, referrer_type: referrer_type)
        lead.save!
      end
      # print "Row: #{contact}, #{name}, #{user_type}, #{address}, #{details}, #{city}, #{pincode}\n\n"
    end

    final_lead_contacts = Lead.all.pluck :contact
    added_contacts = final_lead_contacts - initial_lead_contacts

    render json: {new_leads: added_contacts,
                  updated_leads: included_leads - added_contacts}
  end

  def events_log
    unless current_user.has_any_role?(:admin, :community_manager, :designer, :city_gm, :design_manager, :business_head)
      return render json: {message: "Unauthorized!"}, status: :unauthorized
    end
    render json: @lead, serializer: LeadPastEventSerializer, event_time: params[:event_time], event_type: params[:event_type]
  end

  def lead_event_counts
    unless current_user.has_any_role?(:admin, :community_manager, :designer, :city_gm, :design_manager, :business_head)
      return render json: {message: "Unauthorized!"}, status: :unauthorized
    end
    render json: @lead, serializer: LeadEventCountSerializer
  end

  def assign_cm_to_lead
    unless params[:cm_id].present?
      return render json: {message: "Please Selct Community Manager First"}, status: 204
    end
    cm = User.find(params[:cm_id])
    if cm.has_role?(:community_manager)
      if @lead.project&.assigned_designer.present? && !params[:designer_id].present?
        if current_user.has_role?(:admin)
          hash = Hash.new
          cms = User.with_role(:community_manager).select(:id, :email, :name).as_json
          hash[:community_managers] = cms
          @designers = cm.designers_for_cm.select(:id, :email, :name).as_json
          hash[:designers] = @designers
          return render json: hash, status: 200
        else
          return render json: {message: "Cannot change CM after lead is assigned to designer"}, status: 403
        end
      end
      @lead.update(assigned_cm_id: cm.id)
      UserNotifierMailer.lead_qualified_mail_to_cm(cm.email, @lead).deliver_now!
      @project = @lead.project

      if params[:designer_id].present? && current_user.has_role?(:admin) && @project.present?
        @project.assign_project params[:designer_id]

        @events = @project.events.where(status: ["scheduled", "rescheduled"])
        @events.each do |event|
          event.update(status: "done")
        end if @events.present?
      end

      return render json: {message: "Community Manager Assigned to Lead"}, status: 200
    else
      return render json: {message: "Selected User is not a Community Manager"}, status: 204
    end
  end

  def lead_queue
    if LeadQueue.count > 0
      render json: LeadQueue.all.sort, each_serializer: LeadPriorityDisplaySerializer, status: 200
    else
      render json: {lead_queues: []}, status: 200
    end
  end

  def make_contact_visible
    if current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head)
      if @lead.is_contact_visible
        @lead.update! is_contact_visible: false
      else
        @lead.update! is_contact_visible: true
      end
      return render json: {message: "saved successfully"}, status: 200
    else
      return render json: {message: "unauthorized user"}, status: 401
    end
  end

  def update_basic_info
    @user = @lead.related_user
    if @user.email != params[:email]
      if User.where(email: params[:email]).present?
        return render json: {message: "email already exists"}, status: 200
      else
        @lead.update(name: params[:name], contact: params[:contact], email: params[:email])
        @user.skip_reconfirmation!
        @user.update(name: params[:name], contact: params[:contact], email: params[:email], dummyemail: false)

        render json: @lead, serializer: LeadSerializerForCM
      end
    else
      @lead.update(name: params[:name], contact: params[:contact])
      @user.update(name: params[:name], contact: params[:contact])

      render json: @lead, serializer: LeadSerializerForCM
    end
  end

  def sales_life_cycle_report
    if current_user.is_champion || current_user.has_any_role?(:admin, :lead_head, :sales_manager)
      if @lead.lead_status == "qualified" && @lead.user_type == "customer"  && @lead.project.present?
        sales_report_encoded_file = @lead.generate_sales_life_cycle_pdf
        file_name = "#{@lead.name&.titleize}-Sales Life Cycle Report.pdf"
        render json: {report: sales_report_encoded_file, file_name: file_name}
      else
        render json: {message: "Lead Type - Status not Valid"}, status: :unprocessable_entity
      end
    else
      render json: {message: "Unauthorized"}, status: 403
    end
  end

  # get history of smart shares for a lead.
  def smart_share_history_for_lead
    smart_hystories = OfficeMoodboardPpt.where(lead_id: params[:lead_id])
    render json: {smart_histories: smart_hystories.map {|history| {id: history.id, url: history.url, time_stamp: history.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")}}}
  end

  # Smart Share History will be sent by email as excel through SmartShareReportJob.
  def smart_share_report
    case current_user.roles.last.name
    when "lead_head"
      @leads = Lead.all
    when "designer"
      @leads = Lead.where(id: current_user.active_assigned_projects.pluck(:lead_id))
    when "city_gm"
      @leads = Lead.where(assigned_cm_id: current_user.cms)
    when "design_manager"
      @leads = Lead.where(assigned_cm_id: current_user.dm_cms)
    when  "community_manager"
      @leads = Lead.where(assigned_cm_id: current_user)
    when "business_head"
      @leads = Lead.where(assigned_cm_id: User.with_role(:community_manager).pluck(:id))
    else
      raise CanCan::AccessDenied
    end
    SmartShareReportJob.perform_later(current_user, @leads.pluck(:id))
  end

  def alternate_contacts
    render json: @lead, serializer: AlternateContactSerializer
  end

  def search_leads
    lead = Lead.find_by_id params[:lead_id]
    if lead.present?
       if lead.lead_status == "qualified"
         if  ["wip", "installation"].include?(lead&.project&.status)
           type = lead.note_records&.last&.accomodation_type
           return render json: {lead: lead.attributes.slice("id", "name", "email").as_json.merge('lead_type': type)}, status: 200
         else
           return render json: {message: "Project is not in WIP State"}, status: 404
         end
       else
         return render json: {message: "Lead is not qualified"}, status: 404
       end
    else
      return render json: {message: "Lead not found"}, status: 404
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_lead
    @lead = Lead.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def lead_params
    params.require(:lead).permit(:id, :name, :email, :contact, :address, :details, :created_at, :updated_at, :city, :pincode, :user_type,
                                 :status_updated_at, :lead_status, :source, :follow_up_time, :lost_remark, :lost_reason, :created_by, :lead_source_temp, :dummyemail, :related_user_id,
                                 :lead_escalated, :reason_for_escalation, :lead_campaign_id, :lead_source_id, :lead_type_id, :not_contactable_counter, :remark, :instagram_handle, :referrer_id, :referrer_type)
  end

  # this is used only for broker and referral role updating a lead's details. Very limited.
  def broker_update_lead_params
    params.require(:lead).permit(:name, :details, :email, :contact, :address, :city, :pincode)
  end

  def load_leads
    # current_user ||= User.with_role(:admin).first
    if current_user.has_any_role?(:admin, :lead_head, :customer_head)
      @leads = Lead.latest_created_at_first.search(params[:lead_term])
      return true
    else
      return false
    end
  end

  def sales_manager_load_leads
    if current_user.has_any_role? :sales_manager
      referrers_ids = current_user.referrers.pluck(:id)
      referrers_ids << current_user.id # Adding sales manager id to referrer ids : Deepak
      @leads = Lead.where("created_by IN (?) OR referrer_id IN (?)", referrers_ids, referrers_ids).latest_created_at_first.search(params[:lead_term])
    else
      @leads = nil
    end
  end

  #returns a hash that can be used in a where clause for leads e.g.
  # {source: ["digital"], lead_status: ["qualified","dropped"]}
  def build_filter_hash
    hash = Hash.new
    allowed_keys = [:source, :lead_status, :lead_type_id, :lead_source_id, :lead_campaign_id]
    params.keys.map(&:to_sym).each do |filter_key|
      if allowed_keys.include?(filter_key) && params[filter_key].present?
        hash[filter_key] = params[filter_key].split(",")
        if params[filter_key].split(",").include?("not_attempted")
          hash[filter_key].push "not_claimed"
        end
      end
    end
    hash
  end

  def sales_manager_build_filter_hash
    hash = Hash.new
    allowed_keys = [:source, :lead_status, :lead_type_id, :lead_source_id, :lead_campaign_id]
    params.keys.map(&:to_sym).each do |filter_key|
      if allowed_keys.include?(filter_key) && params[filter_key].present?
        hash[filter_key] = params[filter_key].split(",")
        if params[filter_key].split(",").include?("not_attempted")
          hash[filter_key].push "not_claimed"
        end
      end
    end
    hash
  end

  def update_email_and_contact
    @lead.email = params[:email] if params[:email]
    @lead.contact = params[:contact] if params[:contact]
    @lead.name = params[:name] if params[:name]
    @lead.pincode = params[:pincode] if params[:pincode]
  end

  def create_event_for_follow_up(follow_up_time, status, user_type, lead_id, emails)
    @event = Event.new(agenda: status, scheduled_at: follow_up_time, ownerable: Lead.find(lead_id), contact_type: "phone_call")
    @event.save
    @event.add_participants(emails, current_user.id)
    @event.save!
  end


end
