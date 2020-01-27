class FjaPiPaymentsSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :description, :remarks, :percentage, :payment_status, :status_updated_at, :payment_due_date, 
     :created_at, :updated_at, :attachment

  attribute :request_form do |object|
    object.created_by.slice(:id,:name)
  end
  
  attribute :amount do |object|
    object.amount || (object.performa_invoice.base_amount * object.percentage/100)
  end

  attribute :tax_amount do |object|
    object.tax_amount
  end

  attribute :total_amount do |object|
    object.total_amount
  end


  attribute :value_amount_released do |object|
    (object.amount || (object.performa_invoice.base_amount * object.percentage/100)) * object.percentage/100
  end

  attribute :performa_invoice do |object|
    FjaPerformaInvoiceForFinanceSerializer.new(object.performa_invoice).serializable_hash
  end
end

class PiPaymentLedgerSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :status_updated_at, :payment_due_date, :created_at, :updated_at

  attribute :value_amount_released do |object|
    (object.amount || (object.performa_invoice.base_amount * object.percentage/100)) * object.percentage/100
  end

  attributes :performa_invoice_details do |object|
    performa_invoice = object.performa_invoice
    vendor = performa_invoice.vendor
    {vendor_name: vendor&.name, vendor_id: vendor.id,  performa_invoice_id: performa_invoice.id, reference_no: performa_invoice.reference_no}
  end

end