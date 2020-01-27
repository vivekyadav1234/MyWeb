class PaymentDownloadJob < ApplicationJob
  queue_as :default

  def perform(user, quotation_ids = nil)
  	Payment.payment_excel_to_download(user, quotation_ids)
  end
end