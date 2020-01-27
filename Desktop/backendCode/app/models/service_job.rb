# == Schema Information
#
# Table name: service_jobs
#
#  id                  :integer          not null, primary key
#  name                :string
#  service_code        :string
#  unit                :string
#  quantity            :float
#  base_rate           :float
#  installation_rate   :float
#  final_rate          :float
#  amount              :float
#  space               :string
#  ownerable_type      :string
#  ownerable_id        :integer
#  service_activity_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  estimated_cogs      :float            default(0.0)
#  clubbed_job_id      :integer
#  tag_id              :integer
#  no_bom              :boolean          default(FALSE), not null
#

class ServiceJob < ApplicationRecord
  has_paper_trail

  belongs_to :ownerable, polymorphic: true, optional: true
  belongs_to :service_activity, required: true
  belongs_to :clubbed_job, optional: true
  belongs_to :tag, optional: :true
  has_many :cad_upload_jobs, as: :uploadable, dependent: :destroy
  has_many :cad_uploads, through: :cad_upload_jobs

  # for dividing a job into several elements as each elements can have its own set of vendors
  has_many :job_elements, as: :ownerable, dependent: :destroy
  has_many :vendors, through: :job_elements
  has_one :invoice_line_item, as: :line_item, dependent: :destroy
  has_one :payment_invoice, through: :invoice_line_item 

  has_many :line_item_boms, as: :line_item, dependent: :destroy
  has_many :boms, through: :line_item_boms, source: :content

  has_many :production_drawings, as: :line_item, dependent: :destroy
  has_many :project_handovers, through: :production_drawings 

  has_many :contents, as: :ownerable

  validates :no_bom, inclusion: { in: [true, false] }  
  
  validates_presence_of :name, :unit, :base_rate, :installation_rate, :final_rate,
    :space, :service_code
  validates :quantity, numericality: { greater_than: 0 }

  before_validation :populate_defaults

  alias service service_activity
  scope :not_a_clubbed_module, -> { where(clubbed_job: nil)}

  include JobSplitConcern
  
  def populate_defaults
    self.final_rate = get_final_rate
    self.amount = quantity * final_rate * get_price_increase_factor
  end

  ### added as per client requirements
  def lead_time
    75
  end

  def populate_estimated_cogs
    self.update_columns(estimated_cogs: cost_price.round(2))
  end

  # import data from a Service
  def import_service(service, quantity, base_rate_given, space=nil, options = {})
    self.name = service.name
    self.service_code = service.code
    self.unit = service.unit
    self.quantity = quantity.to_f
    self.base_rate = base_rate_given
    self.installation_rate = service.installation_price
    self.amount = get_final_rate.to_f * quantity.to_f * get_price_increase_factor
    self.service_activity = service_activity
    self.space = space
    self.save if options[:save_now]
    self
  end

  def get_details
    hash = {}
    hash[:no_bom] = no_bom
    hash
  end
    
  # This method now returns the factored final rate as we can't just add the base and installation
  # rates because of different factors.
  def get_final_rate(options={})
    price_factor_hash = {}
    if options[:estimated_cogs]
      price_factor_hash = MKW_GLOBAL_DATA_ESTIMATED_COGS
    else
      price_factor_hash = get_price_factor_hash
    end
    base_rate.to_f * price_factor_base(price_factor_hash) + installation_rate.to_f * price_factor_installation(price_factor_hash)
  end

  def get_price_factor_hash
    if ownerable_type == "Quotation"
      return ownerable.get_price_factor_hash
    else
      return MKW_GLOBAL_DATA
    end
  end

  def price_factor_base(price_factor_hash)
    price_factor_hash["sale_cost_factor"]["services_base"] * price_factor_hash["sale_cost_factor"]["overall"]
  end

  def price_factor_installation(price_factor_hash)
    price_factor_hash["sale_cost_factor"]["services_installation"] * price_factor_hash["sale_cost_factor"]["overall"]
  end

  def get_price_increase_factor
    if ownerable_type == "Quotation"
      return ownerable.price_increase_factor
    else
      return 1.0
    end
  end

  def cost_price
    quantity.to_f * get_final_rate({estimated_cogs: true}).to_f * get_price_increase_factor
  end
end
