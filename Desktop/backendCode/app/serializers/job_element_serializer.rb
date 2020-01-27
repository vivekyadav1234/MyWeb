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

class JobElementSerializer < ActiveModel::Serializer
  attributes :id, :element_name, :unit, :rate, :ownerable_type, :ownerable_id,
    :created_at, :updated_at, :quotation_id, :vendor_product_id, :import_type, :imos_type,
    :attribution_ratio

  attribute :from_bom
  attribute :vendor_product_name
  attribute :job_element_vendor_details
  attribute :po_created
  attribute :modifying_po
  attribute :amount
  attribute :tax
  attribute :quantity

  def quantity
    object.quantity&.round(5)
  end

  def from_bom
    object.from_bom?
  end

  def vendor_product_name
    object.vendor_product&.sli_name
  end

  def job_element_vendor_details
    object.job_element_vendors.map{|job_element_vendor|
      JobElementVendorSerializer.new(job_element_vendor).serializable_hash
    }
  end

  def unit
    object.unit
  end

  # not using object's column value directly.
  def rate
    object.job_element_vendors.present? ? object.job_element_vendors.last.cost : object.rate
  end

  def po_created
    object.po_created?
  end

  def modifying_po
    object.modifying_po?
  end

  def amount
    rate.to_f * object.quantity.to_f
  end

  def tax
    object.job_element_vendors.present? ? object.job_element_vendors.last.tax_percent : nil
  end
end
