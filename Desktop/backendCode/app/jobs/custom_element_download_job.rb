class CustomElementDownloadJob < ApplicationJob
  queue_as :default

  def perform(user)

    custom_elements = CustomElement.all
    ce_headers = ["Sr. No.", "Customer Name", "Custom Element Proposed ", "Material", "Finish", "Dimension", "Remarks", "Ask Price", "Status", "Category Price", "Category Remarks", "Timestamp - Date and time of raising request", "Timestamp - Date and time of responding to request", "Designer Name", "Community Manager Name", "User Name - Who responded to that query"]
    p = Axlsx::Package.new
    ce_xlsx = p.workbook
    ce_xlsx.add_worksheet(:name => "Basic Worksheet") do |sheet|
      sheet.add_row ce_headers
      sr_no = 1
      custom_elements.each do |ce|
        designer = ce.project&.assigned_designer
        designer_name = designer&.name
        cm_name = designer&.cm&.name
        category = ""

        ce.versions.each do |version|
          who_dun_it = version.whodunnit
          a = version&.object_changes
            if a
              status = YAML::load a
              if status.present? && (status["price"].present? || status["category_remark"].present?) 
                category = User.find who_dun_it.to_i
              end
            else
              nil
            end
        end

        category_name = ""
        category_email = ""
        if category.present?
          category_name = category.name
          category_email = category.email
        end

        sheet.add_row [sr_no, ce.project&.user&.name, ce.created_at&.strftime("%Y/%m/%d - %I:%M:%S%p"), ce.core_material, ce.shutter_finish, ce.dimension, ce.designer_remark, ce.ask_price, ce.status, ce.price, ce.category_remark, ce.created_at&.strftime("%Y/%m/%d - %I:%M:%S%p"), ce.updated_at&.strftime("%Y/%m/%d - %I:%M:%S%p"), designer_name, cm_name, category_name, category_email]
        sr_no += 1
      end
    end
    file_name = "custom_element_#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp","custom_element_#{Date.today}.xlsx")
    p.serialize(filepath)
    ReportMailer.custom_element_report_email(filepath, file_name, user).deliver!
    File.delete(filepath) if File.exist?(filepath)
  end
end