class Catalog::CatalogDownloadJob < ApplicationJob
  queue_as :catalog

  def perform(emails)
    catalog_content = CatalogPdf.new
    file_name = "Catalog-Report-#{DateTime.now.in_time_zone('Asia/Kolkata').strftime("%Y-%m-%d:%I:%M:%S%p")}.pdf"
    filepath = Rails.root.join("tmp",file_name)
    catalog_content.render_file(filepath) 
    UserNotifierMailer.catalog_report_email(filepath, file_name, emails).deliver_now
    File.delete(filepath) if File.exist?(filepath)  
  end
end
