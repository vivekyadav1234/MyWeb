class ShangpinImportModule::ShangpinImportError
  def initialize(error_category, error_message, row = nil)
    @error_category = error_category  #cabinet, door or accessory
    @error_message = error_message
    @row = row  #@row being nil means that the error is not for a particular row.
  end

  def message_hash
    {
      error_category: @error_category, 
      row: @row, 
      message: @error_message
    }
  end
end
