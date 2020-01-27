# This job is for generating excel with info about services in DB.
# This is meant to be used from backend as no mail is sent.
class Catalog::ServiceReportJob < ApplicationJob
  queue_as :catalog

  def perform
    services = ServiceActivity.includes(:service_category, :service_subcategory)

    # Excel Headers
    header_names = [
      'Category',
      'Sub-Category',
      'Hidden',
      'Unique Sku Code',
      'Name',
      'Base Price',
      'Installation Price',
      'UoM',
      'Description'
    ]

    @headers = Hash.new
    header_names.each_with_index do |n, i|
      @headers[n] = i
    end

    @package = Axlsx::Package.new
    @service_report = @package.workbook
    @sheet = @service_report.add_worksheet(:name => "Service Report")
    @sheet.add_row header_names

    services.find_each do |service|
      add_row(@sheet, service)
    end

    file_name = "Service-Report-#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    @package.serialize(filepath)
  end

  private
  def add_row(sheet, service)
    row_array = []
    row_array[@headers["Category"]] = service.service_category&.name
    row_array[@headers["Sub-Category"]] = service.service_subcategory&.name
    row_array[@headers["Hidden"]] = service.hidden? ? "Yes" : "No"
    row_array[@headers["Unique Sku Code"]] = service.code
    row_array[@headers["Name"]] = service.name
    row_array[@headers["Base Price"]] = service.default_base_price
    row_array[@headers["Installation Price"]] = service.installation_price
    row_array[@headers["UoM"]] = service.unit
    row_array[@headers["Description"]] = service.description
    @sheet.add_row row_array
  end
end