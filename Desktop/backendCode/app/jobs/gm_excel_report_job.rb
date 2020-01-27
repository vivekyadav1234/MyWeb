class GmExcelReportJob < ApplicationJob
  queue_as :report_mailer

  def perform(data, user)
    GmDashboardModule::GmDashboardExcel.new(data, user).gm_dashboard_excel      
  end
end