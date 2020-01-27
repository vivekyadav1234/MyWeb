# == Schema Information
#
# Table name: appliance_jobs
#
#  id                   :integer          not null, primary key
#  name                 :string
#  make                 :string
#  rate                 :float
#  quantity             :float
#  amount               :float
#  space                :string
#  ownerable_type       :string
#  ownerable_id         :integer
#  kitchen_appliance_id :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  vendor_sku           :string
#  specifications       :string
#  warranty             :string
#  estimated_cogs       :float            default(0.0)
#  clubbed_job_id       :integer
#  tag_id               :integer
#  no_bom               :boolean          default(FALSE), not null
#

class ApplianceJob < ApplicationRecord
  has_paper_trail

  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :kitchen_appliance, required: true
  belongs_to :clubbed_job, optional: true

  belongs_to :tag, optional: :true
  
  has_many :cad_upload_jobs, as: :uploadable, dependent: :destroy
  has_many :cad_uploads, through: :cad_upload_jobs

  # For BOM files uploaded against this line item.
  has_many :line_item_boms, as: :line_item, dependent: :destroy
  has_many :boms, through: :line_item_boms, source: :content
  has_one :invoice_line_item, as: :line_item, dependent: :destroy
  has_one :payment_invoice, through: :invoice_line_item

  # for dividing a job into several elements as each elements can have its own set of vendors
  has_many :job_elements, as: :ownerable, dependent: :destroy
  has_many :vendors, through: :job_elements

  has_many :boq_labels, as: :ownerable, dependent: :destroy

  has_many :production_drawings, as: :line_item, dependent: :destroy
  has_many :project_handovers, through: :production_drawings 

  has_many :contents, as: :ownerable

  validates_presence_of :name, :vendor_sku, :kitchen_appliance_id
  validates_presence_of [:rate, :space], unless: :belongs_to_layout?
  validates :quantity, numericality: { greater_than: 0 }

  validates :no_bom, inclusion: { in: [true, false] }

  before_validation :populate_defaults, unless: :belongs_to_layout?
  after_save :populate_labels, on: [:create, :update], unless: :belongs_to_layout?

  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}

  include JobSplitConcern
  
  LAYOUT_COLUMNS_TO_COPY = [:name, :make, :quantity, :kitchen_appliance_id, :vendor_sku, :specifications, :warranty]

  def belongs_to_layout?
    ownerable_type == "MkwLayout"
  end

  def populate_defaults
    self.rate = 0.0 if rate.blank?
    self.amount = quantity * rate * price_factor(get_price_factor_hash) * get_price_increase_factor
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

  def populate_estimated_cogs
    self.update_columns(estimated_cogs: cost_price.round(2))
  end

  # import data from an Appliance
  def import_appliance(kitchen_appliance, quantity, space=nil, options = {})
    self.name = kitchen_appliance.name
    self.vendor_sku = kitchen_appliance.vendor_sku
    self.make = kitchen_appliance.make
    self.specifications = kitchen_appliance.specifications
    self.warranty = kitchen_appliance.warranty
    self.quantity = quantity.to_f
    category = "kitchen"
    self.rate = kitchen_appliance.mrp * price_factor(get_price_factor_hash) * get_price_increase_factor
    self.amount = rate.to_f * quantity.to_f
    self.kitchen_appliance = kitchen_appliance
    self.space = space
    self.save if options[:save_now]
    self
  end

  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
  end  

  # Similar to importing when part of a BOQ, but there are several differences.
  # Not all columns for a normal appliance_job will be imported.
  def import_job_for_layout
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job
  end

  def import_job_for_quotation(space)
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job.space = space
    new_job.rate = kitchen_appliance.mrp * price_factor(get_price_factor_hash) * get_price_increase_factor
    new_job.amount = new_job.rate.to_f * new_job.quantity.to_f
    new_job
  end

  def get_price_factor_hash
    if ownerable_type == "Quotation"
      return ownerable.get_price_factor_hash
    else
      return MKW_GLOBAL_DATA
    end
  end

  def get_price_increase_factor
    if ownerable_type == "Quotation"
      return ownerable.price_increase_factor
    else
      return 1.0
    end
  end

  def cost_price
    quantity * rate * price_factor(MKW_GLOBAL_DATA_ESTIMATED_COGS) * get_price_increase_factor
  end

  def price_factor(price_factor_hash)
    category = "kitchen"
    price_factor_hash["sale_cost_factor"][category]["appliances"]
    # MKW_GLOBAL_DATA["sale_cost_factor"][category]["appliances"]
  end
end
