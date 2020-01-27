# == Schema Information
#
# Table name: purchase_elements
#
#  id                    :integer          not null, primary key
#  purchase_order_id     :integer
#  job_element_vendor_id :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class PurchaseElement < ApplicationRecord

  belongs_to :purchase_order
  belongs_to :job_element_vendor
  belongs_to :unscoped_job_element_vendor, -> { unscope(where: :po_cancelled_or_modifying) }, class_name: 'JobElementVendor', foreign_key: :job_element_vendor_id
  has_many :job_elements, through: :job_element_vendor
  has_many :unscoped_job_elements, through: :unscoped_job_element_vendor, source: :job_element
end
