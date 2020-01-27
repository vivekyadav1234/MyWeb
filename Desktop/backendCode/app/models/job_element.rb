# == Schema Information
#
# Table name: job_elements
#
#  id                            :integer          not null, primary key
#  element_name                  :string
#  ownerable_type                :string
#  ownerable_id                  :integer
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  quotation_id                  :integer
#  vendor_product_id             :integer
#  quantity                      :float            default(0.0)
#  unit                          :string
#  rate                          :float            default(0.0)
#  barcode                       :string
#  imos_type                     :string
#  imos_sheet                    :string
#  imos_row                      :integer
#  qc_date                       :string
#  bom_sli_cutting_list_datum_id :integer
#  import_type                   :string
#  added_for_partial_dispatch    :boolean          default(FALSE)
#  po_cancelled_or_modifying     :boolean          default(FALSE)
#

class JobElement < ApplicationRecord
  has_paper_trail

  belongs_to :quotation, required: true
  belongs_to :ownerable, polymorphic: true, optional: true  #Arunoday: nil means the job element is independent of any BOQ line item and is a BOQ level cost.
  belongs_to :vendor_product, optional: true
  belongs_to :bom_sli_cutting_list_datum, optional: true

  has_many :label_job_elements, dependent: :destroy
  has_many :boq_labels, through: :label_job_elements
  has_many :job_element_vendors, dependent: :destroy
  has_many :vendors, through: :job_element_vendors

  has_many :purchase_elements, through: :job_element_vendors
  has_many :unscoped_job_element_vendors, ->{ unscope(where: :added_for_partial_dispatch) }, class_name: JobElementVendor
  has_many :unscoped_purchase_elements, through: :unscoped_job_element_vendors, source: :purchase_elements
  has_many :quality_checks, dependent: :destroy
  has_many :dispatch_readinesses, dependent: :destroy
  has_many :dispatch_schedules, dependent: :destroy
  has_many :delivery_states, dependent: :destroy
  has_one :purchase_order, through: :job_element_vendors

  validates_presence_of :element_name
  validates_presence_of :unit
  validates_uniqueness_of :element_name, scope: [:ownerable_type, :ownerable_id], if: :no_master_sli?
  # validates :rate, presence: true, numericality: { greater_than: 0 }

  IMPORT_TYPES = ['imos', 'bom_sli_manual_sheet', 'imos_manual_sheet']
  validates_inclusion_of :import_type, in: IMPORT_TYPES, allow_blank: true
  # Please note that :imos_type is used by other imported SLIs as well.
  # IMOS_TYPES = ["hardware", "core_material", "edge_banding", "finish"]  #For IMOS parts list.
  IMOS_TYPES = ["hardware", "hardware_custom"]  #For IMOS parts list. Only hardware
  BOM_SLI_MANUAL_SHEET_TYPES = ['part_material', 'laminate_top', 'laminate_bottom', 'edge1', 'hardware', 'hardware_extras', 'edge4']  #For Manual Sheet of both types.
  validates_inclusion_of :imos_type, in: (IMOS_TYPES+BOM_SLI_MANUAL_SHEET_TYPES), allow_blank: true

  before_validation :populate_name
  #before_create :populate_job_element_vendor
  default_scope { where(added_for_partial_dispatch: false, po_cancelled_or_modifying: false) }
  scope :extra_items, ->{ where(ownerable_type: nil) }
  scope :imos_hardwares, ->{ where(import_type: 'imos', imos_type: 'hardware') }
  scope :imos_core_materials, ->{ where(import_type: 'imos', imos_type: 'core_material') }
  scope :imos_edge_bandings, ->{ where(import_type: 'imos', imos_type: 'edge_banding') }
  scope :imos_finishes, ->{ where(import_type: 'imos', imos_type: 'finish') }
  scope :with_master_sli, ->{ where.not(vendor_product_id: nil) }
  scope :without_master_sli, ->{ where(vendor_product_id: nil) }
  scope :with_active_po, -> { joins(purchase_elements: :purchase_order).where(purchase_orders: { status: ['pending', 'released'] }) }
  # SLIs within this scope cannot be modified!
  scope :not_modifiable, -> { joins(purchase_elements: :purchase_order).where("purchase_orders.status = ? OR (purchase_orders.status = ? AND purchase_orders.modifying = ?)", 'released', 'pending', 'f') }

  def ownerable_type=(value)
    if value.present?
      self[:ownerable_type] = value
    else
      self[:ownerable_type] = nil
    end
  end

  # does this job element belong to a vendor product (ie master SLI) or is it a manually created one?
  def no_master_sli?
    vendor_product.blank?
  end

  # Did this SLI come from a BOM file import?
  def from_bom?
    import_type.present?
  end

  # does this job_element have an active PO?
  def po_created?
    PurchaseOrder.joins(:purchase_elements).
      where(purchase_elements: {id: purchase_elements}).
      where(purchase_orders: { status: ['pending', 'released', 'modified'] }).exists?
  end

  # can this job_element be modified?
  def cannot_modify?
    PurchaseOrder.joins(:purchase_elements).
      where(purchase_elements: {id: purchase_elements}).
      where("purchase_orders.status IN (?) OR (purchase_orders.status = ? AND purchase_orders.modifying = ?)", ['released', 'modified'], 'pending', 'f').exists?
  end

  # is this part of a PO being modified currently?
  def modifying_po?
    PurchaseOrder.joins(:purchase_elements).
      where(purchase_elements: {id: purchase_elements}).
      where("purchase_orders.status = ? AND purchase_orders.modifying = ?", 'pending', 't').exists?
  end

  def populate_name
    unless element_name.present?
      name_string = nil
      if vendor_product.present?
        name_string = vendor_product.sli_name
      else
        name_string = self.ownerable&.name.present? ? self.ownerable.name : "default"
      end
      self.element_name = name_string
    end
  end

  # if the job_element was created from a master SLI, then a job_element_vendor should automatically
  # created. Else skip.
  def populate_job_element_vendor
    if vendor_product.present?
      vendor = vendor_product.vendor
      self.job_element_vendors.build(vendor: vendor, cost: vendor_product.rate, tax_percent: 0.0,
        recommended: true, unit_of_measurement: vendor_product.unit, tax_type: 'cgst_sgst', quantity: quantity)
    end
  end

  # update basic details only, not references.
  def update_job_element_vendors
    return_array = job_element_vendors.map do |job_element_vendor|
      job_element_vendor.update(
        quantity: quantity,
        unit_of_measurement: unit,
        cost: rate
      )
    end

    return !return_array.include?(false)
  end

  def sli_code
    vendor_product&.sli_code
  end

  def sli_name
    vendor_product&.sli_name
  end

  def master_line_item_type
    if ownerable_type == "Boqjob"
      "Loose Furniture"
    elsif ownerable_type == "ModularJob"
      if ownerable&.category == "kitchen"
        "Modular Kitchen"
      elsif ownerable&.category == "wardrobe"
        "Modular Wardrobe"
      end
    elsif ownerable_type == "ServiceJob"
      "Services"
    elsif ownerable_type == "CustomJob"
      "Custom Jobs"
    elsif ownerable_type == "ApplianceJob"
      "Appliance"
    end
  end

  def current_address
    self.dispatch_schedules&.last&.status == "complete" ? self.dispatch_schedules&.last&.shipping_address : self.purchase_order&.vendor&.address
  end

  def next_address
    self.dispatch_schedules&.last&.status == "complete" ? "-" : self.dispatch_schedules&.last&.shipping_address
  end

  def self.material_tracking_history(param, id)
    objects = param.constantize.where(job_element_id: id).sort_by(&:created_at)
    return_array = []
    objects.each do |object|
      hash = Hash.new
      if param == "QualityCheck"
        hash[:status] = object.qc_status&.humanize&.titleize
        hash[:date] = object.qc_date&.strftime("%d-%b-%Y")
        file_urls = []
        object.contents&.each do |file|
          file_urls << file.document.url
        end
        hash[:file_urls] = file_urls
      elsif param == "DispatchReadiness"
        hash[:status] = ""
        hash[:date] = object.readiness_date&.strftime("%d-%b-%Y")
      elsif param == "DispatchSchedule"
        hash[:status] = object.status&.humanize&.titleize
        hash[:date] = object.schedule_date&.strftime("%d-%b-%Y")
        file_urls = []
        object.contents&.each do |file|
          file_urls << file.document.url
        end
        hash[:file_urls] = file_urls
      elsif param == "DeliveryState"
        hash[:status] = object.status&.humanize&.titleize
        hash[:date] =  object.created_at&.strftime("%d-%b-%Y")
      end
      hash[:remarks] = object.remarks
      return_array.push hash
    end

    return_array

  end

  # return all unique combinations of required columns for SLIs referenced to vendor_product.
  # columns obtained from method :sli_columns_master or :sli_columns_custom as appropriate.
  # def self.unique_column_values(master_or_custom)
  #   column_array = master_or_custom=='master' ? sli_columns_master : sli_columns_custom
  #   value_array = includes(:job_element_vendors).map do |je|
  #     jev = je.job_element_vendors.last
  #     arr = []

  #     column_array[:job_element_columns].each do |cname|
  #       arr.push je.public_send(cname)  
  #     end

  #     column_array[:job_element_vendor_columns].each do |cname|
  #       arr.push jev&.public_send(cname)  
  #     end

  #     arr
  #   end

  #   value_array.uniq
  # end

  # group for SLI creation screen.
  # def self.group_master
  #   includes(job_element_vendors: {purchase_elements: :purchase_order}).group_by do |je|
  #     jev = je.job_element_vendors.last
  #     [je.vendor_product_id, jev&.vendor_id, jev&.tax_percent, jev&.tax_type, je.cannot_modify?]
  #   end
  # end

  # group for SLI creation screen.
  # def self.group_custom
  #   includes(job_element_vendors: {purchase_elements: :purchase_order}).group_by do |je|
  #     jev = je.job_element_vendors.last
  #     [je.element_name, je.unit, je.rate, jev&.vendor_id, jev&.tax_percent, jev&.tax_type, je.cannot_modify?]
  #   end
  # end

  # def self.sli_columns_master
  #   {
  #     job_element_columns: [:vendor_product_id],
  #     job_element_vendor_columns: [:vendor_id, :tax_percent, :tax_type]
  #   }
  # end

  # def self.sli_columns_custom
  #   {
  #     job_element_columns: [:element_name, :unit, :rate],
  #     job_element_vendor_columns: [:vendor_id, :tax_percent, :tax_type]
  #   }
  # end
end
