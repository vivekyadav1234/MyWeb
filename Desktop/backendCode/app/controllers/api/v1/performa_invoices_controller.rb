class Api::V1::PerformaInvoicesController < Api::V1::ApiController

  before_action :set_project_and_quotation
  before_action :set_performa_invoice, only: [:update, :show, :destroy]

  def index
  	@performa_invoices = @quotation.performa_invoices

    render json: @performa_invoices
  end

  # def show
  # end

  def create
    @performa_invoice = PerformaInvoice.new(performa_invoice_params)
    if @performa_invoice.save!
      render json: @performa_invoice, status: :created
    else
      render json: {message: @performa_invoice.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def update
    if @performa_invoice.update(performa_invoice_params)
      render json: @performa_invoice
    else
      render json: {message: @performa_invoice.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # def destroy
  # end

  private

  def set_project_and_quotation
  	@project = Project.find(params[:project_id])
  	@quotation = Quotation.find(params[:quotation_id])
  end

  def set_performa_invoice
  	@performa_invoice = PerformaInvoice.find(params[:performa_invoice_id])
  end

  def performa_invoice_params
    params.require(:performa_invoice).permit(:id, :vendor_id, :quotation_id, :reference_no, :amount,
      :description, :base_amount, :tax_percent, :pi_upload)
  end
end
