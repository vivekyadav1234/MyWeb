# == Schema Information
#
# Table name: boqjobs
#
#  id                 :integer          not null, primary key
#  name               :string
#  quantity           :float
#  rate               :float
#  amount             :float
#  ownerable_type     :string
#  ownerable_id       :integer
#  product_id         :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  ppt_linked         :boolean          default(FALSE)
#  section_id         :integer
#  space              :string
#  product_variant_id :integer
#  estimated_cogs     :float            default(0.0)
#  clubbed_job_id     :integer
#  tag_id             :integer
#  no_bom             :boolean          default(FALSE), not null
#

class Boqjob < ApplicationRecord
  has_paper_trail
  
  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :product, required: true
  belongs_to :product_variant, optional: true
  belongs_to :section, optional: true   #Made optional - might be removed soon.
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
  
  validates :no_bom, inclusion: { in: [true, false] }

  validates_presence_of :name, :rate, :space
  validates_uniqueness_of :product_id, scope: [:ownerable_type, :ownerable_id, :space]
  validates :quantity, numericality: { greater_than: 0 }

  before_validation :populate_defaults
  after_save :populate_labels, on: [:create, :update]
  
  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}

  include JobSplitConcern

  def populate_defaults
    self.quantity = 1 if quantity.blank?
    self.rate = 0 if rate.blank?
    self.amount = quantity.to_f * rate.to_f * price_factor(get_price_factor_hash) * get_price_increase_factor
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

  # import data from a Product
  def import_product(product, quantity, space=nil, options = {})
    self.name = product.name
    self.quantity = quantity.to_f
    self.rate = product.sale_price.to_f * price_factor(get_price_factor_hash) * get_price_increase_factor
    self.amount = rate.to_f * quantity.to_f
    self.product = product
    self.space = space
    self.section = product.section
    self.ppt_linked = true if options[:ppt_linked]
    self.save if options[:save_now]
    self
  end
  
  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
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
    quantity.to_f * rate.to_f * price_factor(MKW_GLOBAL_DATA_ESTIMATED_COGS) * get_price_increase_factor
  end

  def price_factor(price_factor_hash)
    price_factor_hash["sale_cost_factor"]['loose_furniture']
    # MKW_GLOBAL_DATA["sale_cost_factor"]['loose_furniture']
  end
end
