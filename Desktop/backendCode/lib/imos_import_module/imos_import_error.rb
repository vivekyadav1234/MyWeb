class ImosImportModule::ImosImportError
  def initialize(sheet_name, error_message, line_item = nil)
    @sheet_name = sheet_name
    @error_message = error_message
    @line_item = line_item
  end

  def message_hash
    line_item_details = @line_item.present? ? "Type: #{@line_item.class.to_s}, id: #{@line_item.id}" : nil
    {
      sheet_name: @sheet_name, 
      line_item_details: line_item_details, 
      message: @error_message
    }
  end
end
