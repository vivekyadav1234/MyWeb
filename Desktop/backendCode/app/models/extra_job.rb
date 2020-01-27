# == Schema Information
#
# Table name: extra_jobs
#
#  id             :integer          not null, primary key
#  name           :string
#  rate           :float
#  quantity       :float
#  amount         :float
#  space          :string
#  vendor_sku     :string
#  specifications :string
#  ownerable_type :string
#  ownerable_id   :integer
#  addon_id       :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  estimated_cogs :float            default(0.0)
#  clubbed_job_id :integer
#  tag_id         :integer
#  no_bom         :boolean          default(FALSE), not null
#

class ExtraJob < ApplicationRecord
  has_paper_trail

  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :addon, optional: true
  belongs_to :addon_combination, optional: true
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

  validates_presence_of :name
  validates_presence_of [:rate, :space], unless: :belongs_to_layout?
  validates :quantity, numericality: { greater_than: 0 }

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  validate :addon_required

  before_validation :populate_defaults, unless: :belongs_to_layout?
  after_save :populate_labels, on: [:create, :update], unless: :belongs_to_layout?

  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}
  
  validates :no_bom, inclusion: { in: [true, false] }

  include JobSplitConcern
  
  LAYOUT_COLUMNS_TO_COPY = [:name, :quantity, :vendor_sku, :specifications, :addon_id, :addon_combination_id, :category]

  def belongs_to_layout?
    ownerable_type == "MkwLayout"
  end

  def combination?
    addon_combination.present?
  end

  def populate_defaults
    self.rate = 0.0 if rate.blank?
    self.amount = rate.to_f * quantity.to_f
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

  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
  end
  
  # import data from an Addon as extra
  # parameter addon can be Addon or AddonCombination
  def import_extra(addon_record, quantity, space=nil, options = {})
    self.quantity = quantity.to_f
    self.space = space
    if options[:combination]
      self.addon_combination = addon_record
    else
      self.addon = addon_record
    end
    if addon.present?
      self.name = addon.name
      self.vendor_sku = addon.vendor_sku
      self.specifications = addon.specifications  
      self.rate = addon.mrp * price_factor(get_price_factor_hash) * get_price_increase_factor
    elsif addon_combination.present?
      self.name = addon_combination.combo_name
      self.rate = addon_combination.mrp * price_factor(get_price_factor_hash) * get_price_increase_factor
    end
    self.category = addon.present? ? addon.category : 'kitchen'  #since AddonCombinations are possible in MK only currently.
    self.amount = rate.to_f * quantity.to_f
    self.save if options[:save_now]
    self
  end

  # Similar to importing when part of a BOQ, but there are several differences.
  # Not all columns for a normal extra_job will be imported.
  def import_job_for_layout
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job
  end

  def import_job_for_quotation(space)
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job.space = space
    new_job.rate = addon.mrp * price_factor(get_price_factor_hash) * get_price_increase_factor
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
    rate.to_f * quantity.to_f * price_factor(MKW_GLOBAL_DATA_ESTIMATED_COGS) * get_price_increase_factor
  end

  # 23-09-2019: Overall factor removed from this as per Abhishek's request.
  def price_factor(price_factor_hash)
    # fallback in case category isn't set yet.
    category_to_use = addon.present? ? addon.category : 'kitchen'  #since AddonCombinations are possible in MK only currently.
    price_factor_hash["sale_cost_factor"][category_to_use]["extras"]
  end

  private
  # must have either an addon or an addon_combination associated.
  def addon_required
    errors.add(:addon_id, "missing addon or addon combination - at least 1 is needed.") if addon.blank? && addon_combination.blank?
  end
end
