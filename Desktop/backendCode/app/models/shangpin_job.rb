# == Schema Information
#
# Table name: shangpin_jobs
#
#  id                       :integer          not null, primary key
#  space                    :string
#  cabinet_model_no         :string
#  cabinet_width            :integer
#  cabinet_depth            :integer
#  cabinet_height           :integer
#  cabinet_material         :string
#  cabinet_specific_door    :integer
#  cabinet_specific_worktop :integer
#  cabinet_specific_leg     :integer
#  cabinet_handle           :string
#  cabinet_price            :float            default(0.0)
#  cabinet_quantity         :float            default(0.0)
#  cabinet_amount           :float            default(0.0)
#  door_style_code          :string
#  door_width               :integer
#  door_depth               :integer
#  door_height              :integer
#  door_quantity            :float            default(0.0)
#  door_amount              :float            default(0.0)
#  accessory_code           :string
#  accessory_width          :integer
#  accessory_depth          :integer
#  accessory_height         :integer
#  accessory_price          :float            default(0.0)
#  accessory_quantity       :float            default(0.0)
#  accessory_amount         :float            default(0.0)
#  ownerable_type           :string
#  ownerable_id             :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  job_type                 :string           not null
#  amount                   :float            default(0.0), not null
#  cabinet_item             :string
#  cabinet_color            :string
#  door_item                :string
#  door_color               :string
#  door_model_no            :string
#  accessory_item           :string
#  accessory_color          :string
#  accessory_model_no       :string
#  wardrobe_price           :float            default(0.0)
#  wardrobe_amount          :float            default(0.0)
#  door_price               :float            default(0.0)
#  tag_id                   :integer
#  clubbed_job_id           :integer
#  no_bom                   :boolean          default(FALSE), not null
#

