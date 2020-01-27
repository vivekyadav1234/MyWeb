class CrawlerJob::ExcelImportJob < ApplicationJob
  queue_as :default

  def perform()
    crawl_excel_import()
  end
end

def crawl_excel_import()
  package = Axlsx::Package.new
  crawl_sheet = package.workbook
  sheet = crawl_sheet.add_worksheet(name: 'Crawl-Report')
  header_names = [
    "Building Name",
    "Group",
    "locality",
    "Type",
    "Possession",
    "price",
    "city",
    "floorplans"
  ]

  headers = {}
  header_names.each_with_index do |n, i|
    headers[n] = i
  end

  sheet.add_row header_names
  web_crawlers = WebCrawler.where(source: "housing.com").where.not(source_id: nil)

  web_crawlers.each do |wc|
    row_array = []
    row_array[headers['Building Name']] = wc.name
    row_array[headers['Group']] = wc.group_name
    row_array[headers['locality']] = wc.locality
    row_array[headers['Type']] = wc.bhk_type
    row_array[headers['Possession']] = wc.possession
    row_array[headers['price']] = wc.price
    row_array[headers['city']] = wc.city
    row_array[headers['floorplans']] = wc.web_crawl_floorplans.pluck(:url)
    sheet.add_row row_array
  end
  file_name = "Crawl-Report-#{Time.zone.now.strftime('%Y-%m-%d:%I:%M:%S%p')}.xlsx"
  filepath = Rails.root.join('tmp', file_name)
  package.serialize(filepath)    
end