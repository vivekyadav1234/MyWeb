# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200104074845) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addon_combination_mappings", force: :cascade do |t|
    t.integer  "quantity",             default: 0, null: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "addon_id"
    t.integer  "addon_combination_id"
    t.index ["addon_combination_id"], name: "index_addon_combination_mappings_on_addon_combination_id", using: :btree
    t.index ["addon_id", "addon_combination_id"], name: "by_addon_and_addon_combination", unique: true, using: :btree
    t.index ["addon_id"], name: "index_addon_combination_mappings_on_addon_id", using: :btree
  end

  create_table "addon_combinations", force: :cascade do |t|
    t.string   "combo_name", default: "default"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "code"
    t.boolean  "extra",      default: false,     null: false
    t.boolean  "hidden",     default: false,     null: false
    t.index ["code"], name: "index_addon_combinations_on_code", unique: true, using: :btree
  end

  create_table "addon_tag_mappings", force: :cascade do |t|
    t.integer  "addon_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["addon_id"], name: "index_addon_tag_mappings_on_addon_id", using: :btree
    t.index ["tag_id"], name: "index_addon_tag_mappings_on_tag_id", using: :btree
  end

  create_table "addons", force: :cascade do |t|
    t.string   "code"
    t.string   "name"
    t.string   "specifications"
    t.float    "price"
    t.integer  "brand_id"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.string   "category"
    t.string   "addon_image_file_name"
    t.string   "addon_image_content_type"
    t.integer  "addon_image_file_size"
    t.datetime "addon_image_updated_at"
    t.string   "vendor_sku"
    t.boolean  "extra",                    default: false
    t.float    "mrp"
    t.boolean  "allowed_in_custom_unit",   default: false
    t.integer  "lead_time",                default: 0
    t.boolean  "hidden",                   default: false, null: false
    t.boolean  "arrivae_select",           default: false, null: false
    t.boolean  "modspace",                 default: false, null: false
    t.index ["brand_id"], name: "index_addons_on_brand_id", using: :btree
    t.index ["code", "brand_id", "category"], name: "index_addons_on_code_and_brand_id_and_category", unique: true, using: :btree
    t.index ["vendor_sku", "category"], name: "index_addons_on_vendor_sku_and_category", using: :btree
  end

  create_table "addons_for_addons_mappings", force: :cascade do |t|
    t.integer  "kitchen_module_addon_mapping_id"
    t.integer  "addon_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.integer  "addon_combination_id"
    t.index ["addon_combination_id"], name: "index_addons_for_addons_mappings_on_addon_combination_id", using: :btree
    t.index ["kitchen_module_addon_mapping_id"], name: "index_addons_for_addons_mappings_on_module_addon_mapping_id", using: :btree
  end

  create_table "alternate_contacts", force: :cascade do |t|
    t.string   "name"
    t.string   "contact"
    t.string   "relation"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["ownerable_type", "ownerable_id"], name: "index_alternate_contacts_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "appliance_jobs", force: :cascade do |t|
    t.string   "name"
    t.string   "make"
    t.float    "rate"
    t.float    "quantity"
    t.float    "amount"
    t.string   "space"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "kitchen_appliance_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "vendor_sku"
    t.string   "specifications"
    t.string   "warranty"
    t.float    "estimated_cogs",       default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",               default: false, null: false
    t.index ["clubbed_job_id"], name: "index_appliance_jobs_on_clubbed_job_id", using: :btree
    t.index ["kitchen_appliance_id"], name: "index_appliance_jobs_on_kitchen_appliance_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_appliance_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["tag_id"], name: "index_appliance_jobs_on_tag_id", using: :btree
  end

  create_table "approvals", force: :cascade do |t|
    t.integer  "approved_by"
    t.string   "approvable_type"
    t.integer  "approvable_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "role"
    t.datetime "approved_at"
    t.string   "approval_scope"
    t.string   "subtype"
    t.boolean  "rejected",        default: false, null: false
    t.string   "remarks"
    t.index ["approvable_type", "approvable_id"], name: "index_approvals_on_approvable_type_and_approvable_id", using: :btree
  end

  create_table "bom_sli_cutting_list_data", force: :cascade do |t|
    t.string   "sheet",              null: false
    t.integer  "row",                null: false
    t.string   "sr_no"
    t.string   "article_code"
    t.string   "article_name"
    t.string   "part_name"
    t.string   "mat_top_lam_bottom"
    t.float    "finish_length"
    t.float    "finish_width"
    t.float    "finish_height"
    t.float    "finish_thk"
    t.float    "qty"
    t.string   "part_code"
    t.string   "barcode1"
    t.string   "barcode2"
    t.string   "edge1"
    t.string   "edge2"
    t.string   "edge3"
    t.string   "edge4"
    t.string   "grain"
    t.string   "cutting_length"
    t.string   "cutting_width"
    t.string   "cutting_thk"
    t.string   "customer_name"
    t.string   "part_material"
    t.string   "laminate_top"
    t.string   "laminate_bottom"
    t.string   "size"
    t.float    "edgeband_qty"
    t.integer  "boq_label_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "import_type"
    t.index ["boq_label_id"], name: "index_bom_sli_cutting_list_data_on_boq_label_id", using: :btree
  end

  create_table "bom_sli_cutting_list_mappings", force: :cascade do |t|
    t.string   "program_code",   null: false
    t.string   "sli_group_code", null: false
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["program_code"], name: "index_bom_sli_cutting_list_mappings_on_program_code", unique: true, using: :btree
  end

  create_table "boq_and_ppt_uploads", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.string   "upload_type"
    t.boolean  "shared_with_customer"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.string   "name"
    t.index ["project_id"], name: "index_boq_and_ppt_uploads_on_project_id", using: :btree
  end

  create_table "boq_global_configs", force: :cascade do |t|
    t.string   "core_material"
    t.string   "shutter_material"
    t.string   "shutter_finish"
    t.string   "shutter_shade_code"
    t.string   "skirting_config_type"
    t.string   "skirting_config_height"
    t.string   "door_handle_code"
    t.string   "shutter_handle_code"
    t.string   "hinge_type"
    t.string   "channel_type"
    t.integer  "brand_id"
    t.integer  "skirting_config_id"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "quotation_id"
    t.string   "category"
    t.string   "edge_banding_shade_code"
    t.string   "countertop",              default: "none"
    t.boolean  "civil_kitchen",           default: false
    t.integer  "countertop_width"
    t.boolean  "is_preset",               default: false
    t.string   "preset_remark"
    t.integer  "preset_created_by_id"
    t.string   "preset_name"
    t.index ["brand_id"], name: "index_boq_global_configs_on_brand_id", using: :btree
    t.index ["preset_created_by_id"], name: "index_boq_global_configs_on_preset_created_by_id", using: :btree
    t.index ["quotation_id"], name: "index_boq_global_configs_on_quotation_id", using: :btree
    t.index ["skirting_config_id"], name: "index_boq_global_configs_on_skirting_config_id", using: :btree
  end

  create_table "boq_labels", force: :cascade do |t|
    t.string   "label_name"
    t.integer  "quotation_id"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["ownerable_type", "ownerable_id"], name: "index_boq_labels_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["quotation_id"], name: "index_boq_labels_on_quotation_id", using: :btree
  end

  create_table "boqjobs", force: :cascade do |t|
    t.string   "name"
    t.float    "quantity"
    t.float    "rate"
    t.float    "amount"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "product_id"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "ppt_linked",         default: false
    t.integer  "section_id"
    t.string   "space"
    t.integer  "product_variant_id"
    t.float    "estimated_cogs",     default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",             default: false, null: false
    t.index ["clubbed_job_id"], name: "index_boqjobs_on_clubbed_job_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_boqjobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["product_variant_id"], name: "index_boqjobs_on_product_variant_id", using: :btree
    t.index ["section_id"], name: "index_boqjobs_on_section_id", using: :btree
    t.index ["tag_id"], name: "index_boqjobs_on_tag_id", using: :btree
  end

  create_table "brands", force: :cascade do |t|
    t.string   "name"
    t.boolean  "hardware",   default: true
    t.boolean  "addon",      default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["name"], name: "index_brands_on_name", unique: true, using: :btree
  end

  create_table "building_crawler_details", force: :cascade do |t|
    t.text     "bhk_type"
    t.string   "possession"
    t.string   "source"
    t.string   "source_id"
    t.integer  "building_crawler_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["building_crawler_id"], name: "index_building_crawler_details_on_building_crawler_id", using: :btree
  end

  create_table "building_crawler_floorplans", force: :cascade do |t|
    t.string   "url"
    t.integer  "building_crawler_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["building_crawler_id"], name: "index_building_crawler_floorplans_on_building_crawler_id", using: :btree
  end

  create_table "building_crawlers", force: :cascade do |t|
    t.string   "building_name"
    t.string   "group_name"
    t.string   "locality"
    t.string   "city"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["locality", "building_name", "city"], name: "index_building_crawlers_on_locality_and_building_name_and_city", using: :btree
  end

  create_table "business_units", force: :cascade do |t|
    t.string   "unit_name",  null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cad_drawings", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "cad_drawing_file_name"
    t.string   "cad_drawing_content_type"
    t.integer  "cad_drawing_file_size"
    t.datetime "cad_drawing_updated_at"
    t.string   "name"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.boolean  "panel",                    default: false
    t.index ["project_id"], name: "index_cad_drawings_on_project_id", using: :btree
  end

  create_table "cad_upload_jobs", force: :cascade do |t|
    t.integer  "cad_upload_id"
    t.string   "uploadable_type"
    t.integer  "uploadable_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["cad_upload_id"], name: "index_cad_upload_jobs_on_cad_upload_id", using: :btree
    t.index ["uploadable_type", "uploadable_id"], name: "index_cad_upload_jobs_on_uploadable_type_and_uploadable_id", using: :btree
  end

  create_table "cad_uploads", force: :cascade do |t|
    t.string   "upload_name"
    t.string   "upload_type"
    t.string   "status",              default: "pending"
    t.string   "approval_comment"
    t.datetime "status_changed_at"
    t.string   "upload_file_name"
    t.string   "upload_content_type"
    t.integer  "upload_file_size"
    t.datetime "upload_updated_at"
    t.integer  "quotation_id"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "approved_by_id"
    t.integer  "uploaded_by_id"
    t.boolean  "seen_by_category",    default: false
    t.index ["approved_by_id"], name: "index_cad_uploads_on_approved_by_id", using: :btree
    t.index ["quotation_id"], name: "index_cad_uploads_on_quotation_id", using: :btree
    t.index ["status"], name: "index_cad_uploads_on_status", using: :btree
    t.index ["uploaded_by_id"], name: "index_cad_uploads_on_uploaded_by_id", using: :btree
  end

  create_table "carcass_element_types", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "aluminium",  default: false
    t.boolean  "glass",      default: false
    t.index ["name", "category"], name: "index_carcass_element_types_on_name_and_category", unique: true, using: :btree
  end

  create_table "carcass_elements", force: :cascade do |t|
    t.string   "code"
    t.integer  "width"
    t.integer  "depth"
    t.integer  "height"
    t.float    "length"
    t.float    "breadth"
    t.float    "thickness"
    t.integer  "edge_band_thickness"
    t.float    "area_sqft"
    t.string   "category"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "carcass_element_type_id"
    t.index ["carcass_element_type_id"], name: "index_carcass_elements_on_carcass_element_type_id", using: :btree
    t.index ["code", "category"], name: "index_carcass_elements_on_code_and_category", unique: true, using: :btree
  end

  create_table "catalog_categories", force: :cascade do |t|
    t.string   "category_name", null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["category_name"], name: "index_catalog_categories_on_category_name", unique: true, using: :btree
  end

  create_table "catalog_classes", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_catalog_classes_on_name", unique: true, using: :btree
  end

  create_table "catalog_segments", force: :cascade do |t|
    t.string   "segment_name",                 null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.boolean  "marketplace",  default: false
    t.index ["segment_name"], name: "index_catalog_segments_on_segment_name", unique: true, using: :btree
  end

  create_table "catalog_subcategories", force: :cascade do |t|
    t.string   "subcategory_name", null: false
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["subcategory_name"], name: "index_catalog_subcategories_on_subcategory_name", unique: true, using: :btree
  end

  create_table "catalogue_options", force: :cascade do |t|
    t.string   "name"
    t.integer  "master_sub_option_id"
    t.float    "minimum_price"
    t.float    "maximum_price"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["master_sub_option_id"], name: "index_catalogue_options_on_master_sub_option_id", using: :btree
  end

  create_table "catalogue_services", force: :cascade do |t|
    t.string   "name"
    t.string   "image_name"
    t.string   "product_type"
    t.string   "product_subtype"
    t.string   "unique_sku"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.integer  "section_id"
    t.string   "brand"
    t.string   "catalogue_code"
    t.text     "specification"
    t.float    "rate_per_unit"
    t.float    "l1_rate"
    t.float    "l1_quote_price"
    t.float    "l2_rate"
    t.float    "l2_quote_price"
    t.float    "contractor_rate"
    t.float    "contractor_quote_price"
    t.string   "measurement_unit"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["section_id"], name: "index_catalogue_services_on_section_id", using: :btree
  end

  create_table "category_module_types", force: :cascade do |t|
    t.integer  "kitchen_category_id"
    t.integer  "module_type_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["kitchen_category_id", "module_type_id"], name: "index_category_module_types_on_category_and_module_type", unique: true, using: :btree
    t.index ["kitchen_category_id"], name: "index_category_module_types_on_kitchen_category_id", using: :btree
    t.index ["module_type_id"], name: "index_category_module_types_on_module_type_id", using: :btree
  end

  create_table "category_subcategory_mappings", force: :cascade do |t|
    t.integer  "catalog_category_id"
    t.integer  "catalog_subcategory_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["catalog_category_id", "catalog_subcategory_id"], name: "by_category_subcategory", unique: true, using: :btree
    t.index ["catalog_category_id"], name: "index_category_subcategory_mappings_on_catalog_category_id", using: :btree
    t.index ["catalog_subcategory_id"], name: "index_category_subcategory_mappings_on_catalog_subcategory_id", using: :btree
  end

  create_table "cities", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "city_users", force: :cascade do |t|
    t.integer  "city_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["city_id"], name: "index_city_users_on_city_id", using: :btree
    t.index ["user_id"], name: "index_city_users_on_user_id", using: :btree
  end

  create_table "civil_kitchen_parameters", force: :cascade do |t|
    t.integer  "depth"
    t.integer  "drawer_height_1"
    t.integer  "drawer_height_2"
    t.integer  "drawer_height_3"
    t.integer  "boq_global_config_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["boq_global_config_id"], name: "index_civil_kitchen_parameters_on_boq_global_config_id", using: :btree
  end

  create_table "clubbed_jobs", force: :cascade do |t|
    t.integer  "quotation_id"
    t.string   "label"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["quotation_id"], name: "index_clubbed_jobs_on_quotation_id", using: :btree
  end

  create_table "cm_mkw_variable_pricings", force: :cascade do |t|
    t.json    "full_home_factors", default: {}, null: false
    t.json    "mkw_factors",       default: {}, null: false
    t.integer "cm_id"
    t.index ["cm_id"], name: "index_cm_mkw_variable_pricings_on_cm_id", using: :btree
  end

  create_table "cm_tag_mappings", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_cm_tag_mappings_on_tag_id", using: :btree
    t.index ["user_id"], name: "index_cm_tag_mappings_on_user_id", using: :btree
  end

  create_table "combined_doors", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.float    "price"
    t.integer  "brand_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["brand_id"], name: "index_combined_doors_on_brand_id", using: :btree
    t.index ["code"], name: "index_combined_doors_on_code", unique: true, using: :btree
  end

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "commentable_type"
    t.integer  "commentable_id"
    t.integer  "comment_for"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "body"
    t.index ["commentable_type", "commentable_id"], name: "index_comments_on_commentable_type_and_commentable_id", using: :btree
    t.index ["user_id"], name: "index_comments_on_user_id", using: :btree
  end

  create_table "contacts", force: :cascade do |t|
    t.string   "phone_number"
    t.string   "source"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "contents", force: :cascade do |t|
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.string   "document_file_name"
    t.string   "document_content_type"
    t.integer  "document_file_size"
    t.datetime "document_updated_at"
    t.string   "scope"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.integer  "pdf_page_count"
    t.index ["ownerable_type", "ownerable_id"], name: "index_contents_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "core_material_prices", force: :cascade do |t|
    t.float    "thickness"
    t.float    "price"
    t.integer  "core_material_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "category",         default: "kitchen"
    t.index ["core_material_id"], name: "index_core_material_prices_on_core_material_id", using: :btree
    t.index ["thickness", "core_material_id", "category"], name: "by_thickness_core_material_id_category", unique: true, using: :btree
  end

  create_table "core_materials", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "lead_time",        default: 0
    t.boolean  "hidden",           default: true
    t.boolean  "arrivae_select",   default: false, null: false
    t.boolean  "modspace_visible", default: false, null: false
    t.boolean  "modspace_shutter", default: false, null: false
    t.index ["name"], name: "index_core_materials_on_name", unique: true, using: :btree
  end

  create_table "core_shutter_mappings", force: :cascade do |t|
    t.string   "mapping_type",        default: "arrivae", null: false
    t.integer  "core_material_id"
    t.integer  "shutter_material_id"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.index ["core_material_id"], name: "index_core_shutter_mappings_on_core_material_id", using: :btree
    t.index ["mapping_type", "core_material_id", "shutter_material_id"], name: "index_type_core_shutter", unique: true, using: :btree
    t.index ["shutter_material_id"], name: "index_core_shutter_mappings_on_shutter_material_id", using: :btree
  end

  create_table "custom_elements", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "name"
    t.string   "dimension"
    t.string   "core_material"
    t.string   "shutter_finish"
    t.text     "designer_remark"
    t.string   "photo_file_name"
    t.string   "photo_content_type"
    t.integer  "photo_file_size"
    t.datetime "photo_updated_at"
    t.float    "ask_price"
    t.float    "price"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.text     "category_remark"
    t.string   "status",             default: "pending"
    t.boolean  "seen_by_category",   default: false
    t.integer  "asked_timeline",     default: 0
    t.integer  "timeline",           default: 0
    t.string   "space"
    t.string   "category_split"
    t.index ["project_id"], name: "index_custom_elements_on_project_id", using: :btree
  end

  create_table "custom_jobs", force: :cascade do |t|
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.string   "name"
    t.string   "space"
    t.integer  "quantity"
    t.float    "rate"
    t.float    "amount"
    t.integer  "custom_element_id"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.float    "estimated_cogs",    default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",            default: false, null: false
    t.index ["clubbed_job_id"], name: "index_custom_jobs_on_clubbed_job_id", using: :btree
    t.index ["custom_element_id"], name: "index_custom_jobs_on_custom_element_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_custom_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["tag_id"], name: "index_custom_jobs_on_tag_id", using: :btree
  end

  create_table "customer_inspirations", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_customer_inspirations_on_user_id", using: :btree
  end

  create_table "customer_profiles", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "contact_no"
    t.datetime "dob"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "city"
    t.string   "state"
    t.string   "pincode"
    t.string   "gender"
    t.string   "educational_background"
    t.string   "professional_background"
    t.string   "sector_employed"
    t.string   "income_per_annum"
    t.string   "family_status"
    t.string   "marital_status"
    t.string   "joint_family_status"
    t.string   "no_of_family_members"
    t.string   "co_decision_maker"
    t.string   "co_decision_maker_name"
    t.string   "co_decision_maker_email"
    t.string   "co_decision_maker_phone"
    t.datetime "co_decision_maker_dob"
    t.string   "relation_with_decision_maker"
    t.string   "co_decision_maker_educational_background"
    t.string   "co_decision_maker_professional_background"
    t.string   "co_decision_maker_sector_employed"
    t.string   "co_decision_maker_income_per_annum"
    t.datetime "movein_date"
    t.string   "purpose_of_house"
    t.integer  "project_id"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.index ["project_id"], name: "index_customer_profiles_on_project_id", using: :btree
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree
  end

  create_table "delivery_states", force: :cascade do |t|
    t.integer  "job_element_id"
    t.text     "remarks"
    t.integer  "created_by"
    t.string   "status"
    t.text     "dispached_items"
    t.text     "pending_items"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["job_element_id"], name: "index_delivery_states_on_job_element_id", using: :btree
  end

  create_table "designer_booking_forms", force: :cascade do |t|
    t.string   "customer_name"
    t.integer  "customer_age"
    t.string   "profession"
    t.string   "family_profession"
    t.string   "age_house"
    t.text     "lifestyle"
    t.text     "house_positive_features"
    t.text     "house_negative_features"
    t.string   "inspiration"
    t.string   "inspiration_image_file_name"
    t.string   "inspiration_image_content_type"
    t.integer  "inspiration_image_file_size"
    t.datetime "inspiration_image_updated_at"
    t.string   "color_tones"
    t.string   "theme"
    t.string   "functionality"
    t.string   "false_ceiling"
    t.string   "electrical_points"
    t.string   "special_needs"
    t.text     "vastu_shastra"
    t.string   "all_at_once"
    t.float    "budget_range"
    t.string   "design_style_tastes"
    t.string   "storage_space"
    t.string   "mood"
    t.string   "enhancements"
    t.string   "discuss_in_person"
    t.integer  "mk_age"
    t.string   "mk_gut_kitchen"
    t.string   "mk_same_layout"
    t.text     "mk_improvements"
    t.string   "mk_special_requirements"
    t.text     "mk_cooking_details"
    t.string   "mk_appliances"
    t.string   "mk_family_eating_area"
    t.string   "mk_guest_frequence"
    t.string   "mk_storage_patterns"
    t.string   "mk_cabinet_finishing"
    t.string   "mk_countertop_materials"
    t.string   "mk_mood"
    t.integer  "project_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["project_id"], name: "index_designer_booking_forms_on_project_id", using: :btree
  end

  create_table "designer_details", force: :cascade do |t|
    t.integer  "designer_id"
    t.string   "instagram_handle"
    t.string   "designer_cv_file_name"
    t.string   "designer_cv_content_type"
    t.integer  "designer_cv_file_size"
    t.datetime "designer_cv_updated_at"
    t.boolean  "active",                   default: true
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.index ["designer_id"], name: "index_designer_details_on_designer_id", using: :btree
  end

  create_table "designer_projects", force: :cascade do |t|
    t.integer  "designer_id"
    t.integer  "project_id"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.string   "customer_status",       default: "qualified"
    t.datetime "customer_meeting_time"
    t.string   "customer_remarks"
    t.string   "mail_token"
    t.integer  "token_uses_left",       default: 0,           null: false
    t.integer  "lead_id"
    t.boolean  "active",                default: false
    t.integer  "count_of_calls"
    t.index ["lead_id"], name: "index_designer_projects_on_lead_id", using: :btree
    t.index ["mail_token"], name: "index_designer_projects_on_mail_token", unique: true, using: :btree
    t.index ["project_id"], name: "index_designer_projects_on_project_id", using: :btree
  end

  create_table "designs", force: :cascade do |t|
    t.string   "name"
    t.integer  "floorplan_id"
    t.text     "details"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "designer_id"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.integer  "status",                       default: 0
    t.string   "design_type"
    t.index ["floorplan_id"], name: "index_designs_on_floorplan_id", using: :btree
  end

  create_table "dispatch_readinesses", force: :cascade do |t|
    t.integer  "job_element_id"
    t.datetime "readiness_date"
    t.text     "remarks"
    t.integer  "created_by"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["job_element_id"], name: "index_dispatch_readinesses_on_job_element_id", using: :btree
  end

  create_table "dispatch_schedules", force: :cascade do |t|
    t.integer  "job_element_id"
    t.text     "remarks"
    t.string   "site"
    t.string   "billing_address"
    t.string   "shipping_address"
    t.integer  "created_by"
    t.string   "status"
    t.datetime "schedule_date"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.text     "dispached_items"
    t.text     "pending_items"
    t.text     "dispatched_by"
    t.index ["job_element_id"], name: "index_dispatch_schedules_on_job_element_id", using: :btree
  end

  create_table "dm_cm_mappings", force: :cascade do |t|
    t.integer  "dm_id"
    t.integer  "cm_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cm_id"], name: "index_dm_cm_mappings_on_cm_id", using: :btree
    t.index ["dm_id", "cm_id"], name: "index_dm_cm_mappings_on_dm_id_and_cm_id", unique: true, using: :btree
    t.index ["dm_id"], name: "index_dm_cm_mappings_on_dm_id", using: :btree
  end

  create_table "documents_urls", force: :cascade do |t|
    t.text     "url"
    t.string   "type_of_url"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "dp_questionnaires", force: :cascade do |t|
    t.integer  "designer_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["designer_id"], name: "index_dp_questionnaires_on_designer_id", using: :btree
  end

  create_table "dpq_answers", force: :cascade do |t|
    t.integer  "dpq_question_id"
    t.integer  "dp_questionnaire_id"
    t.text     "answer"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.boolean  "skipped"
    t.index ["dp_questionnaire_id"], name: "index_dpq_answers_on_dp_questionnaire_id", using: :btree
    t.index ["dpq_question_id"], name: "index_dpq_answers_on_dpq_question_id", using: :btree
  end

  create_table "dpq_projects", force: :cascade do |t|
    t.string   "customer_name"
    t.string   "project_type"
    t.string   "budget"
    t.string   "area"
    t.string   "client_pitches_and_design_approval"
    t.integer  "dpq_section_id"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.integer  "dp_questionnaire_id"
    t.index ["dp_questionnaire_id"], name: "index_dpq_projects_on_dp_questionnaire_id", using: :btree
    t.index ["dpq_section_id"], name: "index_dpq_projects_on_dpq_section_id", using: :btree
  end

  create_table "dpq_questions", force: :cascade do |t|
    t.integer  "dpq_section_id"
    t.text     "question"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["dpq_section_id"], name: "index_dpq_questions_on_dpq_section_id", using: :btree
  end

  create_table "dpq_sections", force: :cascade do |t|
    t.string   "section_name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "ec_visitors", id: :bigserial, force: :cascade do |t|
    t.string   "ec_center_name"
    t.string   "name"
    t.string   "contact"
    t.text     "reason_for_visit"
    t.datetime "checkin_time"
    t.datetime "checkout_time"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "edge_banding_shades", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.string   "shade_image_file_name"
    t.string   "shade_image_content_type"
    t.integer  "shade_image_file_size"
    t.datetime "shade_image_updated_at"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["code"], name: "index_edge_banding_shades_on_code", unique: true, using: :btree
  end

  create_table "elevations", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_elevations_on_project_id", using: :btree
  end

  create_table "event_users", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.boolean  "host"
    t.boolean  "attendence"
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_users_on_event_id", using: :btree
    t.index ["user_id"], name: "index_event_users_on_user_id", using: :btree
  end

  create_table "events", force: :cascade do |t|
    t.string   "agenda"
    t.string   "description"
    t.datetime "scheduled_at"
    t.string   "status",                 default: "scheduled"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.string   "location"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "contact_type"
    t.string   "remark"
    t.string   "mom_status",             default: "pending"
    t.text     "mom_description"
    t.string   "review_location"
    t.string   "recording_file_name"
    t.string   "recording_content_type"
    t.integer  "recording_file_size"
    t.datetime "recording_updated_at"
    t.index ["ownerable_type", "ownerable_id"], name: "index_events_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "extra_jobs", force: :cascade do |t|
    t.string   "name"
    t.float    "rate"
    t.float    "quantity"
    t.float    "amount"
    t.string   "space"
    t.string   "vendor_sku"
    t.string   "specifications"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "addon_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.float    "estimated_cogs",       default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",               default: false, null: false
    t.integer  "addon_combination_id"
    t.string   "category"
    t.index ["addon_combination_id"], name: "index_extra_jobs_on_addon_combination_id", using: :btree
    t.index ["addon_id"], name: "index_extra_jobs_on_addon_id", using: :btree
    t.index ["clubbed_job_id"], name: "index_extra_jobs_on_clubbed_job_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_extra_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["tag_id"], name: "index_extra_jobs_on_tag_id", using: :btree
  end

  create_table "factories", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "factory_processes", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.integer  "factory_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "fb_leadgens", force: :cascade do |t|
    t.bigint   "leadgen_id"
    t.datetime "fb_created_time"
    t.bigint   "form_id"
    t.bigint   "ad_id"
    t.bigint   "page_id"
    t.bigint   "adgroup_id"
    t.string   "field"
    t.json     "fb_payload_body"
    t.integer  "lead_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "contact"
    t.index ["lead_id"], name: "index_fb_leadgens_on_lead_id", using: :btree
  end

  create_table "floor_plan_crawls", force: :cascade do |t|
    t.text   "url"
    t.string "source_crawl_id"
    t.string "source"
  end

  create_table "floorplans", force: :cascade do |t|
    t.string   "name"
    t.integer  "project_id"
    t.string   "url"
    t.text     "details"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.index ["project_id"], name: "index_floorplans_on_project_id", using: :btree
  end

  create_table "gm_cm_mappings", force: :cascade do |t|
    t.integer  "gm_id"
    t.integer  "cm_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cm_id"], name: "index_gm_cm_mappings_on_cm_id", using: :btree
    t.index ["gm_id", "cm_id"], name: "index_gm_cm_mappings_on_gm_id_and_cm_id", unique: true, using: :btree
    t.index ["gm_id"], name: "index_gm_cm_mappings_on_gm_id", using: :btree
  end

  create_table "gst_numbers", force: :cascade do |t|
    t.string   "gst_reg_no"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["ownerable_type", "ownerable_id"], name: "index_gst_numbers_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "handles", force: :cascade do |t|
    t.string   "code"
    t.string   "handle_type"
    t.float    "price"
    t.string   "handle_image_file_name"
    t.string   "handle_image_content_type"
    t.integer  "handle_image_file_size"
    t.datetime "handle_image_updated_at"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "category"
    t.float    "mrp"
    t.string   "vendor_sku"
    t.string   "spec"
    t.string   "make"
    t.string   "unit"
    t.integer  "lead_time",                 default: 0
    t.boolean  "arrivae_select",            default: false,    null: false
    t.string   "handle_class",              default: "normal", null: false
    t.boolean  "hidden",                    default: false,    null: false
    t.boolean  "modspace",                  default: false,    null: false
    t.index ["code", "category"], name: "index_handles_on_code_and_category", unique: true, using: :btree
  end

  create_table "hardware_element_types", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "category"], name: "index_hardware_element_types_on_name_and_category", unique: true, using: :btree
  end

  create_table "hardware_elements", force: :cascade do |t|
    t.string   "code"
    t.string   "category"
    t.string   "unit"
    t.float    "price"
    t.integer  "brand_id"
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.integer  "hardware_type_id"
    t.integer  "hardware_element_type_id"
    t.index ["brand_id"], name: "index_hardware_elements_on_brand_id", using: :btree
    t.index ["code", "category", "brand_id"], name: "index_hardware_elements_on_code_and_category_and_brand_id", unique: true, using: :btree
    t.index ["hardware_element_type_id"], name: "index_hardware_elements_on_hardware_element_type_id", using: :btree
    t.index ["hardware_type_id"], name: "index_hardware_elements_on_hardware_type_id", using: :btree
  end

  create_table "hardware_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_hardware_types_on_name", unique: true, using: :btree
  end

  create_table "imos_mappings", force: :cascade do |t|
    t.string   "imos_code"
    t.string   "mapping_type"
    t.string   "sli_group_code"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["imos_code"], name: "index_imos_mappings_on_imos_code", unique: true, using: :btree
  end

  create_table "inhouse_calls", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "call_from"
    t.integer  "call_to_id"
    t.string   "call_to_type"
    t.string   "call_to"
    t.string   "call_for"
    t.json     "call_response"
    t.string   "call_type",     default: "outgoing"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.string   "contact_type",  default: "call"
    t.integer  "lead_id"
    t.string   "sid"
    t.index ["lead_id"], name: "index_inhouse_calls_on_lead_id", using: :btree
    t.index ["user_id"], name: "index_inhouse_calls_on_user_id", using: :btree
  end

  create_table "invoice_line_items", force: :cascade do |t|
    t.string   "line_item_type"
    t.integer  "line_item_id"
    t.integer  "payment_invoice_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.float    "amount",             default: 0.0
    t.index ["line_item_type", "line_item_id"], name: "index_invoice_line_items_on_line_item_type_and_line_item_id", using: :btree
    t.index ["payment_invoice_id"], name: "index_invoice_line_items_on_payment_invoice_id", using: :btree
  end

  create_table "invoices", force: :cascade do |t|
    t.string   "name"
    t.text     "terms"
    t.float    "net_amount",       default: 0.0
    t.float    "total_amount",     default: 0.0
    t.integer  "status",           default: 0
    t.integer  "project_id"
    t.integer  "user_id"
    t.date     "invoicing_date"
    t.date     "due_date"
    t.integer  "due_in_days",      default: 0
    t.integer  "payment_status",   default: 0
    t.string   "billing_address"
    t.float    "total_discount",   default: 0.0
    t.float    "gross_amount",     default: 0.0
    t.text     "customer_notes"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "reference_number"
    t.integer  "quotation_id"
    t.integer  "designer_id"
    t.index ["designer_id"], name: "index_invoices_on_designer_id", using: :btree
    t.index ["project_id"], name: "index_invoices_on_project_id", using: :btree
    t.index ["quotation_id"], name: "index_invoices_on_quotation_id", using: :btree
    t.index ["user_id"], name: "index_invoices_on_user_id", using: :btree
  end

  create_table "job_addons", force: :cascade do |t|
    t.integer  "modular_job_id"
    t.integer  "addon_id"
    t.integer  "quantity"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.boolean  "compulsory",              default: false
    t.string   "slot"
    t.integer  "brand_id"
    t.integer  "compulsory_job_addon_id"
    t.integer  "addon_combination_id"
    t.index ["addon_combination_id"], name: "index_job_addons_on_addon_combination_id", using: :btree
    t.index ["addon_id"], name: "index_job_addons_on_addon_id", using: :btree
    t.index ["brand_id"], name: "index_job_addons_on_brand_id", using: :btree
    t.index ["compulsory_job_addon_id"], name: "index_job_addons_on_compulsory_job_addon_id", using: :btree
    t.index ["modular_job_id"], name: "index_job_addons_on_modular_job_id", using: :btree
  end

  create_table "job_combined_doors", force: :cascade do |t|
    t.integer  "modular_job_id"
    t.integer  "combined_door_id"
    t.integer  "quantity",         default: 1
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["combined_door_id"], name: "index_job_combined_doors_on_combined_door_id", using: :btree
    t.index ["modular_job_id"], name: "index_job_combined_doors_on_modular_job_id", using: :btree
  end

  create_table "job_element_vendors", force: :cascade do |t|
    t.integer  "job_element_id"
    t.integer  "vendor_id"
    t.string   "description"
    t.float    "cost"
    t.float    "tax_percent"
    t.float    "final_amount"
    t.datetime "deliver_by_date"
    t.boolean  "recommended",                default: false
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.string   "unit_of_measurement"
    t.string   "tax_type"
    t.float    "quantity"
    t.boolean  "added_for_partial_dispatch", default: false
    t.boolean  "po_cancelled_or_modifying",  default: false
    t.index ["job_element_id"], name: "index_job_element_vendors_on_job_element_id", using: :btree
    t.index ["vendor_id"], name: "index_job_element_vendors_on_vendor_id", using: :btree
  end

  create_table "job_elements", force: :cascade do |t|
    t.string   "element_name"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.integer  "quotation_id"
    t.integer  "vendor_product_id"
    t.float    "quantity",                      default: 0.0
    t.string   "unit"
    t.float    "rate",                          default: 0.0
    t.string   "barcode"
    t.string   "imos_type"
    t.string   "imos_sheet"
    t.integer  "imos_row"
    t.string   "qc_date"
    t.integer  "bom_sli_cutting_list_datum_id"
    t.string   "import_type"
    t.boolean  "added_for_partial_dispatch",    default: false
    t.boolean  "po_cancelled_or_modifying",     default: false
    t.float    "attribution_ratio"
    t.index ["bom_sli_cutting_list_datum_id"], name: "index_job_elements_on_bom_sli_cutting_list_datum_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_job_elements_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["quotation_id"], name: "index_job_elements_on_quotation_id", using: :btree
    t.index ["vendor_product_id"], name: "index_job_elements_on_vendor_product_id", using: :btree
  end

  create_table "job_histories", force: :cascade do |t|
    t.string   "job_type"
    t.string   "job_name"
    t.datetime "run_at"
    t.text     "info"
    t.integer  "job_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "kitchen_addon_slots", force: :cascade do |t|
    t.string   "slot_name"
    t.integer  "product_module_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["product_module_id"], name: "index_kitchen_addon_slots_on_product_module_id", using: :btree
  end

  create_table "kitchen_appliances", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.string   "make"
    t.float    "price"
    t.string   "appliance_image_file_name"
    t.string   "appliance_image_content_type"
    t.integer  "appliance_image_file_size"
    t.datetime "appliance_image_updated_at"
    t.integer  "module_type_id"
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.string   "vendor_sku"
    t.string   "specifications"
    t.string   "warranty"
    t.float    "mrp"
    t.integer  "lead_time",                    default: 0
    t.boolean  "arrivae_select",               default: false, null: false
    t.index ["code"], name: "index_kitchen_appliances_on_code", unique: true, using: :btree
    t.index ["module_type_id"], name: "index_kitchen_appliances_on_module_type_id", using: :btree
  end

  create_table "kitchen_categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_kitchen_categories_on_name", unique: true, using: :btree
  end

  create_table "kitchen_module_addon_mappings", force: :cascade do |t|
    t.integer  "kitchen_addon_slot_id"
    t.integer  "addon_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.integer  "addon_combination_id"
    t.index ["addon_combination_id"], name: "index_kitchen_module_addon_mappings_on_addon_combination_id", using: :btree
    t.index ["addon_id"], name: "index_kitchen_module_addon_mappings_on_addon_id", using: :btree
    t.index ["kitchen_addon_slot_id", "addon_combination_id"], name: "by_slot_and_addon_combination", unique: true, using: :btree
    t.index ["kitchen_addon_slot_id"], name: "index_kitchen_module_addon_mappings_on_kitchen_addon_slot_id", using: :btree
  end

  create_table "label_job_elements", force: :cascade do |t|
    t.integer  "boq_label_id"
    t.integer  "job_element_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["boq_label_id"], name: "index_label_job_elements_on_boq_label_id", using: :btree
    t.index ["job_element_id"], name: "index_label_job_elements_on_job_element_id", using: :btree
  end

  create_table "lead_app_banners", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "is_active"
    t.string   "render_screen"
    t.bigint   "user_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["user_id"], name: "index_lead_app_banners_on_user_id", using: :btree
  end

  create_table "lead_app_wallets", id: :bigserial, force: :cascade do |t|
    t.integer  "lead_id"
    t.integer  "user_id"
    t.string   "transaction_id"
    t.decimal  "credit_amount",  precision: 8, scale: 2
    t.integer  "credit_status"
    t.datetime "received_at"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  create_table "lead_campaigns", force: :cascade do |t|
    t.string   "name"
    t.datetime "start_date"
    t.datetime "end_date"
    t.string   "status",               default: "default", null: false
    t.string   "location"
    t.boolean  "not_removable",        default: false,     null: false
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "assigned_cs_agent_id"
    t.index ["assigned_cs_agent_id"], name: "index_lead_campaigns_on_assigned_cs_agent_id", using: :btree
  end

  create_table "lead_priorities", force: :cascade do |t|
    t.integer  "priority_number"
    t.integer  "lead_source_id"
    t.integer  "lead_type_id"
    t.integer  "lead_campaign_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["lead_campaign_id"], name: "index_lead_priorities_on_lead_campaign_id", using: :btree
    t.index ["lead_source_id"], name: "index_lead_priorities_on_lead_source_id", using: :btree
    t.index ["lead_type_id"], name: "index_lead_priorities_on_lead_type_id", using: :btree
    t.index ["priority_number"], name: "index_lead_priorities_on_priority_number", unique: true, using: :btree
  end

  create_table "lead_questionaire_items", force: :cascade do |t|
    t.string   "name",                         null: false
    t.integer  "quantity",       default: 1,   null: false
    t.float    "price",          default: 0.0, null: false
    t.float    "total",          default: 0.0, null: false
    t.integer  "note_record_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["note_record_id"], name: "index_lead_questionaire_items_on_note_record_id", using: :btree
  end

  create_table "lead_queues", force: :cascade do |t|
    t.integer  "priority",         default: 1
    t.string   "status",           default: "queued"
    t.integer  "lead_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "lead_priority_id"
    t.index ["lead_id"], name: "index_lead_queues_on_lead_id", using: :btree
    t.index ["lead_priority_id"], name: "index_lead_queues_on_lead_priority_id", using: :btree
  end

  create_table "lead_sources", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "assigned_cs_agent_id"
    t.index ["assigned_cs_agent_id"], name: "index_lead_sources_on_assigned_cs_agent_id", using: :btree
  end

  create_table "lead_statistics_data", force: :cascade do |t|
    t.datetime "lead_qualification_time"
    t.datetime "first_meeting_time"
    t.datetime "first_shared_time"
    t.datetime "closure_time"
    t.integer  "lead_id"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.float    "first_shared_value",      default: 0.0, null: false
    t.float    "closure_value",           default: 0.0, null: false
    t.datetime "boq_creation_time"
    t.float    "boq_creation_value",      default: 0.0, null: false
    t.datetime "designer_assign_time"
    t.datetime "designer_first_call"
    t.datetime "cm_assigned_date"
    t.float    "boq_shangpin_value",      default: 0.0
    t.float    "closer_shangpin_value",   default: 0.0
    t.index ["lead_id"], name: "index_lead_statistics_data_on_lead_id", using: :btree
  end

  create_table "lead_types", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "assigned_cs_agent_id"
    t.index ["assigned_cs_agent_id"], name: "index_lead_types_on_assigned_cs_agent_id", using: :btree
  end

  create_table "lead_users", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "lead_id"
    t.string   "claimed",       default: "pending"
    t.datetime "processed_at"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.boolean  "active",        default: false
    t.boolean  "seen_by_agent", default: false
    t.index ["lead_id"], name: "index_lead_users_on_lead_id", using: :btree
    t.index ["user_id"], name: "index_lead_users_on_user_id", using: :btree
  end

  create_table "lead_utm_contents", force: :cascade do |t|
    t.text     "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lead_utm_media", force: :cascade do |t|
    t.text     "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lead_utm_terms", force: :cascade do |t|
    t.text     "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "leads", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "contact"
    t.text     "address"
    t.text     "details"
    t.datetime "created_at",                                        null: false
    t.datetime "updated_at",                                        null: false
    t.string   "city"
    t.string   "pincode"
    t.datetime "status_updated_at"
    t.string   "lead_status",             default: "not_attempted", null: false
    t.string   "source",                  default: "digital",       null: false
    t.datetime "follow_up_time"
    t.text     "lost_remark"
    t.integer  "created_by"
    t.boolean  "dummyemail",              default: false
    t.integer  "related_user_id"
    t.boolean  "lead_escalated",          default: false,           null: false
    t.string   "reason_for_escalation"
    t.integer  "lead_campaign_id"
    t.integer  "lead_source_id"
    t.integer  "lead_type_id"
    t.integer  "not_contactable_counter", default: 0,               null: false
    t.string   "drop_reason"
    t.boolean  "duplicate",               default: false
    t.string   "remark"
    t.string   "lost_reason"
    t.string   "instagram_handle"
    t.string   "lead_cv_file_name"
    t.string   "lead_cv_content_type"
    t.integer  "lead_cv_file_size"
    t.datetime "lead_cv_updated_at"
    t.integer  "tag_id"
    t.integer  "assigned_cm_id"
    t.integer  "referrer_id"
    t.string   "referrer_type"
    t.boolean  "is_contact_visible",      default: false
    t.boolean  "from_fasttrack_page",     default: false,           null: false
    t.integer  "lead_utm_content_id"
    t.integer  "lead_utm_medium_id"
    t.integer  "lead_utm_term_id"
    t.boolean  "disable_cm_auto_assign",  default: false
    t.boolean  "is_in_pipeline"
    t.boolean  "is_new",                  default: false
    t.index ["lead_campaign_id"], name: "index_leads_on_lead_campaign_id", using: :btree
    t.index ["lead_source_id"], name: "index_leads_on_lead_source_id", using: :btree
    t.index ["lead_type_id"], name: "index_leads_on_lead_type_id", using: :btree
    t.index ["lead_utm_content_id"], name: "index_leads_on_lead_utm_content_id", using: :btree
    t.index ["lead_utm_medium_id"], name: "index_leads_on_lead_utm_medium_id", using: :btree
    t.index ["lead_utm_term_id"], name: "index_leads_on_lead_utm_term_id", using: :btree
    t.index ["referrer_id"], name: "index_leads_on_referrer_id", using: :btree
    t.index ["related_user_id"], name: "index_leads_on_related_user_id", using: :btree
    t.index ["tag_id"], name: "index_leads_on_tag_id", using: :btree
  end

  create_table "line_item_boms", force: :cascade do |t|
    t.integer  "content_id"
    t.string   "line_item_type"
    t.integer  "line_item_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["content_id"], name: "index_line_item_boms_on_content_id", using: :btree
    t.index ["line_item_type", "line_item_id"], name: "index_line_item_boms_on_line_item_type_and_line_item_id", using: :btree
  end

  create_table "line_markings", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["project_id"], name: "index_line_markings_on_project_id", using: :btree
  end

  create_table "master_line_items", force: :cascade do |t|
    t.string   "mli_name",   null: false
    t.string   "mli_type",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "master_options", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "master_sub_options", force: :cascade do |t|
    t.string   "name"
    t.integer  "master_option_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["master_option_id"], name: "index_master_sub_options_on_master_option_id", using: :btree
  end

  create_table "media_pages", force: :cascade do |t|
    t.string   "logo_file_name"
    t.string   "logo_content_type"
    t.integer  "logo_file_size"
    t.datetime "logo_updated_at"
    t.string   "title"
    t.string   "description"
    t.string   "read_more_url"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "milestones", force: :cascade do |t|
    t.integer  "milestone_object_id"
    t.string   "milestone_object_type"
    t.string   "percentage_amount"
    t.string   "interval"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.text     "description"
    t.datetime "estimate_date"
  end

  create_table "mkw_layouts", force: :cascade do |t|
    t.string   "category"
    t.string   "name"
    t.text     "remark"
    t.boolean  "global",        default: false
    t.integer  "created_by_id"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["created_by_id"], name: "index_mkw_layouts_on_created_by_id", using: :btree
  end

  create_table "mli_attributes", force: :cascade do |t|
    t.string   "attr_name",                                   null: false
    t.string   "attr_type",            default: "text_field"
    t.string   "attr_data_type",       default: "string"
    t.string   "reference_table_name"
    t.boolean  "required",             default: false
    t.integer  "master_line_item_id"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.index ["master_line_item_id"], name: "index_mli_attributes_on_master_line_item_id", using: :btree
  end

  create_table "modspace_cabinet_prices", force: :cascade do |t|
    t.integer  "product_module_id"
    t.integer  "core_shutter_mapping_id"
    t.integer  "shutter_finish_id"
    t.float    "price",                   default: 0.0, null: false
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.index ["core_shutter_mapping_id"], name: "index_modspace_cabinet_prices_on_core_shutter_mapping_id", using: :btree
    t.index ["product_module_id", "core_shutter_mapping_id", "shutter_finish_id"], name: "on_product_module_cs_mapping_and_finish", unique: true, using: :btree
    t.index ["product_module_id"], name: "index_modspace_cabinet_prices_on_product_module_id", using: :btree
    t.index ["shutter_finish_id"], name: "index_modspace_cabinet_prices_on_shutter_finish_id", using: :btree
  end

  create_table "modular_job_costs", force: :cascade do |t|
    t.float    "core_quantity",         default: 0.0
    t.float    "shutter_quantity",      default: 0.0
    t.float    "carcass_cost",          default: 0.0
    t.float    "finish_cost",           default: 0.0
    t.float    "hardware_cost",         default: 0.0
    t.float    "addon_cost",            default: 0.0
    t.float    "handle_cost",           default: 0.0
    t.float    "skirting_cost",         default: 0.0
    t.float    "soft_close_hinge_cost", default: 0.0
    t.float    "modspace_cabinet_cost", default: 0.0
    t.integer  "modular_job_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["modular_job_id"], name: "index_modular_job_costs_on_modular_job_id", using: :btree
  end

  create_table "modular_jobs", force: :cascade do |t|
    t.string   "name"
    t.float    "quantity"
    t.float    "rate"
    t.float    "amount"
    t.string   "space"
    t.string   "category"
    t.string   "dimensions"
    t.string   "core_material"
    t.string   "shutter_material"
    t.string   "shutter_finish"
    t.string   "shutter_shade_code"
    t.string   "skirting_config_type"
    t.string   "skirting_config_height"
    t.string   "door_handle_code"
    t.string   "shutter_handle_code"
    t.string   "hinge_type"
    t.string   "channel_type"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "product_module_id"
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.integer  "number_exposed_sites"
    t.integer  "section_id"
    t.integer  "number_door_handles",     default: 0
    t.integer  "number_shutter_handles",  default: 0
    t.integer  "brand_id"
    t.string   "kitchen_category_name"
    t.integer  "combined_module_id"
    t.boolean  "combined",                default: false
    t.string   "edge_banding_shade_code"
    t.integer  "custom_shelf_unit_width", default: 0
    t.float    "thickness"
    t.float    "length"
    t.float    "breadth"
    t.integer  "width"
    t.integer  "depth"
    t.integer  "height"
    t.float    "estimated_cogs",          default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",                  default: false, null: false
    t.integer  "lead_time",               default: 0,     null: false
    t.string   "lead_time_type"
    t.string   "lead_time_code"
    t.index ["brand_id"], name: "index_modular_jobs_on_brand_id", using: :btree
    t.index ["clubbed_job_id"], name: "index_modular_jobs_on_clubbed_job_id", using: :btree
    t.index ["combined_module_id"], name: "index_modular_jobs_on_combined_module_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_modular_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["product_module_id"], name: "index_modular_jobs_on_product_module_id", using: :btree
    t.index ["section_id"], name: "index_modular_jobs_on_section_id", using: :btree
    t.index ["tag_id"], name: "index_modular_jobs_on_tag_id", using: :btree
  end

  create_table "modular_products", force: :cascade do |t|
    t.string   "name"
    t.string   "modular_product_type"
    t.string   "space"
    t.float    "price"
    t.integer  "section_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["section_id"], name: "index_modular_products_on_section_id", using: :btree
  end

  create_table "module_carcass_elements", force: :cascade do |t|
    t.integer  "product_module_id"
    t.integer  "carcass_element_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.integer  "quantity"
    t.index ["carcass_element_id", "product_module_id"], name: "index_module_carcass_elements_on_carcass_element_and_module", unique: true, using: :btree
    t.index ["carcass_element_id"], name: "index_module_carcass_elements_on_carcass_element_id", using: :btree
    t.index ["product_module_id"], name: "index_module_carcass_elements_on_product_module_id", using: :btree
  end

  create_table "module_hardware_elements", force: :cascade do |t|
    t.integer  "product_module_id"
    t.integer  "hardware_element_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.integer  "quantity"
    t.index ["hardware_element_id", "product_module_id"], name: "index_module_hardware_elements_on_hardware_element_and_module", unique: true, using: :btree
    t.index ["hardware_element_id"], name: "index_module_hardware_elements_on_hardware_element_id", using: :btree
    t.index ["product_module_id"], name: "index_module_hardware_elements_on_product_module_id", using: :btree
  end

  create_table "module_types", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "category"], name: "index_module_types_on_name_and_category", unique: true, using: :btree
  end

  create_table "note_records", force: :cascade do |t|
    t.text     "notes"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "user_id"
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.string   "customer_name"
    t.string   "phone"
    t.string   "project_name"
    t.string   "city"
    t.text     "location"
    t.string   "project_type"
    t.string   "accomodation_type"
    t.text     "scope_of_work",                  default: [],                 array: true
    t.string   "possession_status"
    t.string   "have_homeloan"
    t.string   "call_back_day"
    t.string   "call_back_time"
    t.string   "have_floorplan"
    t.string   "lead_generator"
    t.text     "additional_comments"
    t.string   "remarks_of_sow"
    t.string   "possession_status_date"
    t.string   "home_value"
    t.string   "budget_value"
    t.string   "lead_floorplan_file_name"
    t.string   "lead_floorplan_content_type"
    t.integer  "lead_floorplan_file_size"
    t.datetime "lead_floorplan_updated_at"
    t.string   "society"
    t.string   "lead_source"
    t.string   "home_type"
    t.text     "cm_comments"
    t.text     "designer_comments"
    t.string   "type_of_space"
    t.string   "area_of_site"
    t.string   "status_of_property"
    t.datetime "project_commencement_date"
    t.string   "address_of_site"
    t.string   "layout_and_photographs_of_site"
    t.datetime "intended_date"
    t.string   "financial_solution_required"
    t.boolean  "site_measurement_required",      default: false
    t.datetime "site_measurement_date"
    t.boolean  "visit_ec",                       default: false
    t.datetime "visit_ec_date"
    t.string   "new_society_value"
    t.string   "new_city_value"
    t.string   "new_locality_value"
    t.datetime "good_time_to_call"
    t.integer  "building_crawler_id"
    t.string   "purpose_of_property"
    t.index ["building_crawler_id"], name: "index_note_records_on_building_crawler_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_note_records_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "office_activity_logs", id: :bigserial, force: :cascade do |t|
    t.jsonb    "user",       default: "{}", null: false
    t.jsonb    "log",        default: "{}", null: false
    t.string   "action"
    t.string   "controller"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_attendances", id: :bigserial, force: :cascade do |t|
    t.integer  "office_user_id"
    t.integer  "office_project_id"
    t.datetime "checkin_time"
    t.datetime "checkout_time"
    t.decimal  "checkin_lng",       precision: 10, scale: 6
    t.decimal  "checkin_lat",       precision: 10, scale: 6
    t.decimal  "checkout_lng",      precision: 10, scale: 6
    t.decimal  "checkout_lat",      precision: 10, scale: 6
    t.datetime "created_at",                                                null: false
    t.datetime "updated_at",                                                null: false
    t.integer  "project_id"
    t.boolean  "is_active",                                  default: true, null: false
  end

  create_table "office_client_communication_matrices", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.string   "contact_number"
    t.string   "email"
    t.string   "scope_of_issues",   default: [],                array: true
    t.integer  "level"
    t.boolean  "is_active",         default: true
    t.bigint   "office_client_id"
    t.bigint   "office_project_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["office_client_id"], name: "index_office_client_communication_matrices_on_office_client_id", using: :btree
    t.index ["office_project_id"], name: "index_office_client_communication_matrices_on_office_project_id", using: :btree
  end

  create_table "office_clients", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "contact_number"
    t.boolean  "is_active",      default: true
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
  end

  create_table "office_customer_reports", id: :bigserial, force: :cascade do |t|
    t.text     "remark"
    t.datetime "shared_datetime"
    t.boolean  "is_active",       default: true, null: false
    t.integer  "project_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  create_table "office_files", id: :bigserial, force: :cascade do |t|
    t.string   "file"
    t.boolean  "is_active",         default: true
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "fileable_id"
    t.string   "fileable_type"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.index ["fileable_type", "fileable_id"], name: "index_office_files_on_fileable_type_and_fileable_id", using: :btree
  end

  create_table "office_labour_plans", id: :bigserial, force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "office_user_id"
    t.date     "planned_date"
    t.integer  "vendor_id"
    t.jsonb    "plumber",        default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "electrician",    default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "painter",        default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "pop",            default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "installer",      default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "service1",       default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "service2",       default: {"actual"=>0, "planned"=>0}, null: false
    t.jsonb    "others",         default: {"actual"=>0, "planned"=>0}, null: false
    t.boolean  "is_active",      default: true,                        null: false
    t.datetime "created_at",                                           null: false
    t.datetime "updated_at",                                           null: false
  end

  create_table "office_mistake_heads", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_moodboard_ppts", id: :bigserial, force: :cascade do |t|
    t.integer  "office_user_id"
    t.string   "url"
    t.string   "contact"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "lead_id"
    t.integer  "user_id"
    t.integer  "designer_id"
  end

  create_table "office_moodboards", id: :bigserial, force: :cascade do |t|
    t.string   "mood_type"
    t.integer  "size"
    t.integer  "low_price"
    t.integer  "high_price"
    t.integer  "boq_value"
    t.text     "scope_of_work"
    t.string   "image_1"
    t.string   "image_2"
    t.string   "image_3"
    t.integer  "layout"
    t.boolean  "is_active",     default: true
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "thumbnail"
    t.string   "category"
  end

  create_table "office_omcms", id: :bigserial, force: :cascade do |t|
    t.bigint   "office_user_id"
    t.bigint   "user_id"
    t.boolean  "is_active",      default: true
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["office_user_id"], name: "index_office_omcms_on_office_user_id", using: :btree
    t.index ["user_id"], name: "index_office_omcms_on_user_id", using: :btree
  end

  create_table "office_payments", id: :bigserial, force: :cascade do |t|
    t.integer  "office_ticket_id"
    t.decimal  "amount"
    t.string   "payment_option"
    t.integer  "office_paytm_payment_id"
    t.integer  "office_payer_id"
    t.integer  "office_payee_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.text     "note"
    t.integer  "payment_status",          default: 0
  end

  create_table "office_paytm_payments", id: :bigserial, force: :cascade do |t|
    t.integer  "user_id"
    t.string   "user_name"
    t.string   "user_email"
    t.integer  "office_user_id"
    t.string   "user_contact"
    t.decimal  "amount"
    t.integer  "wallet_sys_txn_id"
    t.string   "txn_status"
    t.string   "txn_status_code"
    t.string   "txn_status_message"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "office_peoms", id: :bigserial, force: :cascade do |t|
    t.integer  "office_project_engineer_id"
    t.integer  "office_operational_manager_id"
    t.boolean  "is_active",                     default: true
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
  end

  create_table "office_pesses", id: :bigserial, force: :cascade do |t|
    t.integer  "office_project_engineer_id"
    t.integer  "office_site_supervisor_id"
    t.boolean  "is_active",                  default: true
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
  end

  create_table "office_project_handovers", id: :bigserial, force: :cascade do |t|
    t.text     "remark"
    t.integer  "raised_by"
    t.integer  "approved_by"
    t.bigint   "project_id"
    t.boolean  "is_approved",   default: false, null: false
    t.boolean  "is_active",     default: true,  null: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.datetime "approved_date"
    t.index ["project_id"], name: "index_office_project_handovers_on_project_id", using: :btree
  end

  create_table "office_project_users", id: :bigserial, force: :cascade do |t|
    t.integer  "office_user_id"
    t.integer  "office_project_id"
    t.integer  "office_role_id"
    t.boolean  "is_active",         default: true
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.string   "project_type"
    t.integer  "user_id"
    t.integer  "project_id"
    t.integer  "role_id"
  end

  create_table "office_project_vendors", id: :bigserial, force: :cascade do |t|
    t.bigint   "project_id"
    t.bigint   "vendor_id"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["project_id"], name: "index_office_project_vendors_on_project_id", using: :btree
    t.index ["vendor_id"], name: "index_office_project_vendors_on_vendor_id", using: :btree
  end

  create_table "office_projects", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.string   "city"
    t.string   "address"
    t.string   "pin_code"
    t.decimal  "area"
    t.boolean  "is_active",                                  default: true
    t.datetime "created_at",                                                null: false
    t.datetime "updated_at",                                                null: false
    t.datetime "end_date"
    t.datetime "start_date"
    t.decimal  "latitude",         precision: 15, scale: 10
    t.decimal  "longitude",        precision: 15, scale: 10
    t.bigint   "office_client_id"
    t.index ["office_client_id"], name: "index_office_projects_on_office_client_id", using: :btree
  end

  create_table "office_roles", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.boolean  "is_active",  default: true
  end

  create_table "office_snag_nature_of_issues", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_snags", id: :bigserial, force: :cascade do |t|
    t.integer  "project_id"
    t.string   "unique_id"
    t.integer  "user_id"
    t.string   "product"
    t.text     "description"
    t.text     "item_required"
    t.boolean  "is_active",                      default: true
    t.datetime "created_at",                                     null: false
    t.datetime "updated_at",                                     null: false
    t.integer  "status",                         default: 0
    t.string   "size"
    t.string   "quantity"
    t.boolean  "is_urgent",                      default: false, null: false
    t.integer  "office_mistake_head_id"
    t.integer  "office_snag_nature_of_issue_id"
    t.boolean  "is_approved"
    t.datetime "approved_on"
  end

  create_table "office_spaces", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_sub_tasks", id: :bigserial, force: :cascade do |t|
    t.bigint   "office_task_id"
    t.text     "remark"
    t.integer  "labour_count"
    t.boolean  "is_active",      default: true
    t.float    "quantity"
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["office_task_id"], name: "index_office_sub_tasks_on_office_task_id", using: :btree
  end

  create_table "office_tasks", id: :bigserial, force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "office_user_id"
    t.integer  "office_vendor_id"
    t.string   "name"
    t.text     "description"
    t.datetime "start_date_time"
    t.datetime "end_date_time"
    t.integer  "dependent_on"
    t.boolean  "is_active",                default: true
    t.integer  "status",                   default: 0
    t.datetime "created_at",                                    null: false
    t.datetime "updated_at",                                    null: false
    t.string   "unit_of_measurement"
    t.string   "quantity"
    t.integer  "labour_count",             default: 0
    t.datetime "plan_start_date_time"
    t.datetime "plan_end_date_time"
    t.integer  "office_space_id"
    t.string   "office_task_type",         default: "services"
    t.date     "installation_date"
    t.integer  "material_delivery_status"
    t.date     "material_delivery_date"
    t.string   "line_item"
  end

  create_table "office_ticket_categories", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_tickets", id: :bigserial, force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "task_id"
    t.integer  "user_id"
    t.text     "description"
    t.decimal  "price"
    t.boolean  "is_active",                 default: true
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.integer  "status",                    default: 0
    t.datetime "closed_date"
    t.string   "unique_id"
    t.integer  "payment_status",            default: 0
    t.bigint   "office_ticket_category_id"
    t.string   "quantity"
    t.boolean  "is_urgent",                 default: false
    t.boolean  "is_approved"
    t.datetime "approved_on"
    t.index ["office_ticket_category_id"], name: "index_office_tickets_on_office_ticket_category_id", using: :btree
  end

  create_table "office_updates", id: :bigserial, force: :cascade do |t|
    t.text     "remark"
    t.boolean  "is_client_mom",   default: false, null: false
    t.integer  "office_visit_id"
    t.boolean  "is_active",       default: true,  null: false
    t.string   "updateable_type"
    t.bigint   "updateable_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["updateable_type", "updateable_id"], name: "index_office_updates_on_updateable_type_and_updateable_id", using: :btree
  end

  create_table "office_user_site_measurement_requests", id: :bigserial, force: :cascade do |t|
    t.integer  "office_user_id"
    t.integer  "site_measurement_request_id"
    t.boolean  "completed",                   default: false
    t.datetime "completed_at"
    t.boolean  "is_active",                   default: true
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
  end

  create_table "office_users", id: :bigserial, force: :cascade do |t|
    t.string   "provider",               default: "email", null: false
    t.string   "uid",                    default: "",      null: false
    t.string   "encrypted_password",     default: "",      null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean  "allow_password_change",  default: false
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,       null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "name"
    t.string   "nickname"
    t.string   "image"
    t.string   "email"
    t.json     "tokens"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.bigint   "office_role_id"
    t.boolean  "is_active",              default: true
    t.string   "contact"
    t.string   "pe_type"
    t.index ["confirmation_token"], name: "index_office_users_on_confirmation_token", unique: true, using: :btree
    t.index ["email"], name: "index_office_users_on_email", unique: true, using: :btree
    t.index ["office_role_id"], name: "index_office_users_on_office_role_id", using: :btree
    t.index ["reset_password_token"], name: "index_office_users_on_reset_password_token", unique: true, using: :btree
    t.index ["uid", "provider"], name: "index_office_users_on_uid_and_provider", unique: true, using: :btree
  end

  create_table "office_vendor_categories", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.string   "short_name"
    t.boolean  "is_active",  default: true
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "office_vendors", id: :bigserial, force: :cascade do |t|
    t.string   "company_name"
    t.string   "contact_person"
    t.string   "contact"
    t.string   "email"
    t.text     "scope_of_work"
    t.boolean  "is_active",                 default: true
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "office_vendor_category_id"
  end

  create_table "office_visits", id: :bigserial, force: :cascade do |t|
    t.datetime "scheduled_datetime"
    t.boolean  "is_active",          default: true, null: false
    t.integer  "project_id"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.integer  "office_user_id"
  end

  create_table "operations", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.integer  "sub_factory_process_id"
    t.datetime "start_date_time"
    t.datetime "end_date_time"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "payment_invoices", force: :cascade do |t|
    t.string   "invoice_number"
    t.string   "status",                default: "pending"
    t.datetime "sharing_date"
    t.string   "label"
    t.string   "hsn_code"
    t.integer  "project_id"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.integer  "parent_invoice_id"
    t.float    "amount",                default: 0.0
    t.boolean  "is_parent_invoice",     default: false
    t.string   "document_file_name"
    t.string   "document_content_type"
    t.integer  "document_file_size"
    t.datetime "document_updated_at"
    t.index ["parent_invoice_id"], name: "index_payment_invoices_on_parent_invoice_id", using: :btree
    t.index ["project_id"], name: "index_payment_invoices_on_project_id", using: :btree
  end

  create_table "payments", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "quotation_id"
    t.string   "payment_type"
    t.float    "amount_to_be_paid"
    t.string   "mode_of_payment"
    t.string   "bank"
    t.string   "branch"
    t.date     "date_of_checque"
    t.float    "amount"
    t.datetime "date"
    t.boolean  "is_approved"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "payment_status"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "remarks"
    t.string   "payment_stage"
    t.string   "transaction_number"
    t.integer  "ownerable_id"
    t.string   "ownerable_type"
    t.string   "description"
    t.datetime "finance_approved_at"
    t.index ["project_id"], name: "index_payments_on_project_id", using: :btree
    t.index ["quotation_id"], name: "index_payments_on_quotation_id", using: :btree
  end

  create_table "performa_invoice_files", force: :cascade do |t|
    t.integer  "performa_invoice_id"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.boolean  "tax_invoice",                  default: false
    t.datetime "created_at",                                   null: false
    t.datetime "updated_at",                                   null: false
    t.index ["performa_invoice_id"], name: "index_performa_invoice_files_on_performa_invoice_id", using: :btree
  end

  create_table "performa_invoices", force: :cascade do |t|
    t.integer  "quotation_id"
    t.integer  "vendor_id"
    t.float    "amount"
    t.string   "description"
    t.string   "reference_no"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.float    "base_amount",            default: 0.0
    t.float    "tax_percent",            default: 0.0
    t.string   "pi_upload_file_name"
    t.string   "pi_upload_content_type"
    t.integer  "pi_upload_file_size"
    t.datetime "pi_upload_updated_at"
    t.integer  "purchase_order_id"
    t.index ["purchase_order_id"], name: "index_performa_invoices_on_purchase_order_id", using: :btree
    t.index ["quotation_id"], name: "index_performa_invoices_on_quotation_id", using: :btree
    t.index ["vendor_id"], name: "index_performa_invoices_on_vendor_id", using: :btree
  end

  create_table "pi_payments", force: :cascade do |t|
    t.string   "description",                                 null: false
    t.string   "remarks"
    t.float    "percentage",                                  null: false
    t.string   "payment_status",          default: "pending", null: false
    t.datetime "status_updated_at"
    t.datetime "payment_due_date"
    t.integer  "performa_invoice_id"
    t.integer  "created_by_id"
    t.integer  "approved_by_id"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.string   "attachment_file_name"
    t.string   "attachment_content_type"
    t.integer  "attachment_file_size"
    t.datetime "attachment_updated_at"
    t.string   "transaction_number"
    t.float    "amount"
    t.index ["approved_by_id"], name: "index_pi_payments_on_approved_by_id", using: :btree
    t.index ["created_by_id"], name: "index_pi_payments_on_created_by_id", using: :btree
    t.index ["performa_invoice_id"], name: "index_pi_payments_on_performa_invoice_id", using: :btree
  end

  create_table "po_inventories", force: :cascade do |t|
    t.integer  "vendor_product_id"
    t.integer  "quantity"
    t.datetime "lats_ordered"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.text     "location"
    t.float    "tat"
    t.float    "min_stock"
    t.index ["vendor_product_id"], name: "index_po_inventories_on_vendor_product_id", using: :btree
  end

  create_table "po_wip_orders", force: :cascade do |t|
    t.string   "po_name"
    t.string   "status",                  default: "pending"
    t.text     "billing_address"
    t.string   "billing_contact_person"
    t.string   "billing_contact_number"
    t.text     "shipping_address"
    t.string   "shipping_contact_number"
    t.string   "shipping_contact_person"
    t.datetime "created_at",                                  null: false
    t.datetime "updated_at",                                  null: false
    t.integer  "lead_id"
    t.string   "vendor_gst"
    t.string   "po_type"
    t.boolean  "tag_snag",                default: false,     null: false
    t.index ["lead_id"], name: "index_po_wip_orders_on_lead_id", using: :btree
  end

  create_table "po_wip_orders_wip_slis", force: :cascade do |t|
    t.integer  "wip_sli_id"
    t.integer  "po_wip_order_id"
    t.float    "quantity"
    t.float    "recieved_quantity", default: 0.0
    t.datetime "recieved_at"
    t.integer  "parent_wip_sli_id"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["parent_wip_sli_id"], name: "index_po_wip_orders_wip_slis_on_parent_wip_sli_id", using: :btree
    t.index ["po_wip_order_id"], name: "index_po_wip_orders_wip_slis_on_po_wip_order_id", using: :btree
    t.index ["wip_sli_id"], name: "index_po_wip_orders_wip_slis_on_wip_sli_id", using: :btree
  end

  create_table "portfolio_works", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "url"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.integer  "user_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["user_id"], name: "index_portfolio_works_on_user_id", using: :btree
  end

  create_table "portfolios", force: :cascade do |t|
    t.string   "space"
    t.string   "theme"
    t.integer  "price_cents",                  default: 0
    t.string   "segment"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.string   "lifestage"
    t.string   "element"
    t.text     "attachment_file_meta"
    t.text     "description"
    t.string   "user_story_title"
    t.json     "portfolio_data"
  end

  create_table "presentations", force: :cascade do |t|
    t.string   "title",            null: false
    t.string   "ppt_file_name"
    t.string   "ppt_content_type"
    t.integer  "ppt_file_size"
    t.datetime "ppt_updated_at"
    t.integer  "project_id"
    t.integer  "designer_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["designer_id"], name: "index_presentations_on_designer_id", using: :btree
    t.index ["project_id"], name: "index_presentations_on_project_id", using: :btree
  end

  create_table "presentations_products", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "presentation_id"
    t.integer  "quantity"
    t.string   "space"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["presentation_id"], name: "index_presentations_products_on_presentation_id", using: :btree
    t.index ["product_id"], name: "index_presentations_products_on_product_id", using: :btree
  end

  create_table "price_configurators", force: :cascade do |t|
    t.integer  "total_price_cents",  default: 0
    t.string   "pricable_type"
    t.integer  "pricable_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "food_type"
    t.string   "food"
    t.integer  "family_size"
    t.string   "utensil_used"
    t.string   "vegetable_cleaning"
    t.string   "storage_utensils"
    t.string   "kind_of_food"
    t.string   "size_of_utensils"
    t.string   "habit"
    t.string   "platform"
    t.string   "hob"
    t.string   "chimney"
    t.string   "chimney_type"
    t.string   "sink"
    t.string   "dustbin"
    t.string   "bowl_type"
    t.integer  "drain_board"
    t.string   "light"
    t.string   "food_option"
    t.integer  "cleaning_frequency", default: 0
    t.string   "preparation_area"
    t.string   "kitchen_type"
    t.string   "finish_type"
  end

  create_table "product_categories", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "catalog_category_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["catalog_category_id", "product_id"], name: "by_category_product", unique: true, using: :btree
    t.index ["catalog_category_id"], name: "index_product_categories_on_catalog_category_id", using: :btree
    t.index ["product_id"], name: "index_product_categories_on_product_id", using: :btree
  end

  create_table "product_classes", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "catalog_class_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["catalog_class_id", "product_id"], name: "by_class_product", unique: true, using: :btree
    t.index ["catalog_class_id"], name: "index_product_classes_on_catalog_class_id", using: :btree
    t.index ["product_id"], name: "index_product_classes_on_product_id", using: :btree
  end

  create_table "product_configurations", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "code"
    t.integer  "section_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["section_id"], name: "index_product_configurations_on_section_id", using: :btree
  end

  create_table "product_images", force: :cascade do |t|
    t.string   "product_image_file_name"
    t.string   "product_image_content_type"
    t.integer  "product_image_file_size"
    t.datetime "product_image_updated_at"
    t.string   "image_name"
    t.integer  "product_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["product_id"], name: "index_product_images_on_product_id", using: :btree
  end

  create_table "product_likes", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id", "user_id"], name: "index_product_likes_on_product_id_and_user_id", unique: true, using: :btree
    t.index ["product_id"], name: "index_product_likes_on_product_id", using: :btree
    t.index ["user_id"], name: "index_product_likes_on_user_id", using: :btree
  end

  create_table "product_master_options", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "master_option_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["master_option_id"], name: "index_product_master_options_on_master_option_id", using: :btree
    t.index ["product_id"], name: "index_product_master_options_on_product_id", using: :btree
  end

  create_table "product_module_addons", force: :cascade do |t|
    t.integer  "product_module_id"
    t.integer  "addon_id"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "addon_combination_id"
    t.index ["addon_combination_id"], name: "index_product_module_addons_on_addon_combination_id", using: :btree
    t.index ["addon_id"], name: "index_product_module_addons_on_addon_id", using: :btree
    t.index ["product_module_id", "addon_id"], name: "index_product_module_addons_on_product_module_id_and_addon_id", unique: true, using: :btree
    t.index ["product_module_id"], name: "index_product_module_addons_on_product_module_id", using: :btree
  end

  create_table "product_module_types", force: :cascade do |t|
    t.integer  "product_module_id"
    t.integer  "module_type_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["module_type_id"], name: "index_product_module_types_on_module_type_id", using: :btree
    t.index ["product_module_id", "module_type_id"], name: "index_product_module_types_on_module_and_module_type", unique: true, using: :btree
    t.index ["product_module_id"], name: "index_product_module_types_on_product_module_id", using: :btree
  end

  create_table "product_modules", force: :cascade do |t|
    t.string   "code"
    t.string   "description"
    t.integer  "width"
    t.integer  "depth"
    t.integer  "height"
    t.string   "category"
    t.integer  "modular_product_id"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.integer  "module_type_id"
    t.integer  "number_kitchen_addons"
    t.string   "module_image_file_name"
    t.string   "module_image_content_type"
    t.integer  "module_image_file_size"
    t.datetime "module_image_updated_at"
    t.integer  "number_shutter_handles"
    t.integer  "number_door_handles"
    t.integer  "c_section_length",          default: 0
    t.integer  "l_section_length",          default: 0
    t.integer  "c_section_number",          default: 0
    t.integer  "l_section_number",          default: 0
    t.boolean  "special_handles_only",      default: false
    t.boolean  "percent_18_reduction",      default: false
    t.float    "al_profile_size",           default: 0.0
    t.integer  "lead_time",                 default: 0
    t.boolean  "hidden",                    default: false, null: false
    t.boolean  "modspace",                  default: false, null: false
    t.index ["code", "category"], name: "index_product_modules_on_code_and_category", unique: true, using: :btree
    t.index ["modular_product_id"], name: "index_product_modules_on_modular_product_id", using: :btree
    t.index ["module_type_id"], name: "index_product_modules_on_module_type_id", using: :btree
  end

  create_table "product_range_tags", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_range_tags_on_product_id", using: :btree
    t.index ["tag_id"], name: "index_product_range_tags_on_tag_id", using: :btree
  end

  create_table "product_segments", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "catalog_segment_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["catalog_segment_id"], name: "index_product_segments_on_catalog_segment_id", using: :btree
    t.index ["product_id", "catalog_segment_id"], name: "by_segment_product", unique: true, using: :btree
    t.index ["product_id"], name: "index_product_segments_on_product_id", using: :btree
  end

  create_table "product_space_tags", force: :cascade do |t|
    t.integer  "tag_id"
    t.integer  "product_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_space_tags_on_product_id", using: :btree
    t.index ["tag_id"], name: "index_product_space_tags_on_tag_id", using: :btree
  end

  create_table "product_subcategories", force: :cascade do |t|
    t.integer  "product_id"
    t.integer  "catalog_subcategory_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["catalog_subcategory_id", "product_id"], name: "by_subcategory_product", unique: true, using: :btree
    t.index ["catalog_subcategory_id"], name: "index_product_subcategories_on_catalog_subcategory_id", using: :btree
    t.index ["product_id"], name: "index_product_subcategories_on_product_id", using: :btree
  end

  create_table "product_variants", force: :cascade do |t|
    t.string   "name"
    t.string   "product_variant_code"
    t.integer  "catalogue_option_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "fabric_image_file_name"
    t.string   "fabric_image_content_type"
    t.integer  "fabric_image_file_size"
    t.datetime "fabric_image_updated_at"
    t.index ["catalogue_option_id"], name: "index_product_variants_on_catalogue_option_id", using: :btree
    t.index ["product_variant_code"], name: "index_product_variants_on_product_variant_code", using: :btree
  end

  create_table "production_drawings", force: :cascade do |t|
    t.integer  "project_handover_id"
    t.string   "line_item_type"
    t.integer  "line_item_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["line_item_type", "line_item_id"], name: "index_production_drawings_on_line_item_type_and_line_item_id", using: :btree
    t.index ["project_handover_id"], name: "index_production_drawings_on_project_handover_id", using: :btree
  end

  create_table "production_line_items", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.text     "specification"
    t.integer  "client_id"
    t.string   "client_name"
    t.integer  "quotation_id"
    t.string   "boq_number"
    t.string   "ownerable_id"
    t.string   "boq_line_item"
    t.string   "sli"
    t.integer  "operation_id"
    t.boolean  "status"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "products", force: :cascade do |t|
    t.string   "name",                                             null: false
    t.float    "sale_price"
    t.integer  "section_id"
    t.datetime "created_at",                                       null: false
    t.datetime "updated_at",                                       null: false
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.string   "image_name"
    t.string   "model_no"
    t.string   "color"
    t.string   "finish"
    t.string   "product_config"
    t.integer  "length"
    t.integer  "width"
    t.integer  "height"
    t.string   "vendor_sku"
    t.string   "vendor_name"
    t.string   "vendor_location"
    t.float    "cost_price"
    t.string   "model3d_file"
    t.integer  "manufacturing_time_days"
    t.string   "product_url"
    t.text     "material"
    t.text     "dimension_remark"
    t.string   "warranty"
    t.text     "remark"
    t.string   "measurement_unit"
    t.integer  "qty"
    t.string   "unique_sku"
    t.integer  "product_configuration_id"
    t.integer  "parent_product_id"
    t.string   "product_image_file_name"
    t.string   "product_image_content_type"
    t.integer  "product_image_file_size"
    t.datetime "product_image_updated_at"
    t.integer  "lead_time"
    t.boolean  "hidden",                       default: false
    t.integer  "units_sold",                   default: 0
    t.string   "origin",                       default: "arrivae", null: false
    t.string   "imported_sku"
    t.datetime "last_imported_at"
    t.string   "catalog_type",                 default: "arrivae", null: false
    t.index ["catalog_type"], name: "index_products_on_catalog_type", using: :btree
    t.index ["imported_sku"], name: "index_products_on_imported_sku", unique: true, where: "(imported_sku IS NOT NULL)", using: :btree
    t.index ["parent_product_id"], name: "index_products_on_parent_product_id", using: :btree
    t.index ["product_configuration_id"], name: "index_products_on_product_configuration_id", using: :btree
    t.index ["section_id"], name: "index_products_on_section_id", using: :btree
    t.index ["unique_sku"], name: "index_products_on_unique_sku", unique: true, using: :btree
  end

  create_table "project_booking_form_files", force: :cascade do |t|
    t.integer  "project_booking_form_id"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["project_booking_form_id"], name: "index_project_booking_form_files_on_project_booking_form_id", using: :btree
  end

  create_table "project_booking_forms", force: :cascade do |t|
    t.datetime "date"
    t.integer  "lead_id"
    t.integer  "project_id"
    t.string   "flat_no"
    t.string   "floor_no"
    t.text     "building_name"
    t.text     "location"
    t.string   "city"
    t.string   "pincode"
    t.string   "possession_by"
    t.string   "profession"
    t.string   "designation"
    t.string   "company"
    t.string   "professional_details"
    t.string   "annual_income"
    t.string   "landline"
    t.string   "primary_mobile"
    t.string   "secondary_mobile"
    t.string   "primary_email"
    t.string   "secondary_email"
    t.text     "current_address"
    t.string   "order_value"
    t.date     "order_date"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.string   "other_professional_details"
    t.text     "billing_address"
    t.string   "gst_number"
    t.string   "billing_name"
    t.text     "address_type"
    t.index ["lead_id"], name: "index_project_booking_forms_on_lead_id", using: :btree
    t.index ["project_id"], name: "index_project_booking_forms_on_project_id", using: :btree
  end

  create_table "project_details", force: :cascade do |t|
    t.string   "customer_name"
    t.string   "mobile_number"
    t.string   "alternate_mobile"
    t.string   "email"
    t.string   "city"
    t.string   "property_usage"
    t.string   "property_age"
    t.string   "property_type"
    t.string   "number_of_rooms"
    t.string   "project_name"
    t.string   "project_address"
    t.string   "flat_no"
    t.integer  "area_of_flat"
    t.string   "possession_status"
    t.date     "possession_date"
    t.string   "use_type"
    t.string   "requirement"
    t.integer  "budget"
    t.string   "floor_plan_link"
    t.datetime "preferred_time_call_designer"
    t.datetime "preferred_time_site_visit"
    t.string   "occupation_of_customer"
    t.string   "occupation_of_spouse"
    t.integer  "members_in_family"
    t.date     "tentative_date_moving"
    t.string   "project_type"
    t.text     "scope_of_work",                default: [], null: false, array: true
    t.json     "kitchen",                      default: {}, null: false
    t.json     "master_bedroom",               default: {}, null: false
    t.json     "kids_bedroom",                 default: {}, null: false
    t.json     "parent_bedroom",               default: {}, null: false
    t.json     "guest_bedroom",                default: {}, null: false
    t.json     "living_room",                  default: {}, null: false
    t.json     "pooja_room",                   default: {}, null: false
    t.integer  "project_id"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.json     "foyer",                        default: {}, null: false
    t.index ["project_id"], name: "index_project_details_on_project_id", using: :btree
  end

  create_table "project_handover_urls", force: :cascade do |t|
    t.integer  "project_id"
    t.text     "url"
    t.integer  "shared_version"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["project_id"], name: "index_project_handover_urls_on_project_id", using: :btree
  end

  create_table "project_handovers", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "file_version"
    t.string   "status",               default: "false"
    t.datetime "shared_on"
    t.datetime "status_changed_on"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "remarks"
    t.integer  "parent_handover_id"
    t.integer  "created_by"
    t.boolean  "category_upload",      default: false
    t.integer  "status_updated_by_id"
    t.index ["ownerable_type", "ownerable_id"], name: "index_project_handovers_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["parent_handover_id"], name: "index_project_handovers_on_parent_handover_id", using: :btree
    t.index ["project_id"], name: "index_project_handovers_on_project_id", using: :btree
    t.index ["status_updated_by_id"], name: "index_project_handovers_on_status_updated_by_id", using: :btree
  end

  create_table "project_quality_checks", force: :cascade do |t|
    t.string   "qc_type"
    t.integer  "project_id"
    t.boolean  "status"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.text     "remark"
    t.integer  "status_updated_by_id"
    t.index ["project_id"], name: "index_project_quality_checks_on_project_id", using: :btree
    t.index ["status_updated_by_id"], name: "index_project_quality_checks_on_status_updated_by_id", using: :btree
  end

  create_table "project_requirements", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "requirement_name"
    t.string   "budget"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.text     "service"
    t.text     "color_preference"
    t.index ["project_id"], name: "index_project_requirements_on_project_id", using: :btree
  end

  create_table "project_tasks", force: :cascade do |t|
    t.string   "internal_name",          null: false
    t.string   "name",                   null: false
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "duration"
    t.integer  "percent_completion"
    t.integer  "upstream_dependency_id"
    t.integer  "project_id"
    t.integer  "task_category_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "user_id"
    t.string   "status"
    t.string   "action_point"
    t.string   "process_owner"
    t.text     "remarks"
    t.index ["project_id"], name: "index_project_tasks_on_project_id", using: :btree
    t.index ["task_category_id"], name: "index_project_tasks_on_task_category_id", using: :btree
    t.index ["user_id"], name: "index_project_tasks_on_user_id", using: :btree
  end

  create_table "projects", force: :cascade do |t|
    t.string   "name"
    t.integer  "user_id"
    t.text     "details"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.integer  "lead_id"
    t.string   "status"
    t.string   "remarks"
    t.datetime "wip_time"
    t.integer  "count_of_calls"
    t.datetime "status_updated_at"
    t.string   "reason_for_lost"
    t.string   "sub_status"
    t.boolean  "new_handover_file",    default: false
    t.datetime "last_handover_at"
    t.boolean  "is_invoice_completed", default: false
    t.index ["lead_id"], name: "index_projects_on_lead_id", using: :btree
    t.index ["user_id"], name: "index_projects_on_user_id", using: :btree
  end

  create_table "proposal_docs", force: :cascade do |t|
    t.integer  "proposal_id"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.boolean  "is_approved"
    t.datetime "approved_at"
    t.float    "discount_value"
    t.integer  "disc_status_updated_by"
    t.datetime "disc_status_updated_at"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "discount_status"
    t.text     "remark"
    t.boolean  "seen_by_category",       default: false
    t.text     "customer_remark"
    t.index ["ownerable_type", "ownerable_id"], name: "index_proposal_docs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["proposal_id"], name: "index_proposal_docs_on_proposal_id", using: :btree
  end

  create_table "proposals", force: :cascade do |t|
    t.string   "proposal_type"
    t.string   "proposal_name"
    t.integer  "project_id"
    t.integer  "designer_id"
    t.datetime "sent_at"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "proposal_status"
    t.string   "is_draft"
    t.index ["project_id"], name: "index_proposals_on_project_id", using: :btree
  end

  create_table "purchase_elements", force: :cascade do |t|
    t.integer  "purchase_order_id"
    t.integer  "job_element_vendor_id"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
    t.index ["job_element_vendor_id"], name: "index_purchase_elements_on_job_element_vendor_id", using: :btree
    t.index ["purchase_order_id"], name: "index_purchase_elements_on_purchase_order_id", using: :btree
  end

  create_table "purchase_order_performa_invoices", force: :cascade do |t|
    t.integer  "purchase_order_id"
    t.integer  "performa_invoice_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["performa_invoice_id"], name: "index_purchase_order_performa_invoices_on_performa_invoice_id", using: :btree
    t.index ["purchase_order_id"], name: "index_purchase_order_performa_invoices_on_purchase_order_id", using: :btree
  end

  create_table "purchase_orders", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "quotation_id"
    t.string   "status",                 default: "pending"
    t.string   "contact_person"
    t.string   "contact_number"
    t.string   "shipping_address"
    t.string   "reference_no"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.integer  "vendor_id"
    t.string   "billing_address"
    t.string   "billing_contact_person"
    t.string   "billing_contact_number"
    t.string   "vendor_gst"
    t.boolean  "modifying",              default: false
    t.string   "movement"
    t.integer  "release_count",          default: 0
    t.boolean  "tag_snag",               default: false,     null: false
    t.index ["project_id"], name: "index_purchase_orders_on_project_id", using: :btree
    t.index ["quotation_id"], name: "index_purchase_orders_on_quotation_id", using: :btree
    t.index ["vendor_id"], name: "index_purchase_orders_on_vendor_id", using: :btree
  end

  create_table "quality_checks", force: :cascade do |t|
    t.integer  "job_element_id"
    t.string   "qc_status"
    t.datetime "qc_date"
    t.integer  "created_by"
    t.text     "remarks"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["job_element_id"], name: "index_quality_checks_on_job_element_id", using: :btree
  end

  create_table "questionaire_master_items", force: :cascade do |t|
    t.string   "name",                      null: false
    t.float    "price",      default: 0.0,  null: false
    t.boolean  "is_active",  default: true, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "quotation_payments", force: :cascade do |t|
    t.integer  "quotation_id"
    t.integer  "payment_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.float    "amount"
    t.index ["payment_id"], name: "index_quotation_payments_on_payment_id", using: :btree
    t.index ["quotation_id"], name: "index_quotation_payments_on_quotation_id", using: :btree
  end

  create_table "quotations", force: :cascade do |t|
    t.string   "name"
    t.text     "terms"
    t.float    "net_amount",              default: 0.0
    t.float    "total_amount",            default: 0.0
    t.string   "status",                  default: "0"
    t.integer  "project_id"
    t.integer  "user_id"
    t.date     "generation_date"
    t.date     "expiration_date"
    t.integer  "expiration_in_days"
    t.string   "billing_address"
    t.float    "flat_amount",             default: 0.0
    t.text     "customer_notes"
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
    t.string   "reference_number"
    t.integer  "presentation_id"
    t.integer  "designer_id"
    t.text     "spaces",                  default: [],                   array: true
    t.text     "spaces_kitchen",          default: [],                   array: true
    t.text     "spaces_loose",            default: [],                   array: true
    t.text     "spaces_services",         default: [],                   array: true
    t.text     "spaces_custom",           default: [],                   array: true
    t.float    "countertop_cost"
    t.float    "discount_value"
    t.string   "discount_status"
    t.datetime "disc_status_updated_at"
    t.integer  "disc_status_updated_by"
    t.float    "final_amount"
    t.boolean  "is_approved"
    t.float    "paid_amount"
    t.string   "wip_status"
    t.integer  "parent_quotation_id"
    t.boolean  "copied"
    t.integer  "per_10_approved_by_id"
    t.datetime "per_10_approved_at"
    t.integer  "per_50_approved_by_id"
    t.datetime "per_50_approved_at"
    t.integer  "category_appoval_by_id"
    t.datetime "category_appoval_at"
    t.text     "remark"
    t.datetime "cm_approval_at"
    t.integer  "cm_approval_by_id"
    t.boolean  "cm_approval"
    t.boolean  "category_approval"
    t.string   "sli_flag"
    t.text     "customer_viewing_option", default: ["boq"],              array: true
    t.boolean  "seen_by_category",        default: false
    t.integer  "client_approval_by_id"
    t.datetime "client_approval_at"
    t.float    "price_increase_factor",   default: 1.0
    t.float    "estimated_cogs",          default: 0.0
    t.float    "shangpin_amount",         default: 0.0
    t.string   "spaces_custom_furniture", default: [],                   array: true
    t.boolean  "can_edit",                default: true
    t.integer  "duration"
    t.datetime "payment_50_comp_date"
    t.boolean  "need_category_approval"
    t.text     "delivery_tnc"
    t.float    "service_pm_fee",          default: 0.0,     null: false
    t.float    "nonservice_pm_fee",       default: 0.0,     null: false
    t.boolean  "pm_fee_disabled",         default: false,   null: false
    t.integer  "split_from_id"
    t.index ["category_appoval_by_id"], name: "index_quotations_on_category_appoval_by_id", using: :btree
    t.index ["cm_approval_by_id"], name: "index_quotations_on_cm_approval_by_id", using: :btree
    t.index ["designer_id"], name: "index_quotations_on_designer_id", using: :btree
    t.index ["parent_quotation_id"], name: "index_quotations_on_parent_quotation_id", using: :btree
    t.index ["per_10_approved_by_id"], name: "index_quotations_on_per_10_approved_by_id", using: :btree
    t.index ["per_50_approved_by_id"], name: "index_quotations_on_per_50_approved_by_id", using: :btree
    t.index ["presentation_id"], name: "index_quotations_on_presentation_id", using: :btree
    t.index ["project_id"], name: "index_quotations_on_project_id", using: :btree
    t.index ["reference_number"], name: "index_quotations_on_reference_number", unique: true, using: :btree
    t.index ["split_from_id"], name: "index_quotations_on_split_from_id", using: :btree
    t.index ["user_id"], name: "index_quotations_on_user_id", using: :btree
  end

  create_table "recordings", force: :cascade do |t|
    t.string   "call_recording_file_name"
    t.string   "call_recording_content_type"
    t.integer  "call_recording_file_size"
    t.datetime "call_recording_updated_at"
    t.integer  "event_id"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "duration"
    t.integer  "user_id"
    t.string   "note"
    t.integer  "project_id"
    t.index ["event_id"], name: "index_recordings_on_event_id", using: :btree
    t.index ["project_id"], name: "index_recordings_on_project_id", using: :btree
    t.index ["user_id"], name: "index_recordings_on_user_id", using: :btree
  end

  create_table "reference_images", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "panel",      default: false
    t.index ["project_id"], name: "index_reference_images_on_project_id", using: :btree
  end

  create_table "requested_files", force: :cascade do |t|
    t.integer  "raised_by_id"
    t.boolean  "resolved",     default: false
    t.integer  "project_id"
    t.datetime "resolved_on"
    t.string   "remarks"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["project_id"], name: "index_requested_files_on_project_id", using: :btree
    t.index ["raised_by_id"], name: "index_requested_files_on_raised_by_id", using: :btree
  end

  create_table "requirement_sheets", force: :cascade do |t|
    t.integer  "project_requirement_id"
    t.string   "space_type"
    t.string   "space_name"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["project_requirement_id"], name: "index_requirement_sheets_on_project_requirement_id", using: :btree
  end

  create_table "requirement_space_q_and_as", force: :cascade do |t|
    t.integer  "requirement_sheet_id"
    t.text     "question"
    t.text     "answer"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["requirement_sheet_id"], name: "index_requirement_space_q_and_as_on_requirement_sheet_id", using: :btree
  end

  create_table "roles", force: :cascade do |t|
    t.string   "name"
    t.string   "resource_type"
    t.integer  "resource_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", using: :btree
    t.index ["name"], name: "index_roles_on_name", using: :btree
  end

  create_table "rpush_apps", force: :cascade do |t|
    t.string   "name",                                   null: false
    t.string   "environment"
    t.text     "certificate"
    t.string   "password"
    t.integer  "connections",             default: 1,    null: false
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.string   "type",                                   null: false
    t.string   "auth_key"
    t.string   "client_id"
    t.string   "client_secret"
    t.string   "access_token"
    t.datetime "access_token_expiration"
    t.text     "apn_key"
    t.string   "apn_key_id"
    t.string   "team_id"
    t.string   "bundle_id"
    t.boolean  "feedback_enabled",        default: true
  end

  create_table "rpush_feedback", force: :cascade do |t|
    t.string   "device_token"
    t.datetime "failed_at",    null: false
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "app_id"
    t.index ["device_token"], name: "index_rpush_feedback_on_device_token", using: :btree
  end

  create_table "rpush_notifications", force: :cascade do |t|
    t.integer  "badge"
    t.string   "device_token"
    t.string   "sound"
    t.text     "alert"
    t.text     "data"
    t.integer  "expiry",             default: 86400
    t.boolean  "delivered",          default: false, null: false
    t.datetime "delivered_at"
    t.boolean  "failed",             default: false, null: false
    t.datetime "failed_at"
    t.integer  "error_code"
    t.text     "error_description"
    t.datetime "deliver_after"
    t.datetime "created_at",                         null: false
    t.datetime "updated_at",                         null: false
    t.boolean  "alert_is_json",      default: false, null: false
    t.string   "type",                               null: false
    t.string   "collapse_key"
    t.boolean  "delay_while_idle",   default: false, null: false
    t.text     "registration_ids"
    t.integer  "app_id",                             null: false
    t.integer  "retries",            default: 0
    t.string   "uri"
    t.datetime "fail_after"
    t.boolean  "processing",         default: false, null: false
    t.integer  "priority"
    t.text     "url_args"
    t.string   "category"
    t.boolean  "content_available",  default: false, null: false
    t.text     "notification"
    t.boolean  "mutable_content",    default: false, null: false
    t.string   "external_device_id"
    t.string   "thread_id"
    t.boolean  "dry_run",            default: false, null: false
    t.index ["delivered", "failed", "processing", "deliver_after", "created_at"], name: "index_rpush_notifications_multi", where: "((NOT delivered) AND (NOT failed))", using: :btree
  end

  create_table "scope_of_works", force: :cascade do |t|
    t.integer  "project_id"
    t.text     "client_details"
    t.datetime "date"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["project_id"], name: "index_scope_of_works_on_project_id", using: :btree
  end

  create_table "scope_qnas", force: :cascade do |t|
    t.integer  "scope_space_id"
    t.text     "question"
    t.text     "arrivae_scope"
    t.text     "client_scope"
    t.text     "remark"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["scope_space_id"], name: "index_scope_qnas_on_scope_space_id", using: :btree
  end

  create_table "scope_spaces", force: :cascade do |t|
    t.integer  "scope_of_work_id"
    t.string   "space_name"
    t.string   "space_type"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["scope_of_work_id"], name: "index_scope_spaces_on_scope_of_work_id", using: :btree
  end

  create_table "section_hierarchies", id: false, force: :cascade do |t|
    t.integer "ancestor_id",   null: false
    t.integer "descendant_id", null: false
    t.integer "generations",   null: false
    t.index ["ancestor_id", "descendant_id", "generations"], name: "section_anc_desc_idx", unique: true, using: :btree
    t.index ["descendant_id"], name: "section_desc_idx", using: :btree
  end

  create_table "section_tags", force: :cascade do |t|
    t.integer  "section_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["section_id"], name: "index_section_tags_on_section_id", using: :btree
    t.index ["tag_id"], name: "index_section_tags_on_tag_id", using: :btree
  end

  create_table "sections", force: :cascade do |t|
    t.string   "name",                         null: false
    t.text     "description"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.integer  "parent_id"
    t.string   "attachment_file_file_name"
    t.string   "attachment_file_content_type"
    t.integer  "attachment_file_file_size"
    t.datetime "attachment_file_updated_at"
  end

  create_table "segment_category_mappings", force: :cascade do |t|
    t.integer  "catalog_segment_id"
    t.integer  "catalog_category_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["catalog_category_id"], name: "index_segment_category_mappings_on_catalog_category_id", using: :btree
    t.index ["catalog_segment_id", "catalog_category_id"], name: "by_segment_category", unique: true, using: :btree
    t.index ["catalog_segment_id"], name: "index_segment_category_mappings_on_catalog_segment_id", using: :btree
  end

  create_table "send_to_factory_urls", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "content_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content_id"], name: "index_send_to_factory_urls_on_content_id", using: :btree
    t.index ["project_id"], name: "index_send_to_factory_urls_on_project_id", using: :btree
  end

  create_table "service_activities", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.string   "unit"
    t.float    "default_base_price"
    t.float    "installation_price"
    t.integer  "service_category_id"
    t.integer  "service_subcategory_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "description"
    t.index ["code"], name: "index_service_activities_on_code", unique: true, using: :btree
    t.index ["service_category_id"], name: "index_service_activities_on_service_category_id", using: :btree
    t.index ["service_subcategory_id"], name: "index_service_activities_on_service_subcategory_id", using: :btree
  end

  create_table "service_categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "hidden",     default: false
    t.index ["name"], name: "index_service_categories_on_name", unique: true, using: :btree
  end

  create_table "service_jobs", force: :cascade do |t|
    t.string   "name"
    t.string   "service_code"
    t.string   "unit"
    t.float    "quantity"
    t.float    "base_rate"
    t.float    "installation_rate"
    t.float    "final_rate"
    t.float    "amount"
    t.string   "space"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "service_activity_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.float    "estimated_cogs",      default: 0.0
    t.integer  "clubbed_job_id"
    t.integer  "tag_id"
    t.boolean  "no_bom",              default: false, null: false
    t.index ["clubbed_job_id"], name: "index_service_jobs_on_clubbed_job_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_service_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["service_activity_id"], name: "index_service_jobs_on_service_activity_id", using: :btree
    t.index ["tag_id"], name: "index_service_jobs_on_tag_id", using: :btree
  end

  create_table "service_subcategories", force: :cascade do |t|
    t.string   "name"
    t.integer  "service_category_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.boolean  "hidden",              default: false, null: false
    t.index ["name"], name: "index_service_subcategories_on_name", unique: true, using: :btree
    t.index ["service_category_id"], name: "index_service_subcategories_on_service_category_id", using: :btree
  end

  create_table "shades", force: :cascade do |t|
    t.string   "name"
    t.string   "code"
    t.string   "shade_image_file_name"
    t.string   "shade_image_content_type"
    t.integer  "shade_image_file_size"
    t.datetime "shade_image_updated_at"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.integer  "edge_banding_shade_id"
    t.boolean  "hidden",                   default: false
    t.integer  "lead_time",                default: 0
    t.boolean  "arrivae_select",           default: false, null: false
    t.index ["code"], name: "index_shades_on_code", unique: true, using: :btree
    t.index ["edge_banding_shade_id"], name: "index_shades_on_edge_banding_shade_id", using: :btree
  end

  create_table "shangpin_core_materials", force: :cascade do |t|
    t.string   "core_material"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "shangpin_job_colors", force: :cascade do |t|
    t.string   "color"
    t.integer  "shangpin_core_material_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["shangpin_core_material_id"], name: "index_shangpin_job_colors_on_shangpin_core_material_id", using: :btree
  end

  create_table "shangpin_jobs", force: :cascade do |t|
    t.string   "space"
    t.string   "cabinet_model_no"
    t.integer  "cabinet_width"
    t.integer  "cabinet_depth"
    t.integer  "cabinet_height"
    t.string   "cabinet_material"
    t.integer  "cabinet_specific_door"
    t.integer  "cabinet_specific_worktop"
    t.integer  "cabinet_specific_leg"
    t.string   "cabinet_handle"
    t.float    "cabinet_price",            default: 0.0
    t.float    "cabinet_quantity",         default: 0.0
    t.float    "cabinet_amount",           default: 0.0
    t.string   "door_style_code"
    t.integer  "door_width"
    t.integer  "door_depth"
    t.integer  "door_height"
    t.float    "door_quantity",            default: 0.0
    t.float    "door_amount",              default: 0.0
    t.string   "accessory_code"
    t.integer  "accessory_width"
    t.integer  "accessory_depth"
    t.integer  "accessory_height"
    t.float    "accessory_price",          default: 0.0
    t.float    "accessory_quantity",       default: 0.0
    t.float    "accessory_amount",         default: 0.0
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.string   "job_type",                                 null: false
    t.float    "amount",                   default: 0.0,   null: false
    t.string   "cabinet_item"
    t.string   "cabinet_color"
    t.string   "door_item"
    t.string   "door_color"
    t.string   "door_model_no"
    t.string   "accessory_item"
    t.string   "accessory_color"
    t.string   "accessory_model_no"
    t.float    "wardrobe_price",           default: 0.0
    t.float    "wardrobe_amount",          default: 0.0
    t.float    "door_price",               default: 0.0
    t.integer  "tag_id"
    t.integer  "clubbed_job_id"
    t.boolean  "no_bom",                   default: false, null: false
    t.integer  "job_spec_door"
    t.integer  "job_spec_worktop"
    t.integer  "job_spec_leg"
    t.string   "cabinet_platform"
    t.integer  "cabinet_door"
    t.string   "job_handle"
    t.string   "job_material"
    t.string   "imported_file_type"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.index ["clubbed_job_id"], name: "index_shangpin_jobs_on_clubbed_job_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_shangpin_jobs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["tag_id"], name: "index_shangpin_jobs_on_tag_id", using: :btree
  end

  create_table "shangpin_layouts", force: :cascade do |t|
    t.string   "name",          null: false
    t.text     "remark"
    t.integer  "created_by_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["created_by_id"], name: "index_shangpin_layouts_on_created_by_id", using: :btree
  end

  create_table "shutter_finish_shades", force: :cascade do |t|
    t.integer  "shutter_finish_id"
    t.integer  "shade_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["shade_id"], name: "index_shutter_finish_shades_on_shade_id", using: :btree
    t.index ["shutter_finish_id", "shade_id"], name: "index_shutter_finish_shades_on_shutter_finish_id_and_shade_id", unique: true, using: :btree
    t.index ["shutter_finish_id"], name: "index_shutter_finish_shades_on_shutter_finish_id", using: :btree
  end

  create_table "shutter_finishes", force: :cascade do |t|
    t.string   "name"
    t.float    "price"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.float    "wardrobe_price"
    t.integer  "lead_time",        default: 0
    t.boolean  "hidden",           default: true
    t.boolean  "arrivae_select",   default: false, null: false
    t.boolean  "modspace_visible", default: false, null: false
    t.index ["name"], name: "index_shutter_finishes_on_name", unique: true, using: :btree
  end

  create_table "shutter_material_finishes", force: :cascade do |t|
    t.integer  "core_material_id"
    t.integer  "shutter_finish_id"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "mapping_type",      default: "arrivae", null: false
    t.index ["core_material_id", "shutter_finish_id"], name: "index_shutter_material_finishes_on_material_and_shutter", unique: true, using: :btree
    t.index ["core_material_id"], name: "index_shutter_material_finishes_on_core_material_id", using: :btree
    t.index ["mapping_type", "core_material_id", "shutter_finish_id"], name: "on_type_core_finish", unique: true, using: :btree
    t.index ["shutter_finish_id"], name: "index_shutter_material_finishes_on_shutter_finish_id", using: :btree
  end

  create_table "site_galleries", force: :cascade do |t|
    t.integer  "site_measurement_request_id"
    t.string   "site_image_file_name"
    t.string   "site_image_content_type"
    t.integer  "site_image_file_size"
    t.datetime "site_image_updated_at"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.index ["site_measurement_request_id"], name: "index_site_galleries_on_site_measurement_request_id", using: :btree
  end

  create_table "site_layouts", force: :cascade do |t|
    t.integer  "note_record_id"
    t.string   "layout_image_file_name"
    t.string   "layout_image_content_type"
    t.integer  "layout_image_file_size"
    t.datetime "layout_image_updated_at"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["note_record_id"], name: "index_site_layouts_on_note_record_id", using: :btree
  end

  create_table "site_measurement_requests", force: :cascade do |t|
    t.integer  "project_id"
    t.integer  "designer_id"
    t.integer  "sitesupervisor_id"
    t.string   "request_type"
    t.text     "address"
    t.datetime "scheduled_at"
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.string   "request_status",    default: "pending"
    t.datetime "rescheduled_at"
    t.text     "remark"
    t.string   "name",              default: "site_measurement_output"
    t.index ["project_id"], name: "index_site_measurement_requests_on_project_id", using: :btree
  end

  create_table "skirting_configs", force: :cascade do |t|
    t.string   "skirting_type"
    t.integer  "skirting_height"
    t.float    "price"
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "lead_time",       default: 0
    t.index ["skirting_type", "skirting_height"], name: "index_skirting_configs_on_skirting_type_and_skirting_height", unique: true, using: :btree
  end

  create_table "sli_dynamic_attributes", force: :cascade do |t|
    t.string   "attr_value"
    t.integer  "mli_attribute_id"
    t.integer  "vendor_product_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
    t.index ["mli_attribute_id"], name: "index_sli_dynamic_attributes_on_mli_attribute_id", using: :btree
    t.index ["vendor_product_id"], name: "index_sli_dynamic_attributes_on_vendor_product_id", using: :btree
  end

  create_table "slides", force: :cascade do |t|
    t.string   "title"
    t.integer  "serial",                       null: false
    t.json     "data",            default: {}, null: false
    t.integer  "presentation_id"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.index ["presentation_id"], name: "index_slides_on_presentation_id", using: :btree
  end

  create_table "sms_logs", force: :cascade do |t|
    t.integer  "to_id"
    t.integer  "from_id"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.string   "message"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["from_id"], name: "index_sms_logs_on_from_id", using: :btree
    t.index ["ownerable_type", "ownerable_id"], name: "index_sms_logs_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["to_id"], name: "index_sms_logs_on_to_id", using: :btree
  end

  create_table "sub_factory_processes", id: :bigserial, force: :cascade do |t|
    t.string   "name"
    t.integer  "factory_process_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "subcategory_class_mappings", force: :cascade do |t|
    t.integer  "catalog_subcategory_id"
    t.integer  "catalog_class_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.index ["catalog_class_id"], name: "index_subcategory_class_mappings_on_catalog_class_id", using: :btree
    t.index ["catalog_subcategory_id", "catalog_class_id"], name: "by_subcategory_class", unique: true, using: :btree
    t.index ["catalog_subcategory_id"], name: "index_subcategory_class_mappings_on_catalog_subcategory_id", using: :btree
  end

  create_table "tags", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "tag_type"
    t.index ["tag_type"], name: "index_tags_on_tag_type", using: :btree
  end

  create_table "task_categories", force: :cascade do |t|
    t.string   "name"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_task_categories_on_project_id", using: :btree
  end

  create_table "task_dependencies", id: false, force: :cascade do |t|
    t.integer "project_task_id",        null: false
    t.integer "upstream_dependency_id", null: false
    t.index ["project_task_id", "upstream_dependency_id"], name: "index_dependencies_on_task_id_and_dependency_id", unique: true, using: :btree
  end

  create_table "task_escalations", force: :cascade do |t|
    t.integer  "task_set_id"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.integer  "task_owner"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "completed_at"
    t.text     "remark"
    t.string   "status",         default: "no"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.boolean  "is_new",         default: true
    t.boolean  "seen",           default: false
    t.index ["ownerable_type", "ownerable_id"], name: "index_task_escalations_on_ownerable_type_and_ownerable_id", using: :btree
    t.index ["task_set_id"], name: "index_task_escalations_on_task_set_id", using: :btree
  end

  create_table "task_sets", force: :cascade do |t|
    t.string   "task_name"
    t.string   "duration_in_hr"
    t.text     "notify_to",       default: [],              array: true
    t.boolean  "notify_by_email"
    t.boolean  "notify_by_sms"
    t.boolean  "optional"
    t.string   "stage"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.string   "task_owner"
    t.index ["task_name"], name: "index_task_sets_on_task_name", using: :btree
  end

  create_table "testimonials", force: :cascade do |t|
    t.string   "name"
    t.string   "profession"
    t.text     "testimonial"
    t.string   "video_file_name"
    t.string   "video_content_type"
    t.integer  "video_file_size"
    t.datetime "video_updated_at"
    t.string   "thumbnail_file_name"
    t.string   "thumbnail_content_type"
    t.integer  "thumbnail_file_size"
    t.datetime "thumbnail_updated_at"
    t.boolean  "feature"
    t.text     "video_url"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "user_id"
    t.index ["user_id"], name: "index_testimonials_on_user_id", using: :btree
  end

  create_table "three_d_images", force: :cascade do |t|
    t.integer  "project_id"
    t.string   "name"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.boolean  "panel",      default: false
    t.index ["project_id"], name: "index_three_d_images_on_project_id", using: :btree
  end

  create_table "training_materials", force: :cascade do |t|
    t.string   "category_name"
    t.integer  "created_by"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "training_material_id"
    t.index ["created_by"], name: "index_training_materials_on_created_by", using: :btree
    t.index ["training_material_id"], name: "index_training_materials_on_training_material_id", using: :btree
  end

  create_table "unit_product_mappings", force: :cascade do |t|
    t.integer  "business_unit_id"
    t.integer  "product_id"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.index ["business_unit_id", "product_id"], name: "by_unit_product", unique: true, using: :btree
    t.index ["business_unit_id"], name: "index_unit_product_mappings_on_business_unit_id", using: :btree
    t.index ["product_id"], name: "index_unit_product_mappings_on_product_id", using: :btree
  end

  create_table "unit_segment_mappings", force: :cascade do |t|
    t.integer  "business_unit_id"
    t.integer  "catalog_segment_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["business_unit_id", "catalog_segment_id"], name: "by_unit_segment", unique: true, using: :btree
    t.index ["business_unit_id"], name: "index_unit_segment_mappings_on_business_unit_id", using: :btree
    t.index ["catalog_segment_id"], name: "index_unit_segment_mappings_on_catalog_segment_id", using: :btree
  end

  create_table "urban_ladder_infos", force: :cascade do |t|
    t.integer  "product_id"
    t.string   "master_sku",       null: false
    t.string   "product_template", null: false
    t.string   "url"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.float    "price"
    t.integer  "ul_product_id"
    t.index ["product_id"], name: "index_urban_ladder_infos_on_product_id", using: :btree
  end

  create_table "urban_ladder_queues", force: :cascade do |t|
    t.integer  "product_id",                            null: false
    t.integer  "job_id"
    t.string   "status",            default: "pending", null: false
    t.datetime "status_updated_at"
    t.string   "details"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
  end

  create_table "user_data_migrations", force: :cascade do |t|
    t.integer  "from"
    t.integer  "to"
    t.json     "migrated_data", default: {}, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "user_hierarchies", id: false, force: :cascade do |t|
    t.integer "ancestor_id",   null: false
    t.integer "descendant_id", null: false
    t.integer "generations",   null: false
    t.index ["ancestor_id", "descendant_id", "generations"], name: "user_anc_desc_idx", unique: true, using: :btree
    t.index ["descendant_id"], name: "user_desc_idx", using: :btree
  end

  create_table "user_zipcode_mappings", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "zipcode_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_zipcode_mappings_on_user_id", using: :btree
    t.index ["zipcode_id"], name: "index_user_zipcode_mappings_on_zipcode_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "provider",                   default: "email",          null: false
    t.string   "uid",                        default: "",               null: false
    t.string   "encrypted_password",         default: "",               null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",              default: 0,                null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "name"
    t.string   "nickname"
    t.string   "image"
    t.string   "email"
    t.json     "tokens"
    t.datetime "created_at",                                            null: false
    t.datetime "updated_at",                                            null: false
    t.string   "contact"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.boolean  "is_active",                  default: true
    t.string   "pincode"
    t.string   "address_proof_file_name"
    t.string   "address_proof_content_type"
    t.integer  "address_proof_file_size"
    t.datetime "address_proof_updated_at"
    t.string   "gst_number"
    t.string   "pan"
    t.boolean  "online_status"
    t.boolean  "kyc_approved",               default: false
    t.integer  "cm_id"
    t.boolean  "dummyemail",                 default: false
    t.datetime "last_request_at"
    t.string   "designer_status",            default: "not_applicable"
    t.integer  "cm_for_site_supervisor_id"
    t.string   "call_type"
    t.string   "extension"
    t.integer  "sales_manager_id"
    t.string   "otp_secret_key"
    t.integer  "user_level",                 default: 1
    t.integer  "parent_id"
    t.integer  "invited_by_id"
    t.boolean  "is_champion",                default: false
    t.boolean  "is_cm_enable",               default: true
    t.boolean  "allow_password_change",      default: false,            null: false
    t.boolean  "internal",                   default: false
    t.string   "catalog_type",               default: "arrivae",        null: false
    t.index ["cm_for_site_supervisor_id"], name: "index_users_on_cm_for_site_supervisor_id", using: :btree
    t.index ["cm_id"], name: "index_users_on_cm_id", using: :btree
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["sales_manager_id"], name: "index_users_on_sales_manager_id", using: :btree
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true, using: :btree
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.integer "user_id"
    t.integer "role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", using: :btree
  end

  create_table "vendor_categories", force: :cascade do |t|
    t.string   "category_name"
    t.integer  "parent_category_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.index ["parent_category_id"], name: "index_vendor_categories_on_parent_category_id", using: :btree
  end

  create_table "vendor_category_mappings", force: :cascade do |t|
    t.integer  "vendor_id"
    t.integer  "sub_category_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["sub_category_id"], name: "index_vendor_category_mappings_on_sub_category_id", using: :btree
    t.index ["vendor_id"], name: "index_vendor_category_mappings_on_vendor_id", using: :btree
  end

  create_table "vendor_products", force: :cascade do |t|
    t.string   "sli_code"
    t.string   "sli_name"
    t.string   "vendor_code"
    t.string   "unit"
    t.float    "rate"
    t.integer  "vendor_id"
    t.integer  "master_line_item_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "sli_group_code"
    t.index ["master_line_item_id"], name: "index_vendor_products_on_master_line_item_id", using: :btree
    t.index ["sli_code"], name: "index_vendor_products_on_sli_code", unique: true, using: :btree
    t.index ["sli_group_code"], name: "index_vendor_products_on_sli_group_code", using: :btree
    t.index ["vendor_id"], name: "index_vendor_products_on_vendor_id", using: :btree
  end

  create_table "vendor_serviceable_city_mappings", force: :cascade do |t|
    t.integer  "serviceable_city_id"
    t.integer  "vendor_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.index ["serviceable_city_id"], name: "index_vendor_serviceable_city_mappings_on_serviceable_city_id", using: :btree
    t.index ["vendor_id"], name: "index_vendor_serviceable_city_mappings_on_vendor_id", using: :btree
  end

  create_table "vendors", force: :cascade do |t|
    t.string   "name"
    t.text     "address"
    t.string   "contact_person"
    t.string   "contact_number"
    t.string   "email"
    t.string   "pan_no"
    t.string   "gst_reg_no"
    t.string   "account_holder"
    t.string   "account_number"
    t.string   "bank_name"
    t.string   "branch_name"
    t.string   "ifsc_code"
    t.string   "pan_copy_file_name"
    t.string   "pan_copy_content_type"
    t.integer  "pan_copy_file_size"
    t.datetime "pan_copy_updated_at"
    t.string   "gst_copy_file_name"
    t.string   "gst_copy_content_type"
    t.integer  "gst_copy_file_size"
    t.datetime "gst_copy_updated_at"
    t.string   "cancelled_cheque_file_name"
    t.string   "cancelled_cheque_content_type"
    t.integer  "cancelled_cheque_file_size"
    t.datetime "cancelled_cheque_updated_at"
    t.string   "city"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "user_id"
    t.float    "dd_score"
    t.index ["pan_no"], name: "index_vendors_on_pan_no", unique: true, using: :btree
    t.index ["user_id"], name: "index_vendors_on_user_id", using: :btree
  end

  create_table "versions", force: :cascade do |t|
    t.string   "item_type",      null: false
    t.integer  "item_id",        null: false
    t.string   "event",          null: false
    t.string   "whodunnit"
    t.text     "object"
    t.datetime "created_at"
    t.text     "object_changes"
    t.index ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree
  end

  create_table "vouchers", force: :cascade do |t|
    t.integer  "lead_id"
    t.string   "code"
    t.boolean  "is_used",    default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["lead_id"], name: "index_vouchers_on_lead_id", using: :btree
  end

  create_table "web_crawl_floorplans", force: :cascade do |t|
    t.text    "url"
    t.integer "web_crawler_id"
    t.index ["web_crawler_id"], name: "index_web_crawl_floorplans_on_web_crawler_id", using: :btree
  end

  create_table "web_crawlers", force: :cascade do |t|
    t.string "name"
    t.text   "group_name"
    t.string "price"
    t.text   "locality"
    t.text   "bhk_type"
    t.string "possession"
    t.string "source"
    t.string "city"
    t.string "source_id"
  end

  create_table "whatsapps", force: :cascade do |t|
    t.string   "to"
    t.string   "ownerable_type"
    t.integer  "ownerable_id"
    t.string   "message"
    t.json     "response"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.index ["ownerable_type", "ownerable_id"], name: "index_whatsapps_on_ownerable_type_and_ownerable_id", using: :btree
  end

  create_table "wip_slis", force: :cascade do |t|
    t.float    "quantity",          default: 0.0
    t.string   "tax_type"
    t.float    "tax"
    t.float    "amount"
    t.integer  "vendor_product_id"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "status",            default: "pending"
    t.integer  "vendor_id"
    t.string   "name"
    t.string   "unit"
    t.float    "rate"
    t.boolean  "custom"
    t.string   "sli_type"
    t.index ["vendor_id"], name: "index_wip_slis_on_vendor_id", using: :btree
    t.index ["vendor_product_id"], name: "index_wip_slis_on_vendor_product_id", using: :btree
  end

  create_table "zipcodes", force: :cascade do |t|
    t.string   "code"
    t.integer  "city_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.boolean  "landing_page_hidden", default: false, null: false
    t.index ["city_id"], name: "index_zipcodes_on_city_id", using: :btree
  end

  add_foreign_key "addon_combination_mappings", "addon_combinations"
  add_foreign_key "addon_combination_mappings", "addons"
  add_foreign_key "addon_tag_mappings", "addons"
  add_foreign_key "addon_tag_mappings", "tags"
  add_foreign_key "addons", "brands"
  add_foreign_key "addons_for_addons_mappings", "addon_combinations"
  add_foreign_key "addons_for_addons_mappings", "addons"
  add_foreign_key "addons_for_addons_mappings", "kitchen_module_addon_mappings"
  add_foreign_key "appliance_jobs", "kitchen_appliances"
  add_foreign_key "appliance_jobs", "tags"
  add_foreign_key "bom_sli_cutting_list_data", "boq_labels"
  add_foreign_key "boq_and_ppt_uploads", "projects"
  add_foreign_key "boq_global_configs", "brands"
  add_foreign_key "boq_global_configs", "quotations"
  add_foreign_key "boq_global_configs", "skirting_configs"
  add_foreign_key "boq_global_configs", "users", column: "preset_created_by_id"
  add_foreign_key "boq_labels", "quotations"
  add_foreign_key "boqjobs", "product_variants"
  add_foreign_key "boqjobs", "products"
  add_foreign_key "boqjobs", "sections"
  add_foreign_key "boqjobs", "tags"
  add_foreign_key "building_crawler_details", "building_crawlers"
  add_foreign_key "building_crawler_floorplans", "building_crawlers"
  add_foreign_key "cad_drawings", "projects"
  add_foreign_key "cad_upload_jobs", "cad_uploads"
  add_foreign_key "cad_uploads", "quotations"
  add_foreign_key "cad_uploads", "users", column: "approved_by_id"
  add_foreign_key "cad_uploads", "users", column: "uploaded_by_id"
  add_foreign_key "carcass_elements", "carcass_element_types"
  add_foreign_key "catalogue_services", "sections"
  add_foreign_key "category_module_types", "kitchen_categories"
  add_foreign_key "category_module_types", "module_types"
  add_foreign_key "category_subcategory_mappings", "catalog_categories"
  add_foreign_key "category_subcategory_mappings", "catalog_subcategories"
  add_foreign_key "city_users", "cities"
  add_foreign_key "city_users", "users"
  add_foreign_key "civil_kitchen_parameters", "boq_global_configs"
  add_foreign_key "cm_mkw_variable_pricings", "users", column: "cm_id"
  add_foreign_key "combined_doors", "brands"
  add_foreign_key "comments", "users"
  add_foreign_key "core_shutter_mappings", "core_materials"
  add_foreign_key "core_shutter_mappings", "core_materials", column: "shutter_material_id"
  add_foreign_key "custom_elements", "projects"
  add_foreign_key "custom_jobs", "custom_elements"
  add_foreign_key "custom_jobs", "tags"
  add_foreign_key "customer_inspirations", "users"
  add_foreign_key "designer_booking_forms", "projects"
  add_foreign_key "designer_details", "users", column: "designer_id"
  add_foreign_key "designer_projects", "leads"
  add_foreign_key "designer_projects", "projects"
  add_foreign_key "designs", "floorplans"
  add_foreign_key "dm_cm_mappings", "users", column: "cm_id"
  add_foreign_key "dm_cm_mappings", "users", column: "dm_id"
  add_foreign_key "dp_questionnaires", "users", column: "designer_id"
  add_foreign_key "dpq_answers", "dp_questionnaires"
  add_foreign_key "dpq_answers", "dpq_questions"
  add_foreign_key "dpq_projects", "dp_questionnaires"
  add_foreign_key "dpq_projects", "dpq_sections"
  add_foreign_key "dpq_questions", "dpq_sections"
  add_foreign_key "elevations", "projects"
  add_foreign_key "extra_jobs", "addon_combinations"
  add_foreign_key "extra_jobs", "addons"
  add_foreign_key "extra_jobs", "tags"
  add_foreign_key "fb_leadgens", "leads"
  add_foreign_key "floorplans", "projects"
  add_foreign_key "gm_cm_mappings", "users", column: "cm_id"
  add_foreign_key "gm_cm_mappings", "users", column: "gm_id"
  add_foreign_key "hardware_elements", "brands"
  add_foreign_key "hardware_elements", "hardware_element_types"
  add_foreign_key "hardware_elements", "hardware_types"
  add_foreign_key "inhouse_calls", "users"
  add_foreign_key "invoices", "projects"
  add_foreign_key "invoices", "quotations"
  add_foreign_key "invoices", "users"
  add_foreign_key "invoices", "users", column: "designer_id"
  add_foreign_key "job_addons", "addon_combinations"
  add_foreign_key "job_addons", "addons"
  add_foreign_key "job_addons", "brands"
  add_foreign_key "job_addons", "job_addons", column: "compulsory_job_addon_id"
  add_foreign_key "job_addons", "modular_jobs"
  add_foreign_key "job_combined_doors", "combined_doors"
  add_foreign_key "job_combined_doors", "modular_jobs"
  add_foreign_key "job_element_vendors", "job_elements"
  add_foreign_key "job_element_vendors", "vendors"
  add_foreign_key "job_elements", "bom_sli_cutting_list_data"
  add_foreign_key "job_elements", "quotations"
  add_foreign_key "job_elements", "vendor_products"
  add_foreign_key "kitchen_addon_slots", "product_modules"
  add_foreign_key "kitchen_appliances", "module_types"
  add_foreign_key "kitchen_module_addon_mappings", "addon_combinations"
  add_foreign_key "kitchen_module_addon_mappings", "addons"
  add_foreign_key "kitchen_module_addon_mappings", "kitchen_addon_slots"
  add_foreign_key "label_job_elements", "boq_labels"
  add_foreign_key "label_job_elements", "job_elements"
  add_foreign_key "lead_app_banners", "users"
  add_foreign_key "lead_campaigns", "users", column: "assigned_cs_agent_id"
  add_foreign_key "lead_priorities", "lead_campaigns"
  add_foreign_key "lead_priorities", "lead_sources"
  add_foreign_key "lead_priorities", "lead_types"
  add_foreign_key "lead_questionaire_items", "note_records"
  add_foreign_key "lead_queues", "lead_priorities"
  add_foreign_key "lead_queues", "leads"
  add_foreign_key "lead_sources", "users", column: "assigned_cs_agent_id"
  add_foreign_key "lead_statistics_data", "leads"
  add_foreign_key "lead_types", "users", column: "assigned_cs_agent_id"
  add_foreign_key "lead_users", "leads"
  add_foreign_key "lead_users", "users"
  add_foreign_key "leads", "lead_campaigns"
  add_foreign_key "leads", "lead_sources"
  add_foreign_key "leads", "lead_types"
  add_foreign_key "leads", "lead_utm_contents"
  add_foreign_key "leads", "lead_utm_media"
  add_foreign_key "leads", "lead_utm_terms"
  add_foreign_key "leads", "users", column: "referrer_id"
  add_foreign_key "leads", "users", column: "related_user_id"
  add_foreign_key "line_item_boms", "contents"
  add_foreign_key "line_markings", "projects"
  add_foreign_key "mkw_layouts", "users", column: "created_by_id"
  add_foreign_key "mli_attributes", "master_line_items"
  add_foreign_key "modspace_cabinet_prices", "core_shutter_mappings"
  add_foreign_key "modspace_cabinet_prices", "product_modules"
  add_foreign_key "modspace_cabinet_prices", "shutter_finishes"
  add_foreign_key "modular_jobs", "brands"
  add_foreign_key "modular_jobs", "modular_jobs", column: "combined_module_id"
  add_foreign_key "modular_jobs", "product_modules"
  add_foreign_key "modular_jobs", "sections"
  add_foreign_key "modular_jobs", "tags"
  add_foreign_key "modular_products", "sections"
  add_foreign_key "module_carcass_elements", "carcass_elements"
  add_foreign_key "module_carcass_elements", "product_modules"
  add_foreign_key "module_hardware_elements", "hardware_elements"
  add_foreign_key "module_hardware_elements", "product_modules"
  add_foreign_key "note_records", "building_crawlers"
  add_foreign_key "office_client_communication_matrices", "office_clients"
  add_foreign_key "office_client_communication_matrices", "office_projects"
  add_foreign_key "office_omcms", "office_users"
  add_foreign_key "office_omcms", "users"
  add_foreign_key "office_project_handovers", "projects"
  add_foreign_key "office_project_vendors", "projects"
  add_foreign_key "office_project_vendors", "vendors"
  add_foreign_key "office_projects", "office_clients"
  add_foreign_key "office_sub_tasks", "office_tasks"
  add_foreign_key "office_tickets", "office_ticket_categories"
  add_foreign_key "office_users", "office_roles"
  add_foreign_key "payment_invoices", "payment_invoices", column: "parent_invoice_id"
  add_foreign_key "payments", "projects"
  add_foreign_key "payments", "quotations"
  add_foreign_key "performa_invoices", "purchase_orders"
  add_foreign_key "performa_invoices", "quotations"
  add_foreign_key "performa_invoices", "vendors"
  add_foreign_key "pi_payments", "performa_invoices"
  add_foreign_key "pi_payments", "users", column: "approved_by_id"
  add_foreign_key "pi_payments", "users", column: "created_by_id"
  add_foreign_key "po_inventories", "vendor_products"
  add_foreign_key "po_wip_orders", "leads"
  add_foreign_key "po_wip_orders_wip_slis", "po_wip_orders"
  add_foreign_key "po_wip_orders_wip_slis", "wip_slis"
  add_foreign_key "portfolio_works", "users"
  add_foreign_key "presentations", "projects"
  add_foreign_key "presentations", "users", column: "designer_id"
  add_foreign_key "presentations_products", "presentations"
  add_foreign_key "presentations_products", "products"
  add_foreign_key "product_categories", "catalog_categories"
  add_foreign_key "product_categories", "products"
  add_foreign_key "product_classes", "catalog_classes"
  add_foreign_key "product_classes", "products"
  add_foreign_key "product_configurations", "sections"
  add_foreign_key "product_likes", "products"
  add_foreign_key "product_likes", "users"
  add_foreign_key "product_module_addons", "addon_combinations"
  add_foreign_key "product_module_addons", "addons"
  add_foreign_key "product_module_addons", "product_modules"
  add_foreign_key "product_module_types", "module_types"
  add_foreign_key "product_module_types", "product_modules"
  add_foreign_key "product_modules", "modular_products"
  add_foreign_key "product_modules", "module_types"
  add_foreign_key "product_range_tags", "products"
  add_foreign_key "product_range_tags", "tags"
  add_foreign_key "product_segments", "catalog_segments"
  add_foreign_key "product_segments", "products"
  add_foreign_key "product_space_tags", "products"
  add_foreign_key "product_space_tags", "tags"
  add_foreign_key "product_subcategories", "catalog_subcategories"
  add_foreign_key "product_subcategories", "products"
  add_foreign_key "production_drawings", "project_handovers"
  add_foreign_key "products", "product_configurations"
  add_foreign_key "products", "products", column: "parent_product_id"
  add_foreign_key "products", "sections"
  add_foreign_key "project_booking_forms", "leads"
  add_foreign_key "project_booking_forms", "projects"
  add_foreign_key "project_details", "projects"
  add_foreign_key "project_handovers", "project_handovers", column: "parent_handover_id"
  add_foreign_key "project_handovers", "projects"
  add_foreign_key "project_handovers", "users", column: "status_updated_by_id"
  add_foreign_key "project_quality_checks", "users", column: "status_updated_by_id"
  add_foreign_key "project_requirements", "projects"
  add_foreign_key "project_tasks", "project_tasks", column: "upstream_dependency_id"
  add_foreign_key "project_tasks", "projects"
  add_foreign_key "project_tasks", "task_categories"
  add_foreign_key "project_tasks", "users"
  add_foreign_key "projects", "leads"
  add_foreign_key "projects", "users"
  add_foreign_key "proposal_docs", "proposals"
  add_foreign_key "proposals", "projects"
  add_foreign_key "purchase_elements", "purchase_orders"
  add_foreign_key "purchase_order_performa_invoices", "performa_invoices"
  add_foreign_key "purchase_order_performa_invoices", "purchase_orders"
  add_foreign_key "purchase_orders", "projects"
  add_foreign_key "purchase_orders", "quotations"
  add_foreign_key "purchase_orders", "vendors"
  add_foreign_key "quotation_payments", "payments"
  add_foreign_key "quotation_payments", "quotations"
  add_foreign_key "quotations", "presentations"
  add_foreign_key "quotations", "projects"
  add_foreign_key "quotations", "users"
  add_foreign_key "quotations", "users", column: "category_appoval_by_id"
  add_foreign_key "quotations", "users", column: "cm_approval_by_id"
  add_foreign_key "quotations", "users", column: "designer_id"
  add_foreign_key "quotations", "users", column: "per_10_approved_by_id"
  add_foreign_key "quotations", "users", column: "per_50_approved_by_id"
  add_foreign_key "recordings", "events"
  add_foreign_key "recordings", "projects"
  add_foreign_key "recordings", "users"
  add_foreign_key "reference_images", "projects"
  add_foreign_key "requested_files", "users", column: "raised_by_id"
  add_foreign_key "requirement_sheets", "project_requirements"
  add_foreign_key "requirement_space_q_and_as", "requirement_sheets"
  add_foreign_key "scope_of_works", "projects"
  add_foreign_key "scope_qnas", "scope_spaces"
  add_foreign_key "scope_spaces", "scope_of_works"
  add_foreign_key "section_tags", "sections"
  add_foreign_key "section_tags", "tags"
  add_foreign_key "segment_category_mappings", "catalog_categories"
  add_foreign_key "segment_category_mappings", "catalog_segments"
  add_foreign_key "send_to_factory_urls", "contents"
  add_foreign_key "send_to_factory_urls", "projects"
  add_foreign_key "service_activities", "service_categories"
  add_foreign_key "service_activities", "service_subcategories"
  add_foreign_key "service_jobs", "service_activities"
  add_foreign_key "service_jobs", "tags"
  add_foreign_key "service_subcategories", "service_categories"
  add_foreign_key "shades", "edge_banding_shades"
  add_foreign_key "shangpin_job_colors", "shangpin_core_materials"
  add_foreign_key "shangpin_jobs", "tags"
  add_foreign_key "shangpin_layouts", "users", column: "created_by_id"
  add_foreign_key "shutter_finish_shades", "shades"
  add_foreign_key "shutter_finish_shades", "shutter_finishes"
  add_foreign_key "shutter_material_finishes", "core_materials"
  add_foreign_key "shutter_material_finishes", "shutter_finishes"
  add_foreign_key "site_galleries", "site_measurement_requests"
  add_foreign_key "site_layouts", "note_records"
  add_foreign_key "site_measurement_requests", "projects"
  add_foreign_key "sli_dynamic_attributes", "mli_attributes"
  add_foreign_key "sli_dynamic_attributes", "vendor_products"
  add_foreign_key "slides", "presentations"
  add_foreign_key "sms_logs", "users", column: "from_id"
  add_foreign_key "sms_logs", "users", column: "to_id"
  add_foreign_key "subcategory_class_mappings", "catalog_classes"
  add_foreign_key "subcategory_class_mappings", "catalog_subcategories"
  add_foreign_key "task_categories", "projects"
  add_foreign_key "task_escalations", "task_sets"
  add_foreign_key "three_d_images", "projects"
  add_foreign_key "training_materials", "training_materials"
  add_foreign_key "unit_product_mappings", "business_units"
  add_foreign_key "unit_product_mappings", "products"
  add_foreign_key "unit_segment_mappings", "business_units"
  add_foreign_key "unit_segment_mappings", "catalog_segments"
  add_foreign_key "urban_ladder_infos", "products"
  add_foreign_key "users", "users", column: "cm_for_site_supervisor_id"
  add_foreign_key "users", "users", column: "cm_id"
  add_foreign_key "users", "users", column: "sales_manager_id"
  add_foreign_key "vendor_categories", "vendor_categories", column: "parent_category_id"
  add_foreign_key "vendor_category_mappings", "vendor_categories", column: "sub_category_id"
  add_foreign_key "vendor_products", "master_line_items"
  add_foreign_key "vendor_products", "vendors"
  add_foreign_key "vendor_serviceable_city_mappings", "cities", column: "serviceable_city_id"
  add_foreign_key "vendors", "users"
  add_foreign_key "vouchers", "leads"
  add_foreign_key "web_crawl_floorplans", "web_crawlers"
  add_foreign_key "wip_slis", "vendor_products"
  add_foreign_key "wip_slis", "vendors"
end
