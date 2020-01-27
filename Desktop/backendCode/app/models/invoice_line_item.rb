class InvoiceLineItem < ApplicationRecord
  belongs_to :payment_invoice
  belongs_to :line_item, polymorphic: true

  validates_uniqueness_of :payment_invoice_id, scope: [:line_item_type, :line_item_id]
end
