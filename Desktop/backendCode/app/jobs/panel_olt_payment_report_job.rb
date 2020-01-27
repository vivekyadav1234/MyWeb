class PanelOltPaymentReportJob < ApplicationJob
  queue_as :report_mailer

  def perform(user)
    panel_olt_excel = PurchaseOrder.panel_olt_report
    ReportMailer.panel_olt_report(panel_olt_excel[:filepath], panel_olt_excel[:file_name], user.email).deliver_now
    File.delete(panel_olt_excel[:filepath]) if File.exist?(panel_olt_excel[:filepath])
  end
end
