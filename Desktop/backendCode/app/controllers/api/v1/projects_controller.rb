require_dependency "#{Rails.root.join('app','serializers','project_serializer')}"
require_dependency "#{Rails.root.join('app','serializers','proposal_doc_serializer')}"
require_dependency "#{Rails.root.join('app', 'serializers', 'project_purchase_order_serializer')}"
require_dependency "#{Rails.root.join('app', 'serializers', 'project_file_serializer')}"
require_dependency "#{Rails.root.join('app', 'serializers', 'project_handover_serializer')}"
require_dependency "#{Rails.root.join('app', 'serializers', 'category_project_handover_list_serializer')}"


class Api::V1::ProjectsController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: [:status_by_token,:update_status_detail, :update_remark, :share_pdf_with_customer, :seen_by_category_for_handover]
  before_action :set_project, only: [:booking_form_for_project, :scope_of_work_for_ten_percent, :get_project_requirement, :show, :update, :destroy, :assign_project, :product_catalog, :approved_quotations,:update_remark, :get_sms, :post_sms, :share_pdf_with_customer,
    :share_warrenty_doc, :client_address, :purchase_orders, :upload_three_d_image, :upload_reference_image, :upload_elevation, :fetch_three_d_images, :fetch_reference_images, :fetch_elevations, :list_for_handover, :add_project_handover_list,
    :quotation_for_final_payment, :files_to_assign, :seen_by_category_for_handover, :fetch_customer_inspiration, :send_to_factory_mail, :upload_line_marking, :fetch_line_markings, :check_for_booking_form]
  load_and_authorize_resource except: [:booking_form_for_project, :scope_of_work_for_ten_percent, :get_project_requirement, :status_by_token, :update_status_detail, :select_sections, :product_catalog, :quotations_for_po, :seen_by_category_for_handover]

  def projects_for_import_boq
    if current_user.has_role?(:community_manager)
      @projects = Project.includes(:designer_projects).joins(:quotations).where(status: Project::AFTER_WIP_STATUSES, designer_projects: {designer_id: current_user.designers_for_cm.pluck(:id), active: true}).where.not(quotations: {status: "draft"}).distinct
    elsif  current_user.has_role?(:designer)
      @projects = current_user.assigned_projects.joins(:quotations).where(status: Project::AFTER_WIP_STATUSES).where.not(quotations: {status: "draft"}).distinct
    elsif current_user.has_any_role?(:city_gm, :design_manager, :business_head)
      if current_user.has_role? :city_gm
        cms = current_user.cms
      elsif current_user.has_role? :design_manager
        cms = current_user.dm_cms
      elsif current_user.has_role? :business_head
        cms = User.with_role :community_manager
      end
      @projects = Project.includes(:designer_projects).joins(:quotations).where(status: Project::AFTER_WIP_STATUSES, designer_projects: {designer_id: User.where(cm_id: cms), active: true}).where.not(quotations: {status: "draft"}).distinct
    end
    render json: FjaProjectSerializer.new(@projects).serialized_json, status: 200
  end

  def index
    if current_user.has_role? :designer
      @projects = current_user.assigned_projects
    elsif current_user.has_role? :customer
      @projects = current_user.projects
    elsif current_user.has_role? :admin
      @projects = Project.all
    end
    paginate json: @projects.includes(:designer_projects, :designers, :user, :floorplans)
  end

  def business_head_projects
    if current_user.has_role? :business_head
      project = Project.where.not(status: ["on_hold", "inactive"])
      paginate json: project, each_serializer: BusinessProjectSerializer
    else
      render json: {message: "You are not authorized to perform this action"}, status: 403
    end
  end

  # GET /api/v1/projects/1
  def show
    render json: @project, user: current_user
  end

  def get_project_requirement
    if current_user.has_any_role?(:community_manager, :designer, :city_gm, :design_manager, :business_head)
      @project_requirement = @project.project_requirement if @project.present?
      render json: @project_requirement, status: 200
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  def scope_of_work_for_ten_percent
    if current_user.has_any_role?(:community_manager, :designer, :city_gm, :design_manager, :business_head)
      @scope_of_work = @project.scope_of_work if @project.present?
      render json: @scope_of_work, status: 200
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  def booking_form_for_project
    if current_user.has_any_role?(:community_manager, :designer, :city_gm, :design_manager, :business_head)
      @project_booking_form = @project.project_booking_form if @project.present?
      render json: @project_booking_form, status: 200
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  # checks whether bookingform exists or not.
  def check_for_booking_form
    if current_user.has_any_role?(:community_manager, :designer)
      render json: {booking_form_exist: @project&.project_booking_form.present?}, status: 200
    else
      render json: { message: "This user is not a Community Manager or Designer" }, status: :unauthorized
    end
  end

  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class ProjectSerializer
  def create
    # @project = Project.new(project_params)
    if params[:customer_id].present?
      customer = User.find(params[:customer_id])
      @project = customer.projects.new(project_params)
    else
      @project = current_user.projects.new(project_params)
    end
    begin
      @project.save!
      render json: @project, user: current_user, status: :created
    rescue => e
      render json: {message: e.message}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/projects/1
  # @body_parameter [string] name
  # @body_parameter [string] details
  # @response_class ProjectSerializer
  def update
    if @project.update(project_params)
      render json: @project, user: current_user
    else
      render json: {message: @project.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/projects/1
  def destroy
    @project.destroy
  end

  # @body_parameter [string] designer_id
  # @response_class ProjectSerializer
  def assign_project
    begin
      if params.has_key?(:project) && params[:project][:designer_id].present?
        # puts "abhinav"
        @project.assign_project(params[:project][:designer_id])
        render json: @project, user: current_user, status: :created
      else
        # puts "sunnys hsarma"
        render json: @project, user: current_user, status: :unprocessable_entity
      end
    rescue => error
      # puts "riya mehta"
      render json: {message: error.message}, status: :unprocessable_entity
    end
  end

  def status_by_token
    @designer_project = DesignerProject.find_by(mail_token: params[:mail_token])
    # Ensure that designer_project exists and the associated designer is assigned to the project.
    unless @designer_project.present? && @designer_project.active
      return render json: {message: "Invalid token!"}, status: 401
    end

    if @designer_project.token_uses_left == 0
      return render json: {message: "Token has been used or has expired!"}, status: 401
    end

    @designer_project.customer_status = params[:customer_status] if params[:customer_status].present?
    @designer_project.customer_meeting_time = params[:customer_meeting_time] if params[:customer_meeting_time].present?
    @designer_project.customer_remarks = params[:customer_remarks] if params[:customer_remarks].present?

    if @designer_project.save
      @designer_project.use_token
    end

    if params[:redirect_to_frontend] == 'true'
      redirect_to "#{params[:redirect_url]}?designer_project_id=#{@designer_project.id}&mail_token=#{@designer_project.mail_token}&customer_status=#{@designer_project.customer_status}"
    else
      render json: {message: 'Successfully updated!'}, status: :ok
    end
  end

  # When, for creating a new boq, designer has to select sections or choose a boq to import
  def select_sections
    unless current_user&.has_any_role?(:admin, :designer, :community_manager, :business_head)
      return render json: {message: 'Unauthorized'}, status: :unauthorized
    end

    @sections = Section.roots   #top level sections
    if current_user&.has_role?(:admin)
      @projects = Project.all
    else
     @projects = current_user.assigned_projects
    end
    @quotations = current_user.created_quotations
    hash = Hash.new
    section_array = []
    @sections.each do |section|
      section_array.push section.section_product_hash
    end

    hash[:sections] = section_array
    @projects = @projects.includes(:lead) if @projects.present?
    hash[:projects] = @projects.map{|project| project&.slice('id', 'name').merge('lead_name': project&.lead&.name)}
    hash[:quotations] = @quotations.map{|quotation| quotation&.slice('id', 'name', 'reference_number')}

    render json: hash
  end

  # This project's products across ALL of its boqs for populating catalogue (while creating boq)
  def product_catalog
    unless current_user&.has_any_role?(:admin, :designer, :community_manager)
      return render json: {message: 'Unauthorized'}, status: :unauthorized
    end

    quotations = @project.quotations
    boqjobs = Boqjob.where(ownerable: quotations)
    @products = Product.joins(:boqjobs).where(boqjobs: {id: boqjobs.pluck(:id)}).distinct

    render json: @products, each_serializer: AllProductCatalogSerializer
  end

  def approved_quotations
    stage = params[:stage].present? ? params[:stage] : "all"
    proposals = ProposalDoc.joins(:proposal).where(proposals: {project: @project}).distinct.where(ownerable_type: "Quotation", is_approved: true).pluck(:ownerable_id)
    quotations = stage == "all" ?  Quotation.where(id: proposals) : Quotation.where(id: proposals, wip_status: stage)
    render json: quotations, status: 200
  end

  # Quotations for final payment
  def quotation_for_final_payment
    quotation_ids = ProposalDoc.joins(:proposal).where(proposals: {project: @project}).distinct.where(ownerable_type: "Quotation", is_approved: true).pluck(:ownerable_id)
    @quotations = @project.quotations.where(id: quotation_ids, wip_status: "10_50_percent").where("quotations.paid_amount > total_amount*0.45 OR quotations.per_50_approved_by_id IS NOT NULL")
    if @quotations.present?
      render json: @quotations, status: 200
    else
      render json: {message: "No Quotations Found."}, status: 400
    end
  end

  def projects_for_cad
    if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      quitation_ids = []
      unseen_cad = CadUpload.where(seen_by_category: false).order(created_at: :desc)
      unseen_cad_quotations = unseen_cad.pluck(:quotation_id).uniq
      seen_no_action_cad = CadUpload.where(seen_by_category: true, status: "pending").order(created_at: :desc)
      seen_no_action_cad_quotations = seen_no_action_cad.pluck(:quotation_id).uniq
      other_cad = CadUpload.where.not(id: (unseen_cad.pluck(:id)+ seen_no_action_cad.pluck(:id))).order(created_at: :desc)
      other_cad_quotations = other_cad.pluck(:quotation_id).uniq
      quitation_ids.push unseen_cad_quotations
      quitation_ids.push seen_no_action_cad_quotations
      quitation_ids.push other_cad_quotations
      quitation_ids = quitation_ids.flatten.uniq
      # cad_quotations = CadUpload.all.order(seen_by_category: :asc, created_at: :desc).pluck(:quotation_id).uniq
      quotations = Quotation.where_with_order(:id, quitation_ids)
      return paginate json: quotations, each_serializer: ProjectForCadSerializer
    elsif current_user.has_role?(:cad)
      @projects = paginate Project.projects_available_to_cad.order(created_at: :asc)
      # @projects = paginate Project.where(status: 'wip')
      render json: @projects, each_serializer: ProjectCadSerializer
    else
      raise CanCan::AccessDenied
    end
  end

  def update_remark
    if @project.update(remarks: params[:project][:remarks])
      render json: { message: 'remark updated successfully' }, status: 200
    else
      render json: { message: 'remark updated unsuccessfull' }, status: 400

    end
  end

  #list of 50% quotations and it's job_elements.
  def quotations_for_po
    @quotations = Quotation.where(quotations: {wip_status: ["10_50_percent"], } ).where("paid_amount > total_amount*0.5").order(:project_id)

    if @quotations.present?
      # @quotations = paginate @quotations
      events = FjaPoQuotationSerializer.new(@quotations.includes(project: :lead)).serializable_hash

      temp_hash = {}
      temp_hash[:leads] = events.map{|event| event[:attributes]}

      render json: temp_hash
    else
      render json: {message: "No Quotations Found."}, status: 400
    end
  end

  def post_sms
    unless current_user&.has_any_role?(:designer, :community_manager, :admin, :city_gm, :design_manager, :business_head)
      return render json: {message: 'Unauthorized'}, status: :unauthorized
    end

    unless params[:message]&.strip.present?
      return render json: {message: "Empty Message cannot be send"}, status: 400
    end

    params[:contact_no].present? ? SmsModule.send_sms(params[:message], params[:contact_no], current_user, @project) : SmsModule.send_sms(params[:message], @project.user&.contact, current_user, @project)

    render json: {message: "SMS Sent"}, status: 200

  end

  def get_sms
    unless current_user&.has_any_role?(:designer, :community_manager, :admin, :city_gm, :design_manager, :business_head)
      return render json: {message: 'Unauthorized'}, status: :unauthorized
    end

    render json: @project.sms_logs, status: 200
  end

  def quotations_count_for_category
    temp = {}
    temp['custom_elements_count'] = CustomElement.all.where(status: "pending").count
    temp['initial_boq_count'] = Proposal.where(proposal_type: "initial_design").count
    final_proposals = Proposal.where(proposal_type: "final_design").pluck(:id)
    final_proposal_docs_quotation = ProposalDoc.where(ownerable_type: "Quotation", proposal_id: final_proposals).pluck(:ownerable_id)
    final_quotations_count = Quotation.where(id: final_proposal_docs_quotation, category_approval: nil).count
    temp['final_boq_count'] = final_quotations_count
    temp['pre_production_count'] = Quotation.pre_production.count
    temp['cad_approvals_count'] = CadUpload.all.where(status: "pending").count
    temp["all"] = temp.collect {|key, value| value}.sum
    render json: temp
  end

  def pre_production_projects
    @projects = Project.where(sub_status: "40%_payment_recieved")

    if params[:sub_tab] == "sli_creation"
      task_set = TaskSet.find_by(task_name: "SLI Creation")
    elsif params[:sub_tab] == "vendor_selection"
      task_set = TaskSet.find_by(task_name: "Vendor Selection")
    elsif params[:sub_tab] == "po_release"
      task_set = TaskSet.find_by(task_name: "Create Purchase Order")
    elsif params[:sub_tab] == "pi_upload"
      task_set = TaskSet.find_by(task_name: "Upload PI")
    elsif params[:sub_tab] == "payment_request"
      task_set = TaskSet.find_by(task_name: "Payment Request")
    end

    @projects = @projects.joins(quotations: :task_escalations).where(task_escalations: {task_set_id: task_set.id}).distinct
    @projects = paginate @projects

    projects = FjaCategoryProjectsSerializer.new(@projects.includes(:lead)).serializable_hash
    temp_hash = {}
    temp_hash[:projects] = projects.map{|project| project[:attributes]}

    render json: temp_hash
  end

  def projects_by_quotations_wip_status
    proposal_type = params[:proposal_type].present? ? params[:proposal_type] : "all"
    if proposal_type == "initial_design"
      @projects = Project.find(Proposal.where(proposal_type: params[:proposal_type]).order(created_at: :asc).pluck(:project_id).uniq)
      @projects = paginate @projects
      projects = FjaCategoryProjectsSerializer.new(@projects).serializable_hash
      temp_hash = {}
      temp_hash[:projects] = projects.map{|project| project[:attributes]}

      render json: temp_hash
    else
      proposals = Proposal.where(proposal_type: "final_design").order(created_at: :desc).pluck(:id)
      proposal_docs_quotation = ProposalDoc.where(ownerable_type: "Quotation", proposal_id: proposals).pluck(:ownerable_id)
      quotation_ids = []
      new_quotations = Quotation.where(id: proposal_docs_quotation, seen_by_category: false).order(created_at: :desc).pluck(:id).uniq
      seen_no_action_quotations = Quotation.where(id: proposal_docs_quotation, seen_by_category: true, category_approval: nil).order(created_at: :desc).pluck(:id).uniq
      other_quotations = Quotation.where(id: proposal_docs_quotation).where.not(id: (new_quotations + seen_no_action_quotations)).pluck(:id).uniq
      quotation_ids.push new_quotations
      quotation_ids.push seen_no_action_quotations
      quotation_ids.push other_quotations
      quotation_ids = quotation_ids.flatten.uniq
      @proposal_docs = ProposalDoc.where_with_order(:ownerable_id, quotation_ids)

      return paginate json: @proposal_docs, each_serializer: ProposalDocCategorySerializer
    end
  end

  def projects_by_custom_elements
    project_ids = []
    new_custom_elements = CustomElement.where(seen_by_category: false).order(created_at: :desc)
    new_custom_elements_project = new_custom_elements.pluck(:project_id).uniq
    seen_no_action = CustomElement.where(seen_by_category: true, status: "pending").order(created_at: :desc)
    seen_no_action_project = seen_no_action.pluck(:project_id).uniq
    other_custom_elements = CustomElement.where.not(id: (new_custom_elements + seen_no_action)).order(created_at: :desc)
    other_custom_elements_project = other_custom_elements.pluck(:project_id).uniq
    project_ids.push new_custom_elements_project
    project_ids.push seen_no_action_project
    project_ids.push other_custom_elements_project
    project_ids = project_ids.flatten.uniq
    @projects = Project.where_with_order(:id, project_ids)

    if @projects.present?
      projects = paginate @projects
      projects = FjaCategoryProjectsSerializer.new(projects).serializable_hash
      temp_hash = {}

      temp_hash[:projects] = projects.map{|project| project[:attributes]}
      render json: temp_hash
    else
      render json: {message: "No Projects with custom elements."}, status: 400
    end
  end

  def download_custom_elements
    CustomElementDownloadJob.perform_later(current_user)
  end

  def search_project_for_category
    if params[:search].present?
      # leads = Lead.all.search_leads(params[:search])
      if params[:tab] == "initial_design"
        leads = Lead.where(id: Project.find(Proposal.where(proposal_type: "initial_design").order(created_at: :asc).pluck(:project_id).uniq).pluck(:lead_id)).search_leads(params[:search])
      elsif params[:tab] == "cad_approvals"
        leads = Lead.where(id: Project.projects_available_to_cad.pluck(:lead_id)).search_leads(params[:search])
      elsif params[:tab] == "final_design"
        leads = Lead.where(id: Project.find(Proposal.where(proposal_type: "final_design").order(created_at: :asc).pluck(:project_id).uniq).pluck(:lead_id)).search_leads(params[:search])
      elsif params[:tab] == "custom_element"
        leads = Lead.where(id: Project.find(CustomElement.order(price: :desc, created_at: :desc).pluck(:project_id).uniq).pluck(:lead_id)).search_leads(params[:search])
      elsif params[:tab] == "pre_production"
        leads = Lead.where(id: Project.where(sub_status: "40%_payment_recieved").pluck(:lead_id)).search_leads(params[:search])
      end

      if leads.present?
        projects = Project.where(lead_id: leads.pluck(:id))
        projects_ids = projects.pluck(:id)
        puts "-----------------------------"
        puts "#{projects_ids}"
        puts "-----------------------------"
        if params[:tab] == "initial_design"
          @projects = paginate projects
          projects = FjaCategoryProjectsSerializer.new(@projects).serializable_hash
          temp_hash = {}
          temp_hash[:projects] = projects.map{|project| project[:attributes]}
          return render json: temp_hash
        elsif params[:tab] == "cad_approvals"
          quotations = Quotation.where(project_id: projects_ids)
          return paginate json: quotations, each_serializer: ProjectForCadSerializer #for CAD Upload
        elsif params[:tab] == "final_design"
          proposals = Proposal.where(proposal_type: "final_design", project_id: projects_ids).order(created_at: :desc).pluck(:id)
          @proposal_docs = ProposalDoc.where(ownerable_type: "Quotation").where_with_order(:proposal_id, proposals)
          return paginate json: @proposal_docs, each_serializer: ProposalDocCategorySerializer  #for Final BOQ
        elsif params[:tab] == "custom_element"
          projects = paginate projects
          projects = FjaCategoryProjectsSerializer.new(projects).serializable_hash
          temp_hash = {}
          temp_hash[:projects] = projects.map{|project| project[:attributes]}
          return render json: temp_hash  #for Custom elements
        elsif params[:tab] == "pre_production"
          # leads = Lead.where(id: Project.where(sub_status: "40%_payment_recieved").pluck(:lead_id)).search_leads(params[:search])
        end

      else
        render json: {message: "no search text found"}, status: 200
      end
    else
      render json: {message: "no search text found"}, status: 400
    end
  end

  def share_pdf_with_customer
    unless current_user&.has_any_role?(:designer, :community_manager, :admin)
      return render json: {message: 'Unauthorized'}, status: :unauthorized
    end
    if params[:file_name].present?
      @file_name = params[:file_name]
      UserNotifierMailer.share_pdf_with_customer(@project, @file_name).deliver_now!
      render json: {message: "File Shared with Customer"}, status: 200
    else
      render json: {message: "Wrong parameter"}, status: 400
    end
  end
  
  def arrivae_pdf
    pdf_hash = {}
    file_names = ['file_booklet.pdf', 'Customisation_booklet_A4.pdf']
    file_names.each do |file_name|
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(file_name)
      url = obj.presigned_url("get", expires_in: 600*60)
      pdf_hash["#{file_name}"] = url
    end
    render json: pdf_hash, status: 200
  end

  def purchase_orders
    return paginate json: @project.purchase_orders, each_serializer: ProjectPurchaseOrderSerializer
  end

  def share_warrenty_doc
    user_contact = Rails.env == "production" ? @project.user.contact : "9035488425"
    SmsModule.send_sms("Click on link to download warrenty document https://delta.arrivae.com/assets/img/customerWarranty.pdf", user_contact)
    UserNotifierMailer.share_warrenty_doc_with_customer(@project).deliver_now!
    render json: {message: "Document Shared"}, status: 200
  end

  def client_address
    address_block = []
    hash = Hash.new
    user = @project.user
    hash[:name] = user.name
    hash[:contact] = user.contact
    hash[:address] = @project.project_address
    address_block << hash
    if @project.project_address.present?
      render json: address_block, status: 200
    else
      render json: {message: "Address not present"}, status: 204
    end
  end


  def upload_three_d_image
    threeDimage = @project.three_d_images.create(name: params[:three_d_image][:name])
    if threeDimage.create_content(document: params[:three_d_image][:attachments], scope: "three_d_image", document_file_name: params[:three_d_image][:file_name])
      return render json: {message: "Image Uploded"}, status: 200
    else
      return render json: {message: "Image Not Uploded"}, status: 200
    end
  end

  def send_to_factory_mail
    data_hash = {}
    project_handover_ids = @project.project_handovers.where(status: "accepted").pluck(:id) if @project.project_handovers.present?
    production_drawings = ProductionDrawing.where(project_handover_id: project_handover_ids)
    handover_ids = []
    production_drawings.map{|pd| handover_ids << pd.project_handover&.id}
    quotations = @project.quotations.project_handover_quotations
    content_ids = []
    quotations.each do |quotation|
      jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a + quotation.shangpin_jobs.to_a
      jobs.each do |job|
        content_ids += LineItemBom.where(line_item_type: job.class.name, line_item_id: job.id).pluck(:content_id)
      end
    end if quotations.present?
    data_hash[:bom_ids] = content_ids.compact.uniq
    data_hash[:handovers_ids] = handover_ids.uniq
    data_hash[:quotation_ids] = quotations.pluck(:id) if quotations.present?
    SendFactoryJob.perform_later(@project, data_hash)
  end


  def update_panel_for_three_d_image
    if content = ProjectHandover.find_by(id: params[:t_id])
      if content.ownerable_type == 'ThreeDImage'
        threeDimage = ThreeDImage.find_by(id: content.ownerable_id)
        threeDimage.update!(panel: params[:panel])
        render json: {message: "File updated"}, status: 200
      elsif content.ownerable_type == 'ReferenceImage'
        reference_image = ReferenceImage.find_by(id: content.ownerable_id)
        reference_image.update!(panel: params[:panel])
        render json: {message: "File updated"}, status: 200
      else
        render json: {message: "needs to be reference_image or three_d_image"}, status: 422
      end
    end
  end


  def upload_reference_image
    referenceImage = @project.reference_images.create(name: params[:reference_image][:name])
    if referenceImage.create_content(document: params[:reference_image][:attachments], scope: "reference_image", document_file_name: params[:reference_image][:file_name])
      return render json: {message: "Image Uploded"}, status: 200
    else
      return render json: {message: "Image Not Uploded"}, status: 200
    end
  end

  def upload_elevation
    uploadElevation = @project.elevations.create(name: params[:upload_elevation][:name])
    if uploadElevation.create_content(document: params[:upload_elevation][:attachments], scope: "upload_elevation", document_file_name: params[:upload_elevation][:file_name])
      return render json: {message: "Image Uploded"}, status: 200
    else
      return render json: {message: "Image Not Uploded"}, status: 200
    end
  end

  def upload_line_marking
    uploadElevation = @project.line_markings.create(name: params[:line_marking][:name], description: params[:line_marking][:description])
    if uploadElevation.create_content(document: params[:line_marking][:attachments][:document_content_type], scope: "line_marking", document_file_name: params[:line_marking][:file_name])
      return render json: {message: "Image Uploded"}, status: 200
    else
      return render json: {message: "Image Not Uploded"}, status: 200
    end
  end

  def fetch_three_d_images
    render json: @project.three_d_images, each_serializer: ThreeDImageSerializer
  end

  def fetch_reference_images
    render json: @project.reference_images, each_serializer: ReferenceImageSerializer
  end

  def fetch_customer_inspiration
    user = @project.user
    files = user.customer_inspirations
    render json: files, each_serializer: CustomerInspirationSerializer
  end

  def fetch_elevations
    render json: @project.elevations, each_serializer: ElevationSerializer
  end

  def fetch_line_markings
    render json: @project.line_markings, each_serializer: LineMarkingSerializer
  end

  def delete_line_marking
    line_marking =  LineMarking.find_by_id params[:line_marking_id]
    if line_marking.present?
      line_marking.delete
      render json: {message: "File Deleted"}, status: 200
    else
      render json: {message: "File Not Found"}, status: 204
    end
  end

  def list_for_handover
    handover_list = Hash.new
    quotations = @project.quotations.where(wip_status: "10_50_percent")
    ppts = @project.boq_and_ppt_uploads.where(upload_type: "ppt")
    site_requests =  @project.site_measurement_requests
    floorplans = @project.floorplans
    elevations = @project.elevations
    cad_drawing = @project.cad_drawings
    reference_images = @project.reference_images
    three_d_images = @project.three_d_images
    line_markings = @project.line_markings
    customer_inspirations = @project.user.customer_inspirations
    handover_list[:Quotation] = params[:revision].present? ? quotations : @project.check_present_handover_list(quotations, "Quotation")
    handover_list[:BoqAndPptUpload] = params[:revision].present? ? ppts : @project.check_present_handover_list(ppts, "BoqAndPptUpload")
    handover_list[:SiteMeasurementRequest] = params[:revision].present? ? site_requests : @project.check_present_handover_list(site_requests, "SiteMeasurementRequest")
    handover_list[:Floorplan] = params[:revision].present? ? floorplans : @project.check_present_handover_list(floorplans, "Floorplan")
    handover_list[:Elevation] = params[:revision].present? ? elevations : @project.check_present_handover_list(elevations, "Elevation")
    handover_list[:CadDrawing] = params[:revision].present? ? cad_drawing : @project.check_present_handover_list(cad_drawing, "CadDrawing")
    handover_list[:ReferenceImage] = params[:revision].present? ? reference_images : @project.check_present_handover_list(reference_images, "ReferenceImage")
    handover_list[:ThreeDImages] = params[:revision].present? ? three_d_images : @project.check_present_handover_list(three_d_images, "ThreeDImage")
    handover_list[:LineMarking] = params[:revision].present? ? line_markings : @project.check_present_handover_list(line_markings, "LineMarking")
    handover_list[:CustomerInspiration] = params[:revision].present? ? customer_inspirations : @project.check_present_handover_list(customer_inspirations, "CustomerInspiration")
    if params[:category].present?
      if params[:category] == "ThreeDImage"
        handover_list = handover_list["#{params[:category]}s".to_sym]
        return render json: {"#{params[:category]}": handover_list}, status: 200
      else
        handover_list = handover_list[params[:category].to_sym]
        return render json: {"#{params[:category]}": handover_list}, status: 200
      end
    end
    render json: handover_list, status: 200
  end

  def add_project_handover_list
    param_keys = params[:project_handover].keys
    param_keys.each do |param_key|
      params[:project_handover][param_key.to_sym].each do |owner|
           @project.project_handovers.create!(ownerable_id: owner, ownerable_type: param_key, status: "pending")
      end
    end if param_keys.present?
    render json: {message: "File ready for handover"}, status: 200
  end

  def projects_for_handover
    projects = Project.find_with_order(ProjectHandover.where(status: [ "pending_acceptance", "accepted", "rejected"]).order(shared_on: :desc).pluck(:project_id).uniq)
    # projects = projects.search_projects(params[:search]).reorder(new_handover_file: :desc)
    projects = projects.search_projects(params[:search]).reorder(new_handover_file: :desc, last_handover_at: :desc)
    paginate json: projects, each_serializer: CategoryProjectHandoverListSerializer
  end

  def seen_by_category_for_handover
    if @project.update!(new_handover_file: false)
      render json: {message: "files seen"}, status: 200
    else
      render json: {message: @project.errors.full_messages}, status: 422
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def project_params
      params.require(:project).permit(:name, :user_id, :details)
    end
end
