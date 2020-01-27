class FbMailer < ApplicationMailer
  default :from => 'wecare@arrivae.com'

  def fb_lead_test(options)
    @message_body = options[:message]
    @data_recieved = options[:rbody]
    mail(to: "arunoday@gloify.com", subject: "FB lead update from #{Rails.env} environment.")
  end

  def fb_leadgen_report(file_name, file_path, start_time, end_time)
    @file_path = file_path
    @start_time = start_time
    @end_time = end_time
    emails = []

    if Rails.env.production? || Rails.env.uat?
      emails = ["abhishek@arrivae.com", "sumit@arrivae.com"]
      cc_emails = ["arunoday@gloify.com"]
    else
      emails = ["abhinav@gloify.com"]
      cc_emails = ["arunoday@gloify.com"]
    end

    attachments[file_name] = File.read(file_path)
    mail( :to => emails,
      :cc => cc_emails,
    :subject => "Delta FB leads import report from ")
  end


  def failed_job_info_to_dev_team(exception, job_name)
    emails = ["arrivae-dev@gloify.com", "arunoday@gloify.com", "shobhit@gloify.com", "deepak@gloify.com"]
    @job_name = job_name
    @message = exception
    mail( :to => emails,
    :subject => "[IMPORTANT] #{job_name} Job Got Failed")
  end
end
