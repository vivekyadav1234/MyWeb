class DpPayoutPaymentDownloadJob < ApplicationJob
  queue_as :default

  def perform(user)
    Payment.dp_payout_payment_report(user)
  end
end