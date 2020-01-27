class EventReportDownloadJob < ApplicationJob
  queue_as :default

  def perform(event_ids, user, role)
  	@events = Event.where(id: event_ids)
    event_excel = Event.download_event(@events, user, role)
    UserNotifierMailer.event_excel_mail(event_excel[:filepath], event_excel[:file_name], user.email).deliver_now
    File.delete(event_excel[:filepath]) if File.exist?(event_excel[:filepath]) 	
  end
end