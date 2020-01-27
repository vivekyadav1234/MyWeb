module BomSliModule::CommonModule
  # This method will remove all tags from the passed string.
  def excel_no_tags(str)
    if str.class.to_s == 'String'
      Nokogiri::HTML(str).text
    else
      str
    end
  end
end
