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

class JobElementVendorSerializer < ActiveModel::Serializer
  attributes :id, :job_element_id, :vendor_id, :description, :cost, :tax_percent, :final_amount, 
    :deliver_by_date, :recommended, :created_at, :updated_at, :unit_of_measurement, :tax_type, :quantity

  attribute :vendor_name
  attribute :vendor_contact_person
  attribute :vendor_contact_number

  def vendor_name
    object.vendor&.name
  end

  def vendor_contact_person
    object.vendor&.contact_person
  end

  def vendor_contact_number
    object.vendor&.contact_number
  end

end
