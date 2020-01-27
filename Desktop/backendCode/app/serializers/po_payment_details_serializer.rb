class PoPaymentDetailsSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name, :created_at, :reference_number

  def serializable_hash
    data = super
    data[:data][:attributes]
  end

  attribute :lead_name do |object|
    object.project.lead.name
  end

  attribute :purchase_orders do |object|
    temp = []
    object.purchase_orders.where(status: 'released').each do |po|
      hash = Hash.new
      hash[:po_details] = ProjectPurchaseOrderSerializer.new(po).serializable_hash
      temp << hash
      performa_invoice = PerformaInvoice.where(quotation_id: po.quotation_id, vendor_id: po.vendor_id, purchase_order_id: po.id).first_or_create
      hash[:invoice_details] = PerformaInvoiceSerializer.new(performa_invoice).serializable_hash
    end
    temp
  end
end
