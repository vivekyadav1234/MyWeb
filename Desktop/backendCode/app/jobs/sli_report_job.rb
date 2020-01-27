class SliReportJob < ApplicationJob
  queue_as :report_mailer

  def perform(user)
    # Do something later
        category_excel = PurchaseOrder.download_sli_report
        UserNotifierMailer.category_excel_mail(category_excel[:filepath], category_excel[:file_name], user.email).deliver_now
        File.delete(category_excel[:filepath]) if File.exist?(category_excel[:filepath])
  end
end
