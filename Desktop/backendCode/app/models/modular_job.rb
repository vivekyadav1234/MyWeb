# == Schema Information
#
# Table name: modular_jobs
#
#  id                      :integer          not null, primary key
#  name                    :string
#  quantity                :float
#  rate                    :float
#  amount                  :float
#  space                   :string
#  category                :string
#  dimensions              :string
#  core_material           :string
#  shutter_material        :string
#  shutter_finish          :string
#  shutter_shade_code      :string
#  skirting_config_type    :string
#  skirting_config_height  :string
#  door_handle_code        :string
#  shutter_handle_code     :string
#  hinge_type              :string
#  channel_type            :string
#  ownerable_type          :string
#  ownerable_id            :integer
#  product_module_id       :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  number_exposed_sites    :integer
#  section_id              :integer
#  number_door_handles     :integer          default(0)
#  number_shutter_handles  :integer          default(0)
#  brand_id                :integer
#  kitchen_category_name   :string
#  combined_module_id      :integer
#  combined                :boolean          default(FALSE)
#  edge_banding_shade_code :string
#  custom_shelf_unit_width :integer          default(0)
#  thickness               :float
#  length                  :float
#  breadth                 :float
#  width                   :integer
#  depth                   :integer
#  height                  :integer
#  estimated_cogs          :float            default(0.0)
#  clubbed_job_id          :integer
#  tag_id                  :integer
#  no_bom                  :boolean          default(FALSE), not null
#  lead_time               :integer          default(0), not null
#  lead_time_type          :string
#  lead_time_code          :string
#

