class Api::V1::PerformaInvoiceFilesController < Api::V1::ApiController
    
  # POST /api/v1/performa_invoice_files
  def create
    performa_invoice = PerformaInvoice.find(params[:invoice_id])
    if performa_invoice.present?
      @file = performa_invoice.performa_invoice_files.new()
      @file.attachment_file = params[:attachment_file] if params[:attachment_file].present?
      @file.attachment_file_file_name = params[:file_name] if params[:file_name].present?
      @file.tax_invoice = params[:tax_invoice] if params[:tax_invoice].present?
      if @file.save
        render json: @file, status: :created
      else
        render json: {message: @file.errors}, status: :unprocessable_entity
      end
    else
      render json: {message: "Invoice not found"}, status: :unprocessable_entity
    end
  end
end