class PurchaseOrderReportJob < ApplicationJob
   queue_as :report_mailer
   
   def perform(user)
   	 customer_profile_excel = CustomerProfile.xl_report
     UserNotifierMailer.customer_profile_questionnaire(customer_profile_excel[:filepath], customer_profile_excel[:file_name], user.email).deliver_now
     File.delete(customer_profile_excel[:filepath]) if File.exist?(customer_profile_excel[:filepath])
     
   end
end