Rails.application.routes.draw do
  resources :recordings
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations:  'registrations',
    sessions: 'sessions'
  }

  root to: 'home#show'
  get '/blog' => redirect("https://arrivae.com/blog/")
  get '(*path)', to: 'application#blog', constraints: { subdomain: 'blog' }
  # get '/blog', to: redirect('https://arrivae.com/blog/', status: 301)
  post '/otp/otp_based_login', to: 'otp#otp_based_login', as: :login_based_on_otp
  get '/otp/generate_otp', to: 'otp#generate_otp', as: :generate_otp
  scope module: 'api' do
    namespace :v1 do
      resources :recordings
      namespace :mobile do
        resources :leads do
          collection do
            get :search_leads
            get :get_pincodes_on_city_basis
            get :lead_head_dashboard_count
            get :filtered_index
            post :import_leads
            get :download_leads
            get :escalated_leads
            get :broker_leads
            get :designer_leads
            post :change_user_type
            get :broker_lead_details
            get :single_broker_lead
            get :lead_pool_list
            post :assign_cs_agent_to_source
            post :assign_cs_agent_to_type
            post :assign_cs_agent_to_campaign
            post :create_lead
            post :create_contact_lead
            post :designer_lead_add
            post :create_voucher_lead
            post :create_broker_lead
            post :create_voucher_lead
            get :refresh_leads
            get :get_all_projects_belongs_to_lead
            get :filter_details
            get :duplicate_leads
            get :lead_queue
            get :lead_metrics_filter_data
            get :lead_metrics
            get :community_metrics
            get :cm_designer_metrics
            get :aws_dashboard
            get :aws_weekly_data
            get :aws_order_book
            get :aws_city_cm_designer_data
            get :gm_dashboard
            get :gm_dashboard_data
            get :gm_dashboard_excel_report
            get :mkw_business_head
            get :sales_manager_dashboard_count
            get :sales_manager_download_leads
            get :sales_manager_filtered_index
            get :list_champion_leads
            get :smart_share_history_for_lead
            get :smart_share_report
            post :sales_manager_create_lead
            get :city_gm_cm_and_designer
          end
          member do
            get :mark_as_read
            patch :make_contact_visible
            get :get_lead_info
            get 'assign_lead'
            get 'unassign_leads'
            patch :approve_user
            post :record_note
            post :update_status
            post :update_lead_status
            post :update_lead_status2
            post :update_lead_status_from_landing_page
            post 'claim_lead'
            patch :mark_escalated
            patch :unmark_escalated
            get 'show-logs', to: 'leads#show_logs'
            get :events_log
            get :lead_event_counts
            post :edit_broker_lead
            post :assign_cm_to_lead
            patch :update_basic_info
            get :sales_life_cycle_report
            get :alternate_contacts
          end
        end

        resources :events do
          collection do
            get :get_ownerable
            get :email_details_for_event
            get :events_for_ownerable
            get :meeting_scheduled_for_customer
            get :download_event
            get :get_manual_events_of_project
            get :history
            get :last_call
            get :last_meeting
          end
          member do
            post :change_event_status
            post :reschedule_event
            post :create_mom
            patch :update_mom
            get :share_mom
            get :view_mom
            delete :delete_mom
          end
        end
      end
      get '/versions/history', to: 'versions#history', as: :version_history
      patch '/versions/:id/undo', to: 'versions#undo', as: :version_undo
      get '/quotations/download_boq_report', to: 'quotations#download_boq_report'
      get '/purchase_orders/panel_olt_payment_report', to: 'purchase_orders#panel_olt_payment_report'
      get 'quotations/boq_line_item_report', to: 'quotations#boq_line_item_report'
      get 'quotations/download_margin_report', to:'quotations#margin_report'
      get :pre_production_quotation_for_sli, to: 'quotations#pre_production_quotation_for_sli'
      get :pre_production_quotations, to: 'quotations#pre_production_quotations'
      get :pre_production_quotations_po_release, to: 'quotations#pre_production_quotations_po_release'
      get :pre_production_quotations_pi_upload, to: 'quotations#pre_production_quotations_pi_upload'
      get :pre_production_quotations_payment_release, to: 'quotations#pre_production_quotations_payment_release'
      get :show_by_reference, to: 'quotations#show_by_reference'
      patch :change_amount, to: 'quotations#change_amount'
      post :toggle_pm_fee, to: 'quotations#toggle_pm_fee'
      post '/products/import_excel', to: 'products#import_excel'
      get 'fb_webhooks/verification', to: 'fb_webhooks#verification'
      post 'fb_webhooks/verification', to: 'fb_webhooks#process_payload'
      resources :media_pages
      resources :training_materials do
        post :upload_content, on: :member
        get :fetch_traning_material, on: :collection
        get :delete_content, on: :collection
      end
      resources :events do
        collection do
          get :get_ownerable
          get :email_details_for_event
          get :events_for_ownerable
          get :meeting_scheduled_for_customer
          get :download_event
          get :get_manual_events_of_project
        end
        member do
          post :change_event_status
          post :reschedule_event
          post :create_mom
          patch :update_mom
          get :share_mom
          get :view_mom
          delete :delete_mom
        end
      end
      resources :note_records do
        collection do
          get :get_billing_address
          get :get_city_details
          get :get_society_details
        end
      end
      resources :portfolios
      resources :cities
      resources :milestones
      resources :purchase_orders, except: [:index, :show] do
        member do
          get :purchase_order_view
          patch :cancel_purchase_order
          patch :release_po
          patch :modify_po
          patch :release_modified_po
          get :generate_po_pdf
          get :purchase_order_view_for_finance
          post :raise_po_payment
        end
        collection do
          post :delete_purchase_order_view
          get :line_items_for_po
          get :quotations_for_order_manager
          get :vendor_wise_line_items_for_po
          get :download_sli_report
          get :po_payment_list
          get :purchase_order_report
        end
      end
      resources :performa_invoice_files, only: [:create]
      resources :pi_payments, except: [:update] do
        patch :payment_approval, on: :member
        get :vendor_payment_history, on: :collection
        get :vendor_payment_ledger, on: :collection
      end
      resources :testimonials do
        member do
          get :get_featured_testimonials
        end
      end

      resources :cm_mkw_variable_pricings, except: [:create, :update, :show] do
        post :import, on: :collection
      end

      resources :contacts
      resources :users, except: [:create, :destroy] do
        get :download_list, on: :collection

        member do
          post :assign_project
          patch :add_role
          patch :remove_role
          patch :update_role
          patch :activate
          patch :deactivate
          get :csagent_dashboard
          get :cm_dashboard_count
          get :cm_dashboard_designer_actionables
          get :cm_dashboard
          get :cm_lead_download
          get :designer_for_cm
          get :designer_dashboard_count
          get :designer_dashboard
          get :designer_leads_download
          get :designer_leads
          get :desginer_all_projects
          get :csagent_online_change
          post :change_catalog_type
          post :kyc_approved
          post :call_user
          get :customer_details
          post :change_customer_status
          post :change_sub_status
          get :get_all_status_for_project
          get :all_calls_to_be_done_today
          get :leads_qualified_but_no_actions_taken
          get :designer_actionables
          get :all_calls_to_be_done_today_escalated
          get :meeting_scheduled_for_today
          get :meeting_scheduled_for_today_escalated
          get :leads_for_deadlines
          get :leads_for_deadlines_count
          get :wip_leads
          get :community_manager_actionable_counts
          get :call_needs_to_be_done_today_by_cm
          get :cm_meeting_scheduled_for_today
          get :escalated_meetings_for_cm_dashboard
          get :cm_deadlines
          get :cm_wip_leads
          get :cm_designer_no_action_taken
          get :cm_designers
          get :wip_project_details
          get :assigned_designers_to_cm
          get :designer_profile
          post :import_user_pincode_mapping
          get :cm_wip_dashboard_counts
          get :designer_wip_dashboard_counts
          get :sales_manager_referrers
          get :load_referrer_users
          get :referrer_user_types
        end
        collection do
          patch :check_cm_available
          get :designer_active_leads
          get :clients_projects
          get :cm_cities
          get :city_cm_designer_data
          get :designer_cm_index
          get :user_pincode_mapping_xlxs
          get :csagent_list
          post :assign_designer_to_cm
          get :request_role
          get :current_user_details
          post :invite_user
          post :invite_champion
          get :invite_champion_info
          get :champions
          get :child_champions
          get :user_children_with_role
          get :download_list
          get :wip_leads_for_category
          get :sitesupervisor_users
          post :assign_sitesupervisor_to_cm
          get :get_all_site_supervisors
          post :assign_cities_to_cm
          post :un_assign_cities_to_cm
          get :get_all_community_managers
          get :change_status_of_designer
          post :send_visit_us_email
          get :cm_tag_mapping, to: "users#get_cm_tag_mapping"
          post :cm_tag_mapping, to: "users#post_cm_tag_mapping"
          get :list_of_cm
          post :migrate_cm_data
          get :cm_assigned_data
          get :data_migration_history
          post :password_reset_mobile
          get :referrers
          get :sales_managers
          post :assign_sales_manager_to_referrer
        end
        resources :portfolio_works
        resources :dp_questionnaires do
          collection do
            get :get_section_wise_questions
            get :delete_project
          end
        end
      end

      resources :requests do
        member do
          post :reschedule_the_site_measurment_request
          post :assign_site_suppervisor_for_request
          get :discard_the_request
          post :complete_site_measurment_request
          post :add_images_to_request
          get :get_images_for_request
        end
        collection do
          get :site_supervisor_dashboard_count
          get :live_and_finished_projects
          get :requests_for_project
          get :remove_images_from_request
          delete :remove_images_from_request
          get :escalated_site_measurement
        end
      end

      resources :price_configurators do
        member do
          post :add_specification
          get :fetch_designs
        end
        collection do
          post :emicalculator
        end
      end
      resources :inhouse_calls do
        get 'sms_list', on: :collection
        post 'send_sms', on: :collection
        get :call_excel_report, on: :collection
      end
      get 'material_tracking_boq', to: 'quotations#material_tracking_boq'
      get "quotaions/:id/quotaion_po", to: 'quotations#quotaion_po'
      get "quotations/:quotation_id/purchase_orders/:id/po_details", to: 'purchase_orders#po_details'
      post "job_element/dispatch_readiness", to: 'job_elements#post_dispatch_readiness_date'
      get "job_element/dispatch_readiness", to: 'job_elements#get_dispatch_readiness_date'
      post "job_element/dispatch_schedule", to: 'job_elements#post_dispatch_schedule_date'
      post "job_element/delivery_states", to: 'job_elements#post_delivery_state'
      get 'job_element/mt-history', to: 'job_elements#mt_history'
      resources :quality_checks do
        collection do
          get :get_job_element_qc_date
          post :update_job_element_qc_date
        end
      end
      resources :projects do
        get :download_custom_elements, on: :collection
        get :share_pdf_with_customer, on: :member
        get :arrivae_pdf, on: :member
        get :purchase_orders,  on: :member
        post :share_warrenty_doc, on: :member
        get :client_address, on: :member
        collection do
          get :projects_for_handover
        end
        member do
          post :add_project_handover_list
          post :seen_by_category_for_handover
          get :send_to_factory_mail
        end
        post :add_project_handover_list, on: :member
        resources :customer_profiles do
          collection do
            get :generate_xl
          end
        end
        resources :project_handovers do
          post :share_with_category, on: :collection
          get :grouped_index, on: :collection
          post :add_revision, on: :member
          get :child_revisions, on: :member
          post :category_action_on_handover, on: :member
          post :upload_files_from_category, on: :collection
        end
        resources :requested_files do
          post :resolve_request, on: :member
        end

        resources :cad_drawings do
          post :update_panel, on: :member
        end
        resources :payments, except: [:update] do
          post :payment_approval, on: :member
          get :boq_payment_history, on: :collection
          get :payment_history, on: :collection
          post :lead_payment_receipt, on: :member
          put :update_paid_amount, on: :member
        end
        resources :payment_invoices do 
          get :child_invoices, on: :collection
          get :parent_invoices_for_project, on: :collection
          post :create_parent_invoice, on: :collection
          get :share_parent_invoice, on: :collection
          post :update_parent_invoice, on: :collection
        end

        resources :cad_drawings
        resources :custom_elements do
          post :add_custom_element_price, on: :member
          post :add_custom_element_space, on: :member
          get :custom_elements_for_category, on: :collection
          get :priced_custom_elements, on: :collection
          patch :change_category_seen_status, on: :collection
        end
        member do
          get :approved_quotations
          get :get_project_requirement
          get :scope_of_work_for_ten_percent
          get :booking_form_for_project
          get :check_for_booking_form
          post :assign_project
          get 'show-project-details', to: 'project_details#show'
          patch 'update-project-details', to: 'project_details#update'
          get 'show-designer-booking-form', to: 'designer_booking_forms#show'
          patch 'update-designer-booking-form', to: 'designer_booking_forms#update'
          delete 'clear-designer-booking-form', to: 'designer_booking_forms#destroy'
          get 'product-catalog', to: 'projects#product_catalog'
          patch :update_remark
          post :project_sms, to: "projects#post_sms"
          get :project_sms, to: "projects#get_sms"
          post :upload_three_d_image
          post :upload_reference_image
          post :update_panel_for_three_d_image
          post :upload_elevation
          get :fetch_three_d_images
          get :fetch_reference_images
          get :fetch_customer_inspiration
          get :fetch_elevations
          get :fetch_line_markings
          post :upload_line_marking
          delete :delete_line_marking
          get :list_for_handover
          get :quotation_for_final_payment
        end
        collection do
          get :select_sections
          get 'status_by_token'
          post 'status_by_token'
          get 'global-project-details', to: 'project_details#global_project_details'
          get :projects_for_cad
          get :business_head_projects
          get :quotations_for_po
          get :projects_for_import_boq
          get :quotations_count_for_category
          get :projects_by_quotations_wip_status
          get :projects_by_custom_elements
          get :pre_production_projects
          get :search_project_for_category
        end

        resources :boq_and_ppt_uploads do
          collection do
            get :get_ppts
            get :sample_ppt_file
            get :get_boqs
            get :get_shared_ppts_and_boqs
            get :get_shared_boqs
          end

          member do
            get :share_with_customer
          end
        end

        resources :cad_drawings
        resources :custom_elements do
          post :add_custom_element_price, on: :member
          get :custom_elements_for_category, on: :collection
          get :priced_custom_elements, on: :collection
        end
        resources :comments
        resources :task_categories
        resources :project_tasks do
          post 'import_tasks', on: :collection
        end
        resources :floorplans do
          post :send_upload_sms, on: :collection
          post :upload_sms_floorplan, on: :collection
          resources :designs do
            member do
              patch :approve_design
            end
          end
        end
        resources :presentations do
          member do
            get :get_products_of_ppt
            post :update_products_of_ppt
          end
        end

        resources :quotations do
          resources :performa_invoices, except: [:show, :destroy]
          resources :purchase_order_performa_invoices, except: [:show, :destroy]
          get :download_pdf, on: :member
          get :download_v2_pdf, on: :member
          get :download_v2_pdf_office, on: :member #<==== for office.arrivae.com
          get :download_boq_pdf, on: :member
          get :download_boq, on: :member
          get :download_category_excel, on: :member
          get :download_cheat_sheet, on: :member
          patch :change_category_seen_status, on: :member
          get :shared_initial_boqs, on: :collection
          get :shared_final_boqs, on: :collection
          member do
            patch :add_label
            patch :edit_label
            patch :delete_label
            patch :add_boqjob
            patch :update_boqjob
            patch :delete_boqjobs
            patch :update_modular_jobs
            patch :add_modular_job
            patch :edit_modular_job
            patch :edit_modular_job_quantity
            patch :combine_modules
            patch :edit_combined_module
            patch :recalculate_amount
            patch :delete_modular_jobs
            patch :delete_shangpin_jobs
            post 'change-status', to: 'quotations#change_status'
            post :import_kdmax_excel
            post :import_shangpin_excel
            patch :approve_quotation
            patch :set_spaces
            patch :delete_space
            get :customization
            patch :update_service_jobs
            patch :delete_service_jobs
            patch :update_custom_element_jobs
            patch :delete_custom_jobs
            patch :add_appliance_job
            patch :edit_appliance_job
            patch :delete_appliance_jobs
            patch :delete_section
            patch :update_custom_element_job
            patch :add_extra_job
            patch :edit_extra_job
            patch :delete_extra_jobs
            post :change_wip_status
            post :cm_category_approval
            get :quotation_for_business_head
            get :download_boq
            post :change_wip_status
            patch :update_remarks
            get :import_qoutation
            get :client_quotation_display
            patch 'import-layout', to: 'quotations#import_layout'
            patch :import_shangpin_layout
            patch 'generate-smart-quotation', to: 'quotations#generate_smart_quotation'
            patch :change_sli_flag
            patch :add_duration
            get :pre_production_quotation_for_sli_line_items
            get :pre_production_quotations_line_items
            get :pre_production_quotations_vendor_wise_line_items
            get :quotations_po
            get :quotations_payment_release_line_items
            get :quotation_vendors
            get :purchase_orders
            post :create_clubbed_jobs
            post :create_multi_slis
            get :line_items_for_splitting
            get :line_items_for_cutting_list
          end
          collection do
            post 'ppt-linked-boq', to: 'quotations#ppt_linked_boq'
            get 'import-boq', to: 'quotations#import_boq'
            post :designquotes
            get :cad
            get :quotation_list_for_business_head
            get :quotation_for_import
            get :final_approved_quotations
            get :splitted_quotations
            # get :pre_production_quotation_for_vendor_mapping
          end
          resources :boqjobs
          resources :cad_uploads do
            patch :update_tags, on: :member
            patch :change_status, on: :member
            patch :change_category_seen_status, on: :collection
          end
          resources :job_elements, except: [:update] do
            collection do
              get :index_by_job
              post :auto_populate_slis
              post :destroy_selected
              post :change_master_sli_clubbed
              post :update_clubbed
              post :uom_conversion
              get :clubbed_view
              post :set_alternate_sli_clubbed
            end
            member do
              post :add_vendor
              delete :remove_vendor
              patch :update_vendor_details
              get :view_options
              post :change_master_sli
              post :update_sli_details
              post :set_alternate_sli
              get :line_item_details
            end
          end
        end

        resources :invoices do
          resources :boqjobs
        end
        resources :production_drawings
        resources :project_quality_checks do
          get 'qc_history', on: :collection
        end
      end
      get 'payments/download_payment_report', to: 'payments#download_payment_report'
      get 'payments/dp_payout_payment_report', to: 'payments#dp_payout_payment_report'
      post 'job_elements/edit_po_qty', to: "job_elements#edit_po_qty"
      get 'payments/lead_payment_history', to: 'payments#lead_payment_history'
      get 'payments/lead_payment_ledger', to: 'payments#lead_payment_ledger'
      get 'payments/final_stage_projects', to: 'payments#final_stage_projects'

      resources :sections do
        collection do
          get 'products-for-catalog', to: 'sections#products_for_catalog'
          get 'categories_for_spaces'
          get 'configurations'
          get 'products/all_product_list', to: 'products#all_product_list'
          get 'products/slider_ranges', to: 'products#slider_ranges'
          get 'products/filter', to: 'products#filter'
        end
        member do
          get 'products-for-configuration', to: 'sections#products_for_configuration'
          # post 'import_products'
          # post 'import_services'
        end

        # resources :products

        resources :catalogue_services do
          get 'all_service_list', on: :collection
        end
      end

      resources :catalogue_services do
        get 'all_service_list', on: :collection
      end

      resources :products do
        get 'all_product_list', on: :collection
        get :download_products_pdf, on: :collection
        get :get_product_master_fabrics, on: :member
        get :get_product_master_sub_options, on: :collection
        get :get_product_catalogue_options, on: :collection
        get :get_product_variants, on: :collection
        get :get_product_variant_images, on: :collection
        post :like, on: :member
        post :import_excel, on: :collection
      end

      # For Catalog Controller - no resource because there are no CRUD endpoints.
      get 'catalog/megamenu', to: 'catalogs#megamenu'
      get 'catalog/segment_show', to: 'catalogs#segment_show'
      get 'catalog/category_show', to: 'catalogs#category_show'

      # for modular wardrobe and kitchen
      resources :brands
      resources :core_materials do
        post 'add_finish_mapping', on: :member
        post 'remove_finish_mapping', on: :member
        get :list_shutter_materials, on: :collection
        get :list_finishes, on: :collection
      end
      resources :core_material_prices
      resources :shutter_finishes do
        get :shades_mapping, on: :collection, to: "shutter_finishes#fetch_shades_mapping"
        post :shades_mapping, on: :collection, to: "shutter_finishes#add_shades_mapping"
        get :list_shades, on: :collection
        get :core_material_mapping, on: :collection, to: "shutter_finishes#fetch_core_material_mapping"
        post :core_material_mapping, on: :collection, to: "shutter_finishes#add_core_material_mapping"

      end
      resources :edge_banding_shades do
        # get :edge_banding_shades_mapping, on: :member, to: "edge_banding_shades#fetch_edge_banding_shades_mapping"
        # post :edge_banding_shades_mapping, on: :member, to: "edge_banding_shades#add_edge_banding_shades_mapping"
      end
      resources :shades do
        get :matching_edge_banding_shade, on: :member
      end
      resources :skirting_configs do
        get :list_configs, on: :collection
      end
      resources :hardware_types
      resources :module_types do
        get :list_modules, on: :collection
        get :appliance_types, on: :collection
        get :customizable_dimensions, on: :member
      end
      resources :handles do
        get :filter_data, on: :collection
        get :filter_handles, on: :collection
      end
      resources :addons do
        get :brand_list, on: :member
        get :extras, on: :collection
        patch :update_tags, on: :member
        get :optional_addons_for_addons, on: :collection
        get :compulsory_addons, on: :collection
        get :optional_addons, on: :collection
      end
      resources :tags do
        get 'all_ranges', on: :collection
        get 'all_spaces', on: :collection
      end
      resources :carcass_element_types
      resources :hardware_element_types
      resources :kitchen_categories do
        get :kitchen_module_mapping, on: :collection, to: "kitchen_categories#fetch_module_type_mapping"
        post :kitchen_module_mapping, on: :collection, to: "kitchen_categories#add_module_type_mapping"
        get :kitchen_categories_module_type, on: :member
      end
      resources :hardware_elements
      resources :carcass_elements
      resources :product_modules do
        get :addons_mapping, on: :collection, to: "product_modules#fetch_addons_mapping"
        post :addons_mapping, on: :collection, to: "product_modules#add_addons_mapping"
        get :kitchen_module_addon, on: :member, to: "product_modules#fetch_kitchen_module_addons"
        post :kitchen_module_addon, on: :collection, to: "product_modules#add_kitchen_module_addons"
      end
      resources :modular_products

      resources :combined_doors
      resources :boq_global_configs, except: [:show] do
        get :get_config, on: :collection
        get :list_of_spaces, on: :collection
        patch :update_and_apply, on: :member
        get :list_presets, on: :collection
        post :load_preset, on: :collection
      end
      resources :mkw_layouts, except: [:update] do
        get :customization, on: :member
      end
      resources :shangpin_layouts, except: [:update]
      resources :service_categories
      resources :service_subcategories
      resources :service_activities
      resources :kitchen_appliances do
        get :filter_data, on: :collection
        get :filter_appliances, on: :collection
      end
      # resources :vouchers, only: [:index]
      resources :kitchen_appliances
      resources :master_line_items, only: [:index, :show] do
        get :index_new, on: :collection
        get :procurement_types, on: :collection
      end

      resources :vendor_products do
        get :list, on: :collection
        get :list_units, on: :collection
        get :list_units_array, on: :collection
      end
      resources :vouchers, only: [:index] do
        get :schedule_visit, on: :collection
      end

      resources :leads do
        collection do
          get :search_leads
          get :get_pincodes_on_city_basis
          get :lead_head_dashboard_count
          get :filtered_index
          post :import_leads
          get :download_leads
          get :escalated_leads
          get :broker_leads
          get :designer_leads
          post :change_user_type
          get :broker_lead_details
          get :single_broker_lead
          get :lead_pool_list
          post :assign_cs_agent_to_source
          post :assign_cs_agent_to_type
          post :assign_cs_agent_to_campaign
          post :create_lead
          post :create_contact_lead
          post :designer_lead_add
          post :create_voucher_lead
          post :create_broker_lead
          post :create_voucher_lead
          get :refresh_leads
          get :get_all_projects_belongs_to_lead
          get :filter_details
          get :duplicate_leads
          get :lead_queue
          get :lead_metrics_filter_data
          get :lead_metrics
          get :community_metrics
          get :cm_designer_metrics
          get :aws_dashboard
          get :aws_weekly_data
          get :aws_order_book
          get :aws_city_cm_designer_data
          get :gm_dashboard
          get :gm_dashboard_data
          get :gm_dashboard_excel_report
          get :mkw_business_head
          get :sales_manager_dashboard_count
          get :sales_manager_download_leads
          get :sales_manager_filtered_index
          get :list_champion_leads
          get :smart_share_history_for_lead
          get :smart_share_report
          post :sales_manager_create_lead
          get :city_gm_cm_and_designer
        end
        member do
          patch :make_contact_visible
          get :get_lead_info
          get 'assign_lead'
          get 'unassign_leads'
          patch :approve_user
          post :record_note
          post :update_status
          post :update_lead_status
          post :update_lead_status2
          post :update_lead_status_from_landing_page
          post 'claim_lead'
          patch :mark_escalated
          patch :unmark_escalated
          get 'show-logs', to: 'leads#show_logs'
          get :events_log
          get :lead_event_counts
          post :edit_broker_lead
          post :assign_cm_to_lead
          patch :update_basic_info
          get :sales_life_cycle_report
          get :alternate_contacts
        end
      end

      resources :proposals do
        collection do
          get :quotation_types
          get :customer_logs
          get :get_ownerables_for_proposals
          post :aprove_or_reject_or_change_discount
          get :approved_or_rejected_boqs
          get :expired_boqs
          post :approve_or_reject_the_boq
          get :submitted_proposals
          delete :destroy_proposal_docs
          post :add_payment
          get :discount_proposed_boq
          get :designer_cm_details
          post :schedule_call_with_designer
          get :list_of_scheduled_calls
          get :drafted_or_saved_proposals
          get :boq_approved_project_list
          get :proposal_list_for_finance
          get :payment_details_for_boq
          post :payment_approval_by_financiar
          get :all_approved_boqs_of_project
          get :category_boqs_of_project
          get :boqs_shared_with_clients
          get :get_book_order_detail
          get :get_finalize_design_details
        end
        member do
          get :share_with_customer
          post :add_ownerables_to_proposal
        end
      end

      resources :lead_campaigns
      resources :project_requirements
      resources :scope_of_works
      resources :project_booking_forms do
        member do
          get :download_pdf
        end
        resources :project_booking_form_files, only: [:create, :destroy]
      end
      resources :vendors do
        collection do
          get :index_new
          get :get_vendor_categories
          get :get_vendor_sub_categories
          get :sample_dd_files
          get :get_vendor_list
        end
      end

      resources :lead_priorities do
        patch :change_priority, on: :member
      end

      resources :production_drawings do
        collection do
          get :get_spit_tags
          patch :update_production_drawings
          patch :add_or_remove_splits
        end
      end

      resources :task_sets do
        collection do
          get :designer_task_sets
          get :task_counts
          get :get_pre_bid_tasks
          get :get_ten_per_task_status
          get :get_ten_to_forty_per_tasks
          get :project_task_counts
          get :quotation_task_counts
          get :mark_task_as_old
        end
      end

      resources :contents do
        post :upload_cutting_list_and_boms, on: :collection
        post :set_no_bom_and_cutting_list, on: :collection
        post :change_no_bom_status, on: :collection
        delete :clear_contents_by_ids, on: :collection
        patch :destroy_bom, on: :member
      end
      resources :training_materials
      resources :wip_slis do
        get :view_options, on: :member
        post :change_wip_sli, on: :member
        post :add_custom_sli, on: :collection
        get :slis_with_type
      end

      resources :po_wip_orders do
        member do
          get :po_wip_order_view
          patch :take_action_on_po
          patch :receive_po
          get :get_full_line_items
        end
      end
      resources :po_inventories do
        member do
          post :update_min_stock_and_tat
        end
        collection do
          get :inventory_locations
        end
      end
      
      resources :questionaire_master_items, only: [:index]
    end
  end
end
