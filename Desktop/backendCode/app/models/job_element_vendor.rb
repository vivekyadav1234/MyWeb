# == Schema Information
#
# Table name: job_element_vendors
#
#  id                         :integer          not null, primary key
#  job_element_id             :integer
#  vendor_id                  :integer
#  description                :string
#  cost                       :float
#  tax_percent                :float
#  final_amount               :float
#  deliver_by_date            :datetime
#  recommended                :boolean          default(FALSE)
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  unit_of_measurement        :string
#  tax_type                   :string
#  quantity                   :float
#  added_for_partial_dispatch :boolean          default(FALSE)
#  po_cancelled_or_modifying  :boolean          default(FALSE)
#

class JobElementVendor < ApplicationRecord
  has_paper_trail

  belongs_to :job_element, required: true
  belongs_to :unscoped_job_element, -> { unscope(where: :po_cancelled_or_modifying) }, class_name: 'JobElement', foreign_key: :job_element_id
  belongs_to :vendor, required: true

  has_one :purchase_order, through: :purchase_elements

  has_many :purchase_elements, dependent: :destroy

  validates_uniqueness_of :vendor_id, scope: [:job_element_id]
  validates :cost, :tax_percent, :tax_type, presence: true
  validate :vendor_matches_master_sli_vendor

  # ALLOWED_VENDOR_TYPES = ["L1", "L2", "L3"]
  # validates_inclusion_of :type_of_vendor, in: ALLOWED_VENDOR_TYPES
  default_scope { where(added_for_partial_dispatch: false, po_cancelled_or_modifying: false) }
  before_save :populate_final_amount
  after_save :only_one_recommended_vendor

  def populate_final_amount
    self.final_amount = base_value + tax_value
  end

  # a job element can have only one recommended vendor. Ensure that.
  def only_one_recommended_vendor
    if recommended_changed? && recommended
      job_element.job_element_vendors.where.not(id: self).each do |job_element_vendor|
        job_element_vendor.update_columns(recommended: false)
      end
    end
  end

  def base_value
    self.quantity.to_f * self.cost.to_f
  end

  def tax_value
    self.base_value.to_f * (self.tax_percent.to_f/100.0)
  end

  # is this jev elgible for being shown in the 'Create PO' part of PO Release screen.
  # lifiting this condition from FjaPoLineItemsSerializer.
  def include_in_create_po?
    !job_element.cannot_modify? && !(purchase_elements&.last&.purchase_order&.status == 'modified')
  end

  private
  def vendor_matches_master_sli_vendor
    vendor_product = job_element.vendor_product
    errors.add(:vendor_id, "vendor chosen: #{vendor.name}. Vendor of Master SLI: #{vendor_product.vendor.name}. Both must be same.") if vendor_product.present? && (vendor_product.vendor != vendor)
  end
end
