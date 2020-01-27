require_dependency "#{Rails.root.join('app','serializers','quotation_serializer')}"
require_dependency "#{Rails.root.join('app','serializers','modular_job_serializer')}"
require_dependency "#{Rails.root.join('app','serializers','material_tracking_serializer')}"
require 'creek'

class Api::V1::QuotationsController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: [:download_v2_pdf_office]

  before_action :set_quotation, only: [:show, :update, :add_modular_job, :delete_modular_jobs, :destroy, :change_status, :set_spaces, :delete_space,
         :customization, :edit_modular_job, :combine_modules, :edit_combined_module, :recalculate_amount, :import_kdmax_excel, :import_shangpin_excel, :update_service_jobs,
         :delete_service_jobs, :update_custom_element_jobs, :delete_custom_jobs, :update_custom_element_job, :add_appliance_job, :edit_appliance_job,
         :delete_appliance_jobs, :delete_section, :add_extra_job, :edit_extra_job, :delete_extra_jobs, :download_pdf, :download_v2_pdf, :change_wip_status,
         :quotation_for_business_head, :update_remarks, :cm_category_approval, :quotations_purchase_orders, :import_layout, :generate_smart_quotation,
         :add_boqjob, :update_boqjob, :delete_boqjobs, :import_qoutation, :client_quotation_display, :quotations_po,
         :change_sli_flag, :pre_production_quotation_for_sli_line_items, :pre_production_quotations_line_items, :download_boq_pdf,
         :quotations_payment_release_line_items, :quotation_vendors, :download_cheat_sheet, :pre_production_quotations_vendor_wise_line_items,
         :purchase_orders, :create_clubbed_jobs, :create_multi_slis, :line_items_for_splitting, :line_items_for_cutting_list, :edit_modular_job_quantity,
         :import_shangpin_layout, :delete_shangpin_jobs, :add_label, :edit_label, :delete_label, :download_category_excel, :download_v2_pdf_office]

  before_action :set_project, only: [:index, :show, :update, :add_modular_job, :delete_modular_jobs, :destroy, :create, :change_status, :ppt_linked_boq,
         :set_spaces, :delete_space, :customization, :edit_modular_job, :combine_modules, :edit_combined_module, :recalculate_amount, :import_kdmax_excel, :import_shangpin_excel,
         :update_service_jobs, :delete_service_jobs, :update_custom_element_jobs, :delete_custom_jobs, :update_custom_element_job, :add_appliance_job,
         :edit_appliance_job, :delete_appliance_jobs, :delete_section, :add_extra_job, :edit_extra_job, :delete_extra_jobs, :cad, :quotation_for_business_head,
         :quotation_list_for_business_head, :change_wip_status, :cm_category_approval, :import_layout, :generate_smart_quotation, :add_boqjob, :update_boqjob,
         :delete_boqjobs, :import_qoutation, :quotation_for_import, :pre_production_quotation_for_vendor_mapping,
         :quotations_po, :change_sli_flag, :quotations_payment_release_line_items, :shared_initial_boqs, :shared_final_boqs, :quotation_vendors, :download_cheat_sheet, :purchase_orders, :create_clubbed_jobs, :create_multi_slis, :final_approved_quotations, :splitted_quotations,:edit_modular_job_quantity,
         :import_shangpin_layout, :delete_shangpin_jobs, :add_label, :edit_label, :delete_label, :download_category_excel]

  # GET /quotations
  def index
    all_project_quotations = @project.quotations.order(updated_at: :desc)
    if current_user.has_any_role?(:admin, :community_manager, :category_head, *Role::CATEGORY_ROLES, :designer, :city_gm, :design_manager, :business_head)
      @quotations = all_project_quotations
    elsif current_user.has_role?(:customer) && current_user.projects.include?(@project)
      @quotations = all_project_quotations.where(status: STATUSES_VISIBLE_CUSTOMER)
    else
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    #filter quotations as per status
    @quotations = @quotations.where(status: params[:status]) unless params[:status] == 'all' || params[:status].blank?

    if current_user.has_any_role?(:community_manager, :business_head, :designer, :city_gm, :design_manager)
      leads = FjaQuotationIndexSerializer.new(@quotations.includes(:modular_jobs)).serializable_hash
      temp_hash = {}
      temp_hash[:quotations] = leads.map{|lead| lead[:attributes]}
      render json: temp_hash
    else
      render json: @quotations
    end
  end

  def shared_initial_boqs
    @quotations =  @project.quotations.joins(:proposals).where(proposals: {proposal_type: "initial_design"}, status: "shared").distinct
    render json: @quotations
  end

  def shared_final_boqs
    @quotations =  @project.quotations.joins(:proposals).where(proposals: {proposal_type: "final_design"}, status: "shared").distinct
    render json: @quotations
  end

  def quotation_for_import
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    @quotations = @project.quotations.where.not(status: "draft")
    render json: FjaQuotationSerializer.new(@quotations).serialized_json, status: 200
  end

  def import_qoutation
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    #here @quotation is the boq which has to be imported
    @imported_boq = @quotation.import(@project)
    render json: @imported_boq, serializer: QuotationWithJobsSerializer, status: 200
  end

  def quotation_list_for_business_head
    render json: @project.quotations.where(status: "shared").order(updated_at: :desc), each_serializer: BusinessQuotationWithJobsSerializer
  end

  def quotation_for_business_head
    render json: @quotation, serializer: BusinessQuotationWithJobsSerializer

  end

  # get the quotation details with respect to spaces. 
  # set display_boq_label as true if you have to display boq_labels.
  def client_quotation_display
    if current_user.has_any_role?(:designer, :community_manager, :category_head, *Role::CATEGORY_ROLES, :city_gm, :design_manager, :business_head)
      viewing_options = ["boq"]
      display_boq_label = params[:display_boq_label] == "true" ? true : false  
      render json: @quotation.client_quotation_display(viewing_options,display_boq_label), status: 200
    elsif current_user.has_role?(:customer)
      viewing_options = @quotation.customer_viewing_option
      display_boq_label = params[:display_boq_label] == "true" ? true : false 
      render json: @quotation.client_quotation_display(viewing_options,display_boq_label), status: 200
    end
  end

  # BOQs of a given project which are visible to the cad role (obviously also visible to
  # category)
  def cad
    quotation_ids = Project.joins(proposals: :proposal_docs).where(proposal_docs: {ownerable_type: "Quotation"}, proposals: {project_id: @project.id, proposal_type: "final_design"} ).pluck(:ownerable_id).uniq
    @quotations = Quotation.where(id: quotation_ids)
    render json: @quotations
  end

  def designquotes
    if params[:design_id].present?
      design = Design.find(params[:design_id])
      @quotations = design.quotations
    else
      @quotations = nil
    end
    render json: @quotations
  end

  def approve_quotation
    @quotation.approve(params[:quotation][:status])
    render json: @quotation
  end

  # GET /quotations/1
  def show
    unless current_user.assigned_projects.include?(@project) || current_user.has_any_role?(:admin, :community_manager, :customer, :category_head, *Role::CATEGORY_ROLES, :cad, :business_head, :city_gm, :design_manager)
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    return render json: @quotation, serializer: QuotationWithJobsSerializer
  end

  def download_boq
    @quotation = Quotation.find(params[:id])
     unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || current_user.projects.include?(@project) ||
      current_user.created_quotations.include?(@quotation)
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
      render json: @quotation.to_boq_xlsx
      # send_ @quotation.to_boq_xlsx, :type=>"application/xlsx", :disposition => 'attachment'
  end

  # For category - Download the details of a single BOQ. Only ModularJob. Use ModularJobCost data.
  def download_category_excel
    unless current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)
      raise CanCan::AccessDenied
    end

    filepath = @quotation.category_excel
    boq_name = @quotation.reference_number&.gsub("/","-").to_s + ".xlsx"
    boq_encoded_file = Base64.encode64(File.open(filepath).to_a.join)
    render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name}
  end

  # POST /quotations
  def create
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    @quotation = @project.quotations.build(quotation_params)
    # create boqjobs - eg from loose furniture section
    params[:quotation][:products].each do |product_hash|
      boqjob = @quotation.boqjobs.build
      boqjob.import_product(Product.find(product_hash[:id]), product_hash[:quantity], product_hash[:space])
    end if params[:quotation][:products].present?

    @quotation.user = @project.user
    @quotation.designer = current_user
    @quotation.status ||= 'draft'
    @quotation.generation_date = Date.today
    @quotation.expiration_date = Date.today + 1.month

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer, status: :created
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PUT /quotations/1
  # not for update of modular_jobs
  def update
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @quotation.assign_attributes(quotation_params)
    @quotation.project_id = @project.id

    # update boqjobs - eg from loose furniture section
    if params[:quotation][:products].present?
      product_ids_in_params = params[:quotation][:products].map{|product_hash| product_hash[:id]}
      params[:quotation][:products].each do |product_hash|
        # Delete all boqjobs for whom product ids are not sent in the params
        boqjobs_to_delete = @quotation.boqjobs.where.not(product_id: product_ids_in_params).destroy_all
        # Now add/update the rest of boqjobs
        boqjob = @quotation.boqjobs.where(product_id: product_hash[:id]).first_or_initialize
        if boqjob.new_record?
          boqjob.import_product(Product.find(product_hash[:id]), product_hash[:quantity], product_hash[:space])
        else
          boqjob.import_product(Product.find(product_hash[:id]), product_hash[:quantity], product_hash[:space], save_now: true)
        end
      end
    end
    @quotation.need_category_approval =  true
    if @quotation.save
      if params[:handover].present?
        if @quotation.project_handovers.pluck(:status).include?("pending")
          return render json: {message: "Handover Revision can not be created as previous version is still in pending state"}, status: 403
        else
          @quotation.create_handover_revision
        end
      end
      @quotation.touch
      return render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def add_label
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      raise CanCan::AccessDenied
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    # !!!IMPORTANT!!!
    # DO NOT remove this check - Security hole otherwise!!!
    unless params[:ownerable_type].present? && params[:ownerable_id].present? &&
      params[:ownerable_type].in?(['Boqjob', 'ModularJob', 'ApplianceJob', 'ExtraJob', 'CustomJob', 'ShangpinJob'])
      return render json: {message: 'Wrong parameters.'}, status: 400
    end

    line_item = params[:ownerable_type].constantize.find(params[:ownerable_id])
    boq_label = line_item.boq_labels.build(label_name: params[:label_name])
    if boq_label.save
      render json: boq_label.ownerable
    else
      render json: {message: boq_label.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def edit_label
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      raise CanCan::AccessDenied
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    boq_label = @quotation.boq_labels.find(params[:boq_label_id])
    boq_label.assign_attributes(label_name: params[:label_name])
    if boq_label.save
      render json: boq_label.ownerable
    else
      render json: {message: boq_label.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def delete_label
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      raise CanCan::AccessDenied
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    boq_label = @quotation.boq_labels.find(params[:boq_label_id])
    if boq_label.destroy
      render json: boq_label.ownerable
    else
      render json: {message: boq_label.errors.full_messages}, status: :unprocessable_entity
    end
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This label cannot be deleted as it is in use."}, status: :unprocessable_entity
  end

  def add_boqjob
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @presentation = @quotation.presentation
    boqjob = @quotation.boqjobs.build(product_id: params[:product][:id], space: params[:product][:space], product_variant_id: params[:product][:product_variant_id])
    boqjob.import_product(Product.find(params[:product][:id]), params[:product][:quantity], params[:product][:space])

    # for ppt products
    if @presentation.present?
      @product = @presentation.presentations_products.find_or_create_by(product_id: params[:product][:id], space: params[:product][:space])
      @product.quantity = params[:product][:quantity] if @product.present?
      @product.save! if @product.present?
    end
    status = 201

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer, status: status
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update_boqjob
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @boqjob = @quotation.boqjobs.find params[:boqjob_id]
    @boqjob.product_variant_id = params[:product][:product_variant_id] if params[:product][:product_variant_id].present?
    @boqjob.import_product(@boqjob.product, params[:product][:quantity], params[:product][:space], {save_now: true})
    @quotation.touch

    render json: @quotation, serializer: QuotationWithJobsSerializer
  end

  def delete_boqjobs
    unless current_user.has_any_role?(:admin, :community_manager,:city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    boqjobs_to_delete = @quotation.boqjobs.where(id: params[:ids])
    boqjobs_to_delete.destroy_all
    @quotation.recalculate
    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # very much follows the model of the boqjobs (update action)
  def update_service_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    # update service_jobs
    service_ids_in_params = params[:quotation][:services].map{|service_hash| service_hash[:id]}
    # Delete all service jobs for whom service ids are not sent in the params
    service_jobs_to_delete = @quotation.service_jobs.where.not(service_activity_id: service_ids_in_params).destroy_all

    params[:quotation][:services].each do |service_hash|
      # Now add/update the rest of service_jobs
      service_job = @quotation.service_jobs.where(service_activity_id: service_hash[:service_activity_id], space: service_hash[:space]).first_or_initialize
      if service_job.new_record?
        service_job.import_service(ServiceActivity.find(service_hash[:service_activity_id]), service_hash[:quantity], service_hash[:base_rate], service_hash[:space])
      else
        service_job.import_service(ServiceActivity.find(service_hash[:service_activity_id]), service_hash[:quantity], service_hash[:base_rate], service_hash[:space], save_now: true)
      end
    end if params[:quotation][:services].present?

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end


  def delete_service_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end
    service_jobs_to_delete = @quotation.service_jobs.where(id: params[:ids])
    service_jobs_to_delete.destroy_all
    puts "-=--=-="
    puts @quotation.service_jobs.pluck(:amount).sum
    @quotation.recalculate
    puts "-=--=-="
    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  def update_custom_element_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    # update custom jobs
    custom_element_ids_in_params = params[:quotation][:custom_elements].map{|custom_element_hash| custom_element_hash[:id]}
    # Delete all Custom jobs for whom custom_element ids are not sent in the params
    #custom_elements_to_delete = @quotation.custom_jobs.where.not(custom_element_id: custom_element_ids_in_params).destroy_all

    params[:quotation][:custom_elements].each do |custom_element_hash|
      custom_element = CustomElement.find(custom_element_hash[:id])
      custom_job = @quotation.custom_jobs.where(custom_element: custom_element, space: custom_element_hash[:space]).first_or_initialize
      if custom_job.new_record?
        custom_job.import_custom_element(custom_element, custom_element_hash[:quantity], custom_element_hash[:space])
      else
        custom_job.import_custom_element(custom_element, custom_element_hash[:quantity], custom_element_hash[:space], save_now: true)
      end
      # custom_job = @quotation.custom_jobs.create!(name: custom_element.name, rate: custom_element.price, quantity: custom_element_hash[:quantity].to_f, custom_element: custom_element)
      # custom_job.import_custom_element(CustomElement.find(custom_element_hash[:id]), custom_element_hash[:quantity], custom_element_hash[:space], save_now: true)

    end if params[:quotation][:custom_elements].present?

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end


  def delete_custom_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    custom_jobs_delete = @quotation.custom_jobs.where(id: params[:ids])
    custom_jobs_delete.destroy_all

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  def update_custom_element_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    custom_job = CustomJob.find params[:custom_job_id]
    custom_job.update!(quantity: params[:quantity])

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer

  end


  # very much follows the model of the boqjobs (update action)
  def add_appliance_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    
    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    appliance_job = @quotation.appliance_jobs.build(kitchen_appliance_id: params[:kitchen_appliance][:id], space: params[:kitchen_appliance][:space])
    appliance_job.import_appliance(KitchenAppliance.find(params[:kitchen_appliance][:id]), params[:kitchen_appliance][:quantity], params[:kitchen_appliance][:space])
    status = 201

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def edit_appliance_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @appliance_job = @quotation.appliance_jobs.find params[:appliance_job_id]
    @appliance_job.import_appliance(@appliance_job.kitchen_appliance, params[:kitchen_appliance][:quantity], params[:kitchen_appliance][:space], {save_now: true})
    @quotation.touch

    render json: @quotation, serializer: QuotationWithJobsSerializer
  end

  def delete_appliance_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    appliance_jobs_to_delete = @quotation.appliance_jobs.where(id: params[:ids])
    appliance_jobs_to_delete.destroy_all
    @quotation.touch

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # very much follows the model of the boqjobs (update action)
  def add_extra_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    options = { combination: params[:addon][:combination] }
    addon = options[:combination] ? AddonCombination.find(params[:addon][:id]) : Addon.find(params[:addon][:id])
    extra_job = @quotation.extra_jobs.build(space: params[:addon][:space])
    extra_job.import_extra(addon, params[:addon][:quantity], params[:addon][:space], options)
    status = 201

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer, status: status
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def edit_extra_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    options = {save_now: true, combination: params[:addon][:combination]}

    @extra_job = @quotation.extra_jobs.find params[:extra_job_id]
    addon = @extra_job.addon.present? ? @extra_job.addon : @extra_job.addon_combination
    @extra_job.import_extra(addon, params[:addon][:quantity], params[:addon][:space], options)
    @quotation.touch

    render json: @quotation, serializer: QuotationWithJobsSerializer
  end

  def delete_extra_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    extra_jobs_to_delete = @quotation.extra_jobs.where(id: params[:ids])
    extra_jobs_to_delete.destroy_all
    @quotation.touch

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # add a single modular_job
  def add_modular_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    modular_job = @quotation.modular_jobs.build(product_module_id: params[:product_module][:id], space: params[:product_module][:space])
    modular_job.import_module(ProductModule.find(params[:product_module][:id]), params[:product_module][:quantity], params[:product_module][:section_id], params[:product_module][:space], params[:product_module][:options])
    status = 201

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer, status: status
      @quotation.touch
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # edit a single modular job
  def edit_modular_job
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @modular_job = @quotation.modular_jobs.find params[:modular_job_id]
    @modular_job.import_module(@modular_job.product_module, params[:product_module][:quantity],
      params[:product_module][:section_id], params[:product_module][:space], params[:product_module][:options])

    # byebug
    # This condition was specifically added because while importing module, we check if the addons added to the @modular_job
    # are mapped. If not, we had manually added errors to the @modular_job, which will NOT be there if we did a 
    # @modular_job.valid?
    # See method :addons_must_be_mapped in modular_job.
    if @modular_job.errors.present?
      @quotation.recalculate
      render json: {message: @modular_job.errors.full_messages}, status: :unprocessable_entity
    else
      @modular_job.save
      @quotation.touch
      render json: @quotation.reload, serializer: QuotationWithJobsSerializer
    end
  end

  # edit ONLY the quantity of a single modular job
  def edit_modular_job_quantity
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @modular_job = @quotation.modular_jobs.find params[:modular_job_id]
    @modular_job.update!(quantity: params[:product_module][:quantity])
    @quotation.touch

    if @modular_job.valid?
      render json: @quotation.reload, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @modular_job.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # combine several modules into one and provide a door option
  def combine_modules
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @modular_job = @quotation.modular_jobs.build(name: params[:description], space: params[:space], combined: true)
    @combined_door = CombinedDoor.find params[:combined_door_id]
    @modular_job.add_combined_door(@combined_door) if @combined_door.present?

    if @modular_job.save
      params[:modular_job_ids].each do |modular_job_id|
        @quotation.modular_jobs.find(modular_job_id).update(combined_module: @modular_job)
      end if params[:modular_job_ids].present?
      @modular_job.populate_defaults
      @modular_job.save
      @quotation.reload.set_amounts
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: @modular_job.errors.full_messages, status: :unprocessable_entity
    end
  end

  # edit a single combined_module
  def edit_combined_module
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @modular_job = @quotation.modular_jobs.find params[:modular_job_id]
    @modular_job.name = params[:description]
    # first delete old data
    @modular_job.remove_combined_door
    @modular_job.modular_jobs.update(combined_module_id: nil)

    # now new data
    @combined_door = CombinedDoor.find params[:combined_door_id]
    @modular_job.add_combined_door(@combined_door) if @combined_door.present?

    if @modular_job.save
      params[:modular_job_ids].each do |modular_job_id|
        @quotation.modular_jobs.find(modular_job_id).update(combined_module: @modular_job)
      end if params[:modular_job_ids].present?
      @modular_job.populate_defaults
      @modular_job.save
      @quotation.reload.set_amounts
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: @modular_job.errors.full_messages, status: :unprocessable_entity
    end
  end

  # recalculate the price of modules and this BOQ amount without changing anything
  def recalculate_amount
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    if @quotation.recalculate
      render json: @quotation.reload, serializer: QuotationWithJobsSerializer
    else
      render json: @quotation.errors.full_messages, status: :unprocessable_entity
    end
  end

  # get details of a BOQ using the reference number. For use with :change_amount and :toggle_pm_fee actions.
  def show_by_reference
    unless current_user.has_any_role?(:admin, :business_head)
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    @quotation = Quotation.find_by(reference_number: params[:reference_number])
    if @quotation.blank?
      return render json: {message: 'No BOQ with given reference number was found.'}, status: :not_found
    else
      render json: @quotation
    end
  end

  # to change value of a BOQ from front-end
  def change_amount
    unless current_user.has_any_role?(:admin, :business_head)
      raise CanCan::AccessDenied
    end

    unless params[:boq_amount].present? && params[:boq_amount].to_f > 0
      return render json: {message: 'New BOQ amount must be greater than 0.'}, status: :unprocessable_entity
    end

    @quotation = Quotation.find_by(reference_number: params[:reference_number])
    if @quotation.blank?
      return render json: {message: 'No BOQ with given reference number was found.'}, status: :not_found
    end

    if @quotation.status == 'shared'
      return render json: {message: 'Value of shared BOQs cannot be changed.'}, status: :unprocessable_entity
    end

    if @quotation.change_amount(params[:boq_amount])
      render json: @quotation.reload
    else
      render json: @quotation.errors.full_messages, status: :unprocessable_entity
    end
  end

  # To enable or disable the pm fee in a BOQ (note - this is an extra check on top of the check based CM/tag)
  def toggle_pm_fee
    unless current_user.has_any_role?(:admin, :business_head)
      raise CanCan::AccessDenied
    end

    @quotation = Quotation.find_by(reference_number: params[:reference_number])
    if @quotation.blank?
      return render json: {message: 'No BOQ with given reference number was found.'}, status: :not_found
    end

    if @quotation.status == 'shared'
      return render json: {message: 'Value of shared BOQs cannot be changed.'}, status: :unprocessable_entity
    end

    if @quotation.toggle_pm_fee(params[:pm_fee_disabled])
      render json: @quotation.reload
    else
      render json: @quotation.errors.full_messages, status: :unprocessable_entity
    end
  end

  # delete modular_jobs whose IDs are provided in an array
  def delete_modular_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    modular_jobs_to_delete = @quotation.modular_jobs.where(id: params[:ids])
    modular_jobs_to_delete.destroy_all

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # delete modular_jobs whose IDs are provided in an array
  def delete_shangpin_jobs
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    shangpin_jobs_to_delete = @quotation.shangpin_jobs.where(id: params[:ids])
    shangpin_jobs_to_delete.destroy_all

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # DELETE /quotations/1
  def destroy
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    if @quotation.destroy
      render json: {message: 'BOQ successfully deleted.'}
    else
      render json: {message: "BOQ could not be deleted because - #{@quotation.errors.full_messages}."}
    end
  end

  # generate a quotation linked to a ppt
  # no modular products allowed
  def ppt_linked_boq
    @presentation = Presentation.find params[:quotation][:presentation_id]
    unless @presentation.project == @project && (current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project)))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    presentation_products = @presentation.presentations_products
    if presentation_products.present?
      if @presentation.quotation.present?
        @quotation = @presentation.quotation
      else
        @quotation = @presentation.build_quotation
      end

      if @quotation.status == "shared"
        return render json: {message: 'This Boq is already shared.'}
      end

      presentation_spaces = presentation_products.pluck(:space)

      # Add Spaces
      spaces_loose = @quotation.spaces_loose
      spaces_loose << presentation_spaces
      @quotation.assign_attributes(spaces_loose: spaces_loose&.flatten&.uniq)

      @quotation.status = "pending"
      @quotation.project_id = @project.id
      @quotation.user_id = @project&.user&.id
      @quotation.designer_id = @project&.assigned_designer&.id
      @quotation.generation_date = Date.today
      @quotation.expiration_date = Date.today + 1.month
      unless @quotation.save
        render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
      end

      presentation_products.each do |product_hash|

        boqjob = @quotation.boqjobs.where(product_id: product_hash.product_id).first_or_initialize
        if boqjob.new_record?
          boqjob.import_product(Product.find(product_hash.product_id), product_hash.quantity, product_hash.space)
        else
          boqjob.import_product(Product.find(product_hash.product_id), product_hash.quantity, product_hash.space, save_now: true)
        end
      end

      if @quotation.save!
        render json: @quotation, serializer: QuotationWithJobsSerializer, status: :created
        @quotation.touch
      else
        render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {message: "no products present"}, status: :unprocessable_entity
    end
  end

  def change_status
    # unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
    #   current_user.assigned_projects.include?(@project))
    #   return render json: {message: 'Unauthorized.'}, status: :unauthorized
    # end

    @quotation.assign_attributes(status: params[:status])
    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # set the :spaces column
  def set_spaces
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    if params[:category]=="wardrobe"
      spaces = @quotation.spaces
      spaces << params[:space]
      @quotation.assign_attributes(spaces: spaces.uniq)
    elsif params[:category]=="kitchen"
      spaces_kitchen = @quotation.spaces_kitchen
      spaces_kitchen << params[:space]
      @quotation.assign_attributes(spaces_kitchen: spaces_kitchen.uniq)
    elsif params[:category] == "loose_furniture"
      spaces_loose = @quotation.spaces_loose
      spaces_loose << params[:space]
      @quotation.assign_attributes(spaces_loose: spaces_loose.uniq)
    elsif params[:category] == "services"
      spaces_services = @quotation.spaces_services
      spaces_services << params[:space]
      @quotation.assign_attributes(spaces_services: spaces_services.uniq)
    elsif params[:category] == "custom_elements"
      spaces_custom = @quotation.spaces_custom
      spaces_custom << params[:space]
      @quotation.assign_attributes(spaces_custom: spaces_custom.uniq)
    elsif params[:category] == "custom_furniture"
      spaces_custom_furniture = @quotation.spaces_custom_furniture
      spaces_custom_furniture << params[:space]
      @quotation.assign_attributes(spaces_custom_furniture: spaces_custom_furniture.uniq)
    end

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # remove a space and all of its jobs
  def delete_space
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    
    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    if params[:category] == "wardrobe"
      spaces = @quotation.spaces
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces: spaces.uniq)
      @quotation.modular_jobs.where(space: params[:space], category: "wardrobe").destroy_all
      @quotation.extra_jobs.where(category: 'wardrobe', space: params[:space]).destroy_all
    elsif params[:category] == "kitchen"
      spaces = @quotation.spaces_kitchen
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces_kitchen: spaces.uniq)
      @quotation.modular_jobs.where(space: params[:space], category: "kitchen").destroy_all
      @quotation.appliance_jobs.where(space: params[:space]).destroy_all
      @quotation.extra_jobs.where(category: 'kitchen', space: params[:space]).destroy_all
    elsif params[:category] == "loose_furniture"
      spaces = @quotation.spaces_loose
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces_loose: spaces.uniq)
      @quotation.boqjobs.where(space: params[:space]).destroy_all
    elsif params[:category] == "services"
      spaces = @quotation.spaces_services
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces_services: spaces.uniq)
      @quotation.service_jobs.where(space: params[:space]).destroy_all
    elsif params[:category] == "custom_elements"
      spaces = @quotation.spaces_custom
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces_custom: spaces.uniq)
      @quotation.custom_jobs.where(space: params[:space]).destroy_all
    elsif params[:category] == "custom_furniture"
      spaces = @quotation.spaces_custom_furniture
      spaces.delete(params[:space])
      @quotation.assign_attributes(spaces_custom_furniture: spaces.uniq)
      @quotation.shangpin_jobs.where(space: params[:space]).destroy_all
    end

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # remove a tab eg modular kitchen, loose furniture etc
  def delete_section
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    if params[:category].include?("wardrobe")
      @quotation.assign_attributes(spaces: [])
      @quotation.modular_jobs.where(category: "wardrobe").destroy_all
      @quotation.extra_jobs.where(category: 'wardrobe').destroy_all
      @quotation.boq_global_configs.where(category: "wardrobe").destroy_all
    end
    if params[:category].include?("kitchen")
      @quotation.assign_attributes(spaces_kitchen: [])
      @quotation.modular_jobs.where(category: "kitchen").destroy_all
      @quotation.appliance_jobs.destroy_all
      @quotation.extra_jobs.where(category: 'kitchen').destroy_all
      @quotation.boq_global_configs.where(category: "kitchen").destroy_all
    end
    if params[:category].include?("loose_furniture")
      @quotation.assign_attributes(spaces_loose: [])
      @quotation.boqjobs.destroy_all
    end
    if params[:category].include?("services")
      @quotation.assign_attributes(spaces_services: [])
      @quotation.service_jobs.destroy_all
    end
    if params[:category].include?("custom_jobs")
      @quotation.assign_attributes(spaces_custom: [])
      @quotation.custom_jobs.destroy_all
    end
    if params[:category].include?("custom_furniture")
      @quotation.assign_attributes(spaces_custom_furniture: [])
      @quotation.shangpin_jobs.destroy_all
    end

    if @quotation.save
      render json: @quotation, serializer: QuotationWithJobsSerializer
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # get the customization data of a modular job
  def customization
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project)) ||  (current_user.has_role?(:customer) &&
      current_user.projects.include?(@project)) ||  (current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    @modular_job = @quotation.modular_jobs.find(params[:modular_job_id])
    render json: @modular_job, serializer: ModuleCustomizationSerializer
  end

  # Import an MKW layout into a space in a BOQ.
  def import_layout
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    unless params[:category].present? && params[:space].present? && params[:mkw_layout_id].present?
      return render json: {message: 'category, space and mkw_layout_id parameters must be present.'}, status: 400
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @mkw_layout = MkwLayout.find params[:mkw_layout_id]
    unless @mkw_layout.addons_eligible_for_share?
      return render json: { message: "This layout cannot be imported because it has missing mandatory addons or invalid addons. Please edit the layout." }, status: :unprocessable_entity
    end
    @quotation = @mkw_layout.export_to_quotation(@quotation, params[:category], params[:space])
    @quotation.delete_invisible_line_items
    @quotation.recalculate

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # Import a Shangpin layout into a space in a BOQ.
  def import_shangpin_layout
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end
    unless params[:space].present? && params[:shangpin_layout_id].present?
      return render json: {message: 'space and shangpin_layout_id parameters must be present.'}, status: 400
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    @shangpin_layout = ShangpinLayout.find params[:shangpin_layout_id]
    @quotation = @shangpin_layout.export_shangpin_jobs(@quotation, params[:space])
    @quotation.recalculate

    render json: @quotation.reload, serializer: QuotationWithJobsSerializer
  end

  # works for loose furniture section only
  # Given the product categories (and qty for each category) and target price, generate boqjobs
  # in the given space of the BOQ.
  def generate_smart_quotation
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    return_value = SmartBoqGenerator.new(@quotation, params[:category_data], params[:target_price]).populate_boq(params[:space])
    if return_value.class.to_s == "Quotation"
      render json: return_value.reload, serializer: QuotationWithJobsSerializer
    else
      render json: {message: "#{return_value}"}, status: :unprocessable_entity
    end
  end

  # import an excel generated by KDmax design application
  def import_kdmax_excel
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    # IMP - make sure no can game this parameter - we use this in send.
    # DO NOT remove this check!!!
    unless ["wardrobe","kitchen"].include?(params[:category])
      return render json: {message: "Illegal category parameter detected"}, status: 400
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    errors = []
    str = params[:attachment].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    # long name reason - so that no 2 users' simultaneously uploaded excel file get the same name, causing errors.
    filename = "kdmax#{rand(1..1000000)}#{Time.now.to_i}.xlsx"
    filepath = Rails.root.join("tmp").join(filename)
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end

    # filepath = "/Users/arunoday/Downloads/kdmax_excel.xlsx"
    workbook = Roo::Spreadsheet.open filepath.to_s
    worksheet = workbook.sheet("Order")

    headers = Hash.new
    worksheet.row(5).each_with_index do |header,i|
      headers[header.downcase&.strip] = i
    end

    ((worksheet.first_row + 5)..worksheet.last_row).each do |row|
      error_flag = false
      boq_global_config = @quotation.boq_global_configs.where(category: params[:category]).last
      module_code = worksheet.row(row)[headers['modelno']]
      width = worksheet.row(row)[headers['width']]
      depth = worksheet.row(row)[headers['depth']]
      height = worksheet.row(row)[headers['height']]
      shade_code = worksheet.row(row)[headers['door color']]
      quantity = worksheet.row(row)[headers['quantity']]
      kitchen_category_name = params[:category] == "kitchen" ? get_kitchen_category(worksheet, row) : nil
      # check if module exists
      next unless module_code.present? && module_code.first(2)=="AR"  #only import when code has prefix AR
      product_module = ProductModule.send(params[:category]).find_by(code: module_code)
      if product_module.blank?
        errors.push({code: module_code, message: "No module with this code was found"})
        error_flag = true
      else
        # check if module dimensions match
        unless product_module.width == width
          errors.push({code: module_code, message: "Dimensions do not match with database values. Given: width: #{width}. Actual: width: #{product_module.width}."})
          error_flag = true
        end
      end
      # check if quantity exists and is positive
      unless quantity.to_i > 0
        errors.push({code: module_code, message: "Quantity is not greater than 0."})
        error_flag = true
      end
      # check if shade with given code exists
      unless Shade.find_by(code: shade_code).present?
        shade_code = boq_global_config.shutter_shade_code
        errors.push({code: shade_code, message: "No shade with the given code was found. Using global value."})
        # error_flag = true   # allow import even if shades do not match, but use the global variable value
      end

      if error_flag
        next
      else
        shade = Shade.find_by_code(shade_code)
        shutter_finish = nil
        if shade.present?
          shutter_finish = shade.shutter_finishes.first
        else
          shutter_finish = ShutterFinish.find_by(name: boq_global_config.shutter_finish)
        end
        options = {
          shutter_finish: shutter_finish.name,
          shutter_shade_code: shade_code,
          kitchen_category: kitchen_category_name
        }
        section = Section.public_send("modular_#{params[:category]}")
        quantity.to_i.times do
          modular_job = @quotation.modular_jobs.build(product_module: product_module, category: params[:category], space: params[:space])
          modular_job.import_module(product_module, 1, section.id, params[:space], options)
        end
      end
    end

    if @quotation.save
      hash_to_render = QuotationWithJobsSerializer.new(@quotation).serializable_hash
      render json: {quotation: hash_to_render.merge(errors: errors)}
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def import_shangpin_excel
    unless current_user.has_any_role?(:admin, :community_manager, :city_gm, :design_manager, :business_head) || (current_user.has_role?(:designer) &&
      current_user.assigned_projects.include?(@project))
      return render json: {message: 'Unauthorized.'}, status: :unauthorized
    end

    unless @quotation.can_edit?
      return render json: {message: "BOQ is in handover stage, and cannot be edited."}, status: :unauthorized
    end

    # long name reason - so that no 2 users' simultaneously uploaded excel file get the same name, causing errors.
    filename = "shangpin#{rand(1..1000000)}#{Time.now.to_i}.xlsx"
    filepath = Rails.root.join("tmp").join(filename)
    str = params[:attachment].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    File.open(filepath, "wb") do |f|
      f.write(Base64.decode64(str))
      f.close
    end
    begin
      workbook = Roo::Spreadsheet.open filepath.to_s
      creek_workbook = Creek::Book.new filepath.to_s
    rescue StandardError, ArgumentError
      render_unreadable_excel
      return
    end

    errors = []
    if ["1DetailedQuoteForm", "1DetailedQuoteForm-1"].include? params[:filename]
      errors = ShangpinImportModule::ShangpinImport.new(@quotation, params[:space], workbook).read_detailed_quote_excel
    elsif params[:filename] == "1QuoteForm"
      errors = ShangpinImportModule::ShangpinImport.new(@quotation, params[:space], workbook, creek_workbook).read_quote_excel
    elsif params[:filename] == "1DoorQuoteForm"
      errors = ShangpinImportModule::ShangpinImport.new(@quotation, params[:space], workbook).read_door_quote_excel
    elsif params[:filename] == "1WardrobeSetQuoteForm"
      errors = ShangpinImportModule::ShangpinImport.new(@quotation, params[:space], workbook).read_wardrobe_set_quote_excel
    end

    if @quotation.reload
      hash_to_render = QuotationWithJobsSerializer.new(@quotation).serializable_hash
      render json: {quotation: hash_to_render.merge(errors: errors)}
    else
      render json: {message: @quotation.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def download_pdf
    if params[:download_type].present?
      if (@quotation.boqjobs.present?|| @quotation.shangpin_jobs.present? || @quotation.modular_jobs.present? || @quotation.custom_jobs.present? || @quotation.appliance_jobs.present? ||@quotation.extra_jobs.present? ) && @quotation.service_jobs.present?
        boq_encoded_file = @quotation.generate_quotation_pdf(params[:download_type])
        boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
        services_encoded_file = @quotation.generate_services_pdf
        service_name = "Service-"+@quotation.reference_number&.gsub("/","-").to_s+".pdf"
      elsif (@quotation.boqjobs.present?|| @quotation.shangpin_jobs.present? || @quotation.modular_jobs.present? || @quotation.custom_jobs.present? || @quotation.appliance_jobs.present? ||@quotation.extra_jobs.present? ) && @quotation.service_jobs.empty?
        boq_encoded_file = @quotation.generate_quotation_pdf(params[:download_type])
        boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
      elsif @quotation.service_jobs.present?
        services_encoded_file = @quotation.generate_services_pdf
        service_name = "Service-"+@quotation.reference_number&.gsub("/","-").to_s+".pdf"
      end
      render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name, service_base_64: services_encoded_file, service_name: service_name}
    else
      render json: {message: "Please Select Atleast one Type"}, status: 404
    end
  end

  def download_v2_pdf
    if params[:download_type].present?
      boq_encoded_file = @quotation.generate_quotation_v2_pdf(params[:download_type])
      boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
      render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name}
    else
      render json: {message: "Please Select Atleast one Type"}, status: 404
    end
  end

  def download_v2_pdf_office
    if request.headers["X-WWW-API-KEY"] == 'RR8xqcXh199vzW5ad3uF2xBT'
      if params[:download_type].present?
        boq_encoded_file = @quotation.generate_quotation_v2_pdf(params[:download_type])
        boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
        render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name}
      else
        render json: {message: "Please Select Atleast one Type"}, status: 404
      end
    else
      render json: {message: "You need to sign in or sign up before continuing."}, status: 401      
    end
  end

  def download_boq_pdf
    boq_encoded_file = @quotation.generate_quotation_pdf("boq")
    boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
    services_encoded_file = @quotation.generate_services_pdf
    service_name = "Service-"+@quotation.reference_number&.gsub("/","-").to_s+".pdf"
    render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name, service_base_64: services_encoded_file, service_name: service_name}
  end

  def download_cheat_sheet
    quotation_content = BoqForFinancePdf.new(@quotation, @quotation.project)
    filepath = Rails.root.join("tmp","quotation.pdf")
    boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"
    quotation_content.render_file(filepath)
    boq_encoded_file = Base64.encode64(File.open(filepath).to_a.join)
    render json: {quotation_base_64: boq_encoded_file, boq_name: boq_name}
  end


  def boq_line_item_report
    case current_user.roles.last.name
    when "lead_head", "finance", "category_head" 
      @quotations = Quotation.shared
    when "city_gm"
      cm_ids = current_user.cms.pluck(:id)
      @quotations = Quotation.shared.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})     
    when "design_manager"
      cm_ids = current_user.dm_cms.pluck(:id)
      @quotations = Quotation.shared.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})      
    when  "community_manager"
      cm_ids = [current_user.pluck(:id)]
      @quotations = Quotation.shared.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})      
    when "business_head"
      cm_ids = User.with_role(:community_manager).pluck(:id)
      @quotations = Quotation.shared.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})      
    else
      raise CanCan::AccessDenied
    end

    BoqLineItemReportJob.perform_later(current_user, @quotations.pluck(:id))
  end

  # for downloading excel with BOQ details.
  def download_boq_report
    case current_user.roles.last.name
    when "admin", "lead_head" 
      @quotations = Quotation.all
    when "designer"
      assigned_active_project_ids = current_user.assigned_projects.joins(:designer_projects).where(designer_projects: {active: true}).pluck(:id).uniq
      @quotations = Quotation.where(project_id: assigned_active_project_ids)
    when "city_gm"
      cm_ids = current_user.cms.pluck(:id)
      @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
    when "design_manager"
      cm_ids = current_user.dm_cms.pluck(:id)
      @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
    when  "community_manager"
      cm_ids = current_user.id
      @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
    when "business_head"
      cm_ids = User.with_role(:community_manager).pluck(:id)
      @quotations = Quotation.joins(project: :lead).where(leads: {assigned_cm_id: cm_ids})
    when "sales_manager"
       lead_ids = current_user.referrers.includes(:referrer_leads).distinct.pluck("leads.id")
       lead_ids << Lead.where(created_by: current_user).distinct
       @quotations = Quotation.joins(project: :lead).where(leads: {id: lead_ids})
    else
      raise CanCan::AccessDenied
    end

    QuotationDownloadJob.perform_later(@quotations.pluck(:id), current_user)
    # filepath = @quotation.generate_boq_report
    # byebug
    # excel_workbook_string = File.read filepath
    # boq_name = @quotation.reference_number&.gsub("/","-").to_s+".pdf"

    # render json: {boq_name: boq_name, quotation_base_64: Base64.strict_encode64(excel_workbook_string)}
  end
 
  def change_wip_status
    if params[:approve] == true
      if @quotation.wip_status == "pre_10_percent"
        @quotation.update(per_10_approved_at: Time.zone.now, per_10_approved_by_id: current_user.id)
        @quotation.clone(@quotation.discount_value) if !@quotation.copied
        @new_boq = @quotation.child_quotations&.last
        @cm_approval = TaskEscalation.find_by(ownerable: @quotation, task_set: TaskSet.find_by_task_name("CM Approval for less than 10% Payment"), status: "no")
        @cm_approval.update(status: "yes", completed_at: DateTime.now) if @cm_approval.present?
        if @new_boq.present?
          @task_set_final = TaskEscalation.find_by(ownerable: @new_boq, task_set: TaskSet.find_by_task_name("Create Final BOQ"))
          TaskEscalation.invoke_task(["Create Final BOQ"], "10% - 40%", @new_boq) if !@task_set_final.present?
          TaskEscalation.mark_done_task("Create Final BOQ", "10% - 40%", @new_boq) if !@task_set_final.present?
          @new_boq.update(wip_status: "10_50_percent")
          # @task_of_site_measurement = TaskEscalation.find_by(ownerable: @quotation.project, task_set: TaskSet.find_by_task_name("Request site measurement"))
          # TaskEscalation.invoke_task(["Request site measurement"], "10% - 40%", @quotation.project) if !@task_of_site_measurement
        end
      else
        @quotation.update(per_50_approved_at: Time.zone.now, per_50_approved_by_id: current_user.id, payment_50_comp_date: Time.zone.now)
        @cm_approval = TaskEscalation.find_by(ownerable: @quotation, task_set: TaskSet.find_by_task_name("CM Approval for less than 40% Payment"), status: "no")
        TaskEscalation.mark_done_task("CM Approval for less than 40% Payment", "10% - 40%" ,@quotation) if @cm_approval.present?
        # @cm_approval.update(status: "yes", completed_at: DateTime.now) if @cm_approval.present?
      end
    end
    render json: {message: "Status Updated"}
  end

  def update_remarks
    if @quotation.update(remark: params[:quotation][:remark])
      render json: {message: "The remark is updated successfully"}, status: 200
    else
      render json: {message: "The remark did not updated"}, status: 400
    end
  end

  #Final Proposal Acceptance by CM and category
  # No longer needed can be destroyed once everthing is working fine
  # def cm_category_approval
  #   if current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES, :community_manager)
  #     if current_user.has_role?(:community_manager)
  #       @quotation.update(cm_approval: params[:approve], cm_approval_by_id: current_user.id, cm_approval_at: Time.zone.now)
  #       @cm_task_set = TaskEscalation.find_by(ownerable: @quotation, task_set: TaskSet.find_by_task_name("Approve Final BOQ by CM"))
  #       @cm_task_set.update(status: "yes", completed_at: DateTime.now) if @cm_task_set.present?
  #       pending_task = TaskEscalation.check_pending_task(@quotation)
  #       if params[:approve] && !pending_task && @quotation.category_approval != nil && @quotation.category_approval != false
  #         TaskEscalation.invoke_task(["Proposal Sharing"], "10% - 40%", @quotation)
  #       elsif !params[:approve]
  #         @quotation.task_escalations.where(status: "no").destroy_all
  #       end
  #     elsif current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
  #       @quotation.update(category_approval: params[:approve], category_appoval_by_id: current_user.id, category_appoval_at: Time.zone.now)
  #       @category_task_set = TaskEscalation.find_by(ownerable: @quotation, task_set: TaskSet.find_by_task_name("Approve Final BOQ by Category"), status: "no")
  #       @category_task_set.update(status: "yes", completed_at: DateTime.now) if @category_task_set.present?
  #       pending_task = TaskEscalation.check_pending_task(@quotation)
  #       if params[:approve] && !pending_task && @quotation.cm_approval != nil && @quotation.cm_approval != false
  #         TaskEscalation.invoke_task(["Proposal Sharing"], "10% - 40%", @quotation)
  #       elsif !params[:approve]
  #         @quotation.task_escalations.where(status: "no").destroy_all
  #       end
  #     end
  #     @quotation.clone if !@quotation.copied && !params[:approve]
  #     proposal = @quotation.proposals.last
  #     approved_quotation_count = proposal.quotations.where(cm_approval: true, category_approval: true).count
  #     proposal.update_attributes!(proposal_status: "pending") if approved_quotation_count == proposal.quotations.count
  #     UserNotifierMailer.quotation_cm_category_approval(@quotation, current_user.roles.first.name).deliver_now!
  #     if params[:approve] == true
  #       msg = "Quotation Approved"
  #     else
  #       msg = "Quotation Rejected"
  #     end
  #     render json: {message: msg}, status: 200
  #   else
  #     render json: {message: "You are not authorized to perform this action"}, status: 403
  #   end
  # end

  def quotations_purchase_orders
    @quotations = Quotation.where(quotations: {wip_status: ["10_50_percent"], } ).where("paid_amount > total_amount*0.5")

    if @quotations.present?
      @quotations = paginate @quotations
      events = FjaPoQuotationSerializer.new(@quotations.includes(project: :lead)).serializable_hash

      temp_hash = {}
      temp_hash[:leads] = events.map{|event| event[:attributes]}

      render json: temp_hash
    else
      render json: {message: "No Quotations Found."}, status: 400
    end
  end

  # sli creation screen
  # global level, not specific to any project/quotation
  def pre_production_quotation_for_sli
    # quotation_ids = []
    # unseen_quotations = Quotation.pre_production.joins(:task_escalations).where(task_escalations: {task_set: TaskSet.sli_creation_task, status: "no", seen: false}).pluck(:id).uniq
    # seen_quotations = Quotation.pre_production.joins(:task_escalations).where(task_escalations: {task_set: TaskSet.sli_creation_task, status: "no", seen: true}).pluck(:id).uniq
    # other_quotation = Quotation.pre_production.joins(:task_escalations).where(task_escalations: {task_set: TaskSet.sli_creation_task, status: "yes"}).pluck(:id).uniq
    # quotation_ids.push unseen_quotations
    # quotation_ids.push seen_quotations
    # quotation_ids.push other_quotation
    # quotation_ids = quotation_ids.flatten.uniq
    # @quotations = Quotation.where_with_order(:id, quotation_ids)
    @quotations = Quotation.pre_production.order(created_at: :desc).uniq
    if params[:search].present?
      projects_ids = Project.all.search_projects(params[:search]).pluck(:id)
      @quotations = @quotations.where(project_id: projects_ids)
    end
    if @quotations.present?
      paginate json: @quotations, each_serializer: PreProductionSliQuotationsSerializer, user_id: current_user.id
    else
      render json: {message: "No Quotation found"}, status: 204
    end
  end

  # sli creation screen
  # line items and sub line items for a given BOQ
  def pre_production_quotation_for_sli_line_items
    task_escalation = @quotation.task_escalations.find_by(task_set: TaskSet.sli_creation_task)
    task_escalation.update!(seen: true) if task_escalation.present?
    render json: @quotation, serializer: QuotationWithSliSerializer
  end


  def quotations_po
    if @quotation.present?
      render json: @quotation, serializer: QuotationPoSerializer
    else
      render json: {message: "No Quotation Found."}, status: 404
    end
  end

  # for vendor selection
  # global
  def pre_production_quotations
    # must apply the condition so that only those BOQs that have the SLIs created are available for vendor selection
    @quotations = Quotation.vendor_selection.distinct.order(:id) # removed sort because it will convert ActiveRecord::Relation to Array. : Deepak
    if params[:search].present?
      projects_ids = Project.all.search_projects(params[:search]).pluck(:id)
      @quotations = @quotations.where(project_id: projects_ids)
    end
    paginate json: @quotations, each_serializer: PreProductionVendorSelectionSerializer
  end

  # for vendor selection
  def pre_production_quotations_line_items
    task_escalation = @quotation.task_escalations.find_by(task_set: TaskSet.vendor_selection_task)
    task_escalation.update!(seen: true) if task_escalation.present?

    render json: @quotation, serializer: QuotationWithSliVendorSelectionSerializer
  end

  def pre_production_quotations_vendor_wise_line_items
    render json: @quotation, serializer: QuotationWithVendorWiseSliSerializer
  end

  def change_sli_flag
    @quotation.update(sli_flag: params[:status])
    if params[:status] != "draft"
      TaskEscalation.mark_done_task("SLI Creation", "50%", @quotation)
    end
    render json: {message: "updated sucessfully"}, status: 200
  end

  # for PO release
  def pre_production_quotations_po_release
    # must apply the condition so that only those BOQs that have undergone vendor selection are available for PO release.
    @quotations = Quotation.po_release
    if params[:search].present?
      projects_ids = Project.all.search_projects(params[:search]).pluck(:id)
      @quotations = @quotations.where(project_id: projects_ids)
    end
    paginate json: @quotations, each_serializer: PreProductionPoReleaseSerializer
  end

  # for PI upload
  def pre_production_quotations_pi_upload
    # must apply the condition so that only those BOQs that have undergone PO release are available for PI upload.
    @quotations = Quotation.pi_upload
    if params[:search].present?
      projects_ids = Project.all.search_projects(params[:search]).pluck(:id)
      @quotations = @quotations.where(project_id: projects_ids)
    end

    paginate json: @quotations, each_serializer: PreProductionPiUploadSerializer
  end

  # for Payment Release
  def pre_production_quotations_payment_release
    # must apply the condition so that only those BOQs that have had PIs uploaded against them are available.
    @quotations = Quotation.payment_release
    if params[:search].present?
      projects_ids = Project.all.search_projects(params[:search]).pluck(:id)
      @quotations = @quotations.where(project_id: projects_ids)
    end

    paginate json: @quotations, each_serializer: PreProductionPaymentReleaseSerializer
  end

  # for Payment Release
  #for a quotation
  def quotations_payment_release_line_items
    render json: @quotation, serializer: PaymentReleaseLineItemSerializer
  end

  def change_category_seen_status
    unless current_user.has_any_role?(:category_head, *Role::CATEGORY_ROLES)
      return render json: {message: "You are not authorized to perform this action"}, status: 403
    end

    if params[:id].present?
      quotation = Quotation.find params[:id]
      quotation.update(seen_by_category: true)
      return render json: {message: "Updated"}, status: 200
    else
      return render json: {message: "Please select Quotation"}, status: 403
    end
  end

  def quotation_vendors
    if @quotation.present?
      vendor_ids = @quotation.purchase_orders.where(status: "released").pluck(:vendor_id).uniq
      render json: Vendor.where(id: vendor_ids).select(:id,:name).as_json, status: 200
    else
      render json: {message: "Quotation not found"}, status: 404
    end
  end

  def purchase_orders
    if @quotation.present?
        return render json: @quotation.purchase_orders, each_serializer: ProjectPurchaseOrderSerializer
    else
      render json: {message: "No Quotaion Found"}, status: 404
    end
  end

  ### clubbing line items and creating on clubbed job - under this we will add jobelement
  def create_clubbed_jobs
    if @quotation.present?
      if params[:line_items].present?
        boqjobs_without_added_slis = []
        modular_jobs_without_added_slis = []
        service_jobs_without_added_slis = []
        custom_jobs_without_added_slis = []
        appliance_jobs_without_added_slis = []
        extra_jobs_without_added_slis = []
        shangpin_jobs_without_added_slis = []
        sub_line_present = false
        if params[:line_items][:boqjobs].present?
          params[:line_items][:boqjobs].each do |boqjob_id|
            boqjob = Boqjob.find_by_id(boqjob_id)
            if boqjob.present? and boqjob.job_elements.empty?
              boqjobs_without_added_slis << boqjob
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:modular_jobs].present?
          params[:line_items][:modular_jobs].each do |modular_job_id|
            modular_job = ModularJob.find_by_id(modular_job_id)
            if modular_job.present? and modular_job.job_elements.empty?
              modular_jobs_without_added_slis << modular_job
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:shangpin_jobs].present?
          params[:line_items][:shangpin_jobs].each do |shangpin_job_id|
            shangpin_job = ShangpinJob.find_by_id(shangpin_job_id)
            if shangpin_job.present? and shangpin_job.job_elements.empty?
              shangpin_jobs_without_added_slis << shangpin_job
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:service_jobs].present?
          params[:line_items][:service_jobs].each do |service_job_id|
            service_job = ServiceJob.find_by_id(service_job_id)
            if service_job.present? and service_job.job_elements.empty?
              service_jobs_without_added_slis << service_job
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:custom_jobs].present?
          params[:line_items][:custom_jobs].each do |custom_job_id|
            custom_job = CustomJob.find_by_id(custom_job_id)
            if custom_job.present? and custom_job.job_elements.empty?
              custom_jobs_without_added_slis << custom_job
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:appliance_jobs].present?
          params[:line_items][:appliance_jobs].each do |appliance_job_id|
            appliance_job = ApplianceJob.find_by_id(appliance_job_id)
            if appliance_job.present? and appliance_job.job_elements.empty?
              appliance_jobs_without_added_slis << appliance_job
            else
              sub_line_present = true
            end
          end
        end
        if params[:line_items][:extra_jobs].present?
          params[:line_items][:extra_jobs].each do |extra_job_id|
            extra_job = ExtraJob.find_by_id(extra_job_id)
            if extra_job.present? and extra_job.job_elements.empty?
              extra_jobs_without_added_slis << extra_job
            else
              sub_line_present = true
            end
          end
        end
        if sub_line_present
          return render json: {error: "Please select line items without SLI's"}, status: 422
        else
          if params[:label].present? and (extra_jobs_without_added_slis.present? || appliance_jobs_without_added_slis.present? || custom_jobs_without_added_slis.present? ||
            service_jobs_without_added_slis.present? || modular_jobs_without_added_slis.present? || boqjobs_without_added_slis.present? || shangpin_jobs_without_added_slis.present?)

            clubbed_job = @quotation.clubbed_jobs.create(label: params[:label])
            [boqjobs_without_added_slis,modular_jobs_without_added_slis,service_jobs_without_added_slis,custom_jobs_without_added_slis,appliance_jobs_without_added_slis,extra_jobs_without_added_slis, shangpin_jobs_without_added_slis].flatten.each do |line_item|
              line_item.update(clubbed_job: clubbed_job)
            end

          end

          if clubbed_job.present? and params[:sub_line_items].present?
            params[:sub_line_items].each do |sub_line_item|
              job_element = clubbed_job.job_elements.create(element_name: sub_line_item[:name], quantity: sub_line_item[:quantity],
                          unit: sub_line_item[:unit], rate: sub_line_item[:rate], quotation_id: @quotation.id, vendor_product_id: sub_line_item[:vendor_product_id])
              if job_element.present?
                job_element.job_element_vendors.create(vendor: Vendor.find_by_id(sub_line_item[:vendor_id]), cost: sub_line_item[:rate],
                  tax_percent: sub_line_item[:tax_percent], tax_type: sub_line_item[:tax_type], unit_of_measurement: sub_line_item[:unit],
                  quantity: sub_line_item[:quantity])
              end
            end
          end
        end
      end
      render json: @quotation, serializer: QuotationWithSliSerializer
    else
      render json: {message: "No Quotaion Found"}, status: 404
    end
  end

  def material_tracking_boq
    quotations = Quotation.where(id: PurchaseOrder.where(status: "released").pluck(:quotation_id).uniq)
    # Quotation.joins(:purchase_orders).where(purchase_orders: {status: "released"}).uniq.count
    render json: quotations, each_serializer: MaterialTrackinSerializer
  end

  # Will get Final approved Quotations.
  def final_approved_quotations
    quotations = @project.quotations&.project_handover_quotations&.uniq&.select(:id, :reference_number)
    render json: {quotations: quotations}
  end

  # Each line item for the quotation will be available from here
  # It includes production drawing details and splitting details
  def line_items_for_splitting
    render json: QuotationSplitSerializer.new(@quotation).serializable_hash, status: 200
  end

  # Will get 100% splitted quotation
  def splitted_quotations
    quotations = Quotation.completely_splitted_quotations(@project).select(:id, :reference_number) #.quotations.splitted_quotations.select(:id, :reference_number)
    render json: {quotations: quotations}
  end

  def margin_report
    MarginReportDownloadJob.perform_later(current_user)
    render json: {message: "You will get margin report through mail"}, status: 200
  end

  # Each line item for the quotation will be available from here
  # It includes Cutting List details and BOM details
  def line_items_for_cutting_list
      render json: QuotationCuttingListSerializer.new(@quotation).serializable_hash, status: 200
  end

  def create_multi_slis
    if @quotation.present?
      if params[:line_items].present?
        boqjobs = []
        modular_jobs = []
        service_jobs = []
        custom_jobs = []
        appliance_jobs = []
        extra_jobs = []
        clubbed_jobs = []
        shangpin_jobs = []
        if params[:line_items][:boqjobs].present?
          params[:line_items][:boqjobs].each do |boqjob_id|
            boqjob = Boqjob.find_by_id(boqjob_id)
            if boqjob.present? and boqjob.clubbed_job.nil?
              boqjobs << boqjob
            end
          end
        end
        if params[:line_items][:modular_jobs].present?
          params[:line_items][:modular_jobs].each do |modular_job_id|
            modular_job = ModularJob.find_by_id(modular_job_id)
            if modular_job.present? and modular_job.clubbed_job.nil?
              modular_jobs << modular_job
            end
          end
        end
        if params[:line_items][:service_jobs].present?
          params[:line_items][:service_jobs].each do |service_job_id|
            service_job = ServiceJob.find_by_id(service_job_id)
            if service_job.present? and service_job.clubbed_job.nil?
              service_jobs << service_job
            end
          end
        end
        if params[:line_items][:custom_jobs].present?
          params[:line_items][:custom_jobs].each do |custom_job_id|
            custom_job = CustomJob.find_by_id(custom_job_id)
            if custom_job.present? and custom_job.clubbed_job.nil?
              custom_jobs << custom_job
            end
          end
        end
        if params[:line_items][:shangpin_jobs].present?
          params[:line_items][:shangpin_jobs].each do |shangpin_job_id|
            shangpin_job = ShangpinJob.find_by_id(shangpin_job_id)
            if shangpin_job.present? and shangpin_job.clubbed_job.nil?
              shangpin_jobs << shangpin_job
            end
          end
        end
        if params[:line_items][:appliance_jobs].present?
          params[:line_items][:appliance_jobs].each do |appliance_job_id|
            appliance_job = ApplianceJob.find_by_id(appliance_job_id)
            if appliance_job.present? and appliance_job.clubbed_job.nil?
              appliance_jobs << appliance_job
            end
          end
        end
        if params[:line_items][:extra_jobs].present?
          params[:line_items][:extra_jobs].each do |extra_job_id|
            extra_job = ExtraJob.find_by_id(extra_job_id)
            if extra_job.present? and extra_job.clubbed_job.nil?
              extra_jobs << extra_job
            end
          end
        end
        if params[:line_items][:clubbed_jobs].present?
          params[:line_items][:clubbed_jobs].each do |clubbed_job_id|
            clubbed_job = ClubbedJob.find_by_id(clubbed_job_id)
            if clubbed_job.present?
              clubbed_jobs << clubbed_job
            end
          end
        end

        if (clubbed_jobs.present? || extra_jobs.present? || appliance_jobs.present? || custom_jobs.present? ||
          service_jobs.present? || modular_jobs.present? || boqjobs.present? || shangpin_jobs.present?)

          [clubbed_jobs,extra_jobs,appliance_jobs,custom_jobs,service_jobs,modular_jobs,boqjobs, shangpin_jobs].flatten.each do |line_item|
            params[:sub_line_items].each do |sub_line_item|
              job_element = line_item.job_elements.create(element_name: sub_line_item[:name], quantity: sub_line_item[:quantity],
                unit: sub_line_item[:unit], rate: sub_line_item[:rate], quotation_id: @quotation.id, vendor_product_id: sub_line_item[:vendor_product_id])
              if job_element.present?
                job_element.job_element_vendors.create(vendor: Vendor.find_by_id(sub_line_item[:vendor_id]), cost: sub_line_item[:rate],
                  tax_percent: sub_line_item[:tax_percent], tax_type: sub_line_item[:tax_type], unit_of_measurement: sub_line_item[:unit],
                  quantity: sub_line_item[:quantity])
              end
            end
          end
        else
          params[:sub_line_items].each do |sub_line_item|
            job_element = JobElement.create(element_name: sub_line_item[:name], quantity: sub_line_item[:quantity],
              unit: sub_line_item[:unit], rate: sub_line_item[:rate], quotation_id: @quotation.id, vendor_product_id: sub_line_item[:vendor_product_id])
            if job_element.present?
              job_element.job_element_vendors.create(vendor: Vendor.find_by_id(sub_line_item[:vendor_id]), cost: sub_line_item[:rate],
                  tax_percent: sub_line_item[:tax_percent], tax_type: sub_line_item[:tax_type], unit_of_measurement: sub_line_item[:unit],
                  quantity: sub_line_item[:quantity])
            end
          end
        end
      end
      render json: @quotation, serializer: QuotationWithSliSerializer
    else
      render json: {message: "No Quotaion Found"}, status: 404
    end
  end
  # from the kdmax excel, get the kitchen category. Check first column of row, if found, then return it.
  # else go up one row. repeat until found or reached first row.
  def get_kitchen_category(worksheet, row)
    return worksheet.row(row)[0] if row == 1 || worksheet.row(row)[0].present?
    get_kitchen_category(worksheet, row - 1)
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_quotation
    @quotation = Quotation.find(params[:id])
  end

  def quotaion_po
    quotation = Quotation.find params[:id]
    return render json: quotation.purchase_orders.where(status: params[:status]), each_serializer: PoQuotationSerializer
  end

  def add_duration
    quotation = Quotation.find_by_id(params[:id])
    if quotation.payment_50_comp_date.present?
      return render json: {message: "Duration can not be changed after 50% PAyment."}, status: 403
    end
    old_duration = quotation.duration.to_i
    quotation.update!(duration: params[:duration])
    new_duration = params[:duration].to_i
    UserNotifierMailer.duration_changed(quotation, old_duration, new_duration, current_user.roles.last.name).deliver_now!
    render json: {message: "Duration Updated"}, status: 200
  end

  private
    # from the kdmax excel, get the kitchen category. Check first column of row, if found, then return it.
    # else go up one row. repeat until found or reached first row.
    def get_kitchen_category(worksheet, row)
      return worksheet.row(row)[0] if row == 1 || worksheet.row(row)[0].present?
      get_kitchen_category(worksheet, row - 1)
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_quotation
      @quotation = Quotation.find(params[:id])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    # Only allow a trusted parameter "white list" through.
    def quotation_params
      params.require(:quotation).permit(:name, :terms, :net_amount, :total_amount, :status,
        :project_id, :user_id, :generation_date, :expiration_date, :expiration_in_days, :billing_address,
        :gross_amount, :customer_notes, :reference_number, :presentation_id, :spaces, :spaces_kitchen,
        :spaces_loose, :spaces_services, :remark,
        boqjobs_attributes: [:name, :quantity, :rate, :amount, :ownerable_type, :ownerable_id,
          :product_id, :section_id, :space],
        service_jobs_attributes: [:name, :service_code, :unit, :quantity, :base_rate, :installation_rate,
          :final_rate, :space, :ownerable_id, :ownerable_name, :service_activity_id],
        modular_jobs: [:name, :quantity, :rate, :amount, :space, :category, :dimensions,
          :core_material, :shutter_material, :shutter_finish, :shutter_shade_code, :skirting_config_type,
          :skirting_config_height, :door_handle_code, :shutter_handle_code, :hinge_type, :channel_type,
          :ownerable_type, :ownerable_id, :product_module_id, :section_id, :spaces]
       )
    end
end
