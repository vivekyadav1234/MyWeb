class Catalog::CatalogExcelDownloadJob < ApplicationJob
  queue_as :catalog

  def perform(product_ids,index,section_id, emails)
    section = Section.find section_id
    product_excels = Product.download_catalog_excel(section.name,product_ids,index)
    UserNotifierMailer.catalog_report_email(section.name,product_excels[:filepath], product_excels[:file_name], emails).deliver_now  
    File.delete(product_excels[:filepath]) if File.exist?(product_excels[:filepath]) 
  end
end
