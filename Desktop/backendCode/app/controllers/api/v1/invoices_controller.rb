class Api::V1::InvoicesController < Api::V1::ApiController
  before_action :set_invoice, only: [:show, :update, :destroy]
  before_action :set_project, only: [:index, :create]

  # GET /invoices
  def index
    @invoices = Invoice.all

    render json: @invoices
  end

  # GET /invoices/1
  def show
    render json: @invoice
  end

  # POST /invoices
  def create
    @invoice = Invoice.new(invoice_params)
    if @invoice.save
      render json: @invoice, status: :created
    else
      render json: {message: @invoice.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /invoices/1
  def update
    if @invoice.update(invoice_params)
      render json: @invoice
    else
      render json: {message: @invoice.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # DELETE /invoices/1
  def destroy
    if @invoice.destroy
      render json: {message: 'Invoice successfully deleted.'}
    else
      render json: {message: "Invoice could not be deleted because - #{@invoice.errors.full_messages}."}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_invoice
      @invoice = Invoice.find(params[:id])
    end

    def set_project
      @project = Project.find(params[:project_id])
    end

    # Only allow a trusted parameter "white list" through.
    def invoice_params
      params.require(:invoice).permit(:name, :terms, :net_amount, :total_amount, :status, :project_id, 
        :user_id, :invoicing_date, :due_date, :due_in_days, :payment_status, :billing_address, 
        :total_discount, :gross_amount, :customer_notes, :reference_number, :quotation_id, 
        boqjobs_attributes: [:name, :quantity, :rate, :amount, :ownerable_type, :ownerable_id, :product_id, :section_id]
        )
    end
end
