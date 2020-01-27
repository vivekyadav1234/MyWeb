# == Schema Information
#
# Table name: purchase_order_performa_invoices
#
#  id                  :integer          not null, primary key
#  purchase_order_id   :integer
#  performa_invoice_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class PurchaseOrderPerformaInvoice < ApplicationRecord
  
  belongs_to :purchase_order
  belongs_to :performa_invoice

  validates_uniqueness_of :performa_invoice_id, scope: [:purchase_order_id]
end
