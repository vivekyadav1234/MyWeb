class Api::V1::PurchaseOrderPerformaInvoicesController <  Api::V1::ApiController
  before_action :authenticate_user!
  before_action :set_quotation
  before_action :set_purchase_order_invoice, only: [:update]

  def index
    raise CanCan::AccessDenied unless current_user.has_any_role?(:admin, :business_head, :category_head, *Role::CATEGORY_ROLES)
    temp_hash = {}
    temp_hash[:pairings] = @quotation.vendor_po_pi_pairings

    render json: temp_hash
  end

  def create
    raise CanCan::AccessDenied unless current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)

    # created_ids = []

    ActiveRecord::Base.transaction do
      params[:purchase_order_performa_invoice][:purchase_order_id].each do |purchase_order_id|
        @purchase_order = PurchaseOrder.find purchase_order_id
        params[:purchase_order_performa_invoice][:performa_invoice_id].each do |performa_invoice_id|
          @purchase_order_performa_invoice = @purchase_order.purchase_order_performa_invoices.create!(performa_invoice_id: performa_invoice_id)
        end
      end
    end
    return render json: {pairings: @quotation.vendor_po_pi_pairings}

    rescue ActiveRecord::RecordInvalid
      render json: {message: "Something went wrong. The PI to PO mapping could not be done."}, status: 422
  end

  def update
    raise CanCan::AccessDenied unless current_user.has_any_role?(:admin, :category_head, *Role::CATEGORY_ROLES)

    # created_ids = []

    ActiveRecord::Base.transaction do
      params[:purchase_order_performa_invoice][:purchase_order_id].each do |purchase_order_id|
        @purchase_order = PurchaseOrder.find purchase_order_id
        @purchase_order.purchase_order_performa_invoices.destroy_all
        params[:purchase_order_performa_invoice][:performa_invoice_id].each do |performa_invoice_id|
          @purchase_order_performa_invoice = @purchase_order.purchase_order_performa_invoices.create!(performa_invoice_id: performa_invoice_id)
          # created_ids << @purchase_order_performa_invoice
        end
      end
    end

    @purchase_order_performa_invoices = PurchaseOrderPerformaInvoice.where(id: created_ids)
    return render json: {pairings: @quotation.vendor_po_pi_pairings}

    rescue ActiveRecord::RecordInvalid
      render json: {message: "Something went wrong. The PI to PO mapping could not be done."}, status: 422

  end

  private

  def set_quotation
  	@quotation = Quotation.find(params[:quotation_id])
  end

  def set_purchase_order_invoice
  	@purchase_order_performa_invoice = PurchaseOrderPerformaInvoice.find(params[:purchase_order_performa_invoice_id])
  end

  def purchase_order_invoice_params
  	params.require(:purchase_order_performa_invoice).permit(:id, :purchase_order_id, :performa_invoice_id)
  end
end
