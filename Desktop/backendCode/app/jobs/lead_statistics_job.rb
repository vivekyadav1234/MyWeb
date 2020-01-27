class LeadStatisticsJob < ApplicationJob
  queue_as :analytics

  def perform(lead_ids)
    LeadStatisticsDatum.populate_qualified_data(lead_ids)
    # UserNotifierMailer.rake_task_run("Lead Statistics Datum").deliver_now
  end
end