class ShangpinJob < ApplicationRecord
  has_paper_trail

  belongs_to :ownerable, polymorphic: true, optional: true

  # for dividing a job into several elements as each elements can have its own set of vendors
  has_many :job_elements, as: :ownerable, dependent: :destroy
  has_many :vendors, through: :job_elements

  has_many :boq_labels, as: :ownerable, dependent: :destroy
  
  has_many :line_item_boms, as: :line_item, dependent: :destroy
  has_many :boms, through: :line_item_boms, source: :content
  has_one :invoice_line_item, as: :line_item, dependent: :destroy
  has_one :payment_invoice, through: :invoice_line_item
  
  belongs_to :tag, optional: :true
  belongs_to :clubbed_job, optional: true

  has_many :production_drawings, as: :line_item, dependent: :destroy
  has_many :project_handovers, through: :production_drawings

  has_many :cad_upload_jobs, as: :uploadable, dependent: :destroy
  has_many :cad_uploads, through: :cad_upload_jobs

  has_attached_file :image, :default_url => "/images/:style/missing.png"
  do_not_validate_attachment_file_type :image
  validates_presence_of [:cabinet_price, :cabinet_quantity, :cabinet_amount], if: :is_cabinet_job?
  validates_presence_of [:door_style_code, :door_quantity, :door_amount], if: :is_door_job?
  validates_presence_of [:accessory_price, :accessory_quantity, :accessory_amount], if: :is_accessory_job?    

  ALL_JOB_TYPES = %w(cabinet door accessory sliding_door wardrobe)
  validates_inclusion_of :job_type, in: ALL_JOB_TYPES

  # after_initialize :effective_factor
  before_validation :set_amount

  after_save :populate_labels, on: [:create, :update], unless: :belongs_to_layout?

  LAYOUT_COLUMNS_TO_COPY = [:cabinet_model_no, :cabinet_width, :cabinet_depth, :cabinet_height, 
    :cabinet_material, :cabinet_specific_door, :cabinet_specific_worktop, :cabinet_specific_leg, 
    :cabinet_handle, :cabinet_price, :cabinet_quantity, :cabinet_amount, :door_style_code, :door_width, :door_depth, 
    :door_height, :door_quantity, :door_amount, :accessory_code, :accessory_width, 
    :accessory_depth, :accessory_height, :accessory_price, :accessory_quantity, :accessory_amount, :job_spec_door, :job_spec_worktop, :job_spec_log, :cabinet_platform, :job_handle, :job_material, :imported_file_type,
    :job_type, :amount, :cabinet_item, :cabinet_color, :accessory_model_no, :door_price, :wardrobe_amount, :wardrobe_price, :accessory_item, :accessory_color, :door_item, :door_model_no, :door_color ]

  scope :cabinet_jobs, -> {where(job_type: 'cabinet')}
  scope :door_jobs, -> {where(job_type: 'door')}
  scope :accessory_jobs, -> {where(job_type: 'accessory')}
  scope :wardrobe_jobs, -> {where(job_type: 'wardrobe')}
  scope :sliding_door_jobs, -> {where(job_type: 'sliding_door')}
  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}

  include JobSplitConcern

  def belongs_to_layout?
    ownerable_type == "MkwLayout"
  end

  # if the number of boq_labels is less than the quantity of the line item, generate required
  # number of labels
  # Options:
  # unlimited_labels - By default, not more than BoqLabel::MAX_AUTO_GENERATED_LABELS labels can be
  #   generated at a time. If this option is set to true, this limit is removed.
  def populate_labels(options={})
    missing_count = 0
    case job_type
    when 'cabinet'
      missing_count = cabinet_quantity.to_i - boq_labels.count
    when 'door'
      missing_count = door_quantity.to_i - boq_labels.count
    when 'accessory'
      missing_count = accessory_quantity.to_i - boq_labels.count
    when 'wardrobe'
      missing_count = 1 - boq_labels.count  #no quantity, so take only 1 label per line item
    when 'sliding_door'
      missing_count = 1 - boq_labels.count  #door_quantity applies but refers to length, so take only 1 label per line item
    else
      return true
    end
    unless options[:unlimited_labels]
      missing_count = [missing_count, BoqLabel::MAX_AUTO_GENERATED_LABELS].min
      missing_count = [0, missing_count].max  #cannot be less than 0.
    end
    missing_count.times do
      self.boq_labels.create!
    end
  end

  def get_core_material
    case job_type
    when  "door", "sliding_door"
      job_material.present? ? ShangpinJobColor.find_by(color: job_material)&.shangpin_core_material&.core_material : door_color.present? ? ShangpinJobColor.find_by(color: door_color)&.shangpin_core_material&.core_material : nil
    when "accessory"
      job_material.present? ? ShangpinJobColor.find_by(color: job_material)&.shangpin_core_material&.core_material: accessory_color.present? ? ShangpinJobColor.find_by(color: accessory_color)&.shangpin_core_material&.core_material : nil
    when "cabinet"
      cabinet_material.present? ? ShangpinJobColor.find_by(color: job_material)&.shangpin_core_material&.core_material : cabinet_color.present? ? ShangpinJobColor.find_by(color: cabinet_color)&.shangpin_core_material&.core_material : nil
    else
      nil
    end       
  end

  def belongs_to_layout?
    ownerable_type == "ShangpinLayout"
  end

  def is_cabinet_job?
    job_type == 'cabinet'
  end

  def is_door_job?
    job_type == 'door'
  end

  def is_accessory_job?
    job_type == 'accessory'
  end

  def is_sliding_door_job?
    job_type == 'sliding_door'
  end

  def is_wardrobe_job?
    job_type == 'wardrobe'
  end

  def set_amount
    self.amount = calculate_amount
  end

  def calculate_amount
    cabinet_amount.to_f + door_amount.to_f + accessory_amount.to_f + wardrobe_amount.to_f
  end

  # Set the effective factor to reduce the number of DB calls.
  def effective_factor
    @effective_factor ||= ( price_factor1(get_price_factor_hash) * price_factor2(get_price_factor_hash) * get_price_increase_factor ).to_f
  end

  def amount_factored
    effective_factor
    amount_factored = amount ?  amount * @effective_factor : nil
  end

  def cabinet_price_factored
    effective_factor
    cabinet_price_factored = cabinet_price ?  cabinet_price * @effective_factor : nil
  end

  def cabinet_amount_factored
    effective_factor
    cabinet_amount_factored = cabinet_amount ?  cabinet_amount * @effective_factor : nil
  end

  def door_amount_factored
    effective_factor
    door_amount_factored = door_amount ? door_amount * @effective_factor : nil
  end

  def accessory_price_factored
    effective_factor
    accessory_price_factored = accessory_price ? accessory_price * @effective_factor : nil
  end

  def accessory_amount_factored
    effective_factor
    accessory_amount_factored = accessory_amount ?  accessory_amount * @effective_factor : nil
  end

  def door_price_factored
    effective_factor
    door_price_factored = door_price ? door_price * @effective_factor : nil
  end

  def wardrobe_price_factored
    effective_factor
    wardrobe_price_factored = wardrobe_price ? wardrobe_price * @effective_factor : nil
  end

  def wardrobe_amount_factored
    effective_factor
    wardrobe_amount_factored = wardrobe_amount ? wardrobe_amount * @effective_factor : nil
  end

  # Similar to importing when part of a BOQ, but there are several differences.
  # Not all columns for a normal shagpin_job will be imported.
  def import_job_for_layout
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job
  end

  def import_job_for_quotation(space)
    new_job = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job.space = space
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

  def price_factor1(price_factor_hash)
    price_factor_hash["sale_cost_factor"]["shangpin"]["factor1"]
  end

  def price_factor2(price_factor_hash)
    price_factor_hash["sale_cost_factor"]["shangpin"]["factor2"]
  end

  ### added as per client requirements
  def lead_time
    45
  end

  # Please try to use this instead of writing logic for this everywhere it is needed.
  def name
    case job_type
    when "door", "sliding_door"
      model_no = door_model_no
    when "cabinet"
      model_no = cabinet_model_no
    when "accessory"
      model_no = accessory_model_no
    else
      model_no = 'no_type'
    end

    return "Type: #{job_type} Model: #{model_no}"
  end
end