class ModularJob < ApplicationRecord
  attr_accessor :skip_price_calculation   #use this to skip callback's rate and amount calculation part

  has_paper_trail

  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :section, required: true
  belongs_to :product_module, optional: true
  belongs_to :brand, optional: true
  belongs_to :clubbed_job, optional: true

  belongs_to :tag, optional: :true
  
  has_many :job_addons, dependent: :destroy
  has_many :addons, through: :job_addons
  has_many :addon_combinations, through: :job_addons
  has_many :combined_addons, through: :addon_combinations, source: :addons  # Addons chosen as combination.
  has_one :invoice_line_item, as: :line_item, dependent: :destroy
  has_one :payment_invoice, through: :invoice_line_item
  
  has_one :job_combined_door, dependent: :destroy
  has_one :combined_door, through: :job_combined_door

  # self-referencing, used for combining module - only for wardrobes.
  belongs_to :combined_module, class_name: 'ModularJob', optional: true
  # dependent: :nullify ensures that if a modular_job is deleted, then its individual
  # jobs become independent.
  has_many :modular_jobs, class_name: 'ModularJob', foreign_key: 'combined_module_id', dependent: :nullify

  # for storing cost data
  has_one :modular_job_cost, dependent: :destroy

  # for cad uploads
  has_many :cad_upload_jobs, as: :uploadable, dependent: :destroy
  has_many :cad_uploads, through: :cad_upload_jobs

  # For BOM files uploaded against this line item.
  has_many :line_item_boms, as: :line_item, dependent: :destroy
  has_many :boms, through: :line_item_boms, source: :content

  # for dividing a job into several elements as each elements can have its own set of vendors
  has_many :job_elements, as: :ownerable, dependent: :destroy
  has_many :vendors, through: :job_elements

  has_many :boq_labels, as: :ownerable, dependent: :destroy

  has_many :production_drawings, as: :line_item, dependent: :destroy
  has_many :project_handovers, through: :production_drawings 

  has_many :contents, as: :ownerable

  validates_presence_of :space, unless: :belongs_to_layout?
  validates :quantity, numericality: { greater_than: 0 }

  validate :combined_wardrobe_only
  validate :product_module_present?

  validates :no_bom, inclusion: { in: [true, false] }

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  validates_inclusion_of :hinge_type, in: BoqGlobalConfig::ALL_HINGE_TYPES.keys, unless: Proc.new{:is_combined_module? || :belongs_to_layout?}
  # validates_inclusion_of :channel_type, in: BoqGlobalConfig::ALL_CHANNEL_TYPES.keys, unless: Proc.new{:is_combined_module? || :belongs_to_layout?}, allow_blank: true

  ALLOWED_EXPOSED_SITES = [0,1,2]
  # validates_inclusion_of :number_exposed_sites, in: ALLOWED_EXPOSED_SITES, unless: :is_combined_module?

  ALLOWED_UNFINISHED_THICKNESSES = [6.0, 12.0, 18.0]
  ALLOWED_FINISHED_THICKNESSES = [18.0]
  validate :thickness_valid_for_finished_unfinished
  validates_inclusion_of :thickness, in: ALLOWED_UNFINISHED_THICKNESSES, allow_blank: true

  before_validation :populate_defaults, unless: :belongs_to_layout?
  before_save :set_lead_time
  after_save :populate_combined_amount, if: :is_combined_module?
  after_save :update_master_module, if: Proc.new {:belongs_to_combined_module? && !:belongs_to_layout?}
  after_save :update_quotation_amount, unless: :belongs_to_layout?
  after_save :populate_labels, on: [:create, :update], unless: :belongs_to_layout?
  before_destroy :delete_combined_module, if: :belongs_to_combined_module?
  after_destroy :update_quotation_amount, unless: :belongs_to_layout?

  scope :not_combined_module, -> { where(combined: [false, nil]) }
  scope :kitchen, -> { where(category: 'kitchen') }
  scope :wardrobe, -> { where(category: 'wardrobe') }
  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}

  include JobSplitConcern

  # These columns will be copied from a modular job in a BOQ to a layout's modular job
  # while creating the layout.
  LAYOUT_COLUMNS_TO_COPY = [:name, :quantity, :category, :dimensions, :product_module_id,
    :number_exposed_sites, :section_id, :number_door_handles, :number_shutter_handles, :kitchen_category_name,
    :combined, :custom_shelf_unit_width, :thickness, :length, :breadth, :width, :depth, :height]

  LAYOUT_COLUMNS_NIL = [:rate, :amount, :space, :core_material, :shutter_material, :shutter_finish,
    :shutter_shade_code, :skirting_config_type, :skirting_config_height, :door_handle_code,
    :shutter_handle_code, :hinge_type, :channel_type, :brand_id, :combined_module_id, :edge_banding_shade_code]

  CM_LEAD_TIME_MAPPING = {
    'saurabh@gloify.com': 30,
    'pallavini@arrivae.com': 30,
    'sangeeth@arrivae.com': 30,
    'rajkiran@arrivae.com': 30,
    'dimple@arrivae.com': 30
  }
  def belongs_to_layout?
    ownerable_type == "MkwLayout"
  end

  def is_combined_module?
    combined
  end

  def is_custom_shelf_unit_job?
    product_module&.code == ProductModule::CUSTOM_SHELF_UNIT_CODE
  end

  def belongs_to_combined_module?
    !combined && combined_module.present?
  end

  def update_master_module
    combined_module.populate_combined_amount
  end

  def update_quotation_amount
    if ownerable_type == "Quotation"
      ownerable.set_amounts
    end
  end

  # if a job is deleted, ensure that its parent combined module is unless it has another 2 module or more
  def delete_combined_module
    combined_module.destroy! if combined_module.modular_jobs.count <= 1
  end

  def populate_defaults
    #combined module, just sum up the individual module prices plus the combined door cost
    if combined
      self.quantity = 1 if quantity.blank?
      self.category = "wardrobe"
      self.section = Section.modular_wardrobe
    else
      self.quantity = 1 if quantity.blank?
      self.rate = 0 if rate.blank?
      if category == "kitchen"
        self.section = Section.modular_kitchen
      elsif category == "wardrobe"
        self.section = Section.modular_wardrobe
      end

      # for custom shelf modules, use the appropriate module for price calculation
      module_to_use = nil
      if is_custom_shelf_unit_job?
        module_to_use = product_module.get_nearest_module(custom_shelf_unit_width.to_i)
      else
        module_to_use = product_module
      end

      if skip_price_calculation
        self.rate = 0
        self.amount = 0
      else
        set_rate(module_to_use)
      end
    end
  end

  # if the number of boq_labels is less than the quantity of the line item, generate required
  # number of labels
  def populate_labels(options={})
    missing_count = 0
    unless options[:unlimited_labels]
      missing_count = [quantity.to_i - boq_labels.count, BoqLabel::MAX_AUTO_GENERATED_LABELS].min
      missing_count = [0, missing_count].max  #cannot be less than 0.
    end
    missing_count.times do
      self.boq_labels.create!
    end
  end

  def set_rate(module_to_use)
    price_factor_hash = get_price_factor_hash
    self.rate = module_to_use.calculate_price(options_for_calculation) * price_factor_hash["sale_cost_factor"]["overall"] * get_price_increase_factor
    self.amount = (rate * quantity).round(2)
  end

  def populate_combined_amount
    rate = self.reload.combined_module_price
    self.update_columns(rate: rate, amount: quantity * rate)
  end

  # just sum up the individual module prices plus the combined door cost per m width
  def combined_module_price
    price_factor_hash = get_price_factor_hash
    (modular_jobs.pluck(:amount).sum + price_factor_hash["sale_cost_factor"]["overall"]* get_price_increase_factor * combined_door&.price.to_f).round(2)
  end

  # Populate estimated COGS, including the associated record modular_job_cost
  def populate_estimated_cogs
    if combined
      self.update_columns(estimated_cogs: combined_module_cost_price.round(2))
    else
      self.update_columns(estimated_cogs: cost_price.round(2))
    end
  end

  def combined_module_cost_price
    self.create_modular_job_cost if modular_job_cost.blank?
    price_factor_hash = MKW_GLOBAL_DATA_ESTIMATED_COGS
    modular_job_cost.update(carcass_cost: price_factor_hash["sale_cost_factor"]["overall"] * combined_door&.price.to_f)
    (modular_jobs.pluck(:estimated_cogs).sum + price_factor_hash["sale_cost_factor"]["overall"] * combined_door&.price.to_f).round(2)
  end

  def cost_price
    self.create_modular_job_cost if modular_job_cost.blank?
    price_factor_hash = MKW_GLOBAL_DATA_ESTIMATED_COGS.merge({"has_modspace_pricing" => ownerable_type == 'Quotation' && ownerable.has_modspace_pricing?})
    # for custom shelf modules, use the appropriate module for price calculation
    module_to_use = nil
    if is_custom_shelf_unit_job?
      module_to_use = product_module.get_nearest_module(custom_shelf_unit_width.to_i)
    else
      module_to_use = product_module
    end

    # Get the cost and also set the modular_job_cost values in the method :set_costs.
    # removing get_price_increase_factor as there is no reason why it would affect the cost
    options_hash = options_for_calculation.merge(modular_job_cost: modular_job_cost)
    quantity * module_to_use.set_costs(options_hash) * price_factor_hash["sale_cost_factor"]["overall"]
  end

  def remove_addon(addon, options={})
    if options[:combination]
      self.addon_combinations.delete(addon.id)
    else
      self.addons.delete(addon.id)
    end
  end

  def add_combined_door(combined_door)
    self.combined_door = nil if self.combined_door.present?
    mapping = self.build_job_combined_door(combined_door: combined_door)
    mapping.save! unless mapping.new_record?
  end

  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
  end

  def remove_combined_door
    self.combined_door = nil
  end

  def import_module(product_module, quantity, section_id, space=nil, options = {})
    #populate the job fields now
    self.name = product_module.description
    self.quantity = quantity.to_f
    # self.rate = product_module.calculate_price.to_f
    # self.amount = product_module(options_for_calculation)
    self.section_id = section_id
    self.space = space
    self.category = product_module.category

    # This part is for custom modules only! Where the designer can set the thickness, L, B,
    # w, d, h or a combination of these.
    set_custom_dimensions(options)
    # End custom module's custom dimension part

    # only for show
    # self.dimensions = [product_module.width,product_module.depth,product_module.height].compact.join("X")
    # properties taken from global variables or customization for BOQ
    if ownerable_type == "Quotation"
      boq_global_config = get_boq_global_config
      self.kitchen_category_name = options[:kitchen_category] if category == "kitchen"
      self.core_material = options[:core_material].present? ? options[:core_material] : boq_global_config.core_material
      self.shutter_material = options[:shutter_material].present? ? options[:shutter_material] : boq_global_config.shutter_material
      self.shutter_finish = options[:shutter_finish].present? ? options[:shutter_finish] : boq_global_config.shutter_finish
      self.shutter_shade_code = options[:shutter_shade_code].present? ? options[:shutter_shade_code] : boq_global_config.shutter_shade_code
      self.edge_banding_shade_code = options[:edge_banding_shade_code].present? ? options[:edge_banding_shade_code] : boq_global_config.edge_banding_shade_code
      self.skirting_config_type = options[:skirting_config_type].present? ? options[:skirting_config_type] : boq_global_config.skirting_config_type
      self.skirting_config_height = options[:skirting_config_height].present? ? options[:skirting_config_height] : boq_global_config.skirting_config_height
      set_door_handle(options)
      # self.door_handle_code = options[:door_handle_code].present? ? options[:door_handle_code] : boq_global_config.door_handle_code
      if category == 'kitchen'
        self.shutter_handle_code = door_handle_code   #both codes same - frontend is sending shutter handle code only
      else
        self.shutter_handle_code = options[:shutter_handle_code].present? ? options[:shutter_handle_code] : boq_global_config.shutter_handle_code
      end
      self.hinge_type = options[:hinge_type].present? ? options[:hinge_type] : boq_global_config.hinge_type
      self.channel_type = options[:channel_type].present? ? options[:channel_type] : boq_global_config.channel_type
      self.number_exposed_sites = options[:number_exposed_sites]
      self.number_door_handles = options[:number_door_handles]
      self.number_shutter_handles = options[:number_shutter_handles]
      self.custom_shelf_unit_width = options[:custom_shelf_unit_width]
      self.brand_id = options[:hardware_brand_id].present? ? options[:hardware_brand_id] : boq_global_config.brand_id   #different name - be careful
    end
    ### addons
    self.job_addons = []
    options[:addons].each do |addon_hash|
      addon = nil
      next if addon_hash[:id].blank?
      klass_name = addon_hash["combination"] ? "AddonCombination" : "Addon"
      addon = klass_name.constantize.find addon_hash[:id]
      addon_options = {}
      if category == "kitchen"
        addon_options = {
          compulsory: addon_hash[:compulsory],
          slot: addon_hash[:slot],
          brand_id: addon_hash[:brand_id], 
          combination: addon_hash[:combination]
        }
      end
      add_addon(addon, addon_hash[:quantity], addon_options)
    end if options[:addons].present?
    # now mark if any job_addon belongs to a compulsory job_addon
    options[:addons].each do |addon_hash|
      set_compulsory_job_addon(addon_hash) if addon_hash[:compulsory_addon_id].present?
    end if options[:addons].present?
    # ensure that all addons added to this line item are mapped in db - if not, add errors to the Quotation and delete the 
    # offending job_addons (if :delete_unmapped is set to true)
    addons_must_be_mapped({delete_unmapped: true})
    ###end addons

    # if finished or unfinished panel, then set the applicable columns to nil
    if product_module.unfinished_panel? || product_module.finished_panel?
      nullify_unfinished_panel_values
    end
    # puts attributes
    self.save if options[:save_now]
    self
  end

  def add_addon(addon, quantity, options={})
    mapping = nil
    if options[:combination]
      mapping = self.job_addons.where(addon_combination: addon, slot: options[:slot]).first_or_initialize
    else
      mapping = self.job_addons.where(addon: addon, slot: options[:slot]).first_or_initialize
    end
    mapping.quantity = quantity
    mapping.compulsory = true if options[:compulsory]
    # mapping.slot = options[:slot]
    mapping.brand_id = options[:brand_id]
    mapping.compulsory_job_addon_id = options[:compulsory_job_addon_id]
    mapping.save
  end

  # used in :import_module method.
  def set_compulsory_job_addon(addon_hash)
    this_job_addon = nil
    compulsory_job_addon = nil
    # find the optional addon
    if addon_hash["combination"]
      this_job_addon = job_addons.find_by(slot: addon_hash[:slot], addon_combination_id: addon_hash[:id], compulsory: false)
    else
      this_job_addon = job_addons.find_by(slot: addon_hash[:slot], addon_id: addon_hash[:id], compulsory: false)
    end

    # now find the compulsory job_addon
    # changing this code so that addon_hash[:compulsory_addon_type] is no longer needed.
    # Important assumption here - for a given slot, a modular_job will have only one single compulsory job_addon!
    if addon_hash[:compulsory_addon_type] == 'single'
      compulsory_job_addon = job_addons.find_by(slot: addon_hash[:slot], compulsory: true)
    else
      compulsory_job_addon = job_addons.find_by(slot: addon_hash[:slot], compulsory: true)
    end

    # if this_job_addon is blank, then remove the optional addon that was to be added to it as well
    if this_job_addon.blank? || compulsory_job_addon.blank?
      return false
    else
      this_job_addon.update(compulsory_job_addon: compulsory_job_addon)
    end
  end

  # Similar to importing when part of a BOQ, but there are several differences.
  # Biggest difference is importing from a given modular_job, not
  # Only import the values not part of the Global Variables preset, plus addons.
  def import_job_for_layout
    new_job = self.deep_clone include: [ :job_combined_door ], only: LAYOUT_COLUMNS_TO_COPY

    LAYOUT_COLUMNS_NIL.each do |column_name|
      new_job.public_send("#{column_name}=", nil)
    end

    new_job
  end

  # reverse of import_job_for_layout - obvious how it should work. Import INTO quotation!
  # take most properties from global variable, rest from layout
  def import_job_from_layout(quotation, category, space)
    new_job = self.deep_clone include: [ :job_combined_door ], only: LAYOUT_COLUMNS_TO_COPY
    new_job.ownerable = quotation
    new_job.category = category
    new_job.space = space
    new_job.product_module = product_module

    # many properties will be taken from global variables or customization for BOQ
    boq_global_config = quotation.boq_global_configs.find_by_category(category)

    arr = [:core_material, :shutter_material, :shutter_finish, :shutter_shade_code, :edge_banding_shade_code,
      :skirting_config_type, :skirting_config_height, :shutter_handle_code, :door_handle_code,
      :hinge_type, :channel_type, :brand_id]

    arr.map(&:to_s).each do |gc_column|
      new_job.public_send("#{gc_column}=", boq_global_config.public_send(gc_column))
    end

    new_job
  end

  # also for creating layouts from modular_jobs
  def copy_job_addons(modular_job)
    # start with top level jobs
    modular_job.job_addons.where(compulsory_job_addon_id: nil).each do |job_addon|
      layout_job_addon = job_addon.import_for_layout
      layout_job_addon.modular_job = self
      layout_job_addon.save!

      job_addon.optional_job_addons.each do |included_job_addon|
        included_layout_job_addon = included_job_addon.import_for_layout
        included_layout_job_addon.compulsory_job_addon = layout_job_addon
        included_layout_job_addon.modular_job = self
        included_layout_job_addon.save!
      end
    end
  end

  # for aluminium profile shutters, only the special handles are allowed, with G Section handle default.
  # this overrides any boq_global_config value (only upon creation of job, not update)
  def set_door_handle(options)
    if new_record? && category == 'kitchen' && product_module&.aluminium_profile_shutter?
      self.door_handle_code = Handle.g_section_handle.code
    else
      if options[:door_handle_code].present?
        self.door_handle_code = options[:door_handle_code]
      else
        boq_global_config = get_boq_global_config
        self.door_handle_code = boq_global_config.door_handle_code
      end
    end
  end

  # This part is for custom modules only! Where the designer can set the thickness, L, B,
  # w, d, h or a combination of these.
  def set_custom_dimensions(options)
    self.thickness = options[:thickness] if options.has_key?(:thickness)
    self.length = options[:length] if options.has_key?(:length)
    self.breadth = options[:breadth] if options.has_key?(:breadth)
    self.width = options[:width] if options.has_key?(:width)
    self.depth = options[:depth] if options.has_key?(:depth)
    self.height = options[:height] if options.has_key?(:height)
    if width.present? || depth.present? || height.present?
      self.dimensions = [width, depth, height].map{|d| d.present? ? d : 'NA'}.join("X") + " (WDH)"
    elsif thickness.present?
      self.dimensions = [length, breadth, thickness].map{|d| d.present? ? d : 'NA'}.join("X") + " (LBT)"
    else
      self.dimensions = [product_module.width, product_module.depth, product_module.height].map{|d| d || 'NA'}.join("X") + " (WDH)"
    end
  end

  # works for both unfinished and finished panels.
  def nullify_unfinished_panel_values
    attributes_to_nullify = product_module.attributes_not_for_customization.map(&:to_s)
    # brand_id is the column name - hardware_brand_id is what comes from form.
    attributes_to_nullify.delete "hardware_brand_id"
    attributes_to_nullify << "brand_id"
    attributes_to_nullify.each do |attr|
      self.send("#{attr}=", nil)
    end
  end

  def options_for_calculation
    # addons data -> set here due to complications due to combinations.
    addons_array = job_addons.map do |job_addon|
      addon_id = job_addon.addon_id.present? ? job_addon.addon_id : job_addon.addon_combination_id
      {
        id: addon_id, 
        quantity: job_addon.quantity, 
        brand_id: job_addon.brand_id, 
        combination: job_addon.combination?
      }
    end

    {
      civil_kitchen: get_civil_kitchen_value,
      core_material: core_material,
      shutter_material: shutter_material,
      shutter_finish: shutter_finish,
      shutter_shade_code: shutter_shade_code,
      edge_banding_shade_code: edge_banding_shade_code,
      skirting_config_type: skirting_config_type,
      skirting_config_height: skirting_config_height,
      door_handle_code: door_handle_code,
      shutter_handle_code: shutter_handle_code,
      hinge_type: hinge_type,
      channel_type: channel_type,
      number_exposed_sites: number_exposed_sites,
      brand_id: brand_id,
      custom_shelf_unit_width: custom_shelf_unit_width,
      addons: addons_array,
      # custom module related
      thickness: thickness,
      length: length,
      breadth: breadth,
      width: width,
      depth: depth,
      height: height,
      price_factor_hash: get_price_factor_hash
    }
  end

  # apply boq_global_config values provided to this job
  def apply_global_config(boq_global_config, options = {})
    self.core_material = boq_global_config.core_material
    self.shutter_material = boq_global_config.shutter_material
    self.shutter_finish = boq_global_config.shutter_finish
    self.shutter_shade_code = boq_global_config.shutter_shade_code
    self.edge_banding_shade_code = boq_global_config.edge_banding_shade_code
    self.skirting_config_type = boq_global_config.skirting_config_type
    self.skirting_config_height = boq_global_config.skirting_config_height
    self.door_handle_code = boq_global_config.door_handle_code
    self.shutter_handle_code = boq_global_config.shutter_handle_code
    self.hinge_type = boq_global_config.hinge_type
    self.channel_type = boq_global_config.channel_type
    self.brand_id = boq_global_config.brand_id
    self.save if persisted? && options[:save_now]   #don't try to save for new records - they will save with the quotation.
  end

  def get_boq_global_config
    ownerable.boq_global_configs.find_by_category(category)
  end

  def get_price_factor_hash
    if ownerable_type == "Quotation"
      return ownerable.get_price_factor_hash
    else
      return MKW_GLOBAL_DATA
    end
  end

  def get_civil_kitchen_value
    if product_module&.module_type&.kitchen_categories.first == KitchenCategory.base_unit
      if ownerable_type == "Quotation" && category == 'kitchen'
        boq_global_config = get_boq_global_config
        boq_global_config.present? ? boq_global_config.civil_kitchen : nil
      else
        return false
      end
    else
      return false
    end
  end

  def get_price_increase_factor
    if ownerable_type == "Quotation"
      return ownerable.price_increase_factor
    else
      return 1.0
    end
  end

  def time_line
    result = {type: "", code: "", lead_time: 0}
    project_module_lead_time = {type: "cabinet", code: "", lead_time: product_module&.lead_time}
    addon_lead_time = {type: "addon", code: "", lead_time: 0}
    addons.each do |addon|
      if addon.lead_time.to_f > addon_lead_time[:lead_time].to_f
        addon_lead_time[:lead_time] = addon.lead_time
        addon_lead_time[:code] = addon.code
      end
    end
    # Repeat as above for mandatory addons chosen as combination.
    combined_addons.distinct.each do |addon|
      if addon.lead_time.to_f > addon_lead_time[:lead_time].to_f
        addon_lead_time[:lead_time] = addon.lead_time
        addon_lead_time[:code] = addon.code
      end
    end
    finish_lead_time = {type: "finish", code: "", lead_time: ShutterFinish.find_by(name: shutter_finish)&.lead_time}
    shade_lead_time = {type: "shade", code: "", lead_time: Shade.find_by(code: shutter_shade_code)&.lead_time}
    skirting_lead_time = {type: "skirting", code: "", lead_time: SkirtingConfig.find_by(skirting_type: skirting_config_type, skirting_height: skirting_config_height)&.lead_time}
    handle_lead_time = {type: "handle", code: "", lead_time: 0}
    if (number_door_handles.present? and number_door_handles > 0) and (number_shutter_handles.present? and number_shutter_handles > 0)
      [door_handle_code, shutter_handle_code].each do |code|
        lt = Handle.find_by(code: code)&.lead_time
        if lt > handle_lead_time[:lead_time]
          handle_lead_time[:code] = code
          handle_lead_time[:lead_time] = lt
        end
      end
    elsif (number_door_handles.present? and number_door_handles > 0)
      lt = Handle.find_by(code: door_handle_code)&.lead_time
      handle_lead_time[:code] = door_handle_code
      handle_lead_time[:lead_time] = lt
    elsif (number_shutter_handles.present? and number_shutter_handles > 0)
      lt = Handle.find_by(code: shutter_handle_code)&.lead_time
      handle_lead_time[:code] = shutter_handle_code
      handle_lead_time[:lead_time] = lt
    end
    core_material_lead_time = {type: "core material", code: "", lead_time: CoreMaterial.find_by(name: core_material)&.lead_time}
    [project_module_lead_time, addon_lead_time, finish_lead_time, shade_lead_time, skirting_lead_time, handle_lead_time, core_material_lead_time].each do |ele|
      if (ele[:lead_time] || 0) > result[:lead_time]
        result[:lead_time] = ele[:lead_time]
        result[:type] = ele[:type]
        result[:code] = ele[:code]
      end
    end
    ### changed as per client requirements
    if self.ownerable_type == 'Quotation'
      l_time = CM_LEAD_TIME_MAPPING[self.ownerable.project&.lead&.assigned_cm&.email&.to_sym] || 45
      result[:lead_time] = l_time
    end
    result
  end

  # Added this as a column as otherwise, it takes too long to calculate and render, for example
  # in the BOQ show.
  # Take the result of the :time_line method and use that to populate the individual columns.
  def set_lead_time
    result_hash = time_line
    self.lead_time = time_line[:lead_time]
    self.lead_time_type = time_line[:type]
    self.lead_time_code = time_line[:code]
  end

  # reverse of :set_lead_time. Take the columns and build the hash in format of :time_line method.
  def time_line_from_columns
    {
      lead_time: lead_time,
      type: lead_time_type,
      code: lead_time_code
    }
  end

  # Check if this modular job has mandatory addons in all the required slots.
  # Please note that this method doesn't check if the addons themselves are correct. That is done by the 
  # method :addons_must_be_mapped.
  def mandatory_addons_present?
    return true if product_module.blank?
    slot_names = product_module.kitchen_addon_slots.pluck(:slot_name)
    slots_compulsory_addons_added = job_addons.where(compulsory: true, compulsory_job_addon_id: nil).pluck(:slot)
    return ( slot_names - slots_compulsory_addons_added ).blank?
  end

  # does this modular_job have unmapped_addons? Read only method - no writing please!!!
  def has_unmapped_addons?
    addons_must_be_mapped.present?
  end

  # Check if the addons added to this modular_job is actually mapped to it.
  # If not, then we also remove it, if :delete_unmapped is provided to in options.
  def addons_must_be_mapped(options={})
    return [] if product_module.blank?  #no need for validation if no module is there
    job_addon_ids_delete = []
    # first the optional addons
    job_addon_ids_delete << check_optional_addons
    # then the compulsory
    job_addon_ids_delete << check_compulsory_addons
    if options[:delete_unmapped]
      job_addons.where(id: job_addon_ids_delete.flatten.uniq).destroy_all
    end
    puts "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    puts errors.full_messages
    puts "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
    # return the ids of job_addons that have unmapped addons
    job_addon_ids_delete.flatten.uniq
  end

  def check_optional_addons
    optional_job_addons = job_addons.where(slot: nil)
    disallowed_addons = optional_job_addons.joins(:addon).where.not(addons: { id: product_module.allowed_addons.pluck(:id) })
    disallowed_addon_combinations = optional_job_addons.joins(:addon_combination).where.not(addon_combinations: { id: product_module.allowed_addon_combinations.pluck(:id) })
    disallowed_addons.each do |job_addon|
      errors.add :base, "Unmapped Addon #{job_addon.addon&.code} added to module #{product_module.code} as optional addon."
    end
    disallowed_addon_combinations.each do |job_addon|
      errors.add :base, "Unmapped Combination #{job_addon.addon_combination&.code} added to module #{product_module.code} as optional addon."
    end
    # return the ids of job_addons to be deleted
    disallowed_addons.pluck(:id) + disallowed_addon_combinations.pluck(:id)
  end

  def check_compulsory_addons
    ja_to_delete_ids = []
    compulsory_job_addons = job_addons.where.not(slot: nil).where(compulsory: true).includes(modular_job: { product_module: { kitchen_addon_slots: { kitchen_module_addon_mappings: :addons_for_addons_mappings } } })
    disallowed_addons = compulsory_job_addons.select do |job_addon|
      # First check if the module has such a slot or not! If not, add error and go to next job_addon.
      kitchen_addon_slot = product_module.kitchen_addon_slots.find_by slot_name: job_addon.slot
      unless kitchen_addon_slot.present?
        errors.add :base, "Module #{product_module.code} has no slot #{job_addon.slot} for mandatory addons."
        ja_to_delete_ids << job_addon.id
        next
      end
      addon = job_addon.addon.present? ? job_addon.addon : job_addon.addon_combination
      # check if the slot contains this addon as one of the mapped mandatory addons.
      unless ( addon.class.to_s == 'Addon' && kitchen_addon_slot.addons.include?(addon) ) || 
        ( addon.class.to_s == 'AddonCombination' && kitchen_addon_slot.addon_combinations.include?(addon) )
        # No. So, add errors.
        errors.add :base, "Unmapped #{addon.class.to_s} #{addon&.code} added to module #{product_module.code}, slot #{job_addon.slot} as mandatory addon."
        ja_to_delete_ids << job_addon.id
        # Also, any of its optional addons for this mandatory addon should be marked for deletion - currently, that happens by
        # dependent: :destroy, so following line is not needed. But we have it just in case the previous fails. No harm done if 
        # they were deleted already, as expected.
        ja_to_delete_ids << job_addon.optional_job_addons.pluck(:id)
      else
        # Yes, mandatory addon is mapped for the slot.
        # So, Now check if the optional addons added to this are mapped for the particular combination of module, slot and the chosen
        # mandatory addon.
        kmap = addon.class.to_s == 'Addon' ? kitchen_addon_slot.kitchen_module_addon_mappings.find_by(addon: addon) : kitchen_addon_slot.kitchen_module_addon_mappings.find_by(addon_combination: addon)
        job_addon.optional_job_addons.each do |optional_job_addon|
          optional_addon = optional_job_addon.addon.present? ? optional_job_addon.addon : optional_job_addon.addon_combination
          unless ( optional_addon.class.to_s == 'Addon' && kmap.allowed_addons.include?(optional_addon) ) || 
            ( optional_addon.class.to_s == 'AddonCombination' && kmap.allowed_addon_combinations.include?(optional_addon) )
            errors.add :base, "Unmapped optional #{optional_addon.class.to_s} #{optional_addon&.code} added to module #{product_module.code}, slot #{job_addon.slot} for mandatory addon #{addon.code}."
            ja_to_delete_ids << optional_job_addon.id
          end
        end
      end
    end

    ja_to_delete_ids.flatten
  end

  private
  # a combined module must be for modular wardrobe only
  def combined_wardrobe_only
    errors.add(:combined, "combined module must be for wardrobe only") if combined && category != "wardrobe"
  end

  # unless a module is a combined module, it must have an associated product_module.
  def product_module_present?
    errors.add(:product_module_id, "module must exist") unless combined || product_module.present?
  end

  def thickness_valid_for_finished_unfinished
    if product_module&.unfinished_panel?
      errors.add(:thickness, "must be in #{ALLOWED_UNFINISHED_THICKNESSES}.") unless ALLOWED_UNFINISHED_THICKNESSES.include?(thickness)
    elsif product_module&.finished_panel?
      errors.add(:thickness, "must be in #{ALLOWED_FINISHED_THICKNESSES}.") unless ALLOWED_FINISHED_THICKNESSES.include?(thickness)
    end
  end
end
