class ContentPdfPageCountJob < ApplicationJob
  queue_as :default

  def perform(content)
    if File.extname(content.document_file_name) == ".pdf"
      begin
        doc = open("https:#{content.document.url}")
      rescue OpenURI::HTTPError
        Rails::logger.info "Unable to open https:#{content.document.url} - this job will not run again."
        return true
      end
      reader = PDF::Reader.new(doc)
      if reader.present?
        content.update_columns(pdf_page_count: reader.page_count)
      end
    else
      Rails::logger.info "Not a PDF file. Skipping."
    end
  end
end
