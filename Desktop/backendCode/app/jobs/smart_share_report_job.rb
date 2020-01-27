class SmartShareReportJob < ApplicationJob
  queue_as :report_mailer

  # Smart Share History will be sent by email as excel through this job.
  def perform(user, lead_ids)
    smart_share_excel = OfficeMoodboardPpt.download_smart_share_history_excel(lead_ids)
    UserNotifierMailer.lead_list_email(smart_share_excel[:filepath], smart_share_excel[:file_name], user).deliver_now
  end
end