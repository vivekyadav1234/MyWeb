# This same error class can be used for both ordinary Manual Sheet and IMOS manual sheet.
class BomSliModule::ManualSheetError
  # error type - 'fatal' or 'warning' or 'notice'.
  # If fatal, the import will be halted there and then.
  # For warning, it will continue.
  # Notice is just information - not an error.
  def initialize(error_message, error_type, options={})
    @error_message = error_message
    @error_type = error_type
    @sheet_name = options[:sheet_name] if options[:sheet_name]
    @row = options[:row] if options[:row]
    # @line_item = options[:line_item] if options[:line_item]
    @label_name = options[:boq_label].label_name if options[:boq_label]
    @material_code = options[:material_code] if options[:material_code]
    @error_message += "FATAL error - execution halted!" if @error_type == 'fatal'
  end

  def message_hash
    details = @row.present? ? "Label: #{@label_name}, Row: #{@row}" : "Label: #{@label_name}"
    {
      sheet_name: @sheet_name.to_s + "- Row:#{@row}" + " - Code:#{@material_code}",
      details: details,
      message: @error_message
    }
  end
end
