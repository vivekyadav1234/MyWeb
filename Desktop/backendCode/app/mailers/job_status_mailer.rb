class JobStatusMailer < ApplicationMailer
	default :from => 'wecare@arrivae.com'
	after_action :prevent_delivery_to_dummyemails

	def failed_job_info_to_dev_team(exception, job_name)
    emails = ["arrivae-dev@gloify.com", "arunoday@gloify.com", "shobhit@gloify.com", "deepak@gloify.com"]
    @job_name = job_name
    @message = exception
    mail( :to => emails,
    :subject => "[IMPORTANT] #{job_name} Job Got Failed")
  end

private
	def prevent_delivery_to_dummyemails
		if @lead_to_check&.has_dummy_email?
			mail.perform_deliveries = false
		end
	end
end