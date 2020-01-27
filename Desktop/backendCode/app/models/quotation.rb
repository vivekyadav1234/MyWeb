# == Schema Information
#
# Table name: quotations
#
#  id                      :integer          not null, primary key
#  name                    :string
#  terms                   :text
#  net_amount              :float            default(0.0)
#  total_amount            :float            default(0.0)
#  status                  :string           default("0")
#  project_id              :integer
#  user_id                 :integer
#  generation_date         :date
#  expiration_date         :date
#  expiration_in_days      :integer
#  billing_address         :string
#  flat_amount             :float            default(0.0)
#  customer_notes          :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  reference_number        :string
#  presentation_id         :integer
#  designer_id             :integer
#  spaces                  :text             default([]), is an Array
#  spaces_kitchen          :text             default([]), is an Array
#  spaces_loose            :text             default([]), is an Array
#  spaces_services         :text             default([]), is an Array
#  spaces_custom           :text             default([]), is an Array
#  countertop_cost         :float
#  discount_value          :float
#  discount_status         :string
#  disc_status_updated_at  :datetime
#  disc_status_updated_by  :integer
#  final_amount            :float
#  is_approved             :boolean
#  paid_amount             :float
#  wip_status              :string
#  parent_quotation_id     :integer
#  copied                  :boolean
#  per_10_approved_by_id   :integer
#  per_10_approved_at      :datetime
#  per_50_approved_by_id   :integer
#  per_50_approved_at      :datetime
#  category_appoval_by_id  :integer
#  category_appoval_at     :datetime
#  remark                  :text
#  cm_approval_at          :datetime
#  cm_approval_by_id       :integer
#  cm_approval             :boolean
#  category_approval       :boolean
#  sli_flag                :string
#  customer_viewing_option :text             default(["\"boq\""]), is an Array
#  seen_by_category        :boolean          default(FALSE)
#  client_approval_by_id   :integer
#  client_approval_at      :datetime
#  price_increase_factor   :float            default(1.0)
#  estimated_cogs          :float            default(0.0)
#  shangpin_amount         :float            default(0.0)
#  spaces_custom_furniture :string           default([]), is an Array
#  can_edit                :boolean          default(TRUE)
#  duration                :integer
#  payment_50_comp_date    :datetime
#  need_category_approval  :boolean
#  delivery_tnc            :text
#

