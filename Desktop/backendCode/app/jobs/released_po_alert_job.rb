class ReleasedPoAlertJob < ApplicationJob
  queue_as :default

  def perform(quotation, released_po_ids)
    ReportMailer.released_po_cost_alert(quotation, released_po_ids).deliver_now 
  end
end