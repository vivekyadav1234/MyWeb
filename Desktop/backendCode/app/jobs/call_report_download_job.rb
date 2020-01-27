class CallReportDownloadJob < ApplicationJob
  queue_as :default

  def perform(user)
   	InhouseCall.append_to_existing_report(user)
  end
end