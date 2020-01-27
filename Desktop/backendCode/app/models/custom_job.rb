# == Schema Information
#
# Table name: custom_jobs
#
#  id                :integer          not null, primary key
#  ownerable_type    :string
#  ownerable_id      :integer
#  name              :string
#  space             :string
#  quantity          :integer
#  rate              :float
#  amount            :float
#  custom_element_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  estimated_cogs    :float            default(0.0)
#  clubbed_job_id    :integer
#  tag_id            :integer
#  no_bom            :boolean          default(FALSE), not null
#

class CustomJob < ApplicationRecord
  has_paper_trail
  
  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :custom_element, required: true
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


  validates_presence_of :name, :rate, :space
  validates :quantity, numericality: { greater_than: 0 }

  validates :no_bom, inclusion: { in: [true, false] }

  before_validation :populate_defaults
  after_save :populate_labels, on: [:create, :update]

  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}
  # Logic is different, so we cannot use the same scope as for other job classes.
  scope :with_segment, -> (segment) {
    left_outer_joins(:custom_element, :tag).where("tags.id IS NULL").where(custom_elements: { category_split: segment }).
      or( left_outer_joins(:custom_element, :tag).where("tags.name IN (?)", SPLITS_FOR_SEGMENT[segment]).where(custom_elements: { category_split: segment }) ).distinct
  }

  def populate_defaults
    self.quantity = 1 if quantity.blank?
    self.rate = 0 if rate.blank?
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

  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
  end

  def get_segment
    if tag.blank?
      custom_element.category_split
    else
      SPLIT_SEGMENT_MAPPING[tag.name]
    end
  end

  def import_custom_element(custom_element, quantity, space=nil, options = {})
    self.name = custom_element.name
    self.quantity = quantity.to_f
    self.rate = custom_element.price * price_factor(get_price_factor_hash) * get_price_increase_factor
    self.amount = rate.to_f * quantity.to_f
    self.custom_element = custom_element
    self.space = space
    self.save if options[:save_now]
    self
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
    price_factor_hash["sale_cost_factor"]['custom_sku']
    # MKW_GLOBAL_DATA["sale_cost_factor"]['custom_sku']
  end
end
