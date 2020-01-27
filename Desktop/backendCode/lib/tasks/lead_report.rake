namespace :lead_report do
  require Rails.root.join("lib","lead_report_module")
  task download_lead: :environment do
    include LeadReportModule
    LeadReportModule::generate_report
  end
end