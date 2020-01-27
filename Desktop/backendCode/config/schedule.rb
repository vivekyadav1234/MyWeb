# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# every 1.minute do
#   rake "leads:auto_assign_unclaimed"
# end

# every 20.minutes do
#   rake "leads:auto_assign_claimed"
# end

# every 1.day, at: '1:30 am' do
#   rake "project_tasks:send_email_task_owners"
# end

every 1.day, at: '12:01 pm' do
  rake "testtask:utility_test_mail"
end

every '13 2-14 * * *' do
  runner "LeadPriorityEngine.new.generate_queue"
end

every 20.minutes do
  runner "Lead.escalate_eligible_leads"
end

# every 10.minutes do
#   runner "LeadPriorityEngine.add_follow_up_leads_to_queue"
# end

every 1.hours do
  runner "LeadCampaign.make_inactive_leads"
end

# every 1.day, at: '04.05 am' do
#   rake "fb_lead:fetch_lead"
# end

every 1.day, at: '04:00 am' do
  runner "FbLeadgenJob.perform_now(1.day.ago.beginning_of_day, 1.day.ago.end_of_day)"
end

every 3.hours do
  runner "TaskEscalation.check_for_escalation"
end

every '45 1 1 * *' do
  rake "lead:delayed_possession"
end

every 1.day, at: '01:30 pm' do
  rake "lead_report:download_lead"
end

every 1.day, at: '03:30 pm' do
  rake "lead_statistics:populate_data"
end

every 1.day, at: '12:30 am' do
  runner "Lead.unassign_leads"
end

every 31.minutes do
  runner "CreateMissingProjectJob.perform_now"
end

every 1.day, at: '1:30 am' do 
  runner "Payment.daily_payment_report"
end 

# every 1.day, at: '3:00 am' do 
# 	runner "Quotation.olt_client_email_report"
# end


# Learn more: http://github.com/javan/whenever