class Quotation < ApplicationRecord

  #track changes
  has_paper_trail

  #validations
  # validate :check_validity_of_dates
  ALL_STATUSES = %w(draft pending shared paid expired rejected)
  STATUSES_VISIBLE_CUSTOMER = %w(shared paid)
  WIP_STATUS = %w("pre_10_percent", "10_50_percent", "50_percent", "installation", "on_hold", "inactive", nil)
  validates_inclusion_of :status, in: ALL_STATUSES
  # validates_inclusion_of :wip_status, in: WIP_STATUS
  validates_presence_of :reference_number, allow_blank: true
  validates_uniqueness_of :reference_number, allow_blank: true

  #Project Management Fee
  PROJECT_MANAGEMENT_FEE = 8.0

  #associations
  belongs_to :project
  belongs_to :presentation, optional: true
  belongs_to :user #customer for whom the project is
  belongs_to :designer, class_name: 'User'  #designer who
  # belongs_to :design, polymorphic: true

  has_one :invoice
  has_many :performa_invoices

  # parent and child quotations
  belongs_to :parent_quotation, class_name: 'Quotation', optional: true
  has_many :child_quotations, class_name: 'Quotation', foreign_key: 'parent_quotation_id'
  has_many :boq_labels, dependent: :destroy

  has_many :quotation_payments
  has_many :payments, through: :quotation_payments
  has_many :proposal_docs, as: :ownerable, dependent: :destroy
  has_many :proposals, through: :proposal_docs

  has_many :boq_global_configs, dependent: :destroy

  has_many :boqjobs, as: :ownerable, dependent: :destroy
  has_many :modular_jobs, as: :ownerable, dependent: :destroy
  has_many :service_jobs, as: :ownerable, dependent: :destroy
  has_many :custom_jobs, as: :ownerable, dependent: :destroy
  has_many :appliance_jobs, as: :ownerable, dependent: :destroy
  has_many :extra_jobs, as: :ownerable, dependent: :destroy
  has_many :shangpin_jobs, as: :ownerable, dependent: :destroy

  has_many :cad_uploads, dependent: :destroy

  has_many :job_elements, dependent: :destroy
  has_many :purchase_orders, dependent: :destroy

  has_many :task_escalations, as: :ownerable, dependent: :destroy
  has_many :task_sets, through: :task_escalations
  has_many :vendors, through: :purchase_orders

  has_many :purchase_order_performa_invoices, through: :performa_invoices

  has_many :project_handovers, as: :ownerable, dependent: :destroy

  has_many :clubbed_jobs, dependent: :destroy

  has_many :approvals, as: :approvable, dependent: :destroy

  accepts_nested_attributes_for :boqjobs, allow_destroy: true
  accepts_nested_attributes_for :service_jobs, allow_destroy: true
  accepts_nested_attributes_for :modular_jobs, allow_destroy: true

  #before_validation :ensure_reference_presence, :check_handover_status
  before_validation :check_handover_status
  after_save :set_amounts, unless: Proc.new { status == 'shared' }
  after_create :manage_task_sets
  after_create :generate_reference_number
  # after_commit :ensure_delivery_tnc, on: :create

  scope :available_to_cad, ->{ where(is_approved: true) }
  scope :shared, ->{ where(status: 'shared') }
  scope :pre_production, ->{ joins(:payments).where(payments: { is_approved: true }).where("(quotations.wip_status = ? and quotations.paid_amount > quotations.total_amount*0.45) OR quotations.per_50_approved_at < ?", "10_50_percent", Time.zone.now).distinct }
  scope :vendor_selection, -> { joins(:job_elements).distinct.merge(Quotation.pre_production) }
  scope :po_release, -> { joins(job_elements: :job_element_vendors).distinct.merge(Quotation.pre_production) }
  scope :pi_upload, -> { joins(:purchase_orders).distinct.merge(Quotation.pre_production) }
  scope :payment_release, -> { joins(:performa_invoices).distinct.merge(Quotation.pre_production) }
  scope :final_approved_boqs, -> {where(is_approved: true, wip_status: "10_50_percent")}
  scope :project_handover_quotations, -> {joins(:project_handovers).where(is_approved: true, wip_status: "10_50_percent")}

  include Quotations::SegmentConcern

  #for initial boq
  @is_initial_boq = true
  alias jobs boqjobs

  #def ensure_reference_presence
    #self.reference_number = generate_reference_number if self.reference_number.blank?
    #self.reference_number = generate_reference_number
  #end

  def generate_reference_number
    ref_no = "BOQ/#{Date.today.year}/#{self.id}"  
    self.update_columns(reference_number: ref_no)
    return ref_no
  end

  def ensure_delivery_tnc
    str = "Delivery Period #{timeline[:lead_time]}-#{timeline[:lead_time]+10} Days from the date of receipt of 50% Cumulative Payment."
    self.update_columns(delivery_tnc: str)
  end

  # replacing the getter method temporarily - until all data is populated
  def delivery_tnc
    t_hash = timeline
    if self[:delivery_tnc].present?
      self[:delivery_tnc]
    else
      "Delivery Period #{t_hash[:lead_time]}-#{t_hash[:lead_time]+10} Days from the date of receipt of 50% Cumulative Payment."
    end
  end

  def discount_value_to_use
    is_parent_approved = (parent_quotation.present? && parent_quotation.discount_status== "accepted") && parent_quotation.is_approved
    discount_status == "accepted" ?  discount_value.to_f : (discount_status == "no_discount" || is_parent_approved) ? parent_quotation&.discount_value.to_f : 0
  end
  #change the status of the quotation.
  def approve(status_type)
    self.status = status_type
    UserNotifierMailer.quotation_status_email(self).deliver_later!(wait: 15.minutes)
    SmsModule.send_sms("Status of your quotation has been changed to #{self.status}", self.user.contact)
    save!
  end

  def set_amounts
    SetEstimatedCogsJob.perform_later(self.id)
    set_countertop_cost
    set_combined_module_cost
    set_shangpin_amount
    net_amount = calculate_amount
    service_flat_amount = service_cost
    discount = discount_value_to_use * net_amount.to_f/100.0
    flat_amount = net_amount.to_f - discount.to_f
    non_service_amount = flat_amount - service_flat_amount
    nonservice_pm_fee = self.calculate_pm_fee(non_service_amount)
    service_pm_fee = self.calculate_pm_fee(service_flat_amount)
    total_amount = flat_amount + nonservice_pm_fee + service_pm_fee
    self.update_columns(flat_amount: flat_amount,
      net_amount: net_amount,
      service_pm_fee: service_pm_fee,
      nonservice_pm_fee: nonservice_pm_fee,
      total_amount: total_amount
      )
  end

  # This will now be the total_amount, after the introduction of PM FEE.
  # flat_amount - net_amount - discount
  # net_amount - simply sum of all amounts
  # total_amount - net_amount + pm_fee

  def calculate_pm_fee(amount = nil)
    return 0 if pm_fee_disabled
    fee = 0
    if self.project.lead.has_fhi_cm? 
      amount_to_consider = amount.present? ? amount : flat_amount
      fee = amount_to_consider * (Quotation::PROJECT_MANAGEMENT_FEE/100) 
    end
    fee
  end

  # To enable or disable the pm fee in a BOQ (note - this is an extra check on top of the check based CM/tag)
  # Both checks must be passed.
  def toggle_pm_fee(toggle_value)
    self.update!(pm_fee_disabled: toggle_value)
    self.recalculate
  end

  def total_pm_fee
    service_pm_fee.to_f + nonservice_pm_fee.to_f
  end
  # This will be used for getting the service amount after discount
  def service_cost
    amount = service_jobs.pluck(:amount).sum
    discount =  discount_value_to_use * amount.to_f/100.0
    ser_flat_amount = amount.to_f - discount.to_f
  end

  def set_countertop_cost
    price_factor_hash = get_price_factor_hash
    ( self.update_columns( countertop_cost: calculate_countertop_cost * price_factor_hash["sale_cost_factor"]["overall"].round(2) ))
  end

  # This ensures that the cost of combined module is calculated correctly in ALL situations
  def set_combined_module_cost
    modular_jobs.where(combined: true).map{|modular_job| modular_job.populate_combined_amount}
  end

  def set_shangpin_amount
    self.update_columns(shangpin_amount: calculate_shangpin_cost)
  end

  def calculate_amount
    (boqjobs.pluck(:amount).sum +
      modular_jobs.where(combined_module_id: nil).pluck(:amount).sum +
      service_jobs.pluck(:amount).sum +
      custom_jobs.pluck(:amount).sum +
      appliance_jobs.pluck(:amount).sum +
      extra_jobs.pluck(:amount).sum +
      shangpin_amount +
      countertop_cost.to_f).round(2)
  end

  def calculate_countertop_cost
    price_factor_hash = get_price_factor_hash
    boq_global_config = boq_global_configs.find_by(category: 'kitchen')
    total_width =  (boq_global_config&.countertop_width.to_i > 0) ? boq_global_config&.countertop_width.to_i : default_countertop_length
    # countertop_rate = BoqGlobalConfig.countertop_price_hash[boq_global_configs.find_by(category: 'kitchen')&.countertop].to_f
    countertop_rate = MKW_GLOBAL_DATA["countertop_prices"][boq_global_configs.find_by(category: 'kitchen')&.countertop].to_f
    price_factor_hash["sale_cost_factor"]["kitchen"]["countertop"] * (total_width/304.8) * countertop_rate * price_increase_factor
  end

  def calculate_shangpin_cost
    effective_factor = shangpin_jobs.first&.effective_factor.to_f
    shangpin_jobs.pluck(:amount).compact.sum * effective_factor
  end

  def space_total_value(spaces)
    result = Hash.new(0)
    spaces.each do |space|
      result[space] = Hash.new(0)
      result[space][:boqjobs] = boqjobs.where(space: space).sum(:amount).round(2)
      result[space][:modular_jobs] = modular_jobs.where(space: space).sum(:amount).round(2)
      result[space][:service_jobs] = service_jobs.where(space: space).sum(:amount).round(2)
      result[space][:custom_jobs] = custom_jobs.where(space: space).sum(:amount).round(2)
      result[space][:extra_jobs] = extra_jobs.where(space: space).sum(:amount).round(2)
      result[space][:shangpin_jobs] = shangpin_jobs.where(space: space).sum(:amount).round(2)
      result[space][:appliance_jobs] = appliance_jobs.where(space: space).sum(:amount).round(2)
    end
    result
  end

  def set_estimated_cogs
    boqjobs.map(&:populate_estimated_cogs)
    service_jobs.map(&:populate_estimated_cogs)
    custom_jobs.map(&:populate_estimated_cogs)
    appliance_jobs.map(&:populate_estimated_cogs)
    extra_jobs.map(&:populate_estimated_cogs)
    modular_jobs.map(&:populate_estimated_cogs)
    self.update_columns(estimated_cogs: calculate_estimated_cogs.round(2))
  end

  def calculate_estimated_cogs
    (boqjobs.pluck(:estimated_cogs).sum +
      modular_jobs.where(combined_module_id: nil).pluck(:estimated_cogs).sum +
      service_jobs.pluck(:estimated_cogs).sum +
      custom_jobs.pluck(:estimated_cogs).sum +
      appliance_jobs.pluck(:estimated_cogs).sum +
      extra_jobs.pluck(:estimated_cogs).sum).
      round(2)
  end

  # sum of width of all base unit modules
  def default_countertop_length
    product_modules_to_consider = all_product_modules.joins(module_type: :kitchen_categories).where(
      kitchen_categories: {id: KitchenCategory.base_unit}
      ).distinct
    modular_jobs.where(product_module: product_modules_to_consider.pluck(:id)).map{ |modular_job|
      width = modular_job.product_module.width
      width * modular_job.quantity
    }.sum
  end

  def all_product_modules
    ProductModule.joins(:modular_jobs).where(modular_jobs: {id: modular_jobs}).distinct
  end

  def recalculate
    ActiveRecord::Base.transaction do
      boqjobs.each do |boqjob|
        boqjob.populate_defaults
        boqjob.save!
      end

      service_jobs.each do |service_job|
        service_job.populate_defaults
        service_job.save!
      end

      appliance_jobs.each do |appliance_job|
        appliance_job.populate_defaults
        appliance_job.save!
      end

      modular_jobs.each do |modular_job|
        modular_job.populate_defaults
        modular_job.save!
      end

      custom_jobs.each do |custom_job|
        custom_job.populate_defaults
        custom_job.save!
      end

      extra_jobs.each do |extra_job|
        extra_job.populate_defaults
        extra_job.save!
      end

      shangpin_jobs.each do |shangpin_job|
        shangpin_job.set_amount
        shangpin_job.save!
      end

      set_amounts
      self.save!
    end
  end

  # Set the BOQ value to a given amount
  # Not allowed for shared BOQ.
  def change_amount(new_amount)
    return false if status == 'shared'
    return total_amount if total_amount <= 0
    # first recalculate to ensure that the total_amount is calculated as per current factors, prices and logic.
    self.update!(price_increase_factor: 1.0)
    self.reload
    self.recalculate
    new_factor = new_amount.to_f/total_amount
    self.update!(price_increase_factor: new_factor)
    self.reload
    self.recalculate
  end

  # Delete line items for which the space they belong to has been deleted from the BOQ.
  # eg space 'Kitchen' doesn't exist for services in BOQ. Then delete any service_jobs that belong to space 'Kitchen'.
  # Currently done only for services as problem is present only there.
  def delete_invisible_line_items
    service_jobs.where.not(space: spaces_services).destroy_all
  end

  def cad_upload_allowed?
    Project::ALLOWED_SUB_STATUSES.index(project.sub_status).to_i >=  Project::ALLOWED_SUB_STATUSES.index("initial_payment_recieved")
  end

  def cad_upload_approval_pending?
    cad_upload_allowed? && cad_uploads.pluck(:status).include?("pending")
  end

  # Return the effective factor to be usecd for ShangpinJobs of this BOQ.
  # Instance variable @effective_factor in that class - this is same value.
  def shangpin_effective_factor
    price_factor_hash = get_price_factor_hash
    price_factor_hash["sale_cost_factor"]["shangpin"]["factor1"] * price_factor_hash["sale_cost_factor"]["shangpin"]["factor2"] * price_increase_factor
  end

  # return MKW_GLOBAL_DATA if nothing found for CM.
  # depending on:
  # 1. The assigned CM of the lead to which this BOQ's project belongs.
  # 2. The type of lead.
  # The margins ie sale_cost_factors to be used for price calculation are decided.
  def get_price_factor_hash
    # if this has modspace pricing, then return that and override any CM variable factors.
    return MKW_GLOBAL_DATA_MODSPACE.merge("has_modspace_pricing"=> true, "cm_email" => get_cm_email) if has_modspace_pricing?
    margin_hash = {}
    lead = project&.lead
    cm_user = lead&.assigned_cm
    return MKW_GLOBAL_DATA unless cm_user.present? && cm_user.cm_mkw_variable_pricing.present?
    # following lines means that a lead tagged with both or without tag will be taken as full_home.
    type_of_lead = ( lead.tag.present? && lead.tag == Tag.mkw) ? 'mkw' : 'full_home'
    return MKW_GLOBAL_DATA unless cm_user.cm_mkw_variable_pricing.valid?
    if type_of_lead == 'mkw'
      margin_hash = cm_user.cm_mkw_variable_pricing.mkw_factors
    else
      margin_hash = cm_user.cm_mkw_variable_pricing.full_home_factors
    end

    if margin_hash.present?
      return margin_hash
    else
      return MKW_GLOBAL_DATA
    end
  end

  # whether modspace pricing is applicable to this BOQ, based on the CM.
  def has_modspace_pricing?
    lead = project&.lead
    cm_user = lead&.assigned_cm
    cm_user.present? && MODSPACE_EMAILS.include?(cm_user.email)
  end

  # Get the CM's email for this BOQ
  def get_cm_email
    lead = project&.lead
    cm_user = lead&.assigned_cm
    cm_user&.email
  end

  # Excel of BOQ
  def to_boq_xlsx
    boqjobs = self.boqjobs.all
    p = Axlsx::Package.new
    wb = p.workbook

    if boqjobs.present?
      wb.add_worksheet(:name => "BOQ") do |sheet|
        sheet.add_row ['','Reference Number',self.reference_number]
        sheet.add_row ['','BOQ Status',self.status.humanize]
        sheet.add_row ['']
        sheet.add_row ['']
        sheet.add_row ['Category','Item Id', 'Product Display Name', 'Width', 'Depth', 'Height', 'SKU', 'Material Finish',
                       'Material Color', 'Quantity', 'Price', 'Total Price'], :sz => 15
        boqjobs.each do |boqjob|
          product = boqjob.product
          sheet.add_row [product.section&.name&.humanize,product.id, product.name, product.width, product.length, product.height, product.vendor_sku,
                         product.finish, product.color, boqjob.quantity, "\u20B9 #{boqjob.rate}", "\u20B9 #{boqjob.amount}"], :height => 30
        end
        sheet.add_row []
        sheet.add_row ['','','','','','','','','','','Total Amount',"\u20B9 #{self.total_amount}"], :sz => 15, :height => 30
      end
    end
     filepath = Rails.root.join("tmp","BOQ_#{Date.today}.xlsx")
     p.serialize(filepath)
     return {"excel" => Base64.encode64(File.open("tmp/BOQ_#{Date.today}.xlsx").read) , "name" =>self.reference_number}
  end

  # Single BOQ details for category.
  def category_excel
    # First ensure that the BOQ has estimated costs. If not already done, do it now.
    set_estimated_cogs unless estimated_cogs.present?

    # Now generate the excel.
    package = Axlsx::Package.new
    wb = package.workbook
    sheet = wb.add_worksheet(name: 'Line Items')

    # first add header row.
    header_arr = ['Space', 'Category', 'Name', 'Description', 'Labels', 'No. of Exposed Sides', 'Quantity', 'Rate', 'Discount (%)',
      'Final Amount', 'Core Material Quantity', 'Shutter Material Quantity', 'Carcass Cost', 'Finish Cost', 'Assembly Hardware Cost',
      'Add Ons Cost', 'Handles Cost', 'Skirting Cost', 'Soft Close Hinge Cost', 'Cabinet Cost (Modspace)'
    ]
    headers = {}
    header_arr.each_with_index do |title, i|
      headers[title] = i
    end

    sheet.add_row(header_arr)
    discount_value = discount_value_to_use

    # now populate each row
    modular_jobs.order(:category, :space).each do |modular_job|
      mjc = modular_job.modular_job_cost
      arr = []
      product_module = modular_job.product_module
      arr[headers['Space']] = modular_job.space
      arr[headers['Category']] = modular_job.category.humanize
      arr[headers['Description']] = product_module&.module_type&.name
      arr[headers['Labels']] = modular_job.boq_labels.pluck(:label_name).join(',')
      arr[headers['No. of Exposed Sides']] = modular_job.number_exposed_sites.to_i
      arr[headers['Quantity']] = modular_job.quantity.to_i
      arr[headers['Discount (%)']] = discount_value
      # If it is combined module, then the rate/amount should be just the extra due to the sliding door.
      if modular_job.is_combined_module?
        arr[headers['Name']] = modular_job.name
        arr[headers["Rate"]] = ( modular_job.rate - modular_job.modular_jobs.map{|j| j.quantity.to_f * j.rate.to_f}.sum ).round(2)
        arr[headers['Final Amount']] = ( modular_job.quantity * arr[headers['Rate']] * (1 - discount_value.to_f/100) ).round(2)
      else
        arr[headers['Name']] = product_module&.code
        arr[headers['Rate']] = modular_job.rate.to_f.round(2)
        arr[headers['Final Amount']] = ( (modular_job.amount - modular_job.modular_jobs.sum(:amount)) * (1 - discount_value.to_f/100) ).round(2)
      end
      arr[headers['Core Material Quantity']] = mjc.core_quantity.round(2)
      arr[headers['Shutter Material Quantity']] = mjc.shutter_quantity.round(2)
      arr[headers['Carcass Cost']] = mjc.carcass_cost.round(2)
      arr[headers['Finish Cost']] = mjc.finish_cost.round(2)
      arr[headers['Assembly Hardware Cost']] = mjc.hardware_cost.round(2)
      arr[headers['Add Ons Cost']] = mjc.addon_cost.round(2)
      arr[headers['Handles Cost']] = mjc.handle_cost.round(2)
      arr[headers['Skirting Cost']] = mjc.skirting_cost.round(2)
      arr[headers['Soft Close Hinge Cost']] = mjc.soft_close_hinge_cost.round(2)
      arr[headers['Cabinet Cost (Modspace)']] = mjc.modspace_cabinet_cost.round(2)

      sheet.add_row arr
    end

    filepath = Rails.root.join("tmp","BOQ_category_#{Date.today}-#{Time.zone.now.to_i}.xlsx")
    package.serialize(filepath)

    filepath
  end

  def cost_price
    (boqjobs.map(&:cost_price).compact.sum + modular_jobs.map(&:cost_price).compact.sum + service_jobs.map(&:cost_price).compact.sum +
    custom_jobs.map(&:cost_price).compact.sum + appliance_jobs.map(&:cost_price).compact.sum + extra_jobs.map(&:cost_price).compact.sum).to_f.round(2)
  end

  def margin_amount
    (total_amount - cost_price).to_f.round(2)
  end

  def margin_percentage
    ((margin_amount/cost_price) * 100).to_f.round(2)
  end


  def clone(discount=0)
    old_boq = self
    @is_initial_boq = old_boq.is_approved ? false : true
    old_boq.update(copied: true)
    boq = self.deep_clone_boq
    boq.status = "pending"
    boq.wip_status = old_boq.wip_status
    boq.need_category_approval = true if old_boq.wip_status == "10_50_percent"

    if !old_boq.parent_quotation.present? && !old_boq.is_approved #for initial rejected boq
      discount_value = 0
      discount_status = nil
    elsif (!old_boq.is_approved && (old_boq.parent_quotation.present? && old_boq.parent_quotation.is_approved)) #final rejected copy
      discount_value = old_boq.parent_quotation.discount_value
      discount_status = old_boq.parent_quotation.discount_status
    elsif old_boq.is_approved # for final copy
      discount_value = old_boq.discount_value
      discount_status = old_boq.discount_status
    end

    boq.parent_quotation_id = old_boq.parent_quotation_id.present? && old_boq.parent_quotation&.is_approved ? old_boq.parent_quotation_id : old_boq.id
    boq.discount_value = discount_value
    boq.discount_status = discount_status
    boq.disc_status_updated_by = old_boq.disc_status_updated_by
    boq.save!
    # This will slow done cloning, but is needed for now to stop the child BOQs having wrong amount.
    boq.recalculate
    @is_initial_boq = true
    return [{"ownerable_id"=>boq.id, "ownerable_type"=>"Quotation", "discount_value"=>boq.discount_value}]
  end

  def import(project)
    imported_boq = self.deep_clone_boq
    imported_boq.discount_status = nil
    imported_boq.project = project
    imported_boq.discount_value = 0
    imported_boq.user_id = project&.user_id
    imported_boq.designer_id = project&.assigned_designer&.id
    imported_boq.generation_date = Date.today
    imported_boq.expiration_date = Date.today + 1.month
    imported_boq.paid_amount = nil
    imported_boq.save!
    imported_boq.update(presentation_id: nil, disc_status_updated_at: nil, per_10_approved_by_id: nil, per_10_approved_at: nil, per_50_approved_by_id: nil,
                        per_50_approved_at: nil, cm_approval_at: nil, cm_approval_by_id: nil, category_approval: nil, sli_flag: nil, seen_by_category: nil, client_approval_by_id: nil,
                        client_approval_at: nil, price_increase_factor: 1.0)
    imported_boq.delete_invisible_line_items
    imported_boq.update(per_10_approved_by_id: nil, presentation_id: nil, disc_status_updated_at: nil, per_10_approved_at: nil, per_50_approved_by_id: nil,
                        per_50_approved_at: nil, cm_approval_at: nil, cm_approval_by_id: nil, category_approval: nil, sli_flag: nil, seen_by_category: nil, client_approval_by_id: nil,
                        client_approval_at: nil, price_increase_factor: 1.0)
    # Check for any addons that are not mapped, and REMOVE any found. This is very important so that if a BOQ with
    # unmapped addons is imported, the new BOQ doesn't have wrong addons.
    # This could have happened because of bugs or because addon mapping changed.
    imported_boq.modular_jobs.each do |modular_job|
      modular_job.addons_must_be_mapped({ delete_unmapped: true })
    end
    imported_boq.recalculate
    Quotation.find(imported_boq.id)
  end

  def deep_clone_boq
    new_quotation = self.deep_clone include: [
      :boqjobs, {boqjobs: [:cad_upload_jobs]},
      { modular_jobs: [:cad_upload_jobs, { job_addons: :optional_job_addons } ] },
      { modular_jobs: [
        :job_combined_door, :job_addons,
        { modular_jobs: [:combined_module, :job_addons] }, if: lambda { |mod_job| mod_job.combined_module_id == nil }
      ]},
      :service_jobs, {service_jobs: [:cad_upload_jobs]},
      :custom_jobs, {custom_jobs: [:cad_upload_jobs]},
      :appliance_jobs, {appliance_jobs: [:cad_upload_jobs]},
      :extra_jobs, {extra_jobs: [:cad_upload_jobs]},
      :shangpin_jobs,
      {boq_global_configs: :civil_kitchen_parameter}
    ], except: [
      :duration,:payment_50_comp_date,:created_at, :updated_at, :reference_number, :is_approved, :wip_status, :status, :discount_status,
        :disc_status_updated_at, :disc_status_updated_by, :copied, :parent_quotation_id, :category_approval, :cm_approval,
      { boq_global_configs: [ :countertop ] }
    ], use_dictionary: true
    new_quotation.status = "pending"
    new_quotation.can_edit = true
    new_quotation.save!
    new_quotation.update_modular_job_quotations if new_quotation.modular_jobs&.where(combined: true).present?
    new_quotation.reset_clubbed_jobs
    new_quotation
  end

  # If a BOQ has a parent BOQ, then this method will copy all of its labels.
  # Note: It will first delete all existing labels.
  # def copy_labels_from_parent_boq
  #   boq_labels.destroy_all
  #   parent_quotation.boqjobs.each do |parent_job|
  #     boqjob = boqjobs.where(product: parent_job.product, space: parent_job.space, quantity: parent_job.quantity)
  #   end
  # end

  def reset_clubbed_jobs
    self.boqjobs.update_all(clubbed_job_id: nil)
    self.modular_jobs.update_all(clubbed_job_id: nil)
    self.service_jobs.update_all(clubbed_job_id: nil)
    self.custom_jobs.update_all(clubbed_job_id: nil)
    self.appliance_jobs.update_all(clubbed_job_id: nil)
    self.extra_jobs.update_all(clubbed_job_id: nil)
  end

  def update_modular_job_quotations
    mod_jobs = self.modular_jobs.where(combined: true)
    mod_jobs.each do |mod_job|
      mod_job.modular_jobs.each do |child_job|
        child_job.update(ownerable: self)
      end
    end
  end

  def ten_per_true
    paid_amount.to_f >= (0.10*total_amount).to_f
  end

  def per_50_true
    paid_amount.to_f >= (0.50*total_amount).to_f
  end

  def generate_quotation_pdf(download_type)
    quotation_content = BoqReportPdf.new(self, self.project, download_type)
    filepath = Rails.root.join("tmp","quotation.pdf")
    quotation_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  def generate_quotation_v2_pdf(download_type)
    quotation_content = BoqReportV2Pdf.new(self, self.project, download_type)
    filepath = Rails.root.join("tmp","quotation.pdf")
    quotation_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  def generate_quotation_pdf_for_handover(download_type)
    quotation_content = BoqReportPdf.new(self, self.project, download_type)
    filepath = Rails.root.join("public","#{self.reference_number.gsub('/', "-")}.pdf")
    quotation_content.render_file(filepath)
    filepath
  end

  def generate_services_pdf_for_handover
    quotation_content = BoqServiceReportPdf.new(self, self.project)
    filepath = Rails.root.join("public","service-#{self.reference_number.gsub('/', "-")}.pdf")
    quotation_content.render_file(filepath)
    filepath
  end

  def generate_services_pdf
    quotation_content = BoqServiceReportPdf.new(self, self.project)
    filepath = Rails.root.join("tmp","quotation.pdf")
    quotation_content.render_file(filepath)
    Base64.encode64(File.open(filepath).to_a.join)
  end

  # return an Excel workbook - not saved
  def generate_boq_report
    lead = project.lead
    boq_global_config_kitchen = boq_global_configs.find_by_category("kitchen")
    boq_global_config_wardrobe = boq_global_configs.find_by_category("wardrobe")

    package = Axlsx::Package.new
    boq_spread_sheet = package.workbook

    boq_spread_sheet.add_worksheet(:name => "BOQ Report") do |sheet|
      sheet.add_row ["Lead ID", lead.id.to_s]
      sheet.add_row ["Customer Name", lead.name]
      sheet.add_row ["Customer Phone Number", lead.contact]
      sheet.add_row ["Customer Email ID", project.user.email]
      sheet.add_row ["City", lead.city]
      sheet.add_row ["Type of Lead (MKW/Full home/Both)", lead.tag&.name&.humanize]
      sheet.add_row ["Lead Acquisition Date", lead.created_at.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["Lead Qualification Date", lead.created_at.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["Lead Assignment Date to Designer", lead.created_at.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["Date of Marking WIP", project.wip_time.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["BOQ Reference Number", reference_number]
      sheet.add_row ["Designer Name", project.assigned_designer&.name]
      sheet.add_row ["CM Name", project.assigned_designer&.cm&.name]
      sheet.add_row ["BOQ Creation Date", created_at.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["BOQ Last Update Date", updated_at.strftime("%e %b %Y %H:%M:%S%p")]
      sheet.add_row ["Stage (Initial BOQ / Final BOQ]", "TBD"]
      sheet.add_row ["BOQ Value", total_amount.to_f.round(2)]

      type_of_kitchen =  modular_jobs.kitchen.present? ? (boq_global_config_kitchen.civil_kitchen ? "Civil" : "Modular") : "NA"
      sheet.add_row ["Type of Kitchen - Modular / Civil", type_of_kitchen]

      modular_kitchen_value = (
        modular_jobs.kitchen.where(combined_module_id: nil).pluck(:amount).sum +
        appliance_jobs.pluck(:amount).sum +
        extra_jobs.where(category: 'kitchen').pluck(:amount).sum +
        countertop_cost.to_f
        ).round(2)
      sheet.add_row ["Modular Kitchen Value", modular_kitchen_value]

      modular_wardrobe_value = ( modular_jobs.wardrobe.where(combined_module_id: nil).pluck(:amount).sum +
        extra_jobs.where(category: 'kitchen').pluck(:amount).sum ).round(2)
      sheet.add_row ["Modular Wardrobe Value", modular_wardrobe_value]

      loose_furniture_value = boqjobs.pluck(:amount).sum.round(2)
      sheet.add_row ["Loose Furniture Value", loose_furniture_value]

      services_value = service_jobs.pluck(:amount).sum.round(2)
      sheet.add_row ["Services Value", services_value]

      custom_elements_value = custom_jobs.pluck(:amount).sum.round(2)
      sheet.add_row ["Custom Elements Value", custom_elements_value]

      master_bedroom_value = modular_jobs.where(space: "Kitchen").pluck(:amount).sum.round(2)
      sheet.add_row ["Master Bedroom Value", master_bedroom_value]

      living_room_value = modular_jobs.where(space: "Living").pluck(:amount).sum.round(2)
      sheet.add_row ["Living Room Value", living_room_value]

      guest_room_value = modular_jobs.where(space: "Guest Room").pluck(:amount).sum.round(2)
      sheet.add_row ["Guest Room Value", guest_room_value]

      sheet.add_row ["Kitchen Carcass Core Material", boq_global_config_kitchen&.core_material || "NA"]
      sheet.add_row ["Kitchen Carcass Shutter Material", boq_global_config_kitchen&.shutter_material || "NA"]
      sheet.add_row ["Kitchen Shutter Finish", boq_global_config_kitchen&.shutter_finish || "NA"]
      sheet.add_row ["Kitchen Hardware", Brand.find_by_id(boq_global_config_kitchen.brand_id)&.name || "NA"]
      sheet.add_row ["Wardrobe Carcass Core Material", boq_global_config_wardrobe&.core_material || "NA"]
      sheet.add_row ["Wardrobe Carcass Shutter Material", boq_global_config_wardrobe&.shutter_material || "NA"]
      sheet.add_row ["Wardrobe Shutter Finish", boq_global_config_wardrobe&.shutter_finish || "NA"]
      sheet.add_row ["Wardrobe Hardware", Brand.find_by_id(boq_global_config_wardrobe&.brand_id)&.name || "NA"]

      # proposal =
      # sheet.add_row ["Proposal Number", ]
      # sheet.add_row ["Proposal Creation Date", ]
      # sheet.add_row ["Proposal Sharing Date", ]
      # sheet.add_row ["Discount %", ]
      # sheet.add_row ["Discount Value", ]
      # sheet.add_row ["Final BOQ Value", ]
      sheet.add_row ["Parent BOQ", parent_quotation&.reference_number || "NA"]
    end

    file_name = "BOQ-Report-#{reference_number.gsub("/","-")}-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
    filepath = Rails.root.join("tmp").join(file_name)
    # streamed = package.to_stream
    # byebug
    # Base64.strict_encode64(streamed)
    package.serialize(filepath)
    filepath
    # excel_workbook = File.open filepath
    # File.open(filepath, "wb") do |f|
    #   f.write(streamed.read)
    #   return Base64.strict_encode64(f)
    # end
  end

  # set display_boq_label as true if you have to display boq_labels.
  def client_quotation_display(viewing_options, display_boq_label=false)
    @viewing_options = viewing_options
    hash = Hash.new
    designer = self.designer
    project = self&.project
    lead = project&.lead
    discount_value = self.discount_value_to_use
    total_value = self.total_amount
    pm_fee = self.total_pm_fee
    hash[:id] = self.id
    hash[:reference_number] = self.reference_number
    hash[:generation_date] = self.generation_date
    hash[:is_approved] = self.is_approved
    hash[:proposal_doc_id] = self.proposal_docs&.last&.id
    hash[:designer_name] = designer&.name&.humanize
    hash[:designer_contact] = designer&.contact
    #hash[:designer_email] = designer&.email
    hash[:designer_email] = 'wecare@arrivae.com'
    hash[:project_name] = project&.name
    hash[:lead_id] = lead&.id
    hash[:lead_name] = lead&.name
    hash[:lead_contact] = lead&.contact
    hash[:lead_location] = lead&.note_records&.last&.location
    hash[:all_spaces] = get_all_spaces.uniq
    hash[:quotation_body] = quotation_body(display_boq_label)
    hash[:net_amount] = self.net_amount&.round(2)
    hash[:discount_value] = discount_value.round(2)
    hash[:pm_fee] = pm_fee.round(2)
    hash[:total_amount] =  total_value.round(2)
    hash[:countertop_cost] = self.countertop_cost&.round(2)
    hash[:countertop] = self.boq_global_configs.find_by(category: 'kitchen')&.countertop
    hash[:timeline] = self.timeline
    hash[:delivery_tnc] = delivery_tnc.to_s
    hash
  end

  def quotation_body(display_boq_label)
    all_space = get_all_spaces.uniq
    @annexure_loose_images = []
    @annexure_wardrobe_images = []
    @annexure_kitchen_images = []
    boq_hash = Hash.new
    summary_table_hash = Hash.new
    all_space.each do |space|
     spacewise_details = jobs_array_for_spaces(space, display_boq_label)
     if spacewise_details.present?
      boq_hash[space] = spacewise_details[:boq_final_table]
      summary_table_hash[space] = spacewise_details[:summary_final_prices]
     end
    end

    final_hash = Hash.new
    if @viewing_options.include?("boq")
      final_hash[:boq_hash] = boq_hash
    end

    if @viewing_options.include?("summary")
      final_hash[:summary_table_hash] = summary_table_hash
    end

    if @viewing_options.include?("annexure")
      final_hash[:annexure_table_hash] = {annexure_loose_images: @annexure_loose_images , annexure_wardrobe_images: @annexure_wardrobe_images, annexure_kitchen_images: @annexure_kitchen_images }
    end
    final_hash
  end

  def quotation_space_detail

  end

  def jobs_array_for_spaces(space, display_boq_label)
    boq_global_config = boq_global_configs.find_by(category: 'kitchen')

    kitchen_type = ""
    if boq_global_config&.civil_kitchen
      kitchen_type = "Civil Kitchen"
    else
      kitchen_type = "Modular Kitchen"
    end

    wardrobe = wardrobe_for_space(space, display_boq_label)
    kitchen_w = kitchen_modulor_job(space, display_boq_label, kitchen_type)
    kitchen_e = kitchen_extra_job(space, display_boq_label, kitchen_type)
    kitchen_a = kitchen_appliance_job(space, display_boq_label, kitchen_type)
    furniture = lose_furnitures_for_space(space, display_boq_label)
    custom = custom_for_spaces(space, display_boq_label)
    spaces_custom_furniture = spaces_custom_furniture_for_space(space, display_boq_label)
    service = service_for_space(space)
    final_array = []
    summary_array =[]
    if spaces_custom_furniture.present? || furniture.present? || wardrobe.present? || kitchen_w.present? || kitchen_e.present? || kitchen_a.present? || custom.present? || service.present?
      if wardrobe.present?
        final_array+=wardrobe[:space_section_table]
        summary_array.push({section_name: "Wardrobe", section_price: wardrobe[:space_section_price]})
      end

      if kitchen_w.present?
        final_array+=kitchen_w[:space_section_table]
        summary_array.push({section_name: kitchen_type, section_price: kitchen_w[:space_section_price]})
      end

      if kitchen_e.present?
        final_array+=kitchen_e[:space_section_table]
        summary_array.push({section_name: "Extra", section_price: kitchen_e[:space_section_price]})
      end

      if kitchen_a.present?
        final_array+=kitchen_a[:space_section_table]
        summary_array.push({section_name: "Appliance", section_price: kitchen_a[:space_section_price]})
      end

      if furniture.present?
        final_array+=furniture[:space_section_table]
        summary_array.push({section_name: "Furniture", section_price: furniture[:space_section_price]})
      end

      if custom.present?
        final_array+=custom[:space_section_table]
        #custom_element_name_list = custom[:space_section_table].map {|c| c[2]}.join("\/n")
        custom_element_name_list = custom[:space_section_table].map {|c| c[:"name"]}.join("\/n")
        summary_array.push({section_name: "Custom Elements:\n#{custom_element_name_list}", section_price: custom[:space_section_price]})
      end

      if spaces_custom_furniture.present?
        final_array+=spaces_custom_furniture[:space_section_table]
        summary_array.push({section_name: "Custom Furniture", section_price: spaces_custom_furniture[:space_section_price]})
      end

      if service.present?
        final_array+=service[:space_section_table]
        summary_array.push({section_name: "Services", section_price: service[:space_section_price]})
      end

      return {boq_final_table: final_array, summary_final_prices:  summary_array}
    else
      return nil
    end
  end

  def get_all_spaces
    self.spaces+self.spaces_kitchen+self.spaces_loose+self.spaces_services+self.spaces_custom+self.spaces_custom_furniture
  end

  def spaces_custom_furniture_for_space(space, display_boq_label)
    spaces_custom_furnitures = shangpin_jobs.where(space: space)
    spaces_custom_furniture_array = []
    spaces_custom_furniture_price = 0
    if spaces_custom_furnitures.present?
      spaces_custom_furnitures.each do |spaces_custom_furniture|
        job = spaces_custom_furniture.job_type
        case job
        when 'cabinet'
          spaces_custom_furniture_price += spaces_custom_furniture.amount_factored if spaces_custom_furniture.amount_factored.present?
          custom_furniture_name = "#{job.capitalize} \n Item: #{spaces_custom_furniture&.cabinet_item} \n Model No: #{spaces_custom_furniture&.cabinet_model_no}"
          description = "color: #{spaces_custom_furniture.cabinet_color}  \n Actual Size (wdh)(mm) : #{spaces_custom_furniture.cabinet_width}X#{spaces_custom_furniture.cabinet_depth}X#{spaces_custom_furniture.cabinet_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.cabinet_specific_door}"+
          " X #{spaces_custom_furniture.cabinet_specific_worktop}"+
          " X #{spaces_custom_furniture.cabinet_specific_leg}"+
          " \n Cabinet Door: #{spaces_custom_furniture.cabinet_door}" +
          " \n Material: #{spaces_custom_furniture&.cabinet_material}" +
          " \n Platform: #{spaces_custom_furniture&.cabinet_platform}" + 
          "\n Core Material: #{spaces_custom_furniture.get_core_material}" 
          final_json = {product: "Custom Furniture", name: custom_furniture_name, description: description, quantity: spaces_custom_furniture.cabinet_quantity, price: spaces_custom_furniture.cabinet_amount_factored , rate: spaces_custom_furniture.cabinet_price_factored}
          final_json[:boq_labels] = spaces_custom_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
          spaces_custom_furniture_array.push(final_json)
        when 'door'
          spaces_custom_furniture_price += spaces_custom_furniture.amount_factored if spaces_custom_furniture.amount_factored.present?
          item = spaces_custom_furniture&.door_item ? spaces_custom_furniture&.door_item : spaces_custom_furniture.door_style_code 
          custom_furniture_name = "#{job.capitalize} \n Item: #{item} \n Model No: #{spaces_custom_furniture&.door_model_no} \n "
          description = "Actual Size (wdh)(mm) : #{spaces_custom_furniture.door_width}X#{spaces_custom_furniture.door_depth}X#{spaces_custom_furniture.door_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}"+
          " X #{spaces_custom_furniture.job_spec_leg}"+
          " \n Handle: #{spaces_custom_furniture&.job_handle}"+
          " \n Material: #{spaces_custom_furniture&.job_material}" +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          final_json = {product: "Custom Furniture", name: custom_furniture_name, description: description,quantity: spaces_custom_furniture.door_quantity, price: spaces_custom_furniture.door_amount_factored, rate: spaces_custom_furniture.door_price_factored}
          final_json[:boq_labels] = spaces_custom_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
          spaces_custom_furniture_array.push(final_json)
        when 'accessory'
          spaces_custom_furniture_price += spaces_custom_furniture.amount_factored if spaces_custom_furniture.amount_factored.present?
          item = spaces_custom_furniture&.accessory_item ? spaces_custom_furniture&.accessory_item : spaces_custom_furniture.accessory_code
          custom_furniture_name = "#{job.capitalize} \n Item: #{item}  \n Model No: #{spaces_custom_furniture&.accessory_model_no}"
          description = "color: #{spaces_custom_furniture.accessory_color} \n Actual Size (wdh) : #{spaces_custom_furniture.accessory_width}X#{spaces_custom_furniture.accessory_depth}X#{spaces_custom_furniture.accessory_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}"+
          " X #{spaces_custom_furniture.job_spec_leg}"+
          " \n Handle: #{spaces_custom_furniture&.job_handle}"+
          " \n Material: #{spaces_custom_furniture&.job_material}" +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          final_json = {product: "Custom Furniture",name: custom_furniture_name, description: description,quantity: spaces_custom_furniture.accessory_quantity, price: spaces_custom_furniture.accessory_amount_factored, rate: spaces_custom_furniture.accessory_price_factored}
          final_json[:boq_labels] = spaces_custom_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
          spaces_custom_furniture_array.push(final_json)
        when 'sliding_door'
          spaces_custom_furniture_price += spaces_custom_furniture.amount_factored if spaces_custom_furniture.amount_factored.present?
          item = spaces_custom_furniture&.door_item ? spaces_custom_furniture&.door_item : spaces_custom_furniture.door_style_code 
          custom_furniture_name = "Sliding Door \n Item: #{item} \n Model No: #{spaces_custom_furniture&.door_model_no} \n "
          description = "color: #{spaces_custom_furniture.door_color} \n Actual Size (wdh)(mm) : #{spaces_custom_furniture.door_width}X#{spaces_custom_furniture.door_depth}X#{spaces_custom_furniture.door_height}"+
          " \n Specific Size (dwl): #{spaces_custom_furniture.job_spec_door}"+
          " X #{spaces_custom_furniture.job_spec_worktop}"+
          " X #{spaces_custom_furniture.job_spec_leg}"+
          " \n Handle: #{spaces_custom_furniture&.job_handle}"+
          " \n Material: #{spaces_custom_furniture&.job_material}" +
          "\n Core Material: #{spaces_custom_furniture.get_core_material}"
          final_json = {product: "Custom Furniture", name: custom_furniture_name, description: description, quantity: spaces_custom_furniture.door_quantity, price: spaces_custom_furniture.door_amount_factored, rate: spaces_custom_furniture.door_price_factored}
          final_json[:boq_labels] = spaces_custom_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
          spaces_custom_furniture_array.push(final_json)
        when 'wardrobe'
          spaces_custom_furniture_price += spaces_custom_furniture.amount_factored if spaces_custom_furniture.amount_factored.present?
          final_json = {product: "Custom Furniture", name: job.capitalize, price: spaces_custom_furniture.wardrobe_amount_factored, rate: spaces_custom_furniture.wardrobe_price_factored}
          final_json[:boq_labels] = spaces_custom_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
          spaces_custom_furniture_array.push(final_json)
        else
          nil
        end
      end
      {space_section_table: spaces_custom_furniture_array, space_section_price: spaces_custom_furniture_price}
    else
      nil
    end
  end

  def lose_furnitures_for_space(space, display_boq_label)
    loose_furnitures = boqjobs.where(space: space)
    looseArray = []
    loosePrice = 0
    if loose_furnitures.present?
      loose_furnitures.each do |loose_furniture|
        product = loose_furniture.product
        loosePrice += loose_furniture.amount
        description = "Dimention: #{product&.length}*#{product&.width}*#{product&.height}   Material: #{product&.material}   Finish: #{product&.finish}  Color: #{product&.color} Fabric: #{loose_furniture&.product_variant&.name}"
        final_json = {product: "Furniture", name: loose_furniture.name, description: description, quantity: loose_furniture.quantity, price: loose_furniture.amount, rate: loose_furniture.rate}
        final_json[:boq_labels] = loose_furniture.boq_labels.pluck("label_name").join(", ") if display_boq_label
        looseArray.push(final_json)
        image_description = description+"Unique Code: #{product.unique_sku} Quantity: #{loose_furniture.quantity}"
        @annexure_loose_images.push({image_url: product.product_image.url, image_description: image_description})
      end
      # looseArray
      {space_section_table: looseArray, space_section_price: loosePrice}
    else
      nil
    end
  end

  def wardrobe_for_space(space, display_boq_label)
    wardrobe_jobs = modular_jobs.where(space: space, category: "wardrobe")

    wardrobeArray = []
    wardrobePrice = 0

    if wardrobe_jobs.present?
      wardrobe_jobs.each do |wardrobe_job|
        if !wardrobe_job.combined_module_id.present? || wardrobe_job.combined
          if wardrobe_job.combined
            wardrobe_name = ""
            description = "Combine Door: #{wardrobe_job&.combined_door&.name} "
            wardrobe_job.modular_jobs.each do |combined_module|
              wardrobe_name += "Module Type: #{combined_module&.product_module&.module_type&.name.to_s}\n Module :#{combined_module&.product_module&.code.to_s}\n"
              if wardrobe_job&.length.present?
                wardrobe_name += "Dimension: #{wardrobe_job&.length}X#{wardrobe_job&.breadth}X#{wardrobe_job&.thickness}"
              else
                wardrobe_name += "Dimension: #{combined_module&.product_module&.width}X#{combined_module&.product_module&.depth}X#{combined_module&.product_module&.height}mm \n\n"
              end
              description += "#{wardrobe_name} Core Material: #{combined_module&.core_material.to_s}  Shutter Material: #{combined_module&.shutter_material.to_s}  Shutter Finish: #{combined_module&.shutter_finish.to_s}  Shutter Shade Code: #{combined_module&.shutter_shade_code.to_s}  Edge Banding Shade Code: #{combined_module&.edge_banding_shade_code.to_s}  Drawer Handle Code: #{combined_module&.door_handle_code.to_s}  Shutter Handle Code: #{combined_module&.shutter_handle_code.to_s}   Hinge Type: #{combined_module&.hinge_type.to_s}  Channel Type: #{combined_module&.channel_type.to_s}  Hardware Brand: #{combined_module&.brand&.name.to_s}"
              if combined_module&.addons.present?
                addons = "  Addons \n "
                combined_module&.addons.each do |addon|
                  job_addon = addon.job_addons.find_by(modular_job: combined_module)
                  addons += "Code: #{addon.code}  \n Name: #{addon.name} \n Quantity: #{job_addon&.quantity} \n"
                  image_description = addons+"Specifications: #{addon.specifications} \n Make: #{addon&.brand&.name}"
                  @annexure_wardrobe_images.push({image_url: addon.addon_image.url, image_description: image_description })
                end
                description += addons
              end
            end
          else
            if wardrobe_job&.length.present?
              dimension = "#{wardrobe_job&.length}X#{wardrobe_job&.breadth}X#{wardrobe_job&.thickness}"
            else
              dimension = "#{wardrobe_job&.product_module&.width}X#{wardrobe_job&.product_module&.depth}X#{wardrobe_job&.product_module&.height}"
            end
            wardrobe_name = "Module Type: #{wardrobe_job&.product_module&.module_type&.name.to_s}  Module :#{wardrobe_job&.product_module&.code.to_s} \n Dimension: #{dimension}mm \n"
            description = "Core Material: #{wardrobe_job&.core_material.to_s}  Shutter Material: #{wardrobe_job&.shutter_material.to_s}  Shutter Finish: #{wardrobe_job&.shutter_finish.to_s}  Shutter Shade Code: #{wardrobe_job&.shutter_shade_code.to_s}  Edge Banding Shade Code: #{wardrobe_job&.edge_banding_shade_code.to_s}  Drawer Handle Code: #{wardrobe_job&.door_handle_code.to_s}  Shutter Handle Code: #{wardrobe_job&.shutter_handle_code.to_s}   Hinge Type: #{wardrobe_job&.hinge_type.to_s}  Channel Type: #{wardrobe_job&.channel_type.to_s}  Hardware Brand: #{wardrobe_job&.brand&.name.to_s}, Number Exposed Sites: #{wardrobe_job&.number_exposed_sites}"
            if wardrobe_job&.addons.present?
              addons = "  Addons \n "
              wardrobe_job&.addons.each do |addon|
                job_addon = addon.job_addons.find_by(modular_job: wardrobe_job)
                addons += "Code: #{addon.code}  \n Name: #{addon.name} \n Quantity: #{job_addon&.quantity} \n"

                image_description = addons+"Specifications: \n #{addon.specifications} \n Make: #{addon&.brand&.name}"
                @annexure_wardrobe_images.push({image_url: addon.addon_image.url, image_description: image_description })
              end
              description += addons
            end
          end
          final_json = {product: "Wardrobe", name: wardrobe_name, description: description, quantity: wardrobe_job.quantity, price: wardrobe_job.amount, rate: wardrobe_job.rate}
          final_json[:boq_labels] = wardrobe_job.boq_labels.pluck("label_name").join(", ") if display_boq_label
          wardrobeArray.push(final_json)
          wardrobePrice +=  wardrobe_job.amount
        end
      end
      {space_section_table: wardrobeArray, space_section_price: wardrobePrice}
      # wardrobeArray
    else
      nil
    end
  end

  def kitchen_modulor_job(space, display_boq_label, kitchen_type)
    kitchen_jobs = modular_jobs.where(space: space, category: "kitchen")

    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
      kitchen_jobs.each do |kitchen_job|
        if kitchen_job&.length.present?
          dimension = "#{kitchen_job&.length}X#{kitchen_job&.breadth}X#{kitchen_job&.thickness}"
        else
          dimension = "#{kitchen_job&.product_module&.width}X#{kitchen_job&.product_module&.depth}X#{kitchen_job&.product_module&.height}"
        end
        wardrobe_name = "Module Type: "+kitchen_job&.product_module&.module_type&.name.to_s+"  Module :"+kitchen_job&.product_module&.code.to_s + "\n Dimension: #{dimension}mm \n"
        description = "Core Material: #{kitchen_job&.core_material.to_s}  Shutter Material: #{kitchen_job&.shutter_material.to_s}  Shutter Finish: "+kitchen_job&.shutter_finish.to_s+"  Shutter Shade Code: #{kitchen_job&.shutter_shade_code.to_s}  Edge Banding Shade Code: #{kitchen_job&.edge_banding_shade_code.to_s}  Handle Code: #{kitchen_job&.door_handle_code.to_s}  Hinge Type: #{kitchen_job&.hinge_type.to_s}  Channel Type: #{kitchen_job&.channel_type.to_s}  Hardware Brand: #{kitchen_job&.brand&.name.to_s}, Number Exposed Sites: #{kitchen_job&.number_exposed_sites}"
        description += "  Addons\n "
          kitchen_job.job_addons.each do |job_addon|
            if job_addon.combination?
              job_addon.addon_combination.addons&.each do |addon|
                addons = "Slot: #{job_addon.slot} \n Code: #{addon&.code} \n Name: #{addon&.name}\n Quantity: #{job_addon&.quantity} \n"
                image_description = addons + "\n Specifications: #{addon&.specifications} \n Make: #{addon&.brand&.name}"
                @annexure_kitchen_images.push({image_url: addon.addon_image.url, image_description: image_description })
                description += addons
              end
            else
              addons = "Slot: #{job_addon.slot}\n Code: #{job_addon.addon&.code} \n Name: #{job_addon.addon&.name}\n Quantity: #{job_addon&.quantity} \n"
              image_description = addons+"\n Specifications: #{job_addon&.addon&.specifications} \n Make: #{job_addon&.addon&.brand&.name}"
              @annexure_kitchen_images.push({image_url: job_addon.addon.addon_image&.url, image_description: image_description })
              description += addons
            end
          end
        final_json = {product: kitchen_type, name: wardrobe_name, description: description, quantity: kitchen_job.quantity, price: kitchen_job.amount, rate: kitchen_job.rate}
        final_json[:boq_labels] = kitchen_job.boq_labels.pluck("label_name").join(", ") if display_boq_label
        kitchenArray.push(final_json)
        kitchenPrice += kitchen_job.amount
      end
      # kitchenArray
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def kitchen_extra_job(space, display_boq_label, kitchen_type)
    kitchen_jobs = extra_jobs.where(space: space)
    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
      kitchen_jobs.each do |kitchen_job|
        addon_array = []
        description = ""
        if kitchen_job.addon.present?
          addon_array << kitchen_job.addon
        elsif kitchen_job.addon_combination.present?
          addon_array = kitchen_job.addon_combination.addons
        end
        addon_array.each do |addon|
          addon_info = "Code: #{addon.code} Name: #{addon.name}  Dimention: #{addon&.specifications}  Brand: #{addon&.brand&.name} \n"
          description += addon_info
        end if addon_array.present?
        final_json = {product: "#{kitchen_job.category&.humanize}" + " Extra", name: kitchen_job.name, description: description, quantity: kitchen_job.quantity, price: kitchen_job.amount, rate: kitchen_job.rate}
        final_json[:boq_labels] = kitchen_job.boq_labels.pluck("label_name").join(", ") if display_boq_label
        kitchenArray.push(final_json)
        kitchenPrice += kitchen_job.amount
      end
      # kitchenArray
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def kitchen_appliance_job(space, display_boq_label, kitchen_type)
    kitchen_jobs = appliance_jobs.where(space: space)

    kitchenArray = []
    kitchenPrice = 0
    if kitchen_jobs.present?
      kitchen_jobs.each do |kitchen_job|
        @kitchen_appliance = kitchen_job.kitchen_appliance
        description = "Description: #{@kitchen_appliance.code} \n Vendor SKU: #{@kitchen_appliance.vendor_sku} \n Make: #{@kitchen_appliance.make} \n Specifications: #{@kitchen_appliance.specifications}"
        final_json = {product: "Appliance", name: kitchen_job.name, description: description, quantity: kitchen_job.quantity, price: kitchen_job.amount, rate: kitchen_job.rate}
        final_json[:boq_labels] = kitchen_job.boq_labels.pluck("label_name").join(", ") if display_boq_label
        kitchenArray.push(final_json)
        kitchenPrice += kitchen_job.amount
      end
      # kitchenArray
      {space_section_table: kitchenArray, space_section_price: kitchenPrice}
    else
      nil
    end
  end

  def custom_for_spaces(space, display_boq_label)
    customs_jobs = custom_jobs.where(space: space)

    customArray = []
    customPrice = 0
    if customs_jobs.present?
      customs_jobs.each do |custom_job|
        final_json = {product: "Custom", name: custom_job.name, description: "Dimension: #{custom_job&.custom_element&.dimension}\n Core Material: #{custom_job&.custom_element&.core_material}\n Finish: #{custom_job&.custom_element&.shutter_finish}", quantity: custom_job.quantity, price: custom_job.amount, rate: custom_job.rate}
        final_json[:boq_labels] = custom_job.boq_labels.pluck("label_name").join(", ") if display_boq_label
        customArray.push(final_json)
        customPrice += custom_job.amount
      end
      # customArray
      {space_section_table: customArray, space_section_price: customPrice}
    else
      nil
    end
  end

  def service_for_space(space)
    services_jobs = service_jobs.where(space: space)

    serviceArray = []
    servicePrice = 0
    if services_jobs.present?
      services_jobs.each do |service_job|
        description = "Activity: #{service_job.service_activity&.name}"
        serviceArray.push({product: "Service", name: service_job.service_activity&.service_subcategory&.name, description: description, quantity: service_job.quantity, price: service_job.amount, rate: service_job.final_rate})
        servicePrice += service_job.amount
      end
      # serviceArray
      {space_section_table: serviceArray, space_section_price: servicePrice}
    else
      nil
    end
  end

  def manage_task_sets
    if @is_initial_boq != false
        @initial_task = TaskEscalation.find_by(ownerable: project, task_set: TaskSet.find_by_task_name("Create Initial BOQ"), status: "no")
        @initial_task.update(status: "yes", completed_at: DateTime.now) if @initial_task.present?
        TaskEscalation.invoke_task(["Create Proposal"], "10 %", self)
    end
  end

  # po pi pairings by vendor
  def vendor_po_pi_pairings
    arr = []
    mapped_pis = purchase_order_performa_invoices.pluck(:performa_invoice_id)&.uniq
    mapped_pis.each do |pi_id|
      mapping_pi_hash = Hash.new
      purchase_invoice = PerformaInvoice.find(pi_id)
      mapped_pos = PurchaseOrder.joins(:purchase_order_performa_invoices).where(purchase_order_performa_invoices: {performa_invoice_id: pi_id})
      po_arr = []
      mapped_pos.each do |po|
        hash = Hash.new
        hash[:value] = po.job_element_vendors&.pluck(:final_amount)&.sum
        hash[:reference_no] = po.reference_no
        po_arr.push hash
      end
      mapping_pi_hash[:pi_reference_no] = purchase_invoice.reference_no
      mapping_pi_hash[:pi_value] = purchase_invoice.amount
      mapping_pi_hash[:mapped_pos] = po_arr
      mapping_pi_hash[:vendor_name] = purchase_invoice.vendor.name
      arr.push mapping_pi_hash
    end
    arr
  end

  # is final only if parent boq is present and approved
  def final_boq?
    parent_quotation.present? && parent_quotation.is_approved && wip_status == '10_50_percent'
  end

  def payment_percent_done?(percent)
    paid_amount.to_f >= ((percent.to_f/100)*total_amount)
  end

  def payment_10_done?
    payment_percent_done?(10.0)
  end

  def payment_50_done?
    payment_percent_done?(50.0)
  end

  def payment_40_done?
    payment_percent_done?(40.0)
  end

  def payment_100_done?
    payment_percent_done?(100.0)
  end

  def payment_40_done_after_5_days?
    sorted_payments = quotation_payments.sort_by{|qp| qp.created_at}
    amount_required = total_amount.to_f * 0.40
    sum = parent_quotation ? parent_quotation.paid_amount.to_f : 0
    sorted_payments.each do |sorted_payment|
      sum = sum + sorted_payment.amount.to_f
      if amount_required < sum
        return true   if sorted_payment.created_at <  5.days.ago
      end
    end
    return false
  end

  def destroy_bom(options)
    content = options[:content]
    ActiveRecord::Base.transaction do
      case content.scope
      when 'bom_sli_manual_sheet'
        if BomSliModule::ManualSheetImport.new(self, options).po_exists?
          return -2
        else
          BomSliModule::ManualSheetImport.new(self, options).clear_existing_slis
        end
      when 'imos_manual_sheet'
        if BomSliModule::ImosManualSheetImport.new(self, options).po_exists?
          return -2
        else
          BomSliModule::ImosManualSheetImport.new(self, options).clear_existing_slis
        end
      when 'imos'
        if ImosImportModule::ImosImport.new(self, options).po_exists?
          return -2
        else
          ImosImportModule::ImosImport.new(self, options).clear_existing_slis
        end
      else
        return -1
      end

      content.destroy!
      return 0
    end
  end

  def check_if_all_job_elements_are_mapped_with_vendors
    job_elements = self.job_elements.left_outer_joins(:job_element_vendors).where(job_element_vendors: {id: nil})
    TaskEscalation.mark_done_task("Vendor Selection", "50 %", self) if !job_elements.present?
  end

  def sli_creation_task
    task_escalations.where(task_set: TaskSet.sli_creation_task).take
  end

  def vendor_selection_task
    task_escalations.where(task_set: TaskSet.vendor_selection_task).take
  end

  def po_release_task
    task_escalations.where(task_set: TaskSet.po_release_task).take
  end

  def pi_upload_task
    task_escalations.where(task_set: TaskSet.pi_upload_task).take
  end

  def payment_release_task
    task_escalations.where(task_set: TaskSet.payment_release_task).take
  end

  # has at least one job and no task is left without an SLI
  def sli_creation_mark_done_eligible?
    ( boqjobs.count + modular_jobs.count + service_jobs.count + custom_jobs.count + appliance_jobs.count + extra_jobs.count ) > 0 &&
      boqjobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0 &&
      modular_jobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0 &&
      service_jobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0 &&
      custom_jobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0 &&
      appliance_jobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0 &&
      extra_jobs.left_outer_joins(:job_elements).where(job_elements: {id: nil}).distinct.count == 0
  end

  def get_job_elements_for_club_view
    job_elements.joins(vendor_product: :vendor).group_by{|e| [e.sli_code]}
  end

  def timeline
    result = {type: "", code: "", lead_time: 0}
    kitchen_jobs = modular_jobs.where(category: "kitchen")
    wardrobe_jobs = modular_jobs.where(category: "wardrobe")
    #boq_jobs = boqjobs#loose_furnitures =
    #custom_jobs = custom_jobs#custom_elements =
    kitchen_counter_top_lead_time = {type: "countertop", code: "", lead_time: boq_global_configs.find_by(category: "kitchen")&.countertop_lead_time}
    kitchen_jobs.each do |kjob|
      timeline = kjob.time_line
      [timeline, kitchen_counter_top_lead_time].each do |tc|
        if tc[:lead_time].to_f > result[:lead_time].to_f
          result[:type] = tc[:type]
          result[:code] = tc[:code]
          result[:lead_time] = tc[:lead_time]
        end
      end
    end
    wardrobe_jobs.each do |wjob|
      timeline = wjob.time_line
      if timeline[:lead_time].to_f > result[:lead_time].to_f
        result[:type] = timeline[:type]
        result[:code] = timeline[:code]
        result[:lead_time] = timeline[:lead_time]
      end
    end
    appliance_jobs.each do |ajob|
      lead_time = ajob.kitchen_appliance&.lead_time || 0
      if lead_time > result[:lead_time]
        result[:type] = "appliance"
        result[:code] = ajob.kitchen_appliance&.name
        result[:lead_time] = lead_time
      end
    end
    boqjobs.each do |bjob|
      lead_time = bjob.product&.lead_time || 0
      if lead_time > result[:lead_time]
        result[:type] = "loose furniture"
        result[:code] = bjob.product&.unique_sku
        result[:lead_time] = lead_time
      end
    end
    custom_jobs.each do |cjob|
      lead_time = cjob.custom_element&.timeline || 0
      if lead_time > result[:lead_time]
        result[:type] = "Custom Element"
        result[:code] = cjob.custom_element&.name
        result[:lead_time] = lead_time
      end
    end
    shangpin_jobs.each do |sjob|
      lead_time = sjob.lead_time || 0
      if lead_time > result[:lead_time]
        result[:type] = "Shangpin Job"
        result[:code] = sjob.id
        result[:lead_time] = lead_time
      end
    end
    service_jobs.each do |sejob|
      lead_time = sejob.lead_time || 0
      if lead_time > result[:lead_time]
        result[:type] = "Service Job"
        result[:code] = sejob.id
        result[:lead_time] = lead_time
      end
    end

    result
  end

  # To get the line items for quotation with production drawing and split details.
  def line_items_with_production_drawings
    kitchen_jobs = modular_jobs.kitchen
    wardrobe_jobs = modular_jobs.wardrobe

    lines_items = {}

    lines_items[:loose_furniture] = boqjobs.map do |boqjob|
      boqjob.slice(:id, :name).merge(
        fabric: boqjob.product_variant&.product_variant_code,
        quantity: boqjob.quantity,
        type: "Boqjob",
        production_drawings: ProductionDrawingSerializer.new(boqjob.production_drawings).serializable_hash,
        split: boqjob.tag
        )
    end if boqjobs.present?

    lines_items[:modular_kitchen] = modular_jobs.kitchen.map do |modular_job|
      modular_job.slice(:id).merge(
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        quantity: modular_job.quantity,
        type: "ModularJob",
        production_drawings: ProductionDrawingSerializer.new(modular_job.production_drawings).serializable_hash,
        split: modular_job.tag
        )
    end if kitchen_jobs.present?

    lines_items[:modular_wardrobe] = wardrobe_jobs.map do |modular_job|
      modular_job.slice(:id).merge(
        name: "Module Type: #{modular_job.product_module&.module_type&.name.to_s}  Module :#{modular_job.product_module&.code.to_s}",
        quantity: modular_job.quantity,
        type: "ModularJob",
        production_drawings: ProductionDrawingSerializer.new(modular_job.production_drawings).serializable_hash,
        split: modular_job.tag
        )
    end if wardrobe_jobs.present?

    lines_items[:service] = service_jobs.map do |service_job|
      service_job.slice(:id, :name).merge(
        base_rate: service_job.base_rate,
        quantity: service_job.quantity,
        type: "ServiceJob",
        production_drawings: ProductionDrawingSerializer.new(service_job.production_drawings).serializable_hash,
        split: service_job.tag
        )
    end if service_jobs.present?

    lines_items[:custom_element] = custom_jobs.map do |custom_job|
      custom_element = custom_job.custom_element
      custom_job.slice(:id, :name).merge(
        dimension: custom_element.dimension,
        remark: custom_element.designer_remark,
        quantity: custom_job.quantity,
        type: "CustomJob",
        production_drawings: ProductionDrawingSerializer.new(custom_job.production_drawings).serializable_hash,
        split: custom_job.tag

        )
    end if custom_jobs.present?

    lines_items[:appliance] = appliance_jobs.map do |appliance_job|
      appliance_job.slice(:id, :name).merge(
        type: "ApplianceJob",
        quantity: appliance_job.quantity,
        production_drawings: ProductionDrawingSerializer.new(appliance_job.production_drawings).serializable_hash,
        split: appliance_job.tag

        )
    end if appliance_jobs.present?

    lines_items[:extra] = extra_jobs.map do |extra_job|
      extra_job.slice(:id, :name).merge(
        type: "ExtraJob",
        quantity: extra_job.quantity,
        production_drawings: ProductionDrawingSerializer.new(extra_job.production_drawings).serializable_hash,
        split: extra_job.tag
        )
    end if extra_jobs.present?

    lines_items[:custom_furniture] = shangpin_jobs.map do |shangpin_job|
      case shangpin_job.job_type
      when "door", "sliding_door"
        model_no = shangpin_job.door_model_no
        quantity = shangpin_job.door_quantity
      when "cabinet"
        model_no = shangpin_job.cabinet_model_no
        quantity = shangpin_job.cabinet_quantity
      when "accessory"
        model_no = shangpin_job.accessory_model_no
        quantity = shangpin_job.accessory_quantity
      else
        model_no = nil
        quantity = nil
      end
      shangpin_job.slice(:id).merge(
        name: "Type: #{shangpin_job.job_type} Model: #{model_no}",
        type: "ShangpinJob",
        quantity: quantity,
        production_drawings: ProductionDrawingSerializer.new(shangpin_job.production_drawings).serializable_hash,
        split: shangpin_job.tag
        )
    end if shangpin_jobs.present?

    lines_items
  end

  def Quotation.completely_splitted_quotations(project)
    quotations = project.quotations.project_handover_quotations
    q_ids = []
    quotations.each do |quotation|
      flag = true
      next if quotation.boqjobs.pluck(:tag_id).include?(nil)
      next if quotation.modular_jobs.pluck(:tag_id).include?(nil)
      next if quotation.service_jobs.pluck(:tag_id).include?(nil)
      next if quotation.custom_jobs.pluck(:tag_id).include?(nil)
      next if quotation.appliance_jobs.pluck(:tag_id).include?(nil)
      next if quotation.extra_jobs.pluck(:tag_id).include?(nil)
      q_ids << quotation
    end
    Quotation.where(id: q_ids)
  end

  def self.olt_client_email_report
    data_hash = {}
    num_of_client_fourty_per_finance_approved = []
    num_of_client_po_raised = []
    num_of_client_po_not_raised = []
    num_of_client_handover_approved = []
    num_of_client_production_drawing_not_uploaded = []
    #Quotations which has  40% Payment
    quotation_with_fourty_percent_payment = Quotation.all.select(:id, :paid_amount, :total_amount, :project_id).select{|boq| boq.payment_40_done? }
    #Number of Clients that paid 40% payment
    num_of_client_fourty_per_finance_approved = Lead.joins(project: :quotations).where(quotations: {id: quotation_with_fourty_percent_payment.map(&:id).uniq}).distinct.size
    #Clients for which production drawing is not uploaded
    quotation_with_fourty_percent_payment.each do |quotation|
      quotation_jobs = quotation.boqjobs.to_a + quotation.modular_jobs.to_a + quotation.service_jobs.to_a + quotation.custom_jobs.to_a + quotation.appliance_jobs.to_a + quotation.extra_jobs.to_a
      lead_id = quotation.project.lead.id
      num_of_client_production_drawing_not_uploaded << lead_id if quotation_jobs.detect{ |job| job.project_handovers.empty?}.present?
    end
    #Number of Client for that Purchase Order is  raised
    released_purchase_order = PurchaseOrder.where("release_count > ?", 0)
    client_po_raised = Lead.joins(project: [{quotations: :purchase_orders}]).where(purchase_orders: {id: released_purchase_order}).distinct
    num_of_client_po_raised = client_po_raised.size
    #Number of Client for that Purchase Order is not raised
    payment_40_done_after_5_days = Quotation.all.select(:id, :paid_amount, :total_amount, :parent_quotation_id).select{|boq| boq.payment_40_done_after_5_days? }
    num_of_client_po_not_raised = Lead.joins(project: :quotations).where(quotations: {id: payment_40_done_after_5_days.uniq}).where.not(id: client_po_raised).distinct.size
    #Number of Client for that handover is accepted by Category
    num_of_client_handover_approved = Lead.joins(project: :project_handovers).where(project_handovers: {status: "accepted"}).distinct.size

    data_hash[:finance_approved_client] = num_of_client_fourty_per_finance_approved
    data_hash[:po_raised_client] = num_of_client_po_raised
    data_hash[:po_not_raised_client] = num_of_client_po_not_raised
    data_hash[:handover_approved_client] = num_of_client_handover_approved
    data_hash[:not_production_drawing_client] = num_of_client_production_drawing_not_uploaded.uniq.count
    users = User.with_any_role(:category_head, *Role::CATEGORY_ROLES).pluck(:email).uniq
    UserNotifierMailer.olt_email_report(data_hash, users).deliver!
  end

  def check_handover_status
    if self.project_handovers.present?
      handover_status = self.project_handovers.last.status
      handover_status.in?(["pending","pending_acceptance"]) ? false : true
    end
  end

  def create_handover_revision
    if self.project_handovers.present?
      handover = self.project_handovers.last
      if handover.status.in?(["accepted", "rejected"])
        if handover.parent_handover.present?
          parent_handover = handover.parent_handover
          parent_handover.child_versions.create!(ownerable: self, status: "pending", project_id: self.project_id)
        else
          handover.child_versions.create!(ownerable: self, status: "pending", project_id: self.project_id)
        end
      end
    else
      true
    end
  end

  # This method will go through each of the modular_jobs of this BOQ and check if their addons are in order. Two checks:
  # :mandatory_addons_present?
  # :addons_must_be_mapped (make sure to not call it with the option to delete unmapped addons as we are only checking here).
  # ALL the modular_jobs must pass the checks for this method to return true!
  def addons_eligible_for_share?
    valid_flag = true

    modular_jobs.each do |modular_job|
      valid_flag = false unless ( modular_job.mandatory_addons_present? && !modular_job.has_unmapped_addons? )
      break unless valid_flag  #already a modular_job was found to have invalid/missing addons - no need to check further.
    end

    return valid_flag
  end

  def eta
    payment_50_comp_date.present? ? (payment_50_comp_date + duration.to_i.day).strftime("%e %b %y") : "-"
  end

  private
  # Check that the generation_date and expiration_date are in tandem.
  def check_validity_of_dates
    errors.add(:expiration_date, "must be later than Generation date") unless expiration_date >= generation_date
  end

end
