class FjaPerformaInvoiceSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :quotation_id, :amount, :reference_no, :description, :created_at, :base_amount, 
    :tax_percent, :pi_upload

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :vendor_datails do |object|
    object.vendor
  end
end