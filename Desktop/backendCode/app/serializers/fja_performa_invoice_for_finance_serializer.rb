class FjaPerformaInvoiceForFinanceSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :quotation_id, :amount, :reference_no, :description, :created_at, :base_amount, 
    :tax_percent, :pi_upload

  def serializable_hash
    data = super
    data[:data]
  end

  attribute :vendor_datails do |object|
    vendor = object.vendor
    {id: vendor.id, name: vendor.name}
  end

  attribute :purchase_orders do |object|
    # purchase_orders = object.purchase_orders
    # purchase_orders.map{|po| {id: po.id, reference_no: po.reference_no}}
    po = object.purchase_order
    {id: po.id, reference_no: po.reference_no} if po.present?
  end

  attribute :quotation_details do |object|
    quotation = object.quotation
    {id: quotation.id, reference_number: quotation.reference_number, cm: quotation.project.lead.assigned_cm.name, desinger: quotation.project.assigned_designer.name}
  end 

  attribute :client_details do |object|
    object.quotation.project.lead.slice(:id,:name)
  end

  attribute :invoice_files do |object|
    object.performa_invoice_files.map {|file| {name: file.attachment_file_file_name, url: file.attachment_file.url, tax_invoice: file.tax_invoice}}
  end

  attribute :project_address do |object|
    object.quotation&.project&.project_address
  end


end