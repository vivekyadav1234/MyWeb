class InvoicePdfJob < ApplicationJob
  queue_as :default

  def perform(payment_invoice_id)
  end
end