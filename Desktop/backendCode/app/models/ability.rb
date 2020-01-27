class Ability
  include CanCan::Ability

  def initialize(user)
    if user.nil?
      # if no user logged in, use a dummy user, see later
      user = User.new
    end
    alias_action :create, :read, :update, :destroy, :to => :crud

    cannot [:add_role, :remove_role, :update_role, :activate, :deactivate], User unless user.has_role? :admin
    cannot :approve_user, Lead unless user.has_role? :admin
    # All users should now have access to these end-points, so they can refer leads.
    can [:create_contact_lead, :create_broker_lead, :broker_lead_details, :single_broker_lead,
      :filter_details, :edit_broker_lead], Lead

    if user.has_role? :admin
      can :manage, :all
    elsif user.has_role? :designer
      # can :read, User, {id: User.all.joins(projects: :designer_projects).where(designer_projects: {designer_id: user.id}).uniq.pluck(:id) }
      can :manage, User, id: user.id
      can :manage, SiteMeasurementRequest
      can :manage, ProjectRequirement
      cannot :destroy, User
      can [:read, :create, :update], Project, { id: user.assigned_project_ids }   #improve after merge
      can [:read, :create, :update], Project, designer_projects: { id: user.designer_project_ids }  #improve after merge
      can [:read, :create, :update, :delete, :send_upload_sms], Floorplan, project: { id: user.assigned_project_ids }
      can :manage, Design, floorplan: {id: Floorplan.all.joins(project: :designers).where(users: {id: user.id}).distinct.pluck(:id)}
      can [:create, :read, :update], Comment
      can :manage, Quotation
      can :manage, Boqjob
      can :manage, City
      cannot :approve_design, Design
      can [:read, :products_for_catalog, :products_for_configuration, :categories_for_spaces,
        :configurations], Section
      can [:read, :all_product_list, :filter, :slider_ranges, :get_product_master_fabrics, :like,
        :get_product_master_sub_options, :get_product_catalogue_options, :get_product_variants, :get_product_variant_images], Product
      can :manage, InhouseCall
      can :manage, Lead
      can :manage, Presentation
      can :manage, Slide
      can :read, Brand
      can :manage, ModularProduct
      can [:read], ProductModule
      can :read, CarcassElement
      can :read, HardwareElement
      can [:read, :brand_list, :extras, :optional_addons_for_addons, :compulsory_addons,
        :optional_addons], Addon
      can :read, Tag
      can [:read, :list_modules, :appliance_types, :customizable_dimensions], ModuleType
      can :read, CarcassElementType
      can :read, HardwareElementType
      can [:read,:list_finishes, :list_shutter_materials], CoreMaterial
      can :read, CoreMaterialPrice
      can [:read,:list_configs], SkirtingConfig
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout, { created_by_id: user.id }
      can [:create, :read], MkwLayout
      can :manage, ShangpinLayout, { created_by_id: user.id }
      can [:create, :read], ShangpinLayout
      can [:read, :filter_data, :filter_handles], Handle
      can [:read,:list_shades], ShutterFinish
      can [:read, :matching_edge_banding_shade], Shade
      can :read, HardwareType
      can [:read, :kitchen_categories_module_type], KitchenCategory
      can :manage, CustomElement
      can :read, CombinedDoor
      can [:read, :matching_edge_banding_shade], EdgeBandingShade
      can :read, ServiceCategory
      can :read, ServiceSubcategory
      can :read, ServiceActivity
      can [:read, :filter_data, :filter_appliances], KitchenAppliance
      can :manage, CadDrawing
      can :manage, Payment
      can :manage, Project
      can :manage, BoqAndPptUpload
      can :manage, DpQuestionnaire
      can :manage, TaskSet
      can :manage, TaskEscalation
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :catalog_viewer
      can :manage, User, id: user.id
      can [:read, :products_for_catalog, :products_for_configuration, :categories_for_spaces,
        :configurations], Section
      can [:read, :all_product_list, :filter, :slider_ranges, :get_product_master_fabrics, :like,
        :get_product_master_sub_options, :get_product_catalogue_options, :get_product_variants, :get_product_variant_images], Product
    elsif user.has_role? :customer
      # can :manage, Floorplan, {id: Floorplan.all.joins(project: :user).where(users: {id: user.id}).uniq.pluck(:id) }
      can :read, Section
      can :manage, Boqjob
      can :manage, CoreMaterial
      can :manage, ShutterFinish
      can :manage, SkirtingConfig
      can :read, KitchenCategory
      can :manage, ModuleType
      can :manage, Quotation
      can :read, ModuleType
      can :read, CoreMaterial
      can :read, SkirtingConfig
      can :read, ServiceActivity
      can [:read, :filter_data, :filter_handles], Handle
      can [:read, :handle_list], ProductModule
      can [:read, :get_config, :list_of_spaces], BoqGlobalConfig
      can :manage, Floorplan, project: {id: user.project_ids }
      can :manage, Project, user_id: user.id
      cannot :assign_project, Project
      can :read, Design, {id: Design.all.joins(floorplan: :project).where(projects: {user_id: user.id}).distinct.pluck(:id) }
      can [:create, :read, :update], Comment
      can :manage, User, id: user.id
      can :approve_design, Design, {id: Design.all.joins(floorplan: :project).where(projects: {user_id: user.id}).distinct.pluck(:id) }
      can [:read, :get_shared_ppts_and_boqs, :get_shared_ppts], BoqAndPptUpload
      can :manage, TaskSet
      can :manage, TaskEscalation
      # can :read, User, {id: DesignerProject.all.joins(project: :user).where(users: {id: user.id}).uniq.pluck(:designer_id)}
    elsif user.has_role? :design_head
      can :read, Project
     can :read, Floorplan
     can :manage, Design
     can :assign_project, Project
     can :read, User, {id: User.with_role(:designer).pluck(:id)}
     can :manage, User, id: user.id
     can [:approve_user], Lead
     can [:create, :read, :update], Comment
     can [:read, :products_for_catalog, :products_for_configuration, :categories_for_spaces,
      :configurations], Section
     can [:read, :all_product_list, :filter, :slider_ranges, :like], Product
     can :manage, QuestionaireMasterItem
    elsif user.has_role? :lead_head
      can :manage, Lead
      can :manage, NoteRecord
      can :manage, User
      can :manage, LeadCampaign
      can :manage, LeadPriority
      can :manage, City
      can :read, CmMkwVariablePricing
      can :call_excel_report, InhouseCall
      can :download_payment_report, Payment
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :cs_agent
      can :manage, Lead
      can :manage, User, id: user.id
      can :manage, City
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :sitesupervisor
      can :manage, User, id: user.id
      can :manage, Quotation
      can :manage, Payment
      can :manage, Project
      can [:read, :update], Event
    elsif user.has_role? :finance
      can :manage, Lead
      can :manage, PaymentInvoice
      can :manage, User, id: user.id
      can :manage, Quotation
      can :manage, Payment
      can :manage, Project
      can :manage, TaskSet
      can :manage, TaskEscalation
      can :manage, PurchaseOrder
      can :read, Vendor
      can :download_pdf, ProjectBookingForm
      can :margin_report, Quotation
      # can :manage, PerformaInvoice
      # can :manage, PiPayment
      can [:read, :payment_approval, :vendor_payment_history, :vendor_payment_ledger], PiPayment
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :community_manager
      can :manage, :all
      # can :manage, User, id: user.id
      can [:manage, :gm_dashboard, :aws_city_cm_designer_data, :city_gm_cm_and_designer, :gm_dashboard_data, :gm_dashboard_excel_report], Lead
      can :manage, NoteRecord
      can :manage, User, id: user.id
      can :manage, :all
      can :manage, Presentation
      can :manage, Slide
      can :manage, Quotation
      can :manage, Boqjob
      can :manage, SiteMeasurementRequest
      can :read, CustomElement
      can :manage, BoqAndPptUpload
      can :read, DpQuestionnaire
      can :manage, City
      can [:read, :like], Product
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout, { created_by_id: user.id }
      can [:create, :read], MkwLayout
      can :manage, ShangpinLayout, { created_by_id: user.id }
      can [:create, :read], ShangpinLayout
      can :manage, TaskSet
      can :manage, TaskEscalation
      can :read, CmMkwVariablePricing, { cm_id: user.id }
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :broker
      can :manage, User, id: user.id
      can [:create_contact_lead, :create_broker_lead, :broker_lead_details, :single_broker_lead,
        :filter_details, :edit_broker_lead], Lead
    elsif user.has_any_role?(:referral, :client_referral, :employee_referral, :design_partner_referral, :display_dealer_referral, :non_display_dealer_referral, :others)
      can :manage, User, id: user.id
      can [:create_contact_lead, :create_broker_lead, :broker_lead_details, :single_broker_lead,
        :filter_details, :edit_broker_lead, :list_champion_leads, :sales_life_cycle_report], Lead
    elsif user.has_role? :sales_manager
      can :manage, User, id: user.id
      can [:sales_manager_filtered_index, :sales_manager_dashboard_count, :sales_manager_download_leads,
        :filter_details, :sales_manager_create_lead, :sales_life_cycle_report], Lead
      can [:sales_manager_referrers, :referrer_user_types], User
      can [:download_payment_report], Payment
    elsif user.has_role? :customer_head
      can :read, User
      can :manage, User, id: user.id
      can :manage, Lead
      can :manage, NoteRecord
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :catalogue_head
      can :manage, Section
      can :manage, Product
      can :manage, User, id: user.id
    elsif user.has_role? :boq_head
      can :manage, Quotation
      can :manage, Boqjob
      can :manage, User, id: user.id
    elsif user.has_any_role?(*Role::CATEGORY_ROLES)
      can [:read, :list_finishes], CoreMaterial
      can [:search_leads], Lead
      # can :manage, ModuleType
      can [:read, :list_shades], ShutterFinish
      # can :manage, ServiceCategory
      can :manage, MasterLineItem
      can :manage, Quotation
      can [:read, :po_details, :delete_purchase_order_view, :purchase_order_view_for_finance, :purchase_order_view, :cancel_purchase_order, :release_modified_po, :release_po, :modify_po, :panel_olt_payment_report, :quotations_for_order_manager, :po_payment_list, :raise_po_payment, :vendor_wise_line_items_for_po, :line_items_for_po, :update, :create], PurchaseOrder

      can [:read, :category_boqs_of_project], Proposal
      can :read, Floorplan
      can :read, CadDrawing
      can [:read, :get_ppts, :get_boqs], BoqAndPptUpload
      can :manage, User
      can :manage, Vendor
      can :read, City
      can :manage, VendorProduct
      can :manage, Project
      can :manage, Section
      can :manage, Product
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout
      can :manage, ShangpinLayout
      can :manage, CustomElement
      can :read, CmMkwVariablePricing
      can [:read, :list_configs], SkirtingConfig
      can :manage, JobElement
      can :manage, ProductionDrawing
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :category_head
      can :manage, CoreMaterial
      can [:search_leads], Lead
      can :manage, ModuleType
      can :manage, ShutterFinish
      can :manage, ServiceCategory
      can :manage, MasterLineItem
      can :manage, PurchaseOrder
      
      can [:read, :category_boqs_of_project], Proposal
      can :read, Floorplan
      can :read, CadDrawing
      can [:read, :get_ppts, :get_boqs], BoqAndPptUpload
      can :manage, User
      can :manage, Vendor
      can :read, City
      can :manage, VendorProduct
      can :manage, Project
      can :manage, Section
      can :manage, Product
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout
      can :manage, ShangpinLayout
      can :manage, CustomElement
      can :read, CmMkwVariablePricing
      can [:read, :list_configs], SkirtingConfig
      can :manage, JobElement
      can :manage, ProductionDrawing
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :cad
      can :manage, User, id: user.id
      can :manage, CadUpload
      can [:projects_for_cad], Project
      can [:read, :cad], Quotation, {is_approved: true}
      can :manage, TaskSet
      can :manage, TaskEscalation
    elsif user.has_role? :business_head
      can :manage, Project
      can :manage, ProposalDoc
      can :manage, User, id: user.id
      # can [:lead_metrics, :lead_metrics_filter_data, :community_metrics, :cm_designer_metrics,
      #   :mkw_business_head, :aws_dashboard, :aws_weekly_data, :aws_order_book, :aws_city_cm_designer_data, :gm_dashboard, :gm_dashboard_data, :city_gm_cm_and_designer, :gm_dashboard_excel_report], Lead
      can :manage, CmMkwVariablePricing
      can :manage, InhouseCall
      can :manage, Lead
      can :manage, Presentation
      can :manage, Slide
      can :read, Brand
      can :manage, ModularProduct
      can [:read], ProductModule
      can :read, CarcassElement
      can :read, HardwareElement
      can [:read, :brand_list, :extras, :optional_addons_for_addons, :compulsory_addons,
        :optional_addons], Addon
      can :read, Tag
      can [:read, :list_modules, :appliance_types, :customizable_dimensions], ModuleType
      can :read, CarcassElementType
      can :read, HardwareElementType
      can [:read,:list_finishes, :list_shutter_materials], CoreMaterial
      can :read, CoreMaterialPrice
      can [:read,:list_configs], SkirtingConfig
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout, { created_by_id: user.id }
      can [:create, :read], MkwLayout
      can :manage, ShangpinLayout, { created_by_id: user.id }
      can [:create, :read], ShangpinLayout
      can [:read, :filter_data, :filter_handles], Handle
      can [:read,:list_shades], ShutterFinish
      can [:read, :matching_edge_banding_shade], Shade
      can :read, HardwareType
      can [:read, :kitchen_categories_module_type], KitchenCategory
      can :manage, CustomElement
      can :read, CombinedDoor
      can [:read, :matching_edge_banding_shade], EdgeBandingShade
      can :read, ServiceCategory
      can :read, ServiceSubcategory
      can :read, ServiceActivity
      can [:read, :filter_data, :filter_appliances], KitchenAppliance
      can :manage, CadDrawing
      can :manage, Payment
      can :manage, Project
      can :manage, BoqAndPptUpload
      can :manage, Floorplan
      can [:create, :read, :update], Comment
      can :manage, Design
      can :read, Tag
      can :manage, City
      can :manage, Quotation
      can [:read, :products_for_catalog, :products_for_configuration, :categories_for_spaces,
        :configurations], Section
      can [:read, :all_product_list, :filter, :slider_ranges, :get_product_master_fabrics, :like,
        :get_product_master_sub_options, :get_product_catalogue_options, :get_product_variants, :get_product_variant_images], Product
    elsif user.has_role? :order_manager
      can :manage, PurchaseOrder
      can :manage, User, id: user.id
    elsif user.has_role? :developer
      can :create, Lead
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :associate_partner
      can :create, Lead
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :non_display_dealer
      can :create, Lead
      can :manage, QuestionaireMasterItem
    elsif user.has_role? :contractor
      can :create, Lead
    elsif user.has_any_role? :city_gm, :design_manager
      can :manage, QuestionaireMasterItem
      can :manage, User, id: user.id
      #can [:gm_dashboard, :aws_city_cm_designer_data, :city_gm_cm_and_designer, :gm_dashboard_data, :gm_dashboard_excel_report], Lead
      can :manage, InhouseCall
      can :manage, Lead
      can :manage, Presentation
      can :manage, Slide
      can :read, Brand
      can :manage, ModularProduct
      can [:read], ProductModule
      can :read, CarcassElement
      can :read, HardwareElement
      can [:read, :brand_list, :extras, :optional_addons_for_addons, :compulsory_addons,
        :optional_addons], Addon
      can :read, Tag
      can [:read, :list_modules, :appliance_types, :customizable_dimensions], ModuleType
      can :read, CarcassElementType
      can :read, HardwareElementType
      can [:read,:list_finishes, :list_shutter_materials], CoreMaterial
      can :read, CoreMaterialPrice
      can [:read,:list_configs], SkirtingConfig
      can :manage, BoqGlobalConfig
      can :manage, MkwLayout, { created_by_id: user.id }
      can [:create, :read], MkwLayout
      can :manage, ShangpinLayout, { created_by_id: user.id }
      can [:create, :read], ShangpinLayout
      can [:read, :filter_data, :filter_handles], Handle
      can [:read,:list_shades], ShutterFinish
      can [:read, :matching_edge_banding_shade], Shade
      can :read, HardwareType
      can [:read, :kitchen_categories_module_type], KitchenCategory
      can :manage, CustomElement
      can :read, CombinedDoor
      can [:read, :matching_edge_banding_shade], EdgeBandingShade
      can :read, ServiceCategory
      can :read, ServiceSubcategory
      can :read, ServiceActivity
      can [:read, :filter_data, :filter_appliances], KitchenAppliance
      can :manage, CadDrawing
      can :manage, Payment
      can :manage, Project
      can :manage, BoqAndPptUpload
      can :manage, Floorplan
      can [:create, :read, :update], Comment
      can :manage, Design
      can :read, Tag
      can :manage, City
      can :manage, Quotation
      can [:read, :products_for_catalog, :products_for_configuration, :categories_for_spaces,
        :configurations], Section
      can [:read, :all_product_list, :filter, :slider_ranges, :get_product_master_fabrics, :like,
        :get_product_master_sub_options, :get_product_catalogue_options, :get_product_variants, :get_product_variant_images], Product
    end

    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/CanCanCommunity/cancancan/wiki/Defining-Abilities
  end
end
